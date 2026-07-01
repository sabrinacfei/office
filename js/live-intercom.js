(() => {
  const config = window.OfficeConfig || {};
  const sessionKey = config.sessionStorageKey || 'ambassadorOfficeSession';
  const accountList = config.accounts || [];
  const clientKey = 'ambassadorIntercomClientId';
  const clientId = sessionStorage.getItem(clientKey) || `client-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
  sessionStorage.setItem(clientKey,clientId);

  let socket = null;
  let reconnectTimer = null;
  let currentUser = readSession();
  let currentCall = null;
  let peer = null;
  let localStream = null;
  let pendingIce = [];
  let overlayReady = false;
  let layer;
  let callCard;
  let kicker;
  let title;
  let subtitle;
  let statusText;
  let actions;
  let answerButton;
  let declineButton;
  let hangupButton;
  let remoteAudio;
  let toastBox;
  let overlayHost;

  function normalizeExt(value) {
    return String(value || '').replace(/\D/g,'');
  }

  function readSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(sessionKey) || 'null');
      if (!saved?.account) return null;
      const full = accountList.find(item => item.account === saved.account);
      return full ? {...full,...saved} : saved;
    } catch (error) {
      return null;
    }
  }

  function userLabel(user = currentUser) {
    return user?.department || user?.role || user?.account || '未知人員';
  }

  function ensureOverlay() {
    if (overlayReady) return;
    overlayHost =
      document.querySelector('.canvas') ||
      document.querySelector('.visitor-canvas') ||
      document.querySelector('.kiosk-screen') ||
      document.body;
    if (getComputedStyle(overlayHost).position === 'static') {
      overlayHost.style.position = 'relative';
    }
    layer = document.createElement('section');
    layer.className = 'live-intercom-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = `
      <div class="live-call-card" data-state="idle" role="dialog" aria-modal="true" aria-labelledby="liveCallTitle">
        <div class="live-call-orb" aria-hidden="true">
          <svg viewBox="0 0 48 48"><path d="M5 8c6-3 10 7 7 11l-2 2c4 8 9 13 17 17l2-2c4-3 14 1 11 7-2 5-8 6-14 4C14 42 6 34 1 22-1 16 0 10 5 8Z"/></svg>
        </div>
        <span class="live-call-kicker">INTERCOM CALL</span>
        <h2 class="live-call-title" id="liveCallTitle">對講通話</h2>
        <p class="live-call-subtitle"></p>
        <div class="live-call-status"></div>
        <div class="live-call-actions" data-mode="outgoing">
          <button class="live-call-decline" type="button">掛斷</button>
          <button class="live-call-answer" type="button">接聽</button>
          <button class="live-call-hangup" type="button">結束通話</button>
        </div>
        <audio class="live-call-audio" autoplay playsinline></audio>
      </div>
    `;
    toastBox = document.createElement('div');
    toastBox.className = 'live-call-toast';
    overlayHost.append(layer,toastBox);
    callCard = layer.querySelector('.live-call-card');
    kicker = layer.querySelector('.live-call-kicker');
    title = layer.querySelector('.live-call-title');
    subtitle = layer.querySelector('.live-call-subtitle');
    statusText = layer.querySelector('.live-call-status');
    actions = layer.querySelector('.live-call-actions');
    answerButton = layer.querySelector('.live-call-answer');
    declineButton = layer.querySelector('.live-call-decline');
    hangupButton = layer.querySelector('.live-call-hangup');
    remoteAudio = layer.querySelector('.live-call-audio');
    answerButton.addEventListener('click',acceptIncomingCall);
    declineButton.addEventListener('click',declineOrCancelCall);
    hangupButton.addEventListener('click',declineOrCancelCall);
    overlayReady = true;
  }

  function showToast(message) {
    ensureOverlay();
    toastBox.textContent = message;
    toastBox.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toastBox.classList.remove('show'),2400);
  }

  function showCall(state, data = {}) {
    ensureOverlay();
    callCard.dataset.state = state;
    kicker.textContent = data.kicker || 'INTERCOM CALL';
    title.textContent = data.title || '對講通話';
    subtitle.textContent = data.subtitle || '';
    statusText.textContent = data.status || '';
    actions.dataset.mode = data.mode || 'outgoing';
    layer.hidden = false;
    window.requestAnimationFrame(() => {
      layer.classList.add('open');
      layer.setAttribute('aria-hidden','false');
    });
  }

  function hideCall(delay = 0) {
    ensureOverlay();
    window.setTimeout(() => {
      layer.classList.remove('open');
      layer.setAttribute('aria-hidden','true');
    },delay);
  }

  function canSignal() {
    return socket?.readyState === WebSocket.OPEN;
  }

  function send(payload) {
    if (!canSignal()) return false;
    socket.send(JSON.stringify({...payload,clientId}));
    return true;
  }

  function registerClient() {
    if (!currentUser?.account) return;
    send({
      type:'register',
      account:currentUser.account,
      extension:normalizeExt(currentUser.extension),
      role:currentUser.role,
      department:currentUser.department,
      english:currentUser.english
    });
  }

  function connectSignal() {
    window.clearTimeout(reconnectTimer);
    if (!currentUser?.account || !location.host || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${protocol}//${location.host}/intercom-signal`);
    socket.addEventListener('open',registerClient);
    socket.addEventListener('message',event => {
      try {
        handleSignal(JSON.parse(event.data));
      } catch (error) {
        console.warn('無法解析對講機訊息',error);
      }
    });
    socket.addEventListener('close',() => {
      if (!currentUser?.account) return;
      reconnectTimer = window.setTimeout(connectSignal,1800);
    });
    socket.addEventListener('error',() => {
      showToast('即時對講伺服器未連線');
    });
  }

  async function ensureMedia() {
    if (localStream) return localStream;
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('這個瀏覽器不支援麥克風通話');
    }
    localStream = await navigator.mediaDevices.getUserMedia({
      audio:{
        echoCancellation:true,
        noiseSuppression:true,
        autoGainControl:true
      },
      video:false
    });
    return localStream;
  }

  function closePeer(stopAudio = false) {
    if (peer) {
      peer.onicecandidate = null;
      peer.ontrack = null;
      peer.onconnectionstatechange = null;
      peer.close();
    }
    peer = null;
    pendingIce = [];
    if (remoteAudio) remoteAudio.srcObject = null;
    if (stopAudio && localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
  }

  function createPeer(remoteClientId) {
    closePeer(false);
    peer = new RTCPeerConnection({iceServers:[]});
    localStream.getTracks().forEach(track => peer.addTrack(track,localStream));
    peer.onicecandidate = event => {
      if (event.candidate) {
        send({
          type:'webrtc-ice',
          to:remoteClientId,
          callId:currentCall?.id,
          candidate:event.candidate
        });
      }
    };
    peer.ontrack = event => {
      if (remoteAudio && event.streams[0]) remoteAudio.srcObject = event.streams[0];
    };
    peer.onconnectionstatechange = () => {
      if (!peer) return;
      if (peer.connectionState === 'connected') {
        showCall('connected',{
          kicker:'CONNECTED',
          title:'通話中',
          subtitle:currentCall?.remoteLabel || '',
          status:'語音通話已接通',
          mode:'active'
        });
      }
      if (['failed','disconnected','closed'].includes(peer.connectionState)) {
        if (currentCall) statusText.textContent = '通話已中斷';
      }
    };
    return peer;
  }

  async function flushIce() {
    if (!peer?.remoteDescription) return;
    const queue = pendingIce;
    pendingIce = [];
    for (const candidate of queue) {
      try {
        await peer.addIceCandidate(candidate);
      } catch (error) {
        console.warn('ICE 加入失敗',error);
      }
    }
  }

  async function startCallByExtension(extension) {
    currentUser = readSession();
    const toExt = normalizeExt(extension);
    if (!currentUser?.account) {
      showToast('請先登入員工帳號');
      return false;
    }
    if (!toExt) {
      showToast('請輸入分機');
      return false;
    }
    if (!canSignal()) {
      connectSignal();
      showToast('即時對講伺服器尚未連線');
      return false;
    }
    const callId = `call-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    currentCall = {
      id:callId,
      direction:'outgoing',
      targetExt:toExt,
      remoteLabel:`分機 ${toExt}`
    };
    send({
      type:'call-request',
      callId,
      toExt,
      from:{
        account:currentUser.account,
        extension:normalizeExt(currentUser.extension),
        role:currentUser.role,
        department:currentUser.department
      }
    });
    showCall('calling',{
      kicker:'CALLING',
      title:`撥打分機 ${toExt}`,
      subtitle:`${userLabel()} 正在呼叫`,
      status:'等待對方接聽',
      mode:'outgoing'
    });
    return true;
  }

  async function acceptIncomingCall() {
    if (!currentCall || currentCall.direction !== 'incoming') return;
    try {
      await ensureMedia();
      send({
        type:'call-accept',
        to:currentCall.peerId,
        callId:currentCall.id,
        from:{
          account:currentUser.account,
          extension:normalizeExt(currentUser.extension),
          role:currentUser.role,
          department:currentUser.department
        }
      });
      showCall('connecting',{
        kicker:'CONNECTING',
        title:'正在接通',
        subtitle:currentCall.remoteLabel,
        status:'建立語音連線中',
        mode:'active'
      });
    } catch (error) {
      showToast('麥克風權限未開啟，無法接聽');
      send({type:'call-reject',to:currentCall.peerId,callId:currentCall.id,reason:'mic-denied'});
      cleanupCall(false);
    }
  }

  function declineOrCancelCall() {
    if (!currentCall) {
      hideCall();
      return;
    }
    if (currentCall.direction === 'incoming') {
      send({type:'call-reject',to:currentCall.peerId,callId:currentCall.id});
    } else if (currentCall.peerId) {
      send({type:'hangup',to:currentCall.peerId,callId:currentCall.id});
    } else {
      send({type:'call-cancelled',callId:currentCall.id,toExt:currentCall.targetExt});
    }
    cleanupCall(true);
  }

  function cleanupCall(stopAudio) {
    closePeer(Boolean(stopAudio));
    currentCall = null;
    hideCall();
  }

  async function handleSignal(message) {
    if (!message || message.clientId === clientId) return;
    if (message.type === 'registered') return;

    if (message.type === 'call-request') {
      if (currentCall) {
        send({type:'call-busy',to:message.fromClientId,callId:message.callId});
        return;
      }
      const from = message.from || {};
      currentCall = {
        id:message.callId,
        direction:'incoming',
        peerId:message.fromClientId,
        remoteLabel:userLabel(from),
        targetExt:message.toExt
      };
      showCall('incoming',{
        kicker:'INCOMING CALL',
        title:userLabel(from),
        subtitle:`分機 ${message.toExt || from.extension || ''} 來電`,
        status:'對講機來電中',
        mode:'incoming'
      });
      return;
    }

    if (!currentCall || message.callId !== currentCall.id) return;

    if (message.type === 'call-accepted') {
      currentCall.peerId = message.fromClientId;
      currentCall.remoteLabel = userLabel(message.from);
      try {
        await ensureMedia();
        createPeer(message.fromClientId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        send({type:'webrtc-offer',to:message.fromClientId,callId:currentCall.id,description:peer.localDescription});
        showCall('connecting',{
          kicker:'CONNECTING',
          title:'正在接通',
          subtitle:currentCall.remoteLabel,
          status:'建立語音連線中',
          mode:'active'
        });
      } catch (error) {
        showToast('麥克風權限未開啟，無法通話');
        send({type:'hangup',to:message.fromClientId,callId:currentCall.id});
        cleanupCall(false);
      }
      return;
    }

    if (message.type === 'webrtc-offer') {
      try {
        currentCall.peerId = message.fromClientId;
        await ensureMedia();
        createPeer(message.fromClientId);
        await peer.setRemoteDescription(message.description);
        await flushIce();
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        send({type:'webrtc-answer',to:message.fromClientId,callId:currentCall.id,description:peer.localDescription});
      } catch (error) {
        showToast('無法建立語音通話');
        send({type:'hangup',to:message.fromClientId,callId:currentCall.id});
        cleanupCall(false);
      }
      return;
    }

    if (message.type === 'webrtc-answer') {
      try {
        await peer?.setRemoteDescription(message.description);
        await flushIce();
      } catch (error) {
        console.warn('設定通話回覆失敗',error);
      }
      return;
    }

    if (message.type === 'webrtc-ice') {
      const candidate = message.candidate;
      if (!candidate) return;
      if (peer?.remoteDescription) {
        try {
          await peer.addIceCandidate(candidate);
        } catch (error) {
          console.warn('ICE 加入失敗',error);
        }
      } else {
        pendingIce.push(candidate);
      }
      return;
    }

    if (message.type === 'call-reject') {
      statusText.textContent = '對方已掛斷';
      cleanupCall(true);
      return;
    }

    if (message.type === 'call-busy') {
      statusText.textContent = '對方通話中';
      window.setTimeout(() => cleanupCall(true),900);
      return;
    }

    if (message.type === 'call-unavailable') {
      statusText.textContent = '該分機目前未登入';
      window.setTimeout(() => cleanupCall(true),1200);
      return;
    }

    if (message.type === 'hangup' || message.type === 'call-cancelled') {
      statusText.textContent = '通話已結束';
      cleanupCall(true);
    }
  }

  function refreshSession() {
    currentUser = readSession();
    if (!currentUser?.account) {
      if (socket) socket.close();
      socket = null;
      cleanupCall(true);
      return;
    }
    if (canSignal()) registerClient();
    else connectSignal();
  }

  window.addEventListener('office-session-change',refreshSession);
  window.addEventListener('storage',event => {
    if (event.key === sessionKey) refreshSession();
  });
  window.addEventListener('beforeunload',() => {
    if (currentCall?.peerId) send({type:'hangup',to:currentCall.peerId,callId:currentCall.id});
  });

  window.AmbassadorLiveIntercom = {
    startCallByExtension,
    reconnect:refreshSession,
    getStatus:() => ({connected:canSignal(),user:currentUser,clientId})
  };

  ensureOverlay();
  refreshSession();
})();
