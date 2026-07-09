(function() {
  // --- данные ---
  const catalogProducts = [
    { id: 1, name: 'Сосна обыкновенная', type: 'обыкновенная', age: 1, price: 500, img: 'image/pine-saplings/common-pine-1year.jpeg' },
    { id: 2, name: 'Сосна обыкновенная', type: 'обыкновенная', age: 2, price: 800, img: 'image/pine-saplings/common-pine-2year.jpeg' },
    { id: 3, name: 'Сосна горная', type: 'горная', age: 1, price: 600, img: 'image/pine-saplings/mountain-pine-1year.jpeg' },
    { id: 4, name: 'Сосна горная', type: 'горная', age: 3, price: 1200, img: 'image/pine-saplings/mountain-pine-3year.jpeg' },
    { id: 5, name: 'Сосна кедровая', type: 'кедровая', age: 2, price: 1500, img: 'image/pine-saplings/cedar-pine-2year.jpeg' },
    { id: 6, name: 'Сосна черная', type: 'черная', age: 1, price: 700, img: 'image/pine-saplings/black-pine-1year.jpeg' },
  ];

  const exclusiveProducts = [
    {
      id: 'ex1',
      name: 'Сосна кедровая «Сибирский Великан»',
      images: {
        '1 год': 'image/exclusive/siberian-giant-cedar-pine-1year.jpeg',
        '3 года': 'image/exclusive/siberian-giant-cedar-pine-3year.jpeg',
        '5 лет': 'image/exclusive/siberian-giant-cedar-pine-5year.jpeg'
      },
      description: 'Элитный сорт с пушистой кроной и ускоренным ростом. Шишки появляются уже на 5-й год.',
      care: 'Полив 2 раза в неделю, солнечное место, дренированная почва. Зимой укрывать мульчей.'
    },
    {
      id: 'ex2',
      name: 'Сосна горная «Золотая вершина»',
      images: {
        '1 год': 'image/exclusive/mountain-pine-golden-peack-1year.jpeg',
        '3 года': 'image/exclusive/mountain-pine-golden-peack-3year.jpeg',
        '4 года': 'image/exclusive/mountain-pine-golden-peack-5year.jpeg'
      },
      description: 'Декоративный карликовый сорт с золотистыми кончиками хвои. Идеален для альпинариев.',
      care: 'Умеренный полив, полутень, слабокислая почва. Обрезка не требуется.'
    }
  ];

  const allSazenNames = [...new Set([...catalogProducts.map(p => p.name), ...exclusiveProducts.map(p => p.name)])];

  // --- рендер каталога ---
  function renderCatalog(products) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="age">Возраст: ${p.age} ${getYearWord(p.age)}</div>
          <div class="price">${p.price} ₽</div>
        </div>
      </div>
    `).join('');
  }

  function getYearWord(age) {
    if (age === 1) return 'год';
    if (age >= 2 && age <= 4) return 'года';
    return 'лет';
  }

  // --- рендер эксклюзивных ---
  function renderExclusive() {
    const grid = document.getElementById('exclusiveGrid');
    if (!grid) return;
    grid.innerHTML = exclusiveProducts.map(product => {
      const ages = Object.keys(product.images);
      const firstAge = ages[0];
      return `
        <div class="product-card exclusive-card" data-product-id="${product.id}">
          <img src="${product.images[firstAge]}" alt="${product.name}" class="exclusive-img" data-id="${product.id}">
          <div class="image-tabs">
            ${ages.map(age => `<span class="image-tab${age === firstAge ? ' active' : ''}" data-age="${age}" data-id="${product.id}">${age}</span>`).join('')}
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="care-tips">
            <strong>🌿 Советы по уходу:</strong> ${product.care}
          </div>
          <button class="order-btn" data-name="${product.name}">Заказать эксклюзив</button>
        </div>
      `;
    }).join('');

    // переключение картинок
    document.querySelectorAll('.image-tab').forEach(tab => {
      tab.addEventListener('click', function(e) {
        const id = this.dataset.id;
        const age = this.dataset.age;
        const product = exclusiveProducts.find(p => p.id === id);
        if (!product) return;
        const imgEl = document.querySelector(`.exclusive-img[data-id="${id}"]`);
        if (imgEl) imgEl.src = product.images[age];
        this.parentElement.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // кнопки "Заказать" → модальное окно
    document.querySelectorAll('.exclusive-card .order-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const name = this.dataset.name;
        openOrderModal(name);
      });
    });
  }

  // --- модальное окно заказа ---
  const orderModal = document.getElementById('orderModal');
  const modalSazenecInput = document.getElementById('modalSazenec');
  const closeOrderModalBtn = document.getElementById('closeModalBtn');
  const modalNameInput = document.getElementById('modalName');

  function openOrderModal(sazenName = '') {
    if (modalSazenecInput) modalSazenecInput.value = sazenName;
    if (modalNameInput) modalNameInput.value = '';
    orderModal.classList.add('active');
  }

  function closeOrderModal() {
    orderModal.classList.remove('active');
  }

  if (closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeOrderModal);
  window.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  // --- модальное окно условий возврата ---
  const returnModal = document.getElementById('returnModal');
  const closeReturnModalBtn = document.getElementById('closeReturnModalBtn');
  const returnLink = document.getElementById('returnLink');

  function openReturnModal(e) {
    e.preventDefault(); // чтобы ссылка не перезагружала страницу
    returnModal.classList.add('active');
  }

  function closeReturnModal() {
    returnModal.classList.remove('active');
  }

  if (returnLink) returnLink.addEventListener('click', openReturnModal);
  if (closeReturnModalBtn) closeReturnModalBtn.addEventListener('click', closeReturnModal);
  window.addEventListener('click', (e) => {
    if (e.target === returnModal) closeReturnModal();
  });

  // --- автокомплит ТОЛЬКО для главной формы ---
  function setupAutocomplete(wrapperId, inputId, listId, toggleBtnId) {
    const wrapper = document.getElementById(wrapperId);
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const toggleBtn = document.getElementById(toggleBtnId);
    if (!wrapper || !input || !list) return;

    function renderDropdown(filterText = '') {
      const filtered = allSazenNames.filter(name => name.toLowerCase().includes(filterText.toLowerCase()));
      list.innerHTML = filtered.map(name => `<div class="dropdown-item">${name}</div>`).join('');
      list.classList.toggle('active', filtered.length > 0);
    }

    input.addEventListener('input', () => renderDropdown(input.value));
    input.addEventListener('focus', () => {
      renderDropdown(input.value.trim() === '' ? '' : input.value);
    });

    toggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (list.classList.contains('active')) {
        list.classList.remove('active');
      } else {
        renderDropdown(input.value);
      }
    });

    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropdown-item')) {
        input.value = e.target.textContent;
        list.classList.remove('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        list.classList.remove('active');
      }
    });
  }

  // Запускаем автокомплит только для главной формы
  setupAutocomplete('autocompleteMain', 'sazenecInput', 'dropdownList', 'dropdownToggleBtn');
  // Для модалки автокомплит не нужен, поэтому строка удалена

  // --- фильтрация и сортировка каталога ---
  const filterType = document.getElementById('filterType');
  const filterAge = document.getElementById('filterAge');
  const sortSelect = document.getElementById('sortSelect');

  function filterAndSort() {
    let filtered = [...catalogProducts];
    const typeVal = filterType.value;
    const ageVal = filterAge.value;

    if (typeVal !== 'all') filtered = filtered.filter(p => p.type === typeVal);
    if (ageVal !== 'all') filtered = filtered.filter(p => p.age === parseInt(ageVal));

    const sortVal = sortSelect.value;
    if (sortVal === 'priceAsc') filtered.sort((a,b) => a.price - b.price);
    else if (sortVal === 'priceDesc') filtered.sort((a,b) => b.price - a.price);
    else if (sortVal === 'nameAsc') filtered.sort((a,b) => a.name.localeCompare(b.name));
    else if (sortVal === 'nameDesc') filtered.sort((a,b) => b.name.localeCompare(a.name));

    renderCatalog(filtered);
  }

  if (filterType) filterType.addEventListener('change', filterAndSort);
  if (filterAge) filterAge.addEventListener('change', filterAndSort);
  if (sortSelect) sortSelect.addEventListener('change', filterAndSort);

  // --- Вспомогательная функция отправки формы через fetch ---
  async function submitOrder(name, sazhenec, type = 'обычная') {
      try {
          const response = await fetch('submit_order.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, sazhenec, type })
          });
          const data = await response.json();
          if (data.success) {
              return { success: true };
          } else {
              return { success: false, errors: data.errors || ['Неизвестная ошибка'] };
          }
      } catch (error) {
          console.error('Ошибка сети:', error);
          return { success: false, errors: ['Ошибка соединения с сервером'] };
      }
  }

  // --- Показать модальное окно успеха ---
  function showSuccessModal() {
      const modal = document.getElementById('successModal');
      if (modal) modal.classList.add('active');
  }

  // --- Обработчик главной формы (обычная заявка) ---
  window.handleMainSubmit = async function(e) {
      e.preventDefault();
      const form = e.target;
      const name = form.querySelector('input[placeholder="Имя и фамилия"]')?.value.trim();
      const sazenec = form.querySelector('#sazenecInput')?.value.trim();

      if (!name || !sazenec) {
          alert('Пожалуйста, заполните все поля.');
          return;
      }

      const result = await submitOrder(name, sazenec, 'обычная');
      if (result.success) {
          form.reset();
          showSuccessModal();
      } else {
          alert('Ошибка: ' + result.errors.join('\n'));
      }
  };

  // --- Обработчик модальной формы (эксклюзивная заявка) ---
  window.handleModalSubmit = async function(e) {
      e.preventDefault();
      const form = e.target;
      const name = document.getElementById('modalName')?.value.trim();
      const sazenec = document.getElementById('modalSazenec')?.value.trim();

      if (!name || !sazenec) {
          alert('Пожалуйста, заполните все поля.');
          return;
      }

      const result = await submitOrder(name, sazenec, 'эксклюзивная');
      if (result.success) {
          form.reset();
          closeOrderModal();        // закрываем модалку заказа
          showSuccessModal();       // показываем успех
      } else {
          alert('Ошибка: ' + result.errors.join('\n'));
      }
  };

  // --- Закрытие модалки успеха (крестик и клик вне) ---
  document.addEventListener('DOMContentLoaded', function() {
      const successModal = document.getElementById('successModal');
      const closeBtn = document.getElementById('closeSuccessModalBtn');

      if (closeBtn) {
          closeBtn.addEventListener('click', () => {
              successModal.classList.remove('active');
          });
      }

      window.addEventListener('click', (e) => {
          if (e.target === successModal) {
              successModal.classList.remove('active');
          }
      });
  });
  // --- начальный рендер ---
  renderCatalog(catalogProducts);
  renderExclusive();
})();
