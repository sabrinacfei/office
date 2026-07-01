(() => {
  const form = document.getElementById('visitorForm');
  const peopleButtons = [...document.querySelectorAll('#peopleOptions button')];
  const nameInput = document.getElementById('visitorName');
  const phoneInput = document.getElementById('visitorPhone');
  const companyInput = document.getElementById('visitorCompany');
  const clearButton = document.getElementById('clearButton');
  const digitCount = document.getElementById('digitCount');
  const reviewLayer = document.getElementById('reviewLayer');
  const successLayer = document.getElementById('successLayer');
  const autoReturnSeconds = document.getElementById('autoReturnSeconds');
  let people = '1';
  const visitorPeopleArt = document.querySelector('#visitorPeopleArt');

  const visitorPeopleImages = {
    '1': 'images/one.png',
    '2': 'images/2.png',
    '3': 'images/3.png',
    '4': 'images/4.png',
    '5': 'images/5.png',
    '6': 'images/6.png',
    '6+': 'images/6.png'
  };

const visitorDefaultImage = 'images/665E7F6A-CB9A-4AB7-9894-05CBA6BECF9C.png';

const updateVisitorPeopleImage = value => {
  if (!visitorPeopleArt) return;

  visitorPeopleArt.classList.remove('visitor-art-pop');
  visitorPeopleArt.src = visitorPeopleImages[value] || visitorDefaultImage;

  requestAnimationFrame(() => {
    visitorPeopleArt.classList.add('visitor-art-pop');
  });
};

  const goHome = () => { window.location.href = 'homepage-ui.html'; };
  let idleTimer = null;
  let idleDeadline = Date.now() + 10000;
  const resetIdleTimer = () => {
    window.clearTimeout(idleTimer);
    idleDeadline = Date.now() + 10000;
    idleTimer = window.setTimeout(goHome,10000);
    autoReturnSeconds.textContent = '10';
  };
  ['pointerdown','touchstart','keydown','input'].forEach(eventName => window.addEventListener(eventName,resetIdleTimer,{passive:true}));
  window.setInterval(() => {
    autoReturnSeconds.textContent = String(Math.max(0,Math.ceil((idleDeadline - Date.now()) / 1000)));
  },250);
  resetIdleTimer();

  const updateTime = () => {
    const time = new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false});
    document.getElementById('headerTime').textContent = time;
    document.getElementById('successTime').textContent = time;
  };
  updateTime();
  window.setInterval(updateTime,30000);

  const updateDigitCount = () => {
    digitCount.textContent = `${phoneInput.value.length} / 10`;
  };
  updateDigitCount();

  peopleButtons.forEach(button => button.addEventListener('click',() => {
    people = button.dataset.value;
    peopleButtons.forEach(item => item.classList.toggle('selected', item === button));
    updateVisitorPeopleImage(people);
  }));

  const clearFieldError = input => {
    const group = input.closest('.input-group');
    group.classList.remove('invalid');
    group.querySelector('.error').textContent = '';
  };

  [nameInput,companyInput].forEach(input => input.addEventListener('input',() => clearFieldError(input)));
  phoneInput.addEventListener('input',() => {
    phoneInput.value = phoneInput.value.replace(/\D/g,'').slice(0,10);
    updateDigitCount();
    clearFieldError(phoneInput);
  });

  const validate = (input,message,test = value => value.trim().length > 0) => {
    const group = input.closest('.input-group');
    const valid = test(input.value);
    group.classList.toggle('invalid',!valid);
    group.querySelector('.error').textContent = valid ? '' : message;
    return valid;
  };

  clearButton.addEventListener('click',() => {
    form.reset();
    people = '1';
    updateDigitCount();
    peopleButtons.forEach((item,index) => item.classList.toggle('selected',index === 0));
    if (visitorPeopleArt) {
      visitorPeopleArt.src = visitorDefaultImage;
    }
    document.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('invalid');
      group.querySelector('.error').textContent = '';
    });
    nameInput.focus();
  });

  form.addEventListener('submit',event => {
    event.preventDefault();
    const nameValid = validate(nameInput,'請輸入訪客姓名');
    const phoneValid = validate(phoneInput,'手機號碼須為 09 開頭的 10 碼數字',value => /^09\d{8}$/.test(value));
    const companyValid = validate(companyInput,'請輸入公司或單位名稱');
    if (!(nameValid && phoneValid && companyValid)) return;

    document.getElementById('reviewPeople').textContent = people === '6+' ? '6 人以上' : `${people} 人`;
    document.getElementById('reviewName').textContent = nameInput.value.trim();
    document.getElementById('reviewPhone').textContent = phoneInput.value;
    document.getElementById('reviewCompany').textContent = companyInput.value.trim();
    reviewLayer.classList.add('open');
    reviewLayer.setAttribute('aria-hidden','false');
  });

  document.getElementById('reviewEdit').addEventListener('click',() => {
    reviewLayer.classList.remove('open');
    reviewLayer.setAttribute('aria-hidden','true');
  });

  document.getElementById('reviewSubmit').addEventListener('click',() => {
    reviewLayer.classList.remove('open');
    reviewLayer.setAttribute('aria-hidden','true');
    document.getElementById('successName').textContent = nameInput.value.trim();
    document.getElementById('successPeople').textContent = people === '6+' ? '6 人以上' : `${people} 人`;
    updateTime();
    successLayer.classList.add('open');
    successLayer.setAttribute('aria-hidden','false');
  });

  document.getElementById('backButton').addEventListener('click',goHome);
  document.getElementById('successBack').addEventListener('click',goHome);
})();
