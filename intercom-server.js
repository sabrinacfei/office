const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const portArgIndex = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portArgIndex >= 0 ? process.argv[portArgIndex + 1] : 8080)) || 8080;
const host = process.env.HOST || '0.0.0.0';
const clients = new Map();

const mime = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon'
};

function normalizeExt(value) {
  return String(value || '').replace(/\D/g,'');
}

function staticPath(url = '/') {
  const pathname = new URL(url,'http://localhost').pathname;
  const relative = pathname === '/' ? 'homepage-ui.html' : decodeURIComponent(pathname).replace(/^\/+/,'');
  const resolved = path.resolve(root,relative);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) return null;
  return resolved;
}

function serveStatic(req,res) {
  const filePath = staticPath(req.url);
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath,(error,stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200,{
      'content-type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function sendFrame(socket,payload,opcode = 1) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload));
  let header;
  if (data.length < 126) {
    header = Buffer.from([0x80 | opcode,data.length]);
  } else if (data.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(data.length,2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeUInt32BE(0,2);
    header.writeUInt32BE(data.length,6);
  }
  socket.write(Buffer.concat([header,data]));
}

function sendJson(record,payload) {
  if (!record?.socket || record.socket.destroyed) return false;
  sendFrame(record.socket,JSON.stringify(payload));
  return true;
}

function attachSocket(record,onText,onClose) {
  let buffer = Buffer.alloc(0);
  let closed = false;
  const finish = () => {
    if (closed) return;
    closed = true;
    onClose();
  };
  record.socket.on('data',chunk => {
    buffer = Buffer.concat([buffer,chunk]);
    while (buffer.length >= 2) {
      const opcode = buffer[0] & 0x0f;
      const masked = Boolean(buffer[1] & 0x80);
      let length = buffer[1] & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (buffer.length < 4) return;
        length = buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (buffer.length < 10) return;
        if (buffer.readUInt32BE(2) !== 0) {
          record.socket.destroy();
          finish();
          return;
        }
        length = buffer.readUInt32BE(6);
        offset = 10;
      }
      const maskLength = masked ? 4 : 0;
      if (buffer.length < offset + maskLength + length) return;
      const mask = masked ? buffer.subarray(offset,offset + 4) : null;
      let payload = buffer.subarray(offset + maskLength,offset + maskLength + length);
      if (mask) {
        const decoded = Buffer.alloc(length);
        for (let index = 0; index < length; index += 1) decoded[index] = payload[index] ^ mask[index % 4];
        payload = decoded;
      }
      buffer = buffer.subarray(offset + maskLength + length);
      if (opcode === 8) {
        record.socket.end();
        finish();
        return;
      }
      if (opcode === 9) {
        sendFrame(record.socket,payload,10);
        continue;
      }
      if (opcode === 1) onText(payload.toString('utf8'));
    }
  });
  record.socket.on('close',finish);
  record.socket.on('error',finish);
}

function register(record,message) {
  const nextId = String(message.clientId || record.id);
  const existing = clients.get(nextId);
  if (existing && existing !== record) existing.socket.destroy();
  if (record.clientId && record.clientId !== nextId) clients.delete(record.clientId);
  record.clientId = nextId;
  record.meta = {
    account:message.account,
    extension:normalizeExt(message.extension),
    role:message.role,
    department:message.department,
    english:message.english
  };
  clients.set(nextId,record);
  sendJson(record,{type:'registered',clientId:'server',registeredClientId:nextId});
}

function forwardToClient(targetId,message,fromRecord) {
  const target = clients.get(String(targetId || ''));
  if (!target) return false;
  return sendJson(target,{
    ...message,
    clientId:fromRecord.clientId,
    fromClientId:fromRecord.clientId,
    from:message.from || fromRecord.meta
  });
}

function forwardToExtension(extension,message,fromRecord) {
  const toExt = normalizeExt(extension);
  let delivered = 0;
  clients.forEach(record => {
    if (record === fromRecord) return;
    if (normalizeExt(record.meta?.extension) !== toExt) return;
    if (sendJson(record,{
      ...message,
      clientId:fromRecord.clientId,
      fromClientId:fromRecord.clientId,
      from:message.from || fromRecord.meta
    })) delivered += 1;
  });
  return delivered;
}

function handleMessage(record,raw) {
  let message;
  try {
    message = JSON.parse(raw);
  } catch {
    return;
  }
  if (message.type === 'register') {
    register(record,message);
    return;
  }
  if (!record.clientId) return;
  if (message.type === 'call-request') {
    const delivered = forwardToExtension(message.toExt,message,record);
    if (!delivered) sendJson(record,{type:'call-unavailable',callId:message.callId,clientId:'server'});
    return;
  }
  if (message.type === 'call-cancelled') {
    forwardToExtension(message.toExt,message,record);
    return;
  }
  if (['call-accept','call-reject','call-busy','webrtc-offer','webrtc-answer','webrtc-ice','hangup'].includes(message.type)) {
    if (!forwardToClient(message.to,message,record) && message.callId) {
      sendJson(record,{type:'call-unavailable',callId:message.callId,clientId:'server'});
    }
  }
}

const server = http.createServer((req,res) => {
  if (new URL(req.url,'http://localhost').pathname === '/intercom-signal') {
    res.writeHead(426,{'content-type':'text/plain; charset=utf-8'});
    res.end('WebSocket endpoint');
    return;
  }
  serveStatic(req,res);
});

server.on('upgrade',(req,socket) => {
  const pathname = new URL(req.url,'http://localhost').pathname;
  if (pathname !== '/intercom-signal') {
    socket.destroy();
    return;
  }
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }
  const accept = crypto
    .createHash('sha1')
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest('base64');
  socket.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${accept}`,
    '',
    ''
  ].join('\r\n'));
  const record = {id:`server-${Date.now()}-${Math.random().toString(36).slice(2)}`,socket,meta:{}};
  attachSocket(record,raw => handleMessage(record,raw),() => {
    if (record.clientId && clients.get(record.clientId) === record) clients.delete(record.clientId);
  });
});

server.listen(port,host,() => {
  const localHost = host === '0.0.0.0' ? 'localhost' : host;
  console.log(`Ambassador office server running at http://${localHost}:${port}/homepage-ui.html`);
  console.log(`Intercom WebSocket ready at ws://${localHost}:${port}/intercom-signal`);
});
