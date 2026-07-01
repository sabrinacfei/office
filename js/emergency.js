(() => {
  const goHome = () => { window.location.href = 'homepage-ui.html'; };
  const views = {
    choice:document.getElementById('choiceView'),
    pin:document.getElementById('pinView'),
    call:document.getElementById('callView'),
    done:document.getElementById('doneView')
  };
  let action = 'lock';
  let pin = '';
  const lockIcon = '<svg class="lock-svg" viewBox="0 0 64 64"><path d="M18 29v-8c0-8 6-14 14-14s14 6 14 14v8"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  const unlockIcon = '<svg class="lock-svg" viewBox="0 0 64 64"><path d="M18 29v-7c0-8 6-14 14-14 6 0 11 4 13 9"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  function updateTime() {
    const time = new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false});
    document.getElementById('headerTime').textContent = time;
    document.getElementById('doneTime').textContent = time;
  }
  updateTime(); setInterval(updateTime,30000);
  function show(name) {
    Object.entries(views).forEach(([key,view]) => {
      const active = key === name;
      view.classList.toggle('active',active);
      view.setAttribute('aria-hidden',String(!active));
    });
  }
  function renderPin() {
    [...document.querySelectorAll('#pinDots i')].forEach((dot,index) => dot.classList.toggle('filled',index < pin.length));
    document.getElementById('pinError').textContent = '';
  }
  document.querySelectorAll('.emergency-card').forEach(card => card.addEventListener('click',() => {
    action = card.dataset.action;
    if (action === 'call') { show('call'); return; }
    pin = '';
    renderPin();
    document.getElementById('pinTitle').textContent = action === 'lock' ? '輸入上鎖授權碼' : '輸入解鎖授權碼';
    document.getElementById('pinKicker').textContent = action === 'lock' ? 'SECURITY LOCK' : 'SECURITY UNLOCK';
    show('pin');
  }));
  document.querySelectorAll('.section-back').forEach(button => button.addEventListener('click',() => show(button.dataset.back)));
  document.getElementById('pinPad').addEventListener('click',event => {
    const button = event.target.closest('button');
    if (!button) return;
    const act = button.dataset.action;
    if (act === 'clear') pin = '';
    else if (act === 'delete') pin = pin.slice(0,-1);
    else pin = (pin + button.textContent.trim()).replace(/\D/g,'').slice(0,6);
    renderPin();
  });
  document.getElementById('pinConfirm').addEventListener('click',() => {
    if (pin.length !== 6) {
      document.getElementById('pinError').textContent = '請輸入 6 碼授權碼';
      return;
    }
    const doneIcon = document.getElementById('doneIcon');
    const isLock = action === 'lock';
    document.getElementById('doneTitle').textContent = isLock ? '大門已上鎖' : '大門已解鎖';
    document.getElementById('doneStatus').textContent = isLock ? '上鎖完成' : '解鎖完成';
    doneIcon.classList.toggle('locked',isLock);
    doneIcon.classList.toggle('unlocked',!isLock);
    doneIcon.innerHTML = isLock ? lockIcon : unlockIcon;
    updateTime();
    show('done');
  });
  document.getElementById('endCall').addEventListener('click',() => show('choice'));
  document.getElementById('doneBack').addEventListener('click',goHome);
  document.getElementById('backButton').addEventListener('click',goHome);
})();