(() => {
  const officeSessionKey = 'ambassadorOfficeSession';
  const loginNextKey = 'ambassadorOfficeNext';
  try {
    if (!localStorage.getItem(officeSessionKey)) {
      const next = `employee.html${window.location.search || ''}${window.location.hash || ''}`;
      sessionStorage.setItem(loginNextKey,next);
      window.location.replace('homepage-ui.html');
      return;
    }
  } catch (error) {
    window.location.replace('homepage-ui.html');
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = (value) => `$${Number(value || 0).toLocaleString('zh-TW')}`;

  const views = {
    hub: $('#hubView'),
    benefits: $('#benefitView'),
    partnerList: $('#partnerListView'),
    partnerDetail: $('#partnerDetailView'),
    employeeVerify: $('#employeeVerifyView'),
    benefitQr: $('#benefitQrView'),
    birthday: $('#birthdayView'),
    birthdayVerify: $('#birthdayVerifyView'),
    birthdayResult: $('#birthdayResultView'),
    benefitNotice: $('#benefitNoticeView'),
    schedule: $('#scheduleView'),
    bulk: $('#bulkView'),
    movie: $('#movieView'),
    food: $('#foodView'),
    pay: $('#payView'),
    done: $('#doneView'),
    movieDone: $('#movieDoneView')
  };

  const categories = [
    {
      id: 'bento',
      title: '便當',
      vendor: '老張便當',
      desc: '台式家常便當，今日菜單，截止時間 11:00。',
      image: 'images/bento.jpg',
      items: [
        { id: 'pork-rib', name: '排骨飯', desc: '酥炸排骨、三樣配菜', price: 90, tag: '人氣' },
        { id: 'chicken-leg', name: '雞腿飯', desc: '招牌大雞腿、白飯與配菜', price: 100, tag: '熱銷' },
        { id: 'braised-pork', name: '控肉飯', desc: '滷控肉、滷蛋、青菜', price: 95 },
        { id: 'fish', name: '魚排飯', desc: '香煎魚排、季節配菜', price: 95 },
        { id: 'veg-bento', name: '蔬食便當', desc: '蛋奶素可，清爽配菜', price: 80, tag: '素' }
      ]
    },
    {
      id: 'donburi',
      title: '日式丼飯',
      vendor: '花火丼飯',
      desc: '現做日式丼飯，醬汁濃郁，適合午餐快速取餐。',
      image: 'images/Japanese Donburi.jpg',
      items: [
        { id: 'katsu', name: '炸豬排丼', desc: '豬排、滑蛋、洋蔥', price: 135, tag: '推薦' },
        { id: 'oyako', name: '親子丼', desc: '雞腿肉、滑蛋、洋蔥', price: 120 },
        { id: 'beef-don', name: '牛五花丼', desc: '牛五花、溫泉蛋、青蔥', price: 145 },
        { id: 'teriyaki', name: '照燒雞腿丼', desc: '炙燒雞腿、照燒醬', price: 130 },
        { id: 'salmon', name: '鮭魚鬆丼', desc: '鮭魚鬆、玉子燒、小菜', price: 150 }
      ]
    },
    {
      id: 'vegan',
      title: '素食天地',
      vendor: '青禾蔬食',
      desc: '清爽蔬食與蛋奶素選項，適合想吃輕盈的一餐。',
      image: 'images/vegetarian.jpg.webp',
      items: [
        { id: 'veg-curry', name: '蔬菜咖哩飯', desc: '南瓜、菇類、花椰菜', price: 110, tag: '蛋奶素' },
        { id: 'tofu', name: '香煎豆腐餐', desc: '豆腐排、五穀飯、沙拉', price: 105 },
        { id: 'mushroom', name: '菇菇燉飯', desc: '綜合菇、奶油白醬', price: 125, tag: '人氣' },
        { id: 'salad', name: '能量沙拉盒', desc: '鷹嘴豆、酪梨、堅果', price: 95 },
        { id: 'veg-noodle', name: '蔬食拌麵', desc: '胡麻醬、時蔬、豆包', price: 90 }
      ]
    },
    {
      id: 'spicy',
      title: '想吃點辣',
      vendor: '辣味研究所',
      desc: '香麻、辣炒、椒香料理，適合想提神的午餐。',
      image: 'images/Spicy.jpg',
      items: [
        { id: 'mala-chicken', name: '麻辣雞丁飯', desc: '花椒香麻、雞丁入味', price: 120, tag: '小辣' },
        { id: 'spicy-pork', name: '泡椒豬肉飯', desc: '酸辣泡椒、青蔥', price: 115 },
        { id: 'spicy-dumpling', name: '紅油抄手麵', desc: '紅油、抄手、細麵', price: 100 },
        { id: 'kungpao', name: '宮保雞丁飯', desc: '乾辣椒、花生、雞丁', price: 125, tag: '熱銷' },
        { id: 'spicy-tofu', name: '麻婆豆腐飯', desc: '豆腐、辣豆瓣、白飯', price: 95 }
      ]
    },
    {
      id: 'western',
      title: '西式輕食',
      vendor: '小島輕食',
      desc: '三明治、沙拉與飲品組合，適合不想吃太重的人。',
      image: 'images/Western_style.jpg',
      items: [
        { id: 'club', name: '總匯三明治', desc: '火腿、雞蛋、生菜', price: 95, tag: '人氣' },
        { id: 'chicken-salad', name: '舒肥雞沙拉', desc: '雞胸、堅果、油醋醬', price: 120 },
        { id: 'bagel', name: '煙燻鮭魚貝果', desc: '鮭魚、奶油乳酪', price: 135 },
        { id: 'pasta', name: '番茄肉醬筆管麵', desc: '番茄肉醬、起司', price: 130 },
        { id: 'soup', name: '濃湯輕食組', desc: '玉米濃湯、烤吐司', price: 90 }
      ]
    }
  ];

  const employeeMovies = [
    {
      id: 'supergirl',
      title: '超少女',
      en: 'SUPERGIRL',
      poster: 'images/Supergirl＿poster.jpg',
      hero: 'images/Supergirl.jpg',
      rating: '8.8',
      genre: '動作・冒險・科幻',
      minutes: 126,
      release: '2025.06.24（二）全台上映',
      synopsis: '卡拉・佐・艾爾從小在地球長大，身為氪星人的她，在尋找自己身分與力量的同時，也必須學會成為象徵希望的英雄。',
      cast: ['米莉・艾考克', '戴維・科倫斯韋', '瑞秋・布羅斯納安', '尼可拉斯・霍特']
    },
    { id: 'toy5', title: '玩具總動員 5', en: 'TOY STORY 5', poster: 'images/ToyStory5_Poster.jpg', hero: 'images/ToyStory5.jpg.avif', rating: '9.1', genre: '動畫・喜劇', minutes: 105, release: '2025.06.17（二）全台上映', synopsis: '老朋友們面對新世代玩具與科技挑戰，展開一場關於陪伴、勇氣與回家的冒險。', cast: ['胡迪', '巴斯光年', '翠絲', '抱抱龍'] },
    { id: 'passenger', title: '鬼上車', en: 'PASSENGER', poster: 'images/PASSENGER＿Poster.jpg', hero: 'images/PASSENGER.jpg', rating: '8.3', genre: '驚悚・懸疑', minutes: 112, release: '2025.06.18（三）你敢了嗎', synopsis: '夜班公車駛入陌生路線，乘客們逐漸發現車上多了一位不該存在的人。', cast: ['林映辰', '周宇翔', '陳品潔', '張柏恩'] },
    { id: 'minions', title: '小小兵＆大怪獸', en: 'MINIONS & MONSTERS', poster: 'images/MINIONSMONSTE＿poster.jpg', hero: 'images/MINIONSMONSTE.jpg', rating: '8.6', genre: '動畫・冒險', minutes: 98, release: '2025.06.30 歡樂登場', synopsis: '小小兵意外喚醒城市地下的大怪獸，只好用最混亂也最可愛的方式拯救世界。', cast: ['凱文', '史都華', '鮑伯', '奧托'] },
    { id: 'realm', title: '感官世界', en: 'IN THE REALM OF THE SENSES', poster: 'images/InTheRealmOfTheSenses_Poster.jpg', hero: 'images/InTheRealmOfTheSenses.jpg', rating: '8.1', genre: '經典・劇情', minutes: 109, release: '2025.06.18 武營鉅獻', synopsis: '經典重映，以壓抑時代裡的慾望與選擇，描繪人性難以迴避的矛盾。', cast: ['藤龍也', '松田英子', '中島葵', '殿山泰司'] },
    { id: 'spiderman', title: '蜘蛛人：重生日', en: 'SPIDER-MAN: BRAND NEW DAY', poster: 'images/SpiderManBrandNewDay_Poster.jpg', hero: 'images/SpiderManBrandNewDay.jpg', rating: '8.9', genre: '動作・科幻', minutes: 138, release: '2025.06.20 IMAX 同步上映', synopsis: '彼得帕克在失去一切後重新出發，面對新的敵人與重新定義自己的英雄道路。', cast: ['湯姆・霍蘭德', '辛蒂亞', '雅各布・貝塔隆', '麥可・基頓'] },
    { id: 'hokum', title: '陰魂旅社', en: 'HOKUM', poster: 'images/Hokum_Poster.jpg', hero: 'images/Hokum.png', rating: '8.0', genre: '恐怖・懸疑', minutes: 116, release: '2025.06.17（二）不宜久留', synopsis: '荒郊旅社每到午夜就會出現不存在的住客，所有房門背後都藏著一段未竟的怨念。', cast: ['安雅・卡洛', '馬克・威廉', '艾蜜莉・羅', '尚恩・李'] },
    { id: 'sorrybaby', title: '寶貝，對不起', en: 'SORRY, BABY', poster: 'images/SorryBaby_Poster.jpg', hero: 'images/SorryBaby.jpg', rating: '8.5', genre: '劇情・溫情', minutes: 104, release: '2025.06.05 溫柔上映', synopsis: '一段關於道歉、療癒與重新理解親密關係的故事，在日常裂縫裡看見重新開始的可能。', cast: ['艾娃・維克', '諾亞・金', '莉莉・陳', '班・史東'] },
    { id: 'conan', title: '名偵探柯南：萬眾仰望的英雄', en: 'DETECTIVE CONAN', poster: 'images/DetectiveConantheMovieFallenAngelof_Poster.jpg', hero: 'images/DetectiveConantheMovieFallenAngelof_180x270_Poster.webp', rating: '9.0', genre: '動畫・推理', minutes: 110, release: '2025.05.24 全台上映', synopsis: '柯南與夥伴們追查城市大型活動中的連續預告案，真相指向被遺忘的英雄傳說。', cast: ['江戶川柯南', '毛利蘭', '灰原哀', '安室透'] }
  ];

  const movieDates = [
    { id: '20250528', label: '今天', date: '05/28', weekday: '（三）' },
    { id: '20250529', label: '明天', date: '05/29', weekday: '（四）' },
    { id: '20250530', label: '後天', date: '05/30', weekday: '（五）' },
    { id: '20250531', label: '', date: '05/31', weekday: '（六）' },
    { id: '20250601', label: '', date: '06/01', weekday: '（日）', holiday: true },
    { id: '20250602', label: '', date: '06/02', weekday: '（一）' },
    { id: '20250603', label: '', date: '06/03', weekday: '（二）' }
  ];

  const movieFormats = ['2D', 'IMAX 2D', 'IMAX', '4DX', 'VIP'];

  const movieSessions = [
    { id: 'd1-1030', date: '20250529', day: '明天 05/29（四）', time: '10:30', hall: '國賓影城 8 廳', type: '2D', seats: 36 },
    { id: 'd1-1320', date: '20250529', day: '明天 05/29（四）', time: '13:20', hall: '國賓影城 5 廳', type: '2D', seats: 22 },
    { id: 'd1-1545', date: '20250529', day: '明天 05/29（四）', time: '15:45', hall: '國賓影城 IMAX 廳', type: 'IMAX 2D', seats: 18 },
    { id: 'd1-1810', date: '20250529', day: '明天 05/29（四）', time: '18:10', hall: '國賓影城 3 廳', type: '2D', seats: 30 },
    { id: 'd1-2040', date: '20250529', day: '明天 05/29（四）', time: '20:40', hall: '國賓影城 8 廳', type: '2D', seats: 16 },
    { id: 'd1-2130', date: '20250529', day: '明天 05/29（四）', time: '21:30', hall: '國賓影城 IMAX 廳', type: 'IMAX 2D', seats: 9 },
    { id: 'd1-2215', date: '20250529', day: '明天 05/29（四）', time: '22:15', hall: '國賓影城 1 廳', type: '2D', seats: 14 },
    { id: 'd0-1930', date: '20250528', day: '今天 05/28（三）', time: '19:30', hall: '國賓影城 8 廳', type: 'IMAX 2D', seats: 12 },
    { id: 'd2-1430', date: '20250530', day: '後天 05/30（五）', time: '14:30', hall: '國賓影城 6 廳', type: '4DX', seats: 10 },
    { id: 'd3-2000', date: '20250531', day: '05/31（六）', time: '20:00', hall: '國賓影城 VIP 廳', type: 'VIP', seats: 6 },
    { id: 'd4-1830', date: '20250601', day: '06/01（日）', time: '18:30', hall: '國賓影城 2 廳', type: 'IMAX', seats: 19 },
    { id: 'd5-1910', date: '20250602', day: '06/02（一）', time: '19:10', hall: '國賓影城 8 廳', type: '2D', seats: 24 },
    { id: 'd6-2030', date: '20250603', day: '06/03（二）', time: '20:30', hall: '國賓影城 5 廳', type: '2D', seats: 21 }
  ];

  const movieSnacks = [
    {
      id: 'popcorn-set',
      name: '爆米花套餐',
      label: '',
      image: 'images/爆米花套餐.png',
      icon: '../images/爆米花標示.png',
      basePrice: 120,
      desc: '中份爆米花 + 中杯飲料',
      badge: ''
    },
    {
      id: 'drink-set',
      name: '吉拿棒套餐',
      label: '',
      image: 'images/飲料套餐.png',
      icon: '../images/可樂標示.png',
      basePrice: 80,
      desc: '中杯飲料 + 吉拿棒',
      badge: ''
    },
    {
      id: 'couple-set',
      name: '雙人套餐',
      label: '',
      image: 'images/雙人套餐.png',
      icon: '../images/雙人套餐標示.png',
      basePrice: 220,
      desc: '大份爆米花 + 2 杯飲料 + 熱狗堡 + 吉拿棒',
      badge: '最受歡迎'
    },
    {
      id: 'hotdog-set',
      name: '熱狗堡套餐',
      label: '',
      image: 'images/熱狗堡套餐.png',
      icon: '../images/熱狗標示.png',
      basePrice: 110,
      desc: '熱狗堡 + 中杯飲料',
      badge: ''
    }
  ];

  let currentView = 'hub';
  let currentCategory = null;
  let cart = {};
  let foodPaymentMethod = '信用卡';
  let bulkKind = '影廳設備異常';
  let activePartnerFilter = '全部';
  let selectedPartner = null;
  let verifiedEmployeeId = '';
  let qrTimer = null;

  let movieStep = 'list';
  let selectedMovie = employeeMovies[0];
  let selectedSession = movieSessions[0];
  let selectedMovieDate = '20250529';
  let selectedMovieFormat = '2D';
  let moviePeople = 1;
  let movieEmployeeId = '';
  let selectedSeats = new Set();
  let movieSnackDraft = {};
  let movieSnackOrders = {};
  let snackFlashId = '';
  let snackDrawerOpen = false;
  let snackSummaryFlash = false;
  let snackSummaryShouldPop = false;
  let moviePaymentMethod = '信用卡付款';
  let movieInvoiceType = '捐贈發票';

  const partnerCategories = ['全部', '餐飲', '生活', '購物', '娛樂'];
  const partners = [
    {
      id: 'starbucks',
      category: '餐飲',
      name: 'Starbucks',
      offer: '全飲品 85 折',
      content: '全飲品享 85 折優惠',
      stores: '全台 Starbucks 門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/Starbucks_Coffee.svg.png',
      hero: 'images/Starbucks_drinks.png'
    },
    {
      id: 'uniqlo',
      category: '購物',
      name: 'UNIQLO',
      offer: '全館商品 95 折',
      content: '正價商品結帳享 95 折優惠',
      stores: '全台 UNIQLO 門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/uniqlo.svg.png',
      hero: 'images/uniqlo衣服.png'
    },
    {
      id: 'mcdonalds',
      category: '餐飲',
      name: '麥當勞',
      offer: '指定套餐優惠',
      content: '指定套餐、點心與飲品享員工優惠價',
      stores: '全台麥當勞指定門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: "images/McDonald's.png",
      hero: "images/麥當勞.png"
    },
    {
      id: 'nike',
      category: '購物',
      name: 'Nike',
      offer: '指定商品 9 折',
      content: '鞋款、服飾與運動配件指定商品享員工 9 折優惠',
      stores: '全台 Nike 直營與指定門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/nike.png',
      hero: 'images/nike運動鞋.png'
    },
    {
      id: 'cosmed',
      category: '生活',
      name: '康是美',
      offer: '指定商品優惠',
      content: '保健、美妝與日用品指定商品享優惠',
      stores: '全台康是美門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/COSMED.jpg',
      hero: 'images/化妝品.png'
    },
    {
      id: 'formosa',
      category: '餐飲',
      name: '鬍鬚張',
      offer: '指定套餐 9 折',
      content: '指定滷肉飯套餐與便當品項享 9 折',
      stores: '全台鬍鬚張指定門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/Formosa_Chang.png',
      hero: 'images/鬍鬚張.png'
    },
    {
      id: 'gu',
      category: '購物',
      name: 'GU',
      offer: '全館商品 95 折',
      content: '正價商品結帳享 95 折優惠',
      stores: '全台 GU 門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/GU.png',
      hero: 'images/衣服.png'
    },
    {
      id: 'net',
      category: '購物',
      name: 'NET',
      offer: '指定商品 9 折',
      content: '服飾、配件指定商品享員工優惠',
      stores: '全台 NET 門市',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/net.jpg',
      hero: 'images/NET衣服.png'
    },
    {
      id: 'ticket',
      category: '娛樂',
      name: '員工電影票',
      offer: '每月員工票券優惠',
      content: '員工電影票、生日票券與活動票券優惠',
      stores: '國賓影城全台據點',
      date: '2025/05/01 ~ 2025/12/31',
      logo: 'images/Employee_movie_tickets.png',
      hero: 'images/Employee_movie_tickets.png'
    }
  ];

  function updateTime() {
    const time = new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).format(new Date());
    const target = $('#currentTime');
    if (target) target.textContent = time;
    $$('[data-welfare-time]').forEach((item) => {
      item.textContent = time;
    });
  }

  function showView(name) {
    Object.entries(views).forEach(([key, el]) => {
      if (!el) return;
      const active = key === name;
      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', String(!active));
      if (active) el.scrollTop = 0;
    });

    currentView = name;
    updateHeaderBackText();

    if (name === 'movie') setMovieStep(movieStep);

    if (name === 'schedule') {
      window.setTimeout(updateScheduleScrollbars, 80);
    }
  }
  function updateScheduleScrollbars() {
    const scrollTargets = [
      '#scheduleView .staff-board-page',
      '#scheduleView .notice-panel',
      '#scheduleView .event-panel',
      '#scheduleView .quick-panel',
      '#scheduleView .today-panel',
      '#scheduleView .reminder-panel',
      '#scheduleView .notice-list'
    ];

    scrollTargets.forEach((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const canScroll = el.scrollHeight > el.clientHeight + 2;

      el.classList.toggle('is-scrollable', canScroll);
    });
  }
  function goHome() {
    window.location.href = 'homepage-ui.html';
  }

  function backFromCurrent() {
    if (currentView === 'hub') {
      goHome();
      return;
    }

    // 合作商家詳情頁：返回合作商家列表，不回首頁
    if (currentView === 'partnerDetail') {
      showView('partnerList');
      return;
    }
    if (currentView === 'movie' && movieStep !== 'list') {
      if (movieStep === 'seats') {
        renderScheduleStep();
        setMovieStep('schedule');
        return;
      }

      if (movieStep === 'schedule') {
        setMovieStep('verify');
        return;
      }

      if (movieStep === 'verify') {
        setMovieStep('detail');
        return;
      }

      if (movieStep === 'snacks') {
        renderSeatStep();
        setMovieStep('seats');
        return;
      }

      if (movieStep === 'payment') {
        renderSnackStep();
        setMovieStep('snacks');
        return;
      }

      setMovieStep('list');
      return;
    }

    if (currentView === 'food' && currentCategory) {
      renderFoodCategories();
      return;
    }

    showView('hub');
  }

  function updateHeaderBackText() {
    const topBackButton = document.querySelector("#backButton");
    const movieBackButton = document.querySelector(".movie-benefit-back");

    if (topBackButton) {
      if (currentView === "partnerDetail") {
        topBackButton.textContent = "‹ 返回合作商家";
      } else if (currentView === "movie" && movieStep !== "list") {
        topBackButton.textContent = "‹ 返回上一步";
      } else {
        topBackButton.textContent = "‹ 返回首頁";
      }
    }

    if (movieBackButton) {
      movieBackButton.textContent =
        currentView === "movie" && movieStep !== "list"
          ? "‹ 返回上一步"
          : "‹ 返回首頁";
    }
  }

  function renderFoodCategories() {
    currentCategory = null;
    $('#foodTitle').textContent = '預訂便當';
    $('#foodSubtitle').textContent = '先選擇餐點類別，再進入店家品項與價格清單。';
    $('#foodBackButton').textContent = '‹ 返回員工專區';
    const grid = $('#categoryGrid');
    const list = $('#menuList');
    grid.hidden = false;
    list.hidden = true;
    grid.innerHTML = categories.map((category) => `
      <button class="food-category-card" type="button" data-category="${category.id}">
        <img src="${category.image}" alt="">
        <span>${category.title}</span>
        <strong>${category.vendor}</strong>
        <small>${category.desc}</small>
        <b>進入</b>
      </button>
    `).join('');
    $$('.food-category-card', grid).forEach((button) => {
      button.addEventListener('click', () => renderMenu(button.dataset.category));
    });
  }

  function renderMenu(categoryId) {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    currentCategory = category;
    $('#foodTitle').textContent = category.vendor;
    $('#foodSubtitle').textContent = `${category.title}｜請選擇品項與數量。`;
    $('#foodBackButton').textContent = '‹ 返回類別';
    $('#categoryGrid').hidden = true;
    const list = $('#menuList');
    list.hidden = false;
    list.innerHTML = category.items.map((item) => {
      const qty = cart[item.id]?.qty || 0;
      return `
        <div class="menu-row" data-item="${item.id}">
          <div>
            <h3>${item.name}${item.tag ? `<em>${item.tag}</em>` : ''}</h3>
            <p>${item.desc}</p>
          </div>
          <strong>${money(item.price)}</strong>
          <div class="qty-control">
            <button type="button" data-qty="-1">−</button>
            <span>${qty}</span>
            <button type="button" data-qty="1">＋</button>
          </div>
        </div>
      `;
    }).join('');
    $$('.menu-row', list).forEach((row) => {
      const item = category.items.find((target) => target.id === row.dataset.item);
      $$('[data-qty]', row).forEach((button) => {
        button.addEventListener('click', () => updateCart(item, category, Number(button.dataset.qty)));
      });
    });
  }

  function updateCart(item, category, delta) {
    const current = cart[item.id]?.qty || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      delete cart[item.id];
    } else {
      cart[item.id] = { ...item, vendor: category.vendor, qty: next };
    }
    renderCart();
    if (currentCategory) renderMenu(currentCategory.id);
  }

  function renderCart() {
    const items = Object.values(cart);
    const list = $('#cartList');
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    $('#cartCount').textContent = `${count} 項`;
    $('#cartTotal').textContent = money(total);
    $('#sendOrderButton').disabled = count === 0;
    if (!items.length) {
      list.textContent = '尚未選擇商品';
      return;
    }
    list.innerHTML = items.map((item) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <span>${item.vendor}｜${money(item.price)} × ${item.qty}</span>
        </div>
        <div class="qty-control compact">
          <button type="button" data-cart="${item.id}" data-qty="-1">−</button>
          <span>${item.qty}</span>
          <button type="button" data-cart="${item.id}" data-qty="1">＋</button>
        </div>
      </div>
    `).join('');
    $$('[data-cart]', list).forEach((button) => {
      button.addEventListener('click', () => {
        const target = cart[button.dataset.cart];
        const category = categories.find((group) => group.vendor === target.vendor);
        updateCart(target, category, Number(button.dataset.qty));
      });
    });
  }

  function openFoodPayment() {
    const items = Object.values(cart);
    if (!items.length) return;
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    $('#paySummary').innerHTML = `
      ${items.map((item) => `<div><span>${item.name} × ${item.qty}</span><strong>${money(item.price * item.qty)}</strong></div>`).join('')}
      <div class="summary-total"><span>合計</span><strong>${money(total)}</strong></div>
    `;
    showView('pay');
  }

  function finishFoodPayment() {
    $('#doneText').textContent = `餐點訂單已完成，付款方式：${foodPaymentMethod}。`;
    cart = {};
    renderCart();
    renderFoodCategories();
    showView('done');
  }

  function renderPartnerTabs() {
    $('#partnerTabs').innerHTML = partnerCategories.map((category) => `
      <button class="${category === activePartnerFilter ? 'active' : ''}" type="button" data-partner-filter="${category}">${category}</button>
    `).join('');
    $$('#partnerTabs [data-partner-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        activePartnerFilter = button.dataset.partnerFilter;
        renderPartnerTabs();
        renderPartnerList();
      });
    });
  }

  function renderPartnerList() {
    const filtered = activePartnerFilter === '全部'
      ? partners
      : partners.filter((partner) => partner.category === activePartnerFilter);
    $('#partnerList').innerHTML = filtered.map((partner) => `
      <button class="partner-row" type="button" data-partner="${partner.id}">
        <img src="${partner.logo}" alt="${partner.name}">
        <div><strong>${partner.name}</strong><small>${partner.offer}</small></div>
        <b>查看優惠 ›</b>
      </button>
    `).join('');
    $$('#partnerList [data-partner]').forEach((button) => {
      button.addEventListener('click', () => openPartnerDetail(button.dataset.partner));
    });
  }

  function openPartnerList() {
    renderPartnerTabs();
    renderPartnerList();
    showView('partnerList');
  }

  function openPartnerDetail(id) {
    selectedPartner = partners.find((partner) => partner.id === id) || partners[0];
    $('#partnerDetailSubtitle').textContent = `${selectedPartner.category}｜${selectedPartner.offer}`;
    $('#partnerDetailLogo').src = selectedPartner.logo;
    $('#partnerDetailLogo').alt = selectedPartner.name;
    $('#partnerDetailHero').src = selectedPartner.hero;
    $('#partnerDetailHero').alt = '';
    $('#partnerDetailTitle').textContent = selectedPartner.name;
    $('#partnerDetailOffer').textContent = selectedPartner.offer;
    $('#partnerDetailContent').textContent = selectedPartner.content;
    $('#partnerDetailStores').textContent = selectedPartner.stores;
    $('#partnerDetailDate').textContent = selectedPartner.date;
    showView('partnerDetail');
  }

  function buildKeypad(targetInput, onConfirm) {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '清除', '0', '確認'];

    return buttons.map((label) => `
      <button 
        type="button" 
        class="${label === '確認' ? 'confirm' : ''} ${label === '清除' ? 'clear' : ''}" 
        data-key="${label}">
        ${label}
      </button>
    `).join('');
  }

  function bindKeypad(containerSelector, inputSelector, errorSelector, onConfirm) {
    const container = $(containerSelector);
    const input = $(inputSelector);
    container.innerHTML = buildKeypad();
    $$('[data-key]', container).forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.key;
        if (key === '清除') {
          input.value = '';
          if (inputSelector === '#employeeMovieId') {
             movieEmployeeId = '';
          }
          return;
        }
        if (key === '確認') {
          const value = input.value.trim();
          if (!/^\d{3,6}$/.test(value)) {
            $(errorSelector).textContent = '請輸入 3 至 6 碼工號。';
            return;
          }
          $(errorSelector).textContent = '';
          onConfirm(value);
          return;
        }
        if (input.value.length < 6) {
          input.value += key;

          if (inputSelector === '#employeeMovieId') {
            movieEmployeeId = input.value.trim();
          }
        }
      });
    });
  }

  function openEmployeeVerify() {
    if ($('#rememberEmployeeId')?.checked && verifiedEmployeeId) {
      showBenefitQr(verifiedEmployeeId);
      return;
    }
    $('#benefitEmployeeId').value = '';
    $('#benefitVerifyError').textContent = '';
    $('#verifySubtitle').textContent = selectedPartner
      ? `取得 ${selectedPartner.name} 專屬優惠 QR Code`
      : '取得您的專屬優惠 QR Code';
    showView('employeeVerify');
  }

  function startQrCountdown(seconds = 299) {
    if (qrTimer) window.clearInterval(qrTimer);
    let left = seconds;
    const render = () => {
      const min = String(Math.floor(left / 60)).padStart(2, '0');
      const sec = String(left % 60).padStart(2, '0');
      $('#qrCountdown').textContent = `${min}:${sec}`;
      left = Math.max(0, left - 1);
    };
    render();
    qrTimer = window.setInterval(render, 1000);
  }

  function showBenefitQr(employeeId, type = 'partner') {
    verifiedEmployeeId = employeeId;
    const now = new Date();
    $('#qrExpireTime').textContent = new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).format(new Date(now.getTime() + 5 * 60 * 1000));
    if (type === 'birthday') {
      $('#qrPageTitle').textContent = '生日禮領取 QR Code';
      $('#qrOfferText').textContent = `員工 ${employeeId}｜生日禮領取`;
    } else {
      $('#qrPageTitle').textContent = `${selectedPartner?.name || '專屬優惠'} QR Code`;
      $('#qrOfferText').textContent = `${selectedPartner?.name || '合作商家'}｜${selectedPartner?.offer || '員工優惠'}｜員工 ${employeeId}`;
    }
    startQrCountdown();
    showView('benefitQr');
  }

  function showBirthdayResult(employeeId) {
    verifiedEmployeeId = employeeId;
    $('#birthdayResultText').textContent = `員工 ${employeeId}，六月生日禮尚未領取。`;
    showView('birthdayResult');
  }

  function sortedSeats() {
    return Array.from(selectedSeats).sort((a, b) => {
      const row = a.localeCompare(b, 'en', { sensitivity: 'base' });
      if (a[0] !== b[0]) return row;
      return Number(a.slice(1)) - Number(b.slice(1));
    });
  }

  function getSessionCandidates() {
    return movieSessions.filter((session) => session.date === selectedMovieDate && session.type === selectedMovieFormat);
  }

  function syncSelectedSession() {
    const candidates = getSessionCandidates();
    if (candidates.some((session) => session.id === selectedSession.id)) return;
    selectedSession = candidates[0] || movieSessions.find((session) => session.date === selectedMovieDate) || movieSessions[0];
    selectedMovieFormat = selectedSession.type;
  }

  function renderMovieList() {
    const grid = $('#moviePosterGrid');

    const movieOrder = [
      'toy5',
      'supergirl',
      'spiderman',
      'sorrybaby',
      'passenger',
      'minions',
      'realm',
      'hokum',
      'conan'
    ];

    const sortedMovies = movieOrder
      .map(id => employeeMovies.find(movie => movie.id === id))
      .filter(Boolean);

    grid.innerHTML = sortedMovies.map((movie) => `
      <button class="movie-poster-card" type="button" data-movie="${movie.id}">
        <span class="poster-frame">
          <img src="${movie.poster}" alt="${movie.title}">
        </span>
        <strong>${movie.title}</strong>
      </button>
    `).join('');

    $$('.movie-poster-card', grid).forEach((button) => {
      button.addEventListener('click', () => openMovieDetail(button.dataset.movie));
    });
  }

  function openMovieDetail(movieId) {
    selectedMovie = employeeMovies.find((movie) => movie.id === movieId) || employeeMovies[0];
    selectedMovieDate = '20250529';
    selectedMovieFormat = '2D';
    syncSelectedSession();
    moviePeople = 1;
    movieEmployeeId = '';
    selectedSeats = new Set();
    movieSnackDraft = {};
    movieSnackOrders = {};
    renderMovieDetail();
    setMovieStep('detail');
  }

  function setMovieStep(step) {
    const previousMovieStep = movieStep;
    movieStep = step;

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    $('#employeeMain').scrollTop = 0;
    $('#movieView').scrollTop = 0;

    $$('[data-movie-step]').forEach((el) => {
      el.classList.toggle('active', el.dataset.movieStep === step);
    });
    const snackStepPanel = $('#movieView [data-movie-step="snacks"]');
    if (snackStepPanel) {
      const shouldAnimateSnackCards = step === 'snacks' && previousMovieStep !== 'snacks';
      snackStepPanel.classList.toggle('snack-step-entering', shouldAnimateSnackCards);

      if (shouldAnimateSnackCards) {
        window.setTimeout(() => {
          snackStepPanel.classList.remove('snack-step-entering');
        }, 700);
      }
    }

    const progressOrder = ['list', 'verify', 'schedule', 'seats', 'snacks', 'payment'];
    const currentIndex = progressOrder.indexOf(step);

    $$('#movieProgress [data-step]').forEach((el) => {
      const stepIndex = progressOrder.indexOf(el.dataset.step);

      el.classList.toggle('active', stepIndex === currentIndex);
      el.classList.toggle('done', stepIndex >= 0 && stepIndex < currentIndex);
    });

    const titles = {
      list: ['正在上映電影', '享受員工專屬優惠票價 $180'],
      detail: ['電影介紹', '確認電影資訊與員工票價'],
      verify: ['輸入工號與選擇張數', '驗證員工資格，每日限購 2 張'],
      schedule: ['選擇日期、場次', '挑選觀影日期與放映廳'],
      seats: ['選擇座位', '金色是目前選擇，紅色是已售座位'],
      snacks: ['加購餐點', '可按下一步略過餐點加購'],
      payment: ['員工電影優惠', 'STAFF MOVIE BENEFIT']
    };

    const moviePageTitle = $('#moviePageTitle');
    const moviePageSubtitle = $('#moviePageSubtitle');

    if (moviePageTitle && titles[step]) {
      moviePageTitle.textContent = titles[step][0];
    }

    if (moviePageSubtitle && titles[step]) {
      moviePageSubtitle.textContent = titles[step][1];
    }

    if (step === 'verify') {
      renderVerifyStep();
    }

    updateHeaderBackText();
  }

  function renderMovieDetail() {
    const detailStep = document.querySelector('[data-movie-step="detail"]');
    const detailLayout =
      detailStep?.querySelector('.movie-intro-layout') ||
      detailStep?.querySelector('.movie-detail-layout');

    const posterTarget = $('#movieDetailPoster');

    if (posterTarget) {
      posterTarget.src = selectedMovie.poster;
      posterTarget.alt = selectedMovie.title;
    }

    $('#movieDetailEn').textContent = selectedMovie.en;
    $('#movieDetailTitle').textContent = selectedMovie.title;
    $('#movieDetailDate').textContent = selectedMovie.release;
    $('#movieDetailSynopsis').textContent = selectedMovie.synopsis;

    $('#movieDetailTags').innerHTML = [
      `${selectedMovie.minutes} 分鐘`,
      '保護級',
      selectedMovie.genre,
      'IMAX 2D / 3D'
    ].map((tag) => `<span>${tag}</span>`).join('');

    /* 不要演員列表 */
    const castList = $('#movieCastList');
    if (castList) {
      castList.innerHTML = '';
    }

    /* 沒有右側優惠卡的話，自動補上 */
    let offerPanel = detailStep?.querySelector('.movie-offer-panel');

    if (!offerPanel && detailLayout) {
      offerPanel = document.createElement('aside');
      offerPanel.className = 'movie-offer-panel';
      detailLayout.appendChild(offerPanel);
    }

    if (offerPanel) {
      offerPanel.innerHTML = `
        <span class="ticket-icon"></span>
        <h2>員工專屬優惠</h2>
        <p>員工票價</p>
        <strong>$180<small> / 張</small></strong>
        <span>每日每位員工限購 2 張</span>
        <button class="primary-action" id="startMovieBookingButton" type="button">立即訂票　→</button>
      `;
    }

    $$('#startMovieBookingButton').forEach((button) => {
      button.onclick = () => {
        setMovieStep('verify');
      };
    });

    /* 不要推薦餐食 */
    const snackTarget = $('#movieDetailSnacks');
    if (snackTarget) {
      snackTarget.innerHTML = '';
    }

    const moviePageTitle = $('#moviePageTitle');
    const moviePageSubtitle = $('#moviePageSubtitle');

    if (moviePageTitle) moviePageTitle.textContent = '正在上映電影';
    if (moviePageSubtitle) moviePageSubtitle.textContent = '享受員工專屬優惠票價 $180';
  }

  function renderScheduleStep() {
    const hasAnySessionForDate = (dateId) =>
      movieSessions.some((session) => session.date === dateId && session.seats > 0);

    const hasSessionForFormatOnDate = (format) =>
      movieSessions.some(
        (session) =>
          session.date === selectedMovieDate &&
          session.type === format &&
          session.seats > 0
      );

    // 如果目前日期沒有任何場次，自動跳到第一個有場次的日期
    if (!hasAnySessionForDate(selectedMovieDate)) {
      const firstAvailableDate = movieDates.find((date) => hasAnySessionForDate(date.id));
      if (firstAvailableDate) selectedMovieDate = firstAvailableDate.id;
    }

    // 該日期全部場次，不只顯示目前格式，會更像參考圖
    const dateSessions = movieSessions.filter(
      (session) => session.date === selectedMovieDate && session.seats > 0
    );

    // 如果目前選到的場次不在這天，自動選第一個
    if (!dateSessions.some((session) => session.id === selectedSession.id)) {
      selectedSession = dateSessions[0] || selectedSession;
      selectedMovieFormat = selectedSession.type;
    }

    $('#movieDateGrid').innerHTML = movieDates.map((date) => {
      const unavailable = !hasAnySessionForDate(date.id);

      return `
        <button
          class="movie-date-card ${date.id === selectedMovieDate ? 'selected' : ''} ${date.holiday ? 'holiday' : ''} ${unavailable ? 'unavailable' : ''}"
          type="button"
          data-date="${date.id}"
          ${unavailable ? 'disabled' : ''}
        >
          <span>${date.label || '&nbsp;'}</span>
          <strong>${date.date}</strong>
          <small>${date.weekday}</small>
        </button>
      `;
    }).join('');

    $$('#movieDateGrid [data-date]:not(.unavailable)').forEach((button) => {
      button.addEventListener('click', () => {
        selectedMovieDate = button.dataset.date;

        const firstSession = movieSessions.find(
          (session) => session.date === selectedMovieDate && session.seats > 0
        );

        if (firstSession) {
          selectedSession = firstSession;
          selectedMovieFormat = firstSession.type;
        }

        renderScheduleStep();
      });
    });

    $('#movieFormatTabs').innerHTML = movieFormats.map((format) => {
      const unavailable = !hasSessionForFormatOnDate(format);

      return `
        <button
          class="${format === selectedMovieFormat ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}"
          type="button"
          data-format="${format}"
          ${unavailable ? 'disabled' : ''}
        >
          ${format}
        </button>
      `;
    }).join('');

    $$('#movieFormatTabs [data-format]:not(.unavailable)').forEach((button) => {
      button.addEventListener('click', () => {
        selectedMovieFormat = button.dataset.format;

        const firstFormatSession = movieSessions.find(
          (session) =>
            session.date === selectedMovieDate &&
            session.type === selectedMovieFormat &&
            session.seats > 0
        );

        if (firstFormatSession) selectedSession = firstFormatSession;

        renderScheduleStep();
      });
    });

    $('#employeeMovieSessions').innerHTML = dateSessions.length
      ? dateSessions.map((session) => {
        const formatUnavailable = session.type !== selectedMovieFormat;

        return `
          <button
            class="session-card ${session.id === selectedSession.id ? 'selected' : ''} ${formatUnavailable ? 'format-dim' : ''}"
            type="button"
            data-session="${session.id}"
          >
            ${session.id === selectedSession.id ? '<em class="session-check">✓</em>' : ''}
            <strong>${session.time}</strong>
            <span>${session.type}</span>
            <small>${session.hall}</small>
            <b>剩餘 ${session.seats} 位</b>
          </button>
        `;
      }).join('')
      : '<p class="empty-state">此日期沒有可選場次，請切換日期。</p>';

    $$('#employeeMovieSessions .session-card').forEach((button) => {
      button.addEventListener('click', () => {
        selectedSession =
          movieSessions.find((session) => session.id === button.dataset.session) || selectedSession;

        selectedMovieFormat = selectedSession.type;
        renderScheduleStep();
      });
    });

    const ticketTotal = moviePeople * 180;

    $('#movieSchedulePreview').innerHTML = `
      <div class="movie-preview-movie">
        <img src="${selectedMovie.poster}" alt="${selectedMovie.title}">
        <div>
          <strong>${selectedMovie.title}</strong>
            <span class="icon-date">${selectedSession.day}</span>
            <span class="icon-time">${selectedSession.time}</span>
            <span class="icon-hall">${selectedSession.hall}</span>
          <b>${selectedSession.type}</b>
        </div>
      </div>

      <div class="movie-preview-row">
        <span>訂票人數</span>
        <strong>${moviePeople} 張</strong>
      </div>

      <div class="movie-preview-row">
        <span>座位</span>
        <strong>尚未選擇</strong>
      </div>

      <div class="movie-preview-price">
        <span>員工優惠票價</span>
        <strong>${money(180)} <small>/ 張</small></strong>
      </div>

      <div class="movie-preview-total">
        <span>總計</span>
        <strong>${money(ticketTotal)}</strong>
      </div>
    `;
  }

  function renderVerifyStep() {
    const input = $('#employeeMovieId');

    if (input && input.value.trim()) {
      movieEmployeeId = input.value.trim();
    }

    $('#moviePeopleCount').textContent = moviePeople;

    if (input) {
      input.value = movieEmployeeId;
    }

    $('#movieVerifyError').textContent = '';
  }

  function getSoldSeats() {
    const base = ['B3', 'B4', 'C9', 'D9', 'D10', 'E7', 'F3', 'F4', 'F5', 'G10', 'G11', 'H2', 'D12', 'E13', 'F14', 'K15'];
    const seed = employeeMovies.findIndex((movie) => movie.id === selectedMovie.id);
    return new Set(base.map((seat, index) => {
      const row = seat[0];
      const number = ((Number(seat.slice(1)) + seed + index) % 16) + 1;
      return `${row}${number}`;
    }));
  }

  function renderSeatStep() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const sold = getSoldSeats();
    $('#employeeSeatLimit').textContent = moviePeople;
    $('#employeeSeatCount').textContent = selectedSeats.size;
    $('#employeeSeatGrid').innerHTML = rows.map((row) => `
      <div class="seat-row">
        <span class="row-label">${row}</span>
        ${Array.from({ length: 16 }, (_, index) => {
          const number = index + 1;
          const label = `${row}${number}`;
          const status = sold.has(label) ? 'sold' : selectedSeats.has(label) ? 'selected' : 'available';
          const accessible = row === 'K' && (number <= 2 || number >= 15);
          return `<button class="seat ${status} ${accessible ? 'accessible' : ''}" type="button" data-seat="${label}" ${status === 'sold' ? 'disabled' : ''}>${accessible ? '♿' : number}</button>`;
        }).join('')}
        <span class="row-label">${row}</span>
      </div>
    `).join('');
    $$('#employeeSeatGrid .seat.available, #employeeSeatGrid .seat.selected').forEach((button) => {
      button.addEventListener('click', () => {
        const label = button.dataset.seat;
        if (selectedSeats.has(label)) {
          selectedSeats.delete(label);
        } else if (selectedSeats.size < moviePeople) {
          selectedSeats.add(label);
        }
        renderSeatStep();
      });
    });
    $('#seatPreview').innerHTML = `
      <h2>已選擇座位</h2>

      <div class="summary-list">
        <div><span>電影</span><strong>${selectedMovie.title}</strong></div>
        <div><span>場次</span><strong>${selectedSession.day} ${selectedSession.time}</strong></div>
        <div><span>張數</span><strong>${moviePeople} 張</strong></div>
        <div><span>座位</span><strong>${selectedSeats.size ? sortedSeats().join('、') : '尚未選擇'}</strong></div>
        <div><span>票價</span><strong>${money(180)} / 張</strong></div>
        <div class="summary-total"><span>總計</span><strong>${money(moviePeople * 180)}</strong></div>
      </div>

      <button class="seat-next-button" id="seatPreviewNextButton" type="button">
        下一步：加購餐點 <span>→</span>
      </button>
    `;

    const seatPreviewNextButton = $('#seatPreviewNextButton');

    if (seatPreviewNextButton) {
      seatPreviewNextButton.addEventListener('click', () => {
        if (selectedSeats.size !== moviePeople) {
          $('#employeeSeatCount').animate?.(
            [
              { transform: 'scale(1)' },
              { transform: 'scale(1.18)' },
              { transform: 'scale(1)' }
            ],
            { duration: 280 }
          );
          return;
        }

        renderSnackStep();
        setMovieStep('snacks');
      });
    }
  }
  function renderSnackStep() {
    $('#employeeSnackGrid').innerHTML = movieSnacks.map((snack) => {
      const qty = movieSnackDraft[snack.id]?.qty || 0;
      const flashClass = snackFlashId === snack.id ? 'is-flashing' : '';

      return `
        <article class="snack-card ${flashClass}" data-snack="${snack.id}">
          ${snack.badge ? `<b class="snack-badge">${snack.badge}</b>` : ''}

          <img src="${snack.image}" alt="${snack.name}">

          <div class="snack-body">
            <h3>
              <span class="snack-title-icon" style="--snack-icon: url('${snack.icon}')" aria-hidden="true"></span>
              <span>${snack.name}</span>
            </h3>

            <p>${snack.desc}</p>
            <strong>${money(snack.basePrice)}</strong>

            <div class="snack-actions">
              <div class="qty-control">
                <button type="button" data-snack-qty="-1">−</button>
                <span>${qty}</span>
                <button type="button" data-snack-qty="1">＋</button>
              </div>

              <button type="button" data-snack-add>加入購物車</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    $$('.snack-card').forEach((card) => {
      const snack = movieSnacks.find((item) => item.id === card.dataset.snack);

      $$('[data-snack-qty], [data-snack-add]', card).forEach((button) => {
        button.addEventListener('click', () => {
          const isAddButton = button.hasAttribute('data-snack-add');
          const currentDraft = movieSnackDraft[snack.id]?.qty || 0;

          snackFlashId = snack.id;

          if (isAddButton) {
            if (currentDraft <= 0) {
              playSnackCardFlash();
              return;
            }

            const currentOrder = movieSnackOrders[snack.id]?.qty || 0;

            movieSnackOrders[snack.id] = {
              ...snack,
              qty: currentOrder + currentDraft
            };

            delete movieSnackDraft[snack.id];

            /* 只有加入購物車時，已選購餐點欄位才閃一下 */
            snackSummaryFlash = true;

            snackDrawerOpen = false;
          } else {
            const nextDraft = Math.max(0, currentDraft + Number(button.dataset.snackQty));

            if (nextDraft === 0) {
              delete movieSnackDraft[snack.id];
            } else {
              movieSnackDraft[snack.id] = {
                ...snack,
                qty: nextDraft
              };
            }

            // 重要：按 + / - 也不要自動浮出購物明細
            snackDrawerOpen = false;
          }

          renderSnackStep();
          playSnackCardFlash();
        });
      });
    });

    renderSnackSummary();
  }
  function playSnackCardFlash() {
    window.setTimeout(() => {
      snackFlashId = '';

      const flashed = document.querySelector('.snack-card.is-flashing');

      if (flashed) {
        flashed.classList.remove('is-flashing');
      }
    }, 360);
  }


  function ensureSnackDrawer() {
    let drawer = $('#snackCartDrawer');

    if (!drawer) {
      const step = $('#movieView [data-movie-step="snacks"]');

      step.insertAdjacentHTML('beforeend', `
        <div class="snack-cart-drawer" id="snackCartDrawer" aria-hidden="true"></div>
      `);

      drawer = $('#snackCartDrawer');
    }

    return drawer;
  }

  function renderSnackSummary() {
    const orders = Object.values(movieSnackOrders).filter((item) => item.qty > 0);
    const target = $('#employeeSnackSummary');

    if (!orders.length) {
      snackDrawerOpen = false;
      target.innerHTML = `<span class="snack-summary-empty">尚未選擇餐食</span>`;
      renderSnackDrawer([]);
      return;
    }

    const total = orders.reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    const totalQty = orders.reduce((sum, item) => sum + item.qty, 0);
    const main = orders[0];

    const summaryLine = orders.map((item) => `${item.name}x${item.qty}`).join('、');
    const summaryDetail = orders.length === 1 ? main.desc : `共 ${totalQty} 份餐點`;

    target.innerHTML = `
      <button class="snack-summary-card ${snackSummaryFlash ? 'is-summary-flashing' : ''}" type="button" data-snack-summary-open>
        <span class="snack-summary-thumb">
          <img src="${main.image}" alt="${main.name}">
          <em>${totalQty}</em>
        </span>

        <span class="snack-summary-info">
          <strong>${summaryLine}</strong>
          <span>${summaryDetail}</span>
        </span>

        <b>${money(total)}</b>
      </button>
    `;

    const openButton = $('[data-snack-summary-open]', target);

    if (openButton) {
      openButton.addEventListener('click', () => {
        snackDrawerOpen = true;
        renderSnackDrawer(orders);
      });
    }

    // 重要：這裡不主動打開購物明細
    renderSnackDrawer(orders);
  }

  function renderSnackDrawer(orders) {
    const drawer = ensureSnackDrawer();

    if (!snackDrawerOpen || !orders.length) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = '';
      return;
    }

    const total = orders.reduce((sum, item) => sum + item.basePrice * item.qty, 0);

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');

    drawer.innerHTML = `
      <div class="snack-drawer-backdrop" data-snack-drawer-close></div>

      <section class="snack-drawer-panel" aria-label="購物車">
        <div class="snack-drawer-handle"></div>

        <header class="snack-drawer-head">
          <h2>購物車</h2>
          <button type="button" data-snack-drawer-close>×</button>
        </header>

        <div class="snack-drawer-list">
          ${orders.map((item) => `
            <div class="snack-drawer-row">
              <img src="${item.image}" alt="${item.name}">

              <div class="snack-drawer-info">
                <strong>${item.name}</strong>
                <small>${item.desc}</small>
              </div>

              <span class="snack-drawer-qty">x${item.qty}</span>

              <div class="snack-drawer-stepper">
                <button type="button" data-drawer-snack="${item.id}" data-drawer-qty="-1">−</button>
                <button type="button" data-drawer-snack="${item.id}" data-drawer-qty="1">＋</button>
              </div>

              <b>${money(item.basePrice)}</b>
            </div>
          `).join('')}
        </div>

        <footer class="snack-drawer-total">
          <span>總金額：</span>
          <strong>${money(total)}</strong>
        </footer>
      </section>
    `;

    $$('[data-snack-drawer-close]', drawer).forEach((button) => {
      button.addEventListener('click', () => {
        snackDrawerOpen = false;
        renderSnackDrawer(Object.values(movieSnackOrders).filter((item) => item.qty > 0));
      });
    });

    $$('[data-drawer-snack]', drawer).forEach((button) => {
      button.addEventListener('click', () => {
        const snack = movieSnacks.find((item) => item.id === button.dataset.drawerSnack);
        const current = movieSnackOrders[snack.id]?.qty || 0;
        const next = Math.max(0, current + Number(button.dataset.drawerQty));

        if (next === 0) {
          delete movieSnackOrders[snack.id];
        } else {
          movieSnackOrders[snack.id] = {
            ...snack,
            qty: next
          };
        }

      const remaining = Object.values(movieSnackOrders).filter((item) => item.qty > 0);

      snackDrawerOpen = remaining.length > 0 && snackDrawerOpen;

      renderSnackStep();
      });
    });
  }


  function getMovieTotal() {
    const ticketTotal = moviePeople * 180;
    const snackTotal = Object.values(movieSnackOrders).reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    return ticketTotal + snackTotal;
  }

  function renderMoviePayment() {
    const snacks = Object.values(movieSnackOrders).filter((item) => item.qty > 0);
    const ticketTotal = moviePeople * 180;
    const snackTotal = snacks.reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    const total = ticketTotal + snackTotal;
    const snackLine = snacks.length
      ? snacks.map((item) => `${item.name} × ${item.qty}`).join('、')
      : '未加購餐點';

    $('#moviePaymentSummary').innerHTML = `
      <article class="checkout-movie-summary">
        <img src="${selectedMovie.poster}" alt="${selectedMovie.title}">
        <div>
          <h3>${selectedMovie.title}</h3>
          <em>${selectedSession.type}</em>
          <span>${selectedSession.day} ${selectedSession.time}</span>
          <span>${selectedSession.hall}</span>
        </div>
      </article>

      <div class="checkout-summary-row">
        <span>座位</span>
        <strong>${sortedSeats().join('、')}</strong>
      </div>

      <div class="checkout-summary-row">
        <span>取票人數</span>
        <strong>${moviePeople} 張</strong>
      </div>

      <div class="checkout-summary-row">
        <span>餐點</span>
        <strong>${snackLine}</strong>
      </div>

      <div class="checkout-summary-line">
        <span>票價</span>
        <small>$180 × ${moviePeople}</small>
        <strong>${money(ticketTotal)}</strong>
      </div>

      <div class="checkout-summary-line">
        <span>餐點</span>
        <small>${snacks.length ? `${snacks.length} 種餐點` : '未加購'}</small>
        <strong>${money(snackTotal)}</strong>
      </div>

      <div class="checkout-summary-line">
        <span>手續費</span>
        <small>${moviePaymentMethod}</small>
        <strong>$0</strong>
      </div>

      <div class="checkout-summary-line summary-total">
        <span>總計</span>
        <small>${movieInvoiceType}</small>
        <strong>${money(total)}</strong>
      </div>
    `;
    $('#moviePaymentError').textContent = '';
    if (snackSummaryFlash) {
      window.setTimeout(() => {
        snackSummaryFlash = false;

        const summaryCard = document.querySelector('.snack-summary-card.is-summary-flashing');
        if (summaryCard) {
          summaryCard.classList.remove('is-summary-flashing');
        }
      }, 360);
    }
  }

  function finishMoviePayment() {
    $('#moviePaymentError').textContent = '';
    $('#movieDoneSummary').innerHTML = `
      ${selectedMovie.title}｜${selectedSession.day} ${selectedSession.time}<br>
      ${sortedSeats().join('、')}｜${moviePaymentMethod}｜${movieInvoiceType}｜${money(getMovieTotal())}
    `;
    $('#movieQrText').textContent = `員工 ${movieEmployeeId}，請於開演前 20 分鐘完成取票。`;
    showView('movieDone');
  }

  function resetMovieFlow() {
    movieStep = 'list';
    selectedMovie = employeeMovies[0];
    selectedMovieDate = '20250529';
    selectedMovieFormat = '2D';
    selectedSession = movieSessions[0];
    moviePeople = 1;
    movieEmployeeId = '';
    selectedSeats = new Set();
    movieSnackDraft = {};
    movieSnackOrders = {};
    moviePaymentMethod = '信用卡付款';
    movieInvoiceType = '捐贈發票';
    renderMovieList();
    setMovieStep('list');
  }

  function bindPaymentChoices(rootSelector, callback) {
    $$(rootSelector).forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.closest('.payment-methods');
        $$('.payment-choice', group).forEach((choice) => choice.classList.remove('selected'));
        button.classList.add('selected');
        callback(button.dataset.pay);
      });
    });
  }

  function bindEvents() {
    $('#backButton').addEventListener('click', backFromCurrent);
    $('#foodBackButton').addEventListener('click', () => {
      if (currentCategory) renderFoodCategories();
      else showView('hub');
    });

    $$('[data-back]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const movieView = document.querySelector('#movieView');
        const isMovieActive = movieView?.classList.contains('active');

        const isMovieBackButton =
          isMovieActive &&
          (
            button.classList.contains('movie-benefit-back') ||
            button.closest('#movieView') ||
            button.dataset.back === 'movie' ||
            button.textContent.includes('返回上一頁')
          );

        if (isMovieBackButton) {
          event.preventDefault();
          event.stopPropagation();
          backFromCurrent();
          return;
        }

        showView(button.dataset.back || 'hub');
      });
    });

    $$('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'benefits' || action === 'benefits-detail') showView('benefits');
        if (action === 'schedule') showView('schedule');
        if (action === 'bulk') showView('bulk');
        if (action === 'movie') {
          resetMovieFlow();
          showView('movie');
        }
        if (action === 'food') {
          renderFoodCategories();
          showView('food');
        }
      });
    });

    $$('[data-benefit-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.benefitAction;
        if (action === 'partners') openPartnerList();
        if (action === 'birthday') showView('birthday');
        if (action === 'birthdayVerify') {
          $('#birthdayEmployeeId').value = '';
          $('#birthdayVerifyError').textContent = '';
          showView('birthdayVerify');
        }
        if (action === 'birthdayQr') showBenefitQr(verifiedEmployeeId || '1025', 'birthday');
        if (action === 'notice') showView('benefitNotice');
      });
    });

    $('#getPartnerQrButton').addEventListener('click', openEmployeeVerify);

    $('#sendOrderButton').addEventListener('click', openFoodPayment);
    $('#confirmPayButton').addEventListener('click', finishFoodPayment);

    bindPaymentChoices('[data-food-payment] .payment-choice', (value) => {
      foodPaymentMethod = value;
    });
    bindPaymentChoices('[data-movie-payment] .payment-choice', (value) => {
      moviePaymentMethod = value;
      if (movieStep === 'payment') renderMoviePayment();
    });

    $$('[data-movie-invoice] .movie-invoice-choice').forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.closest('[data-movie-invoice]');
        $$('.movie-invoice-choice', group).forEach((choice) => choice.classList.remove('selected'));
        button.classList.add('selected');
        movieInvoiceType = button.dataset.invoice;
        if (movieStep === 'payment') renderMoviePayment();
      });
    });

    const bulkForm = $('#bulkForm');
    const setBulkKind = (button) => {
      bulkKind = button.dataset.bulkKind;
      $$('[data-bulk-kind]').forEach((item) => {
        item.classList.toggle('active', item.dataset.bulkKind === bulkKind);
      });
    };

    $$('[data-bulk-kind]').forEach((button) => {
      button.addEventListener('click', () => setBulkKind(button));
    });

    if (bulkForm) {
      bulkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const location = $('#repairLocation')?.value.trim() || '未填寫位置';
        const description = $('#repairDescription')?.value.trim() || '現場同仁將補充詳細內容';
        $('#bulkStatus').textContent = `已送出「${bulkKind}」回報：${location}。${description}，維修人員將盡快處理。`;
        try {
          const key = 'ambassadorOfficeNotifications';
          const saved = JSON.parse(localStorage.getItem(key) || '[]');
          const notification = {
            id: `repair-${Date.now()}`,
            type: '申請維修通知',
            title: `${bulkKind}已送出`,
            body: `${location}：${description}`,
            time: '剛剛',
            target: 'employee.html?view=bulk'
          };
          localStorage.setItem(key, JSON.stringify([notification, ...saved].slice(0, 20)));
        } catch (error) {
          console.warn('維修通知儲存失敗。', error);
        }
      });
    }

    $$('#startMovieBookingButton').forEach((button) => {
      button.addEventListener('click', () => {
        setMovieStep('verify');
      });
    });

    $('#confirmScheduleButton').addEventListener('click', () => {
      selectedSeats = new Set();
      renderSeatStep();
      setMovieStep('seats');
    });

    $('#moviePeopleMinus').addEventListener('click', () => {
      const input = $('#employeeMovieId');
      if (input) movieEmployeeId = input.value.trim();

      moviePeople = Math.max(1, moviePeople - 1);
      selectedSeats = new Set(Array.from(selectedSeats).slice(0, moviePeople));
      renderVerifyStep();
    });

    $('#moviePeoplePlus').addEventListener('click', () => {
      const input = $('#employeeMovieId');
      if (input) movieEmployeeId = input.value.trim();

      moviePeople = Math.min(2, moviePeople + 1);
      renderVerifyStep();
    });
    const movieIdClearButton = $('#movieIdClearButton');

    if (movieIdClearButton) {
      movieIdClearButton.addEventListener('click', () => {
        movieEmployeeId = '';

        const input = $('#employeeMovieId');
        if (input) input.value = '';

        const error = $('#movieVerifyError');
        if (error) error.textContent = '';
      });
    }

    $('#confirmPeopleButton').addEventListener('click', () => {
      const value = $('#employeeMovieId').value.trim();

      if (!/^\d{3,6}$/.test(value)) {
        $('#movieVerifyError').textContent = '請輸入 3 至 6 碼工號。';
        $('#employeeMovieId').focus();
        return;
      }

      movieEmployeeId = value;
      $('#movieVerifyError').textContent = '';

      selectedSeats = new Set();

      renderScheduleStep();
      setMovieStep('schedule');
    });

    $('#confirmSeatsButton').addEventListener('click', () => {
      if (selectedSeats.size !== moviePeople) {
        $('#employeeSeatCount').animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 280 });
        return;
      }
      renderSnackStep();
      setMovieStep('snacks');
    });

    $('#skipSnacksButton').addEventListener('click', () => {
      movieSnackDraft = {};
      movieSnackOrders = {};
      renderMoviePayment();
      setMovieStep('payment');
    });
    $('#confirmSnacksButton').addEventListener('click', () => {
      movieSnackDraft = {};
      renderMoviePayment();
      setMovieStep('payment');
    });
    $('#employeeMovieBuy').addEventListener('click', finishMoviePayment);
  }

  function openInitialViewFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const hashTarget = window.location.hash.replace('#', '');
    const target = params.get('view') || hashTarget;
    let movieId = params.get('movie') || params.get('movieId') || '';
    if (!movieId && hashTarget.startsWith('movie:')) movieId = hashTarget.slice(6);

    if (target === 'food' || target === 'meal') {
      window.location.replace('meal.html');
      return;
    }

    if (target === 'movie' || movieId) {
      showView('movie');
      if (movieId) openMovieDetail(movieId);
      else setMovieStep('list');
      return;
    }

    if (target === 'bulk' || target === 'repair') {
      showView('bulk');
      return;
    }

    if (target && views[target]) {
      showView(target);
    }
  }

  updateTime();
  window.setInterval(updateTime, 30_000);
  bindEvents();
  document.addEventListener('click', (event) => {
    const movieView = document.querySelector('#movieView');
    if (!movieView?.classList.contains('active')) return;

    const backButton = event.target.closest(
      '.movie-benefit-back, #movieView [data-back], #movieView .section-back'
    );

    if (!backButton) return;

    event.preventDefault();
    event.stopPropagation();
    backFromCurrent();
  }, true);
  bindKeypad('#benefitKeypad', '#benefitEmployeeId', '#benefitVerifyError', (value) => showBenefitQr(value, 'partner'));
  bindKeypad('#birthdayKeypad', '#birthdayEmployeeId', '#birthdayVerifyError', showBirthdayResult);
  bindKeypad('#movieEmployeeKeypad', '#employeeMovieId', '#movieVerifyError', (value) => {
    movieEmployeeId = value;
  });
  renderFoodCategories();
  renderCart();
  renderMovieList();
  openInitialViewFromUrl();

  function bindMovieVerifyPage() {
    const input = document.querySelector('#employeeMovieId');
    const keypad = document.querySelector('#movieEmployeeKeypad');
    const minus = document.querySelector('#moviePeopleMinus');
    const plus = document.querySelector('#moviePeoplePlus');
    const count = document.querySelector('#moviePeopleCount');
    const next = document.querySelector('#confirmPeopleButton');
    const error = document.querySelector('#movieVerifyError');

    if (!input || !keypad || !minus || !plus || !count || !next) return;

    keypad.innerHTML = `
      <button type="button" data-key="1">1</button>
      <button type="button" data-key="2">2</button>
      <button type="button" data-key="3">3</button>
      <button type="button" data-key="4">4</button>
      <button type="button" data-key="5">5</button>
      <button type="button" data-key="6">6</button>
      <button type="button" data-key="7">7</button>
      <button type="button" data-key="8">8</button>
      <button type="button" data-key="9">9</button>
      <button type="button" data-key="clear">清除</button>
      <button type="button" data-key="0">0</button>
      <button type="button" class="confirm" data-key="confirm">確認</button>
    `;

    keypad.querySelectorAll('[data-key]').forEach((btn) => {
      btn.onclick = () => {
        const key = btn.dataset.key;

        if (key === 'clear') {
          input.value = '';
          if (error) error.textContent = '';
          return;
        }

        if (key === 'confirm') {
          const value = input.value.trim();

          if (!/^\d{3,6}$/.test(value)) {
            if (error) error.textContent = '請輸入 3 至 6 碼工號。';
            return;
          }

          movieEmployeeId = value;
          if (error) error.textContent = '工號驗證完成，請選擇人數後按下一步。';
          return;
        }

        if (input.value.length < 6) {
          input.value += key;
        }
      };
    });

    minus.onclick = () => {
      moviePeople = Math.max(1, moviePeople - 1);
      count.textContent = moviePeople;
    };

    plus.onclick = () => {
      moviePeople = Math.min(2, moviePeople + 1);
      count.textContent = moviePeople;
    };

    count.textContent = moviePeople;

    next.onclick = () => {
      const value = input.value.trim();

      if (!/^\d{3,6}$/.test(value)) {
        if (error) error.textContent = '請先輸入正確工號。';
        return;
      }

      movieEmployeeId = value;
      selectedSeats = new Set();

      renderScheduleStep();
      setMovieStep('schedule');
    };
  }
})();
window.addEventListener('resize', () => {
  if (currentView === 'schedule') {
    updateScheduleScrollbars();
  }
});
