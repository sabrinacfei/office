(() => {
  const goHome = () => { window.location.href = 'homepage-ui.html'; };

  const employees = {
    1111: { name: '可樂', role: '前台主任', shift: '今日 09:00–17:00', next: '06 / 25（四）09:00' },
    2222: { name: '雪碧', role: '票務專員', shift: '今日 12:00–20:00', next: '06 / 25（四）13:00' },
    3333: { name: '爆米花', role: '場務人員', shift: '今日 15:00–23:00', next: '06 / 26（五）10:00' },
    4444: { name: '吉拿棒', role: '餐飲夥伴', shift: '今日 09:30–17:30', next: '06 / 26（五）11:00' },
    5555: { name: '奶油', role: '影廳服務', shift: '今日 16:00–00:00', next: '06 / 27（六）16:00' },
    6666: { name: '可可', role: '保全人員', shift: '今日 07:00–15:00', next: '06 / 27（六）08:00' }
  };

  const clockInMessages = [
    name => `哈囉！${name}！很開心今天可以跟你一起上班！`,
    name => `嗨！${name}，今天一起加油吧！`,
    name => `${name} 早安，影城今天也交給你啦！`,
    name => `歡迎回來，${name}！今天也會是順順的一天。`
  ];

  const clockOutMessages = [
    name => `${name}，今天上班辛苦了，回家好好休息喔！`,
    name => `${name}，今天也完成任務了，晚點好好放鬆一下。`,
    name => `謝謝你今天的努力，${name}，路上小心，我們下次班見！`,
    name => `${name} 辛苦啦，今天的你也很可靠。`
  ];

  const moods = [
    { label: '開心', src: 'images/happy.png', color: '#36d482' },
    { label: '平淡', src: 'images/emotionless.png', color: '#e7b77b' },
    { label: '難過', src: 'images/sad.png', color: '#6da7ff' },
    { label: '生氣', src: 'images/angry.png', color: '#ff6868' }
  ];

  const $ = selector => document.querySelector(selector);
  const modeButtons = [...document.querySelectorAll('#modeSwitch button')];
  const employeeId = $('#employeeId');
  const error = $('#employeeError');
  const keypad = $('#keypad');
  const reviewLayer = $('#reviewLayer');
  const successLayer = $('#successLayer');
  const autoReturnSeconds = $('#autoReturnSeconds');
  const moodSection = $('#moodSection');
  const moodRange = $('#moodRange');
  const moodImage = $('#moodImage');
  const moodLabel = $('#moodLabel');

  let selectedMode = '上班打卡';
  let selectedEmployee = null;
  let idleTimer = null;
  let idleDeadline = Date.now() + 10000;

  const randomFrom = list => list[Math.floor(Math.random() * list.length)];

  const resetIdle = () => {
    clearTimeout(idleTimer);
    idleDeadline = Date.now() + 10000;
    idleTimer = setTimeout(goHome, 10000);
    autoReturnSeconds.textContent = '10';
  };

  ['pointerdown', 'keydown', 'input', 'touchstart'].forEach(eventName => {
    window.addEventListener(eventName, resetIdle, { passive: true });
  });

  setInterval(() => {
    autoReturnSeconds.textContent = String(Math.max(0, Math.ceil((idleDeadline - Date.now()) / 1000)));
  }, 250);
  resetIdle();

  const updateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    $('#headerTime').textContent = time;
    $('#attendanceTime').textContent = time;
    $('#attendanceDate').textContent = now.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long'
    }).replace(/\//g, ' / ');
    $('#successTime').textContent = time;
  };

  updateTime();
  setInterval(updateTime, 30000);

  const updateMood = () => {
    const mood = moods[Number(moodRange.value)] || moods[1];
    moodImage.src = mood.src;
    moodLabel.textContent = mood.label;
    moodRange.style.setProperty('--mood-progress', `${(Number(moodRange.value) / 3) * 100}%`);
    moodRange.style.setProperty('--mood-color', mood.color);
  };

  updateMood();
  moodRange.addEventListener('input', updateMood);

  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedMode = button.dataset.mode;
      modeButtons.forEach(item => item.classList.toggle('selected', item === button));
      error.textContent = '';
    });
  });

  employeeId.addEventListener('input', () => {
    employeeId.value = employeeId.value.replace(/\D/g, '').slice(0, 4);
    error.textContent = '';
  });

  keypad.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'clear') employeeId.value = '';
    else if (action === 'delete') employeeId.value = employeeId.value.slice(0, -1);
    else employeeId.value = (employeeId.value + button.textContent.trim()).replace(/\D/g, '').slice(0, 4);
    error.textContent = '';
  });

  $('#attendanceSubmit').addEventListener('click', () => {
    const value = employeeId.value.trim();
    selectedEmployee = employees[value];

    if (!/^\d{4}$/.test(value)) {
      error.textContent = '請輸入 4 碼員工號';
      return;
    }

    if (!selectedEmployee) {
      error.textContent = '查無此員工號，請確認後再輸入';
      return;
    }

    const time = $('#headerTime').textContent;
    $('#reviewMode').textContent = selectedMode;
    $('#reviewEmployeeName').textContent = `${selectedEmployee.name}・${selectedEmployee.role}`;
    $('#reviewEmployee').textContent = value;
    $('#reviewTime').textContent = time;
    reviewLayer.classList.add('open');
    reviewLayer.setAttribute('aria-hidden', 'false');
  });

  $('#reviewEdit').addEventListener('click', () => {
    reviewLayer.classList.remove('open');
    reviewLayer.setAttribute('aria-hidden', 'true');
  });

  $('#reviewSubmit').addEventListener('click', () => {
    if (!selectedEmployee) return;

    const value = employeeId.value.trim();
    const isClockOut = selectedMode === '下班打卡';
    const message = randomFrom(isClockOut ? clockOutMessages : clockInMessages)(selectedEmployee.name);

    reviewLayer.classList.remove('open');
    reviewLayer.setAttribute('aria-hidden', 'true');

    $('#successTitle').textContent = selectedMode + '完成';
    $('#successKicker').textContent = isClockOut ? 'GOOD WORK TODAY' : 'WELCOME BACK';
    $('#successMessage').textContent = message;
    $('#successEmployeeName').textContent = `${selectedEmployee.name}　#${value}`;
    $('#successEmployeeRole').textContent = selectedEmployee.role;
    $('#successMode').textContent = selectedMode;
    $('#successShift').textContent = selectedEmployee.shift;

    if (isClockOut) {
      moodRange.value = '1';
      updateMood();
      $('#nextShiftTime').textContent = selectedEmployee.next;
      $('#successMascot').src = moods[1].src;
      moodSection.hidden = false;
    } else {
      $('#successMascot').src = 'images/clocking＿work.png';
      moodSection.hidden = true;
    }

    successLayer.classList.add('open');
    successLayer.setAttribute('aria-hidden', 'false');
  });

  moodRange.addEventListener('input', () => {
    $('#successMascot').src = moods[Number(moodRange.value)].src;
  });

  $('#backButton').addEventListener('click', goHome);
  $('#successBack').addEventListener('click', goHome);
})();