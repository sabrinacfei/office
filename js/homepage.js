(() => {
  const officeConfig = window.OfficeConfig || {};
  const departmentAccounts = officeConfig.accounts || [
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
  const loginPasswordValue = officeConfig.loginPassword || '123456';
  const sessionStorageKey = officeConfig.sessionStorageKey || 'ambassadorOfficeSession';
  const loginNextKey = officeConfig.loginNextKey || 'ambassadorOfficeNext';
  const movies = [
    {id:'supergirl',image:'images/Supergirl.jpg',title:'超少女',english:'SUPERGIRL',score:'★ 8.8',genre:'動作・冒險',duration:'126 分鐘',quote:'「向光而行，勇敢成為自己的英雄。」',tag:'本週首選'},
    {id:'toy5',image:'images/ToyStory5.jpg.avif',title:'玩具總動員 5',english:'TOY STORY 5',score:'★ 9.1',genre:'動畫・喜劇',duration:'105 分鐘',quote:'「老朋友，新冒險，故事永遠不會結束。」',tag:'親子推薦'},
    {id:'passenger',image:'images/PASSENGER.jpg',title:'鬼上車',english:'PASSENGER',score:'★ 8.3',genre:'劇情・懸疑',duration:'116 分鐘',quote:'「旅程的終點，藏著意想不到的答案。」',tag:'口碑推薦'},
    {id:'minions',image:'images/MINIONSMONSTE.jpg',title:'小小兵＆大怪獸',english:'MINIONS & MONSTERS',score:'★ 8.6',genre:'動畫・冒險',duration:'98 分鐘',quote:'「歡笑集合，這次的任務有點失控。」',tag:'歡樂首選'},
    {id:'realm',image:'images/InTheRealmOfTheSenses.jpg',title:'感官世界',english:'IN THE REALM OF THE SENSES',score:'★ 8.1',genre:'劇情',duration:'109 分鐘',quote:'「經典作品，重新回到大銀幕。」',tag:'經典重映'},
    {id:'spiderman',image:'images/SpiderManBrandNewDay.jpg',title:'蜘蛛人：重生日',english:'SPIDER-MAN: BRAND NEW DAY',score:'★ 8.9',genre:'動作・科幻',duration:'138 分鐘',quote:'「每一次選擇，都將寫下嶄新的一頁。」',tag:'熱映強片',layout:'right',focal:'58% center'},
    {id:'hokum',image:'images/Hokum.png',title:'陰魂旅社',english:'HOKUM',score:'★ 8.2',genre:'懸疑・劇情',duration:'112 分鐘',quote:'「真相與謊言，只隔著一場表演。」',tag:'編輯精選'},
    {id:'sorrybaby',image:'images/SorryBaby.jpg',title:'寶貝，對不起',english:'SORRY, BABY',score:'★ 8.5',genre:'劇情',duration:'103 分鐘',quote:'「有些傷口，會在陪伴中慢慢癒合。」',tag:'影展選片'},
    {id:'conan',image:'images/DetectiveConantheMovieFallenAngelof_180x270_Poster.webp',title:'名偵探柯南',english:'DETECTIVE CONAN: FALLEN ANGEL',score:'★ 9.0',genre:'動畫・推理',duration:'110 分鐘',quote:'「唯一看透真相的，是外表看似小孩的名偵探。」',tag:'人氣強檔'}
  ];

  const weekdayText = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const weatherIcons = {
    cloudySunny:'images/weather cloudy to sunny.png',
    sunny:'images/sunny.png',
    rain:'images/rain.png',
    cloudy:'images/cloudy.png',
    clearNight:'images/clear night.png',
    thunder:'images/Afternoon thundershowers.png'
  };
  const weatherState = {
    location:'台北市信義區',
    cwaStation:'臺北',
    text:'多雲時晴',
    temp:'28'
  };

  const homeTime = document.getElementById('homeTime');
  const homeDate = document.getElementById('homeDate');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherText = document.getElementById('weatherText');
  const weatherLocation = document.getElementById('weatherLocation');
  const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const loginAccount = document.getElementById('loginAccount');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const passwordToggle = document.getElementById('passwordToggle');
  const logoutButton = document.getElementById('logoutButton');
  const logoutModal = document.getElementById('logoutModal');
  const logoutCancel = document.getElementById('logoutCancel');
  const logoutConfirm = document.getElementById('logoutConfirm');
  const departmentName = document.getElementById('departmentName');
  const departmentEnglish = document.getElementById('departmentEnglish');

  function readSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(sessionStorageKey) || 'null');
      if (!saved?.account) return null;
      const found = departmentAccounts.find(item => item.account === saved.account);
      return found ? {...found,...saved} : saved;
    } catch (error) {
      return null;
    }
  }

  function notifySessionChange(session) {
    window.dispatchEvent(new CustomEvent('office-session-change',{detail:session || null}));
  }

  function applyDepartmentIdentity(session = readSession()) {
    const display = session?.account ? session : null;
    if (departmentName) departmentName.textContent = display?.department || '員工專區';
    if (departmentEnglish) departmentEnglish.textContent = display?.english || 'EMPLOYEE HUB';
  }

  function showLogin() {
    if (!loginScreen) return;
    loginScreen.classList.remove('is-hidden');
    loginScreen.removeAttribute('aria-hidden');
    window.setTimeout(() => loginAccount?.focus(),80);
  }

  function hideLogin() {
    if (!loginScreen) return;
    loginScreen.classList.add('is-hidden');
    loginScreen.setAttribute('aria-hidden','true');
  }

  function applyLoginState() {
    const session = readSession();
    applyDepartmentIdentity(session);
    if (session?.account) hideLogin();
    else showLogin();
  }

  function openLogoutModal() {
    if (!logoutModal) return;
    logoutModal.hidden = false;
    window.requestAnimationFrame(() => {
      logoutModal.classList.add('is-open');
      logoutModal.setAttribute('aria-hidden','false');
    });
  }

  function closeLogoutModal() {
    if (!logoutModal) return;
    logoutModal.classList.remove('is-open');
    logoutModal.setAttribute('aria-hidden','true');
    window.setTimeout(() => {
      if (!logoutModal.classList.contains('is-open')) logoutModal.hidden = true;
    },180);
  }

  function updateTodayInfo() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2,'0');
    const d = String(now.getDate()).padStart(2,'0');
    if (homeTime) {
      homeTime.textContent = new Intl.DateTimeFormat('zh-TW',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
    }
    if (homeDate) homeDate.textContent = `${y} / ${m} / ${d}　${weekdayText[now.getDay()]}`;
  }

  function isNightTime(date = new Date()) {
    const hour = date.getHours();
    return hour >= 18 || hour < 6;
  }

  function pickWeatherIcon(text) {
    const value = String(text || '');
    if (/雷|閃電/.test(value)) return weatherIcons.thunder;
    if (/雨|陣雨/.test(value)) return weatherIcons.rain;
    if (/晴/.test(value) && isNightTime()) return weatherIcons.clearNight;
    if (/晴/.test(value) && /雲/.test(value)) return weatherIcons.cloudySunny;
    if (/晴/.test(value)) return weatherIcons.sunny;
    if (/陰|雲/.test(value)) return weatherIcons.cloudy;
    return weatherIcons.cloudySunny;
  }

  function renderWeather() {
    if (weatherIcon) {
      const src = pickWeatherIcon(weatherState.text);
      weatherIcon.src = src;
      weatherIcon.alt = weatherState.text;
    }
    if (weatherTemp) weatherTemp.textContent = `${Math.round(Number(weatherState.temp) || 28)}°`;
    if (weatherText) weatherText.textContent = weatherState.text;
    if (weatherLocation) weatherLocation.textContent = weatherState.location;
  }

  function readCwaValue(elements, names) {
    const list = Array.isArray(elements) ? elements : [];
    const found = list.find(item => names.includes(item.ElementName || item.elementName));
    return found?.ElementValue || found?.elementValue || found?.Now?.Precipitation || '';
  }

  async function refreshWeatherFromCwa() {
    const key = window.CWA_API_KEY || localStorage.getItem('CWA_API_KEY') || localStorage.getItem('cwaApiKey');
    if (!key) {
      renderWeather();
      return;
    }

    try {
      const url = new URL('https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001');
      url.searchParams.set('Authorization',key);
      url.searchParams.set('format','JSON');
      url.searchParams.set('StationName',weatherState.cwaStation);
      const response = await fetch(url.href,{cache:'no-store'});
      if (!response.ok) throw new Error(`CWA ${response.status}`);
      const data = await response.json();
      const stations = data.records?.Station || data.records?.location || [];
      const station = stations[0];
      const elements = station?.WeatherElement || station?.weatherElement || [];
      const weather = readCwaValue(elements,['Weather','天氣']) || station?.Weather || weatherState.text;
      const temp = readCwaValue(elements,['AirTemperature','TEMP','氣溫']) || station?.AirTemperature || weatherState.temp;
      weatherState.text = String(weather || weatherState.text).replace('無資料','多雲時晴');
      weatherState.temp = String(temp || weatherState.temp);
      weatherState.location = '台北市信義區';
    } catch (error) {
      console.warn('中央氣象署天氣更新失敗，使用本機備援資料。',error);
    } finally {
      renderWeather();
    }
  }

  const notificationButton = document.getElementById('notificationButton');
  const notificationPanel = document.getElementById('notificationPanel');
  const notificationList = document.getElementById('notificationList');
  const notificationCount = document.getElementById('notificationCount');
  const notificationDot = document.getElementById('notificationDot');
  const notificationEmpty = document.getElementById('notificationEmpty');
  const clearNotifications = document.getElementById('clearNotifications');
  const notificationStorageKey = 'ambassadorOfficeNotifications';
  const notificationSeedKey = 'ambassadorOfficeNotificationsSeed20260630';
  const defaultNotifications = [
    {id:'repair-001',type:'申請維修通知',title:'影廳 3 號設備回報處理中',body:'投影機無法開機，維修人員已收到申請。',time:'剛剛',target:'employee.html?view=bulk'},
    {id:'system-001',type:'系統通知',title:'6 月份排班公告已更新',body:'請至排班公告查看今日班表與內部提醒。',time:'10 分鐘前',target:'employee.html?view=schedule'},
    {id:'repair-002',type:'申請維修通知',title:'餐飲區爆米花機卡住',body:'請值班主管確認設備狀態並補充照片。',time:'25 分鐘前',target:'employee.html?view=bulk'}
  ];
  const randomNotificationTemplates = [
    {type:'申請維修通知',title:'影廳 2 號音響設備待確認',body:'同仁回報音量忽大忽小，請協助查看。',target:'employee.html?view=bulk'},
    {type:'申請維修通知',title:'售票設備需要補檢',body:'取票機讀取速度偏慢，請確認現場狀態。',target:'employee.html?view=bulk'},
    {type:'申請維修通知',title:'餐飲區設備回報',body:'飲料機出杯異常，請值班同仁補充照片。',target:'employee.html?view=bulk'},
    {type:'系統通知',title:'今日交接提醒',body:'請確認門窗、設備電源與環境整潔。',target:'employee.html?view=schedule'},
    {type:'系統通知',title:'排班公告提醒',body:'請查看今日班表與內部提醒事項。',target:'employee.html?view=schedule'}
  ];
  let notifications = loadNotifications();

  function loadNotifications() {
    try {
      if (!localStorage.getItem(notificationSeedKey)) {
        localStorage.setItem(notificationSeedKey,'1');
        localStorage.setItem(notificationStorageKey,JSON.stringify(defaultNotifications));
        return defaultNotifications;
      }
      const saved = JSON.parse(localStorage.getItem(notificationStorageKey) || 'null');
      return Array.isArray(saved) ? saved : defaultNotifications;
    } catch (error) {
      return defaultNotifications;
    }
  }

  function saveNotifications() {
    localStorage.setItem(notificationStorageKey,JSON.stringify(notifications));
  }

  function removeNotification(id) {
    notifications = notifications.filter(item => item.id !== id);
    saveNotifications();
    renderNotifications();
  }

  function bindNotificationItem(item) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let swiping = false;
    let moved = false;

    item.addEventListener('pointerdown',event => {
      startX = event.clientX;
      startY = event.clientY;
      currentX = 0;
      moved = false;
      swiping = true;
      item.setPointerCapture?.(event.pointerId);
    });

    item.addEventListener('pointermove',event => {
      if (!swiping) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
        swiping = false;
        item.style.transform = '';
        return;
      }
      currentX = Math.max(0,Math.min(128,dx));
      moved = moved || currentX > 8;
      item.style.transform = `translateX(${currentX}px)`;
    });

    const finishSwipe = () => {
      if (!swiping) return;
      swiping = false;
      if (currentX > 82) {
        item.classList.add('is-removing');
        window.setTimeout(() => removeNotification(item.dataset.id),160);
        return;
      }
      item.style.transform = '';
    };

    item.addEventListener('pointerup',finishSwipe);
    item.addEventListener('pointercancel',finishSwipe);
    item.addEventListener('click',event => {
      if (moved) {
        event.preventDefault();
        return;
      }
      const target = item.dataset.target;
      removeNotification(item.dataset.id);
      if (target) window.setTimeout(() => { window.location.href = target; },80);
    });
  }

  function addRandomNotification() {
    const template = randomNotificationTemplates[Math.floor(Math.random() * randomNotificationTemplates.length)];
    const notification = {
      id:`auto-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      ...template,
      time:'剛剛'
    };
    notifications = [notification, ...notifications].slice(0,30);
    saveNotifications();
    renderNotifications();
    notificationButton?.animate?.([
      { transform:'scale(1)' },
      { transform:'scale(1.06)' },
      { transform:'scale(1)' }
    ],{ duration:280, easing:'ease-out' });
  }

  function renderNotifications() {
    if (!notificationList || !notificationCount || !notificationDot || !notificationEmpty) return;
    notificationCount.textContent = String(notifications.length);
    notificationDot.hidden = notifications.length === 0;
    notificationEmpty.hidden = notifications.length !== 0;
    notificationList.innerHTML = notifications.map(item => `
      <article class="notification-item" data-id="${item.id}" data-target="${item.target || ''}">
        <span>${item.type}</span>
        <strong>${item.title}</strong>
        <p>${item.body}</p>
        <small>${item.time}</small>
      </article>
    `).join('');
    notificationList.querySelectorAll('.notification-item').forEach(bindNotificationItem);
  }

  function closeNotifications() {
    if (!notificationPanel || !notificationButton) return;
    notificationPanel.classList.remove('open');
    notificationPanel.setAttribute('aria-hidden','true');
    notificationButton.setAttribute('aria-expanded','false');
    notificationPanel.hidden = true;
  }

  function goEmployeeMovie(movie = movies[current]) {
    const movieId = movie?.id || movies[current]?.id || 'supergirl';
    window.location.href = `employee.html?view=movie&movie=${encodeURIComponent(movieId)}`;
  }

  const carousel = document.getElementById('movieCarousel');
  const backdrop = document.getElementById('heroImage');
  const pager = document.getElementById('heroPager');
  const fields = {
    title:document.getElementById('heroTitle'),
    english:document.getElementById('heroEnglish'),
    score:document.getElementById('heroScore'),
    genre:document.getElementById('heroGenre'),
    duration:document.getElementById('heroDuration'),
    quote:document.getElementById('heroQuote'),
    tag:document.getElementById('heroTag')
  };

  let current = 0;
  let startX = null;
  let dragDistance = 0;
  let wheelLocked = false;
  let carouselTimer = null;
  const carouselInterval = 5000;
  const dots = movies.map((movie,index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `第 ${index + 1} 張：${movie.title}`);
    dot.addEventListener('click',event => {
      event.stopPropagation();
      showUserChoice(index);
    });
    pager.appendChild(dot);
    return dot;
  });

  function loadImage(path) {
    return new Promise((resolve,reject) => {
      const candidate = new Image();
      candidate.onload = () => resolve(candidate.currentSrc || candidate.src);
      candidate.onerror = () => reject(new Error('無法載入電影圖片：' + path));
      const imageUrl = new URL(path,document.baseURI);
      imageUrl.searchParams.set('v','20260622-3');
      candidate.src = imageUrl.href;
    });
  }

  let requestToken = 0;
  async function show(next) {
    const targetIndex = (next + movies.length) % movies.length;
    const movie = movies[targetIndex];
    const token = ++requestToken;
    carousel.classList.add('is-changing');
    try {
      const loadedUrl = await loadImage(movie.image);
      if (token !== requestToken) return;
      current = targetIndex;
      backdrop.src = loadedUrl;
      backdrop.alt = movie.title + '電影主視覺';
      backdrop.style.objectPosition = movie.focal || 'center';
      carousel.dataset.layout = movie.layout || 'full';
      Object.keys(fields).forEach(key => fields[key].textContent = movie[key]);
      dots.forEach((dot,index) => dot.classList.toggle('active',index === current));
    } catch (error) {
      console.error(error);
    } finally {
      if (token === requestToken) carousel.classList.remove('is-changing');
    }
  }

  function restartCarouselTimer() {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => {
      if (document.hidden || startX !== null) return;
      show(current + 1);
    },carouselInterval);
  }

  function showUserChoice(next) {
    show(next);
    restartCarouselTimer();
  }

  carousel.querySelector('.prev').addEventListener('click',event => {
    event.stopPropagation();
    showUserChoice(current - 1);
  });
  carousel.querySelector('.next').addEventListener('click',event => {
    event.stopPropagation();
    showUserChoice(current + 1);
  });
  carousel.addEventListener('pointerdown',event => {
    if (event.target.closest('button,.buy')) return;
    startX = event.clientX;
    dragDistance = 0;
    carousel.classList.add('is-dragging');
  });
  window.addEventListener('pointermove',event => {
    if (startX === null) return;
    dragDistance = event.clientX - startX;
    const visualDistance = Math.max(-70,Math.min(70,dragDistance * .28));
    carousel.style.setProperty('--drag-x',visualDistance + 'px');
  });
  window.addEventListener('pointerup',event => {
    if (startX !== null) {
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 18) showUserChoice(current + (distance < 0 ? 1 : -1));
    }
    startX = null;
    dragDistance = 0;
    carousel.style.setProperty('--drag-x','0px');
    carousel.classList.remove('is-dragging');
  });
  window.addEventListener('pointercancel',() => {
    startX = null;
    dragDistance = 0;
    carousel.style.setProperty('--drag-x','0px');
    carousel.classList.remove('is-dragging');
  });
  carousel.addEventListener('wheel',event => {
    if (wheelLocked || Math.abs(event.deltaX) < 18) return;
    event.preventDefault();
    wheelLocked = true;
    showUserChoice(current + (event.deltaX > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; },320);
  },{passive:false});
  carousel.addEventListener('keydown',event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showUserChoice(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showUserChoice(current + 1); }
  });
  carousel.addEventListener('dragstart',event => event.preventDefault());

  const trigger = document.getElementById('quickMenuTrigger');
  const radialLayer = document.getElementById('radialLayer');
  const radialMenu = document.getElementById('radialMenu');
  const radialLabel = document.getElementById('radialLabel');
  const radialItems = [...document.querySelectorAll('.radial-item')];
  const quickView = document.getElementById('quickView');
  const quickBack = document.getElementById('quickBack');
  const quickViewIcon = document.getElementById('quickViewIcon');
  const quickViewTitle = document.getElementById('quickViewTitle');
  const quickViewDescription = document.getElementById('quickViewDescription');
  const quickSingleAction = document.getElementById('quickSingleAction');
  const attendanceChoices = document.getElementById('attendanceChoices');
  const employeeChoices = document.getElementById('employeeChoices');
  const quickContent = {
    employee:['員工專區','查看個人資料、班表與員工相關資訊。'],
    intercom:['對講機','連接辦公室內部對講通訊介面。'],
    attendance:['上下班打卡','請選擇這次要進行上班打卡或下班打卡。']
  };
  let holdTimer = null;
  let radialOpen = false;
  let activeRadial = null;

  function positionRadialMenu() {
    const triggerRect = trigger.getBoundingClientRect();
    const canvas = document.querySelector('.canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const scale = canvasRect.width / 1712;
    let x = (triggerRect.left + triggerRect.width / 2 - canvasRect.left) / scale;
    let y = (triggerRect.top + triggerRect.height / 2 - canvasRect.top) / scale;
    x = Math.max(210,Math.min(1502,x));
    y = Math.max(210,Math.min(870,y));
    radialMenu.style.left = x + 'px';
    radialMenu.style.top = y + 'px';
  }

  function openRadialMenu() {
    positionRadialMenu();
    radialOpen = true;
    trigger.classList.add('is-holding');
    radialLayer.classList.add('open');
    radialLayer.setAttribute('aria-hidden','false');
  }

  function closeRadialMenu() {
    radialOpen = false;
    activeRadial = null;
    radialItems.forEach(item => item.classList.remove('active'));
    radialLabel.textContent = '滑動選擇';
    trigger.classList.remove('is-holding');
    radialLayer.classList.remove('open');
    radialLayer.setAttribute('aria-hidden','true');
  }

  function openQuickView(action,item) {
    if (action === 'employee') { window.location.href = 'employee.html'; return; }
    if (action === 'intercom') { window.location.href = 'intercom.html'; return; }
    if (action === 'attendance') { window.location.href = 'attendance.html'; return; }
    const content = quickContent[action];
    if (!content) return;
    quickViewIcon.innerHTML = item.querySelector('svg').outerHTML;
    quickViewTitle.textContent = content[0];
    quickViewDescription.textContent = content[1];
    const isAttendance = action === 'attendance';
    const isEmployee = action === 'employee';
    quickSingleAction.style.display = (isAttendance || isEmployee) ? 'none' : 'inline-block';
    attendanceChoices.classList.toggle('show',isAttendance);
    employeeChoices.classList.toggle('show',isEmployee);
    quickView.classList.add('open');
    quickView.setAttribute('aria-hidden','false');
  }

  trigger.addEventListener('pointerdown',event => {
    event.preventDefault();
    window.clearTimeout(holdTimer);
    trigger.classList.add('is-holding');
    holdTimer = window.setTimeout(openRadialMenu,500);
  });

  window.addEventListener('pointermove',event => {
    if (!radialOpen) return;
    const target = document.elementFromPoint(event.clientX,event.clientY)?.closest('.radial-item');
    activeRadial = target || null;
    radialItems.forEach(item => item.classList.toggle('active',item === activeRadial));
    radialLabel.textContent = activeRadial ? activeRadial.textContent.trim() : '滑動選擇';
  });

  window.addEventListener('pointerup',() => {
    window.clearTimeout(holdTimer);
    trigger.classList.remove('is-holding');
    if (!radialOpen) return;
    const selected = activeRadial;
    closeRadialMenu();
    if (selected) openQuickView(selected.dataset.action,selected);
  });
  window.addEventListener('pointercancel',() => {
    window.clearTimeout(holdTimer);
    trigger.classList.remove('is-holding');
    if (radialOpen) closeRadialMenu();
  });

  radialItems.forEach(item => item.addEventListener('click',() => {
    closeRadialMenu();
    openQuickView(item.dataset.action,item);
  }));
  quickBack.addEventListener('click',() => {
    quickView.classList.remove('open');
    quickView.setAttribute('aria-hidden','true');
  });

  const employeeMovieOfferButton = document.getElementById('employeeMovieOfferButton');
  const employeeBenefitsButton = document.getElementById('employeeBenefitsButton');
  const movieOfferView = document.getElementById('movieOfferView');
  const offerBack = document.getElementById('offerBack');
  const offerImage = document.getElementById('offerImage');
  const offerTitle = document.getElementById('offerTitle');
  const offerEnglish = document.getElementById('offerEnglish');
  const sessionCards = [...document.querySelectorAll('.session-card')];
  const offerBuyButton = document.querySelector('.offer-buy');
  employeeMovieOfferButton.addEventListener('click',() => {
    const movie = movies[current];
    offerImage.src = backdrop.src;
    offerTitle.textContent = movie.title;
    offerEnglish.textContent = movie.english;
    movieOfferView.classList.add('open');
    movieOfferView.setAttribute('aria-hidden','false');
    quickView.classList.remove('open');
    quickView.setAttribute('aria-hidden','true');
  });
  employeeBenefitsButton.addEventListener('click',() => {
    quickViewTitle.textContent = '員工福利';
    quickViewDescription.textContent = '查看員工專屬福利、活動與合作優惠。';
    employeeChoices.classList.remove('show');
    quickSingleAction.style.display = 'inline-block';
  });
  offerBack.addEventListener('click',() => {
    movieOfferView.classList.remove('open');
    movieOfferView.setAttribute('aria-hidden','true');
  });
  sessionCards.forEach(card => card.addEventListener('click',() => {
    sessionCards.forEach(item => item.classList.toggle('selected',item === card));
  }));

  const buyButton = document.getElementById('buyButton');
  const ticketLayer = document.getElementById('ticketLayer');
  const ticketClose = document.getElementById('ticketClose');
  const ticketSteps = [...document.querySelectorAll('.ticket-step')];
  const ticketStepBadges = [...document.querySelectorAll('.ticket-steps span')];
  const ticketSessionButtons = [...document.querySelectorAll('#ticketSessionGrid button')];
  const ticketEmployeeId = document.getElementById('ticketEmployeeId');
  const ticketEmployeeError = document.getElementById('ticketEmployeeError');
  const ticketMovieImage = document.getElementById('ticketMovieImage');
  const ticketMovieTitle = document.getElementById('ticketMovieTitle');
  const ticketMovieEnglish = document.getElementById('ticketMovieEnglish');
  const ticketMovieTag = document.getElementById('ticketMovieTag');
  const payMovieTitle = document.getElementById('payMovieTitle');
  const paySession = document.getElementById('paySession');
  const payEmployee = document.getElementById('payEmployee');
  let selectedTicketSession = ticketSessionButtons[0];
  const stepMap = ['session','employee','payment'];

  function setTicketStep(stepName) {
    ticketSteps.forEach(step => step.classList.toggle('active',step.dataset.step === stepName));
    const index = stepName === 'success' ? 2 : stepMap.indexOf(stepName);
    ticketStepBadges.forEach((badge,badgeIndex) => badge.classList.toggle('active',badgeIndex === Math.max(0,index)));
  }

  function openTicketFlow() {
    const movie = movies[current];
    ticketMovieImage.src = backdrop.src;
    ticketMovieTitle.textContent = movie.title;
    ticketMovieEnglish.textContent = movie.english;
    ticketMovieTag.textContent = movie.tag;
    payMovieTitle.textContent = movie.title;
    ticketEmployeeId.value = '';
    ticketEmployeeError.textContent = '';
    selectedTicketSession = ticketSessionButtons[0];
    ticketSessionButtons.forEach((button,index) => button.classList.toggle('selected',index === 0));
    setTicketStep('session');
    ticketLayer.classList.add('open');
    ticketLayer.setAttribute('aria-hidden','false');
  }

  function closeTicketFlow() {
    ticketLayer.classList.remove('open');
    ticketLayer.setAttribute('aria-hidden','true');
  }

  ticketSessionButtons.forEach(button => button.addEventListener('click',() => {
    selectedTicketSession = button;
    ticketSessionButtons.forEach(item => item.classList.toggle('selected',item === button));
  }));
  buyButton.addEventListener('click',event => {
    event.stopPropagation();
    goEmployeeMovie(movies[current]);
  });
  offerBuyButton.addEventListener('click',() => goEmployeeMovie(movies[current]));
  document.getElementById('ticketToEmployee').addEventListener('click',() => {
    setTicketStep('employee');
    window.setTimeout(() => ticketEmployeeId.focus(),80);
  });
  ticketEmployeeId.addEventListener('input',() => {
    ticketEmployeeId.value = ticketEmployeeId.value.replace(/[^\da-zA-Z]/g,'').toUpperCase().slice(0,8);
    ticketEmployeeError.textContent = '';
  });
  document.getElementById('ticketConfirmEmployee').addEventListener('click',() => {
    const value = ticketEmployeeId.value.trim();
    if (!/^[A-Z]?\d{4,7}$/.test(value)) {
      ticketEmployeeError.textContent = '請輸入正確員工號，例如 A1025 或 1025';
      return;
    }
    payEmployee.textContent = value;
    paySession.textContent = `${selectedTicketSession.dataset.day} ${selectedTicketSession.dataset.time}｜${selectedTicketSession.dataset.room}`;
    setTicketStep('payment');
  });
  document.getElementById('ticketFinishPayment').addEventListener('click',() => setTicketStep('success'));
  document.getElementById('ticketDone').addEventListener('click',() => { window.location.href = 'homepage-ui.html'; });
  ticketClose.addEventListener('click',closeTicketFlow);

  const visitorEntry = document.getElementById('visitorEntry');
  const openVisitorPage = () => { window.location.href = 'visitor.html'; };
  visitorEntry.addEventListener('click',openVisitorPage);
  visitorEntry.addEventListener('keydown',event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openVisitorPage();
    }
  });

  const deliveryEntry = document.getElementById('deliveryEntry');
  const openDeliveryPage = () => { window.location.href = 'delivery.html'; };
  deliveryEntry.addEventListener('click',openDeliveryPage);
  deliveryEntry.addEventListener('keydown',event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDeliveryPage();
    }
  });

  const mealEntry = document.getElementById('mealEntry');
  const openMealPage = () => { window.location.href = 'employee.html#food'; };
  mealEntry.addEventListener('click',openMealPage);
  mealEntry.addEventListener('keydown',event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMealPage();
    }
  });

  const emergencyEntry = document.getElementById('emergencyEntry');
  const openEmergencyPage = () => { window.location.href = 'emergency.html'; };
  emergencyEntry.addEventListener('click',openEmergencyPage);
  emergencyEntry.addEventListener('keydown',event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEmergencyPage();
    }
  });

  loginForm?.addEventListener('submit',event => {
    event.preventDefault();
    const account = loginAccount?.value.trim().toLowerCase() || '';
    const found = departmentAccounts.find(item => item.account === account);
    if (!found || loginPassword?.value !== loginPasswordValue) {
      if (loginError) loginError.textContent = '帳號或密碼錯誤，請重新輸入。';
      loginForm.classList.remove('is-shaking');
      void loginForm.offsetWidth;
      loginForm.classList.add('is-shaking');
      return;
    }

    const session = {
      ...found,
      loginAt:new Date().toISOString()
    };
    localStorage.setItem(sessionStorageKey,JSON.stringify(session));
    applyDepartmentIdentity(session);
    notifySessionChange(session);
    if (loginError) loginError.textContent = '';
    if (loginPassword) loginPassword.value = '';
    const nextTarget = sessionStorage.getItem(loginNextKey);
    if (nextTarget) {
      sessionStorage.removeItem(loginNextKey);
      window.location.href = nextTarget;
      return;
    }
    hideLogin();
  });

  passwordToggle?.addEventListener('click',() => {
    if (!loginPassword) return;
    const visible = loginPassword.type === 'text';
    loginPassword.type = visible ? 'password' : 'text';
    passwordToggle.setAttribute('aria-label',visible ? '顯示密碼' : '隱藏密碼');
  });

  logoutButton?.addEventListener('click',openLogoutModal);
  logoutCancel?.addEventListener('click',closeLogoutModal);
  logoutConfirm?.addEventListener('click',() => {
    localStorage.removeItem(sessionStorageKey);
    applyDepartmentIdentity(null);
    notifySessionChange(null);
    closeLogoutModal();
    closeNotifications();
    showLogin();
  });
  window.addEventListener('storage',event => {
    if (event.key === sessionStorageKey) {
      const session = readSession();
      applyDepartmentIdentity(session);
      notifySessionChange(session);
      if (session?.account) hideLogin();
      else showLogin();
    }
  });
  logoutModal?.addEventListener('click',event => {
    if (event.target === logoutModal) closeLogoutModal();
  });
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && logoutModal?.classList.contains('is-open')) closeLogoutModal();
  });

  notificationButton?.addEventListener('click',event => {
    event.stopPropagation();
    const open = !notificationPanel.classList.contains('open');
    if (open) notificationPanel.hidden = false;
    notificationPanel.classList.toggle('open',open);
    notificationPanel.setAttribute('aria-hidden',String(!open));
    notificationButton.setAttribute('aria-expanded',String(open));
    if (!open) notificationPanel.hidden = true;
  });
  notificationPanel?.addEventListener('click',event => event.stopPropagation());
  document.addEventListener('click',closeNotifications);
  clearNotifications?.addEventListener('click',() => {
    notifications = [];
    saveNotifications();
    renderNotifications();
  });

  updateTodayInfo();
  window.setInterval(updateTodayInfo,1000);
  refreshWeatherFromCwa();
  window.setInterval(refreshWeatherFromCwa,10 * 60 * 1000);
  renderNotifications();
  window.setInterval(addRandomNotification,5 * 60 * 1000);
  applyLoginState();
  show(0);
  restartCarouselTimer();
})();
