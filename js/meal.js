(() => {
  const stores = [
    {
      id: 'bento',
      category: '便當',
      vendor: '老張便當',
      image: 'images/bento.jpg',
      description: '台式家常便當，今日菜單，截止時間 11:00。',
      items: [
        ['排骨飯', '酥炸排骨、三樣配菜', 90],
        ['雞腿飯', '招牌大雞腿、白飯與配菜', 100],
        ['控肉飯', '滷控肉、滷蛋、青菜', 95],
        ['魚排飯', '香煎魚排、季節配菜', 95],
        ['素食便當', '蛋奶素可，清爽配菜', 80],
        ['滷雞腿飯', '滷香雞腿、青菜與滷蛋', 110],
        ['三杯雞飯', '九層塔、三杯醬、配菜', 105],
        ['蔥爆牛肉飯', '牛肉片、洋蔥、青蔥', 120],
        ['香酥雞排飯', '大雞排、三樣配菜', 115],
        ['雙主菜便當', '排骨與滷蛋、加量配菜', 130]
      ]
    },
    {
      id: 'donburi',
      category: '日式丼飯',
      vendor: '花火丼飯',
      image: 'images/Japanese Donburi.jpg',
      description: '現做日式丼飯，醬汁濃郁，適合午餐快速取餐。',
      items: [
        ['炸豬排丼', '豬排、滑蛋、洋蔥', 135],
        ['親子丼', '雞腿肉、滑蛋、洋蔥', 120],
        ['牛五花丼', '牛五花、溫泉蛋、青蔥', 145],
        ['照燒雞腿丼', '炙燒雞腿、照燒醬', 130],
        ['鮭魚鬆丼', '鮭魚鬆、玉子燒、小菜', 150],
        ['唐揚雞丼', '炸雞塊、海苔、柴魚', 128],
        ['咖哩可樂餅丼', '可樂餅、日式咖哩', 118],
        ['明太子雞肉丼', '雞肉、明太子醬、蔥花', 155]
      ]
    },
    {
      id: 'veggie',
      category: '素食天地',
      vendor: '青禾蔬食',
      image: 'images/vegetarian.jpg.webp',
      description: '清爽蔬食與蛋奶素選項，適合想吃輕盈的一餐。',
      items: [
        ['蔬菜咖哩飯', '南瓜、菇類、花椰菜', 110],
        ['香煎豆腐餐', '豆腐排、五穀飯、沙拉', 105],
        ['菇菇燉飯', '綜合菇、奶油白醬', 125],
        ['能量沙拉盒', '鷹嘴豆、酪梨、堅果', 95],
        ['蔬食拌麵', '胡麻醬、時蔬、豆包', 90],
        ['番茄野菇飯', '番茄燉醬、杏鮑菇', 108],
        ['松露菇菇飯', '菇類、松露香氣、溫蔬', 138],
        ['豆包滷味餐', '滷豆包、豆干、青菜', 98]
      ]
    },
    {
      id: 'spicy',
      category: '想吃點辣',
      vendor: '辣味研究所',
      image: 'images/Spicy.jpg',
      description: '香麻、辣炒、椒香料理，適合想提神的午餐。',
      items: [
        ['麻辣雞丁飯', '花椒香麻、雞丁入味', 120],
        ['泡椒豬肉飯', '酸辣泡椒、青蔥', 115],
        ['紅油抄手麵', '紅油、抄手、細麵', 100],
        ['宮保雞丁飯', '乾辣椒、花生、雞丁', 125],
        ['麻婆豆腐飯', '豆腐、辣豆瓣、白飯', 95],
        ['剝皮辣椒雞飯', '微辣雞湯香、雞腿肉', 132],
        ['椒麻雞腿飯', '椒麻醬、酥炸雞腿', 128],
        ['酸辣打拋飯', '打拋肉、檸檬、九層塔', 118]
      ]
    },
    {
      id: 'western',
      category: '西式輕食',
      vendor: '小島輕食',
      image: 'images/Western_style.jpg',
      description: '三明治、沙拉與飲品組合，適合不想吃太重的人。',
      items: [
        ['總匯三明治', '火腿、雞蛋、生菜', 95],
        ['舒肥雞沙拉', '雞胸、堅果、油醋醬', 120],
        ['煙燻鮭魚貝果', '鮭魚、奶油乳酪', 135],
        ['番茄肉醬筆管麵', '番茄肉醬、起司', 130],
        ['濃湯輕食組', '玉米濃湯、烤吐司', 90],
        ['凱薩雞肉捲', '雞肉、生菜、凱薩醬', 105],
        ['鮪魚蛋沙拉盒', '鮪魚、雞蛋、馬鈴薯', 98],
        ['烤蔬菜佛卡夏', '烤蔬菜、起司、香草', 112]
      ]
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = (value) => `$${Number(value).toLocaleString('zh-TW')}`;
  const state = { store: stores[0], cart: {}, payment: '電子支付' };

  function goHome() {
    window.location.href = 'homepage-ui.html';
  }

  function updateTime() {
    $('#headerTime').textContent = new Date().toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function setStep(step) {
    $$('.meal-step').forEach((section) => section.classList.toggle('active', section.dataset.step === step));
    $$('.meal-progress [data-progress]').forEach((item) => {
      const order = ['store', 'items', 'payment', 'done'];
      item.classList.toggle('active', order.indexOf(item.dataset.progress) <= order.indexOf(step));
    });
  }

  function renderStores() {
    $('#storeGrid').innerHTML = stores.map((store) => `
      <button class="store-card" type="button" data-store="${store.id}">
        <div class="store-image-wrap">
          <img src="${store.image}" alt="${store.vendor}">
        </div>

        <div class="store-info">
          <span>${store.category}</span>
          <h2>${store.vendor}</h2>
          <p>${store.description}</p>
        </div>
      </button>
    `).join('');

    $$('.store-card').forEach((card) => {
      card.addEventListener('click', () => openStore(card.dataset.store));
    });
  }

  function openStore(id) {
    state.store = stores.find((store) => store.id === id) || stores[0];
    state.cart = {};
    $('#selectedCategory').textContent = state.store.category;
    $('#vendorTitle').textContent = state.store.vendor;
    $('#vendorDescription').textContent = state.store.description;
    renderItems();
    renderOrder();
    setStep('items');
  }

  function renderItems() {
    $('#itemList').innerHTML = state.store.items.map(([name, desc, price]) => {
      const qty = state.cart[name]?.qty || 0;
      return `
        <div class="item-row" data-item="${name}">
          <div><h3>${name}</h3><p>${desc}</p></div>
          <strong>${money(price)}</strong>
          <div class="qty">
            <button type="button" data-delta="-1">−</button>
            <span>${qty}</span>
            <button type="button" data-delta="1">＋</button>
          </div>
        </div>
      `;
    }).join('');
    $$('.item-row').forEach((row) => {
      const item = state.store.items.find(([name]) => name === row.dataset.item);
      $$('[data-delta]', row).forEach((button) => {
        button.addEventListener('click', () => updateQty(item, Number(button.dataset.delta)));
      });
    });
  }

  function updateQty(item, delta) {
    const [name, desc, price] = item;
    const current = state.cart[name]?.qty || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) delete state.cart[name];
    else state.cart[name] = { name, desc, price, qty: next };
    renderItems();
    renderOrder();
  }

  function getOrders() {
    return Object.values(state.cart);
  }

  function getTotal() {
    return getOrders().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderOrder() {
    const orders = getOrders();
    $('#orderCount').textContent = `${orders.reduce((sum, item) => sum + item.qty, 0)} 項`;
    $('#orderTotal').textContent = money(getTotal());
    $('#confirmOrderButton').disabled = orders.length === 0;
    $('#orderList').innerHTML = orders.length ? orders.map((item) => `
      <div class="order-line">
        <div><strong>${item.name}</strong><br><span>${money(item.price)} × ${item.qty}</span></div>
        <strong>${money(item.price * item.qty)}</strong>
      </div>
    `).join('') : '尚未選擇餐點';
  }

  function renderConfirm() {
    const orders = getOrders();
    const note = $('#orderNote').value.trim() || '無';
    $('#confirmList').innerHTML = `
      <div><dt>店家</dt><dd>${state.store.vendor}</dd></div>
      <div><dt>餐點</dt><dd>${orders.map((item) => `${item.name} × ${item.qty}`).join('、')}</dd></div>
      <div><dt>備註</dt><dd>${note}</dd></div>
      <div><dt>小計</dt><dd>${money(getTotal())}</dd></div>
      <div><dt>員工折扣</dt><dd>-$10</dd></div>
      <div><dt>總計</dt><dd>${money(Math.max(0, getTotal() - 10))}</dd></div>
    `;
    $('#payTotal').textContent = money(Math.max(0, getTotal() - 10));
  }

  function finishOrder() {
    const orders = getOrders();
    const orderId = `#${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    $('#doneSummary').innerHTML = `
      <div><dt>訂單編號</dt><dd>${orderId}</dd></div>
      <div><dt>店家</dt><dd>${state.store.vendor}</dd></div>
      <div><dt>餐點</dt><dd>${orders.map((item) => `${item.name} × ${item.qty}`).join('、')}</dd></div>
      <div><dt>金額</dt><dd>${money(Math.max(0, getTotal() - 10))}</dd></div>
      <div><dt>付款方式</dt><dd>${state.payment}</dd></div>
      <div><dt>預計送達</dt><dd>12:00–12:30</dd></div>
    `;
    setStep('done');
  }

  function selectPayment(method) {
    state.payment = method;
    $$('.payment-method').forEach((button) => {
      button.classList.toggle('selected', button.dataset.payment === method);
    });
  }

  $('#backButton').addEventListener('click', goHome);
  $('#storeBackButton').addEventListener('click', () => setStep('store'));
  $('#paymentBackButton').addEventListener('click', () => setStep('items'));
  $('#confirmOrderButton').addEventListener('click', () => {
    renderConfirm();
    setStep('payment');
  });
  $('#finishPaymentButton').addEventListener('click', finishOrder);
  $$('.payment-method').forEach((button) => {
    button.addEventListener('click', () => selectPayment(button.dataset.payment));
  });
  $('#newOrderButton').addEventListener('click', () => {
    state.cart = {};
    selectPayment('電子支付');
    $('#orderNote').value = '';
    renderStores();
    renderOrder();
    setStep('store');
  });
  $('#doneHomeButton').addEventListener('click', goHome);

  updateTime();
  window.setInterval(updateTime, 30000);
  renderStores();
})();
