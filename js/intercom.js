(() => {
  const config = window.OfficeConfig || {};
  const sessionKey = config.sessionStorageKey || 'ambassadorOfficeSession';
  const loginNextKey = config.loginNextKey || 'ambassadorOfficeNext';
  const accounts = config.accounts || [
    {account:'ticket',department:'票務部',english:'TICKETING DEPARTMENT',role:'票務部',extension:'2011'},
    {account:'floor',department:'場務部',english:'FLOOR OPERATIONS',role:'場務部',extension:'2001'},
    {account:'food',department:'餐飲部',english:'FOOD & BEVERAGE',role:'餐飲部',extension:'3011'},
    {account:'booth',department:'放映部',english:'PROJECTION DEPARTMENT',role:'放映部',extension:'4001'},
    {account:'service',department:'客服部',english:'CUSTOMER SERVICE',role:'客服部',extension:'1003'},
    {account:'ops',department:'營運管理部',english:'OPERATIONS MANAGEMENT',role:'營運管理部',extension:'6001'},
    {account:'market',department:'行銷部',english:'MARKETING DEPARTMENT',role:'行銷部',extension:'7001'},
    {account:'finance',department:'行政財務部',english:'ADMINISTRATION & FINANCE',role:'行政財務部',extension:'3021'},
    {account:'security',department:'保全部',english:'SECURITY DEPARTMENT',role:'保全部',extension:'5001'}
  ];
  const contacts = (config.contacts || accounts.map(item => ({
    name:item.department,
    role:item.department,
    ext:`#${item.extension}`,
    tone:'#e7b77b',
    account:item.account,
    english:item.english
  }))).map(contact => ({...contact, extension:normalizeExt(contact.ext || contact.extension)}));

  const grid = document.getElementById('contactGrid');
  const search = document.getElementById('contactSearch');
  const display = document.getElementById('dialDisplay');
  const userBox = document.getElementById('intercomUser');
  const legacyLayer = document.getElementById('callLayer');
  let dial = '';

  function normalizeExt(value) {
    return String(value || '').replace(/\D/g,'');
  }

  function readSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(sessionKey) || 'null');
      if (!saved?.account) return null;
      const full = accounts.find(item => item.account === saved.account);
      return full ? {...full,...saved} : saved;
    } catch (error) {
      return null;
    }
  }

  function goHome() {
    window.location.href = 'homepage-ui.html';
  }

  function requireLogin() {
    if (readSession()?.account) return false;
    sessionStorage.setItem(loginNextKey,'intercom.html');
    window.location.href = 'homepage-ui.html';
    return true;
  }

  function updateTime() {
    const time = document.getElementById('headerTime');
    if (!time) return;
    time.textContent = new Date().toLocaleTimeString('zh-TW',{
      hour:'2-digit',
      minute:'2-digit',
      hour12:false
    });
  }

  function updateUserBox() {
    const session = readSession();
    if (!userBox) return;
    userBox.textContent = session?.department
      ? `目前登入：${session.department}｜本機分機 ${session.extension}`
      : '目前登入：--';
  }

  function renderContacts(list = contacts) {
    const session = readSession();
    grid.innerHTML = list.map(contact => {
      const isSelf = session?.account === contact.account;
      return `
        <button class="contact-card${isSelf ? ' self' : ''}" type="button" data-ext="${contact.extension}" data-role="${contact.role}">
          <div class="avatar" style="background:${contact.tone}22;color:${contact.tone}">${contact.role.slice(0,1)}</div>
          <div>
            <strong>${contact.role}</strong>
            <span>${contact.english || contact.name || ''}</span>
          </div>
          <div class="contact-ext">${isSelf ? '本機' : `#${contact.extension}`}</div>
        </button>
      `;
    }).join('');
  }

  function findDialContact() {
    return contacts.find(contact => contact.extension === dial);
  }

  function renderDial() {
    const matched = findDialContact();
    display.classList.toggle('matched',Boolean(matched));
    display.textContent = matched ? `${matched.role} #${matched.extension}` : `${dial || ''}_`;
  }

  function fillDial(extension) {
    dial = normalizeExt(extension).slice(0,8);
    renderDial();
  }

  function callExtension(extension) {
    const toExt = normalizeExt(extension || dial);
    if (!toExt) return;
    const started = window.AmbassadorLiveIntercom?.startCallByExtension(toExt);
    if (!started && legacyLayer) {
      const matched = contacts.find(contact => contact.extension === toExt);
      document.getElementById('callName').textContent = `正在撥打${matched?.role || `分機 ${toExt}`}`;
      document.getElementById('callNumber').textContent = matched ? `#${toExt}` : '';
      legacyLayer.classList.add('open');
      legacyLayer.setAttribute('aria-hidden','false');
    }
  }

  if (requireLogin()) return;
  if (legacyLayer) legacyLayer.remove();
  updateTime();
  window.setInterval(updateTime,30000);
  updateUserBox();
  renderContacts();
  renderDial();

  search?.addEventListener('input',() => {
    const q = search.value.trim().toLowerCase();
    renderContacts(contacts.filter(contact => {
      const haystack = `${contact.name} ${contact.role} ${contact.english} ${contact.extension} ${contact.account}`.toLowerCase();
      return haystack.includes(q);
    }));
  });

  grid?.addEventListener('click',event => {
    const card = event.target.closest('.contact-card');
    if (!card) return;
    fillDial(card.dataset.ext);
  });

  document.getElementById('dialpad')?.addEventListener('click',event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'clear') dial = '';
    else if (action === 'delete') dial = dial.slice(0,-1);
    else dial = (dial + button.childNodes[0].textContent.trim()).slice(0,8);
    renderDial();
  });

  document.getElementById('callButton')?.addEventListener('click',() => callExtension());
  document.getElementById('backButton')?.addEventListener('click',goHome);

  window.addEventListener('storage',event => {
    if (event.key !== sessionKey) return;
    if (requireLogin()) return;
    updateUserBox();
    renderContacts();
    window.AmbassadorLiveIntercom?.reconnect();
  });

  window.addEventListener('office-session-change',() => {
    if (requireLogin()) return;
    updateUserBox();
    renderContacts();
  });
})();
