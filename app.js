(function () {
  'use strict';

  // Роли демонстрации «Как это работает». Скриншоты и подписи правятся здесь.
  var ROLES = [
    {
      id: 'inspector',
      title: 'Инженер технадзора',
      frame: 'phone',
      offline: true,
      steps: [
        {
          title: 'Входит в приложение',
          img: 'img/app-01-login.png',
          alt: 'Экран входа в приложение',
          caption: 'Вход по логину и паролю. Адрес сервера виден прямо на экране входа.',
        },
        {
          title: 'Открывает объект',
          img: 'img/app-02-objects.png',
          alt: 'Список объектов: подстанция 110/10 кВ «Северная»',
          caption: 'Список объектов, к которым есть доступ. Значок вверху показывает, всё ли отправлено на сервер.',
        },
        {
          title: 'Фиксирует нарушение',
          img: 'img/app-04-new-violation.png',
          alt: 'Форма нового нарушения со справочником типовых нарушений',
          caption: 'Категория из справочника, типовое нарушение подставляет описание и норматив. Остаётся выбрать критичность, исполнителя и срок.',
        },
        {
          title: 'Ищет и фильтрует',
          img: 'img/app-03-filters.png',
          alt: 'Фильтры по периоду, критичности, категории и ответственному',
          caption: 'Фильтры по периоду, критичности, категории, ответственному и просрочке, плюс поиск по тексту.',
        },
      ],
    },
    {
      id: 'foreman',
      title: 'Прораб',
      frame: 'phone',
      offline: true,
      steps: [
        {
          title: 'Получает уведомление',
          img: 'img/app-07-notifications.png',
          alt: 'Уведомления: назначено нарушение, возвращено на доработку',
          caption: 'Уведомление приходит, когда на прораба назначили нарушение или вернули его на доработку с причиной.',
        },
        {
          title: 'Устраняет и сдаёт на проверку',
          img: 'img/app-05-violation-history.png',
          alt: 'Карточка нарушения с действиями и историей статусов',
          caption: 'В истории видно, кто и когда взял замечание в работу и сдал на проверку. Инженер принимает или возвращает с комментарием.',
        },
        {
          title: 'Смотрит этапы работ',
          img: 'img/app-06-structure.png',
          alt: 'Структура объекта: этапы работ с планом, фактом и статусом',
          caption: 'Этапы работ с планом и фактом, бригадами и нормативами. Просроченные этапы подсвечены.',
        },
      ],
    },
    {
      id: 'manager',
      title: 'Руководитель',
      frame: 'browser',
      offline: false,
      steps: [
        {
          title: 'Смотрит аналитику',
          img: 'img/web-01-analytics.jpg',
          alt: 'Веб-панель: аналитика по объекту с графиком замечаний',
          caption: 'Веб-панель: сколько замечаний выявлено и закрыто, сколько просрочено, среднее время устранения и динамика по неделям.',
        },
        {
          title: 'Проверяет структуру объекта',
          img: 'img/web-02-structure.jpg',
          alt: 'Веб-панель: участки, бригады и этапы объекта',
          caption: 'Участки, бригады и этапы работ объекта в одном окне.',
        },
        {
          title: 'Выгружает сводный отчёт',
          img: 'img/pdf-01-summary.jpg',
          alt: 'Сводный PDF-отчёт по объекту',
          caption: 'Сводный PDF-отчёт за период: динамика, категории нарушений, этапы работ.',
          portrait: true,
        },
        {
          title: 'Получает акт с подписью',
          img: 'img/pdf-02-act.jpg',
          alt: 'PDF-акт фиксации нарушения с электронной подписью',
          caption: 'Акт по нарушению с простой электронной подписью. Подлинность проверяется в веб-панели по контрольной сумме.',
          portrait: true,
        },
      ],
    },
  ];

  var OFFLINE = {
    img: 'img/app-08-offline.png',
    alt: 'Список нарушений с отметкой «1 не синхр.» и «ожидает синхронизации»',
    caption: 'Связи нет, а работа продолжается: изменения копятся в очереди на телефоне и уйдут на сервер, когда появится сеть.',
  };

  var tabsEl = document.getElementById('role-tabs');
  var stepsEl = document.getElementById('role-steps');
  var deviceEl = document.getElementById('device');
  var imgEl = document.getElementById('device-img');
  var captionEl = document.getElementById('device-caption');
  var offlineEl = document.getElementById('offline-toggle');

  var state = { role: 0, step: 0, offline: false };

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    if (text) node.textContent = text;
    return node;
  }

  function buildHow() {
    tabsEl.setAttribute('role', 'tablist');
    tabsEl.setAttribute('aria-label', 'Роль');
    ROLES.forEach(function (role, i) {
      var tab = el('button', { type: 'button', role: 'tab', id: 'tab-' + role.id, 'aria-controls': 'role-steps', class: 'tab' }, role.title);
      tab.addEventListener('click', function () { selectRole(i); });
      tab.addEventListener('keydown', function (e) {
        var delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!delta) return;
        e.preventDefault();
        var next = (state.role + delta + ROLES.length) % ROLES.length;
        selectRole(next);
        tabsEl.children[next].focus();
      });
      tabsEl.appendChild(tab);
    });
    stepsEl.setAttribute('role', 'tabpanel');
    offlineEl.addEventListener('click', function () {
      state.offline = !state.offline;
      renderHow(state);
    });
  }

  function selectRole(i) {
    state = { role: i, step: 0, offline: false };
    renderHow(state);
  }

  function renderHow(s) {
    var role = ROLES[s.role];
    Array.prototype.forEach.call(tabsEl.children, function (tab, i) {
      tab.setAttribute('aria-selected', String(i === s.role));
      tab.tabIndex = i === s.role ? 0 : -1;
    });
    stepsEl.setAttribute('aria-labelledby', 'tab-' + role.id);

    stepsEl.textContent = '';
    role.steps.forEach(function (step, i) {
      var btn = el('button', { type: 'button', class: 'step', 'aria-pressed': String(i === s.step && !s.offline) }, step.title);
      btn.addEventListener('click', function () {
        state.step = i;
        state.offline = false;
        renderHow(state);
      });
      stepsEl.appendChild(btn);
    });

    offlineEl.hidden = !role.offline;
    offlineEl.setAttribute('aria-pressed', String(s.offline));

    var shown = s.offline ? OFFLINE : role.steps[s.step];
    deviceEl.className = role.frame + (shown.portrait ? ' is-portrait' : '');
    imgEl.src = shown.img;
    imgEl.alt = shown.alt;
    imgEl.removeAttribute('width');
    imgEl.removeAttribute('height');
    captionEl.textContent = shown.caption;
  }

  if (tabsEl && stepsEl && deviceEl && imgEl && captionEl && offlineEl) {
    buildHow();
    renderHow(state);
  }

  // Жизненный цикл нарушения: основная цепочка и возврат на доработку.
  var STATUSES = [
    {
      id: 'created',
      title: 'Создано',
      who: 'Инженер технадзора',
      text: 'фиксирует нарушение: фото, норматив, критичность и срок, при необходимости сразу назначает исполнителя.',
    },
    {
      id: 'in_progress',
      title: 'В работе',
      who: 'Прораб или инженер ПТО',
      text: 'берёт замечание в работу. Срок устранения идёт, приложение предупреждает, когда он истекает.',
    },
    {
      id: 'review',
      title: 'На проверке',
      who: 'Исполнитель',
      text: 'сообщает об устранении. Замечание уходит инженеру технадзора на приёмку.',
    },
    {
      id: 'closed',
      title: 'Закрыто',
      who: 'Инженер технадзора',
      text: 'принимает устранение. По нарушению можно сформировать PDF-акт с электронной подписью.',
    },
    {
      id: 'returned',
      title: 'Возвращено на доработку',
      who: 'Инженер технадзора',
      text: 'возвращает замечание с обязательной причиной. Исполнитель получает уведомление с причиной и снова берёт замечание в работу.',
    },
  ];

  var chainEl = document.getElementById('status-chain');
  var detailEl = document.getElementById('status-detail');
  var statusButtons = [];

  function statusButton(i) {
    var s = STATUSES[i];
    var btn = el('button', { type: 'button', class: 'status status--' + s.id, 'aria-pressed': 'false' });
    btn.appendChild(el('span', { class: 'status__dot', 'aria-hidden': 'true' }));
    btn.appendChild(document.createTextNode(s.title));
    btn.addEventListener('click', function () { renderStatus(i); });
    statusButtons[i] = btn;
    return btn;
  }

  function buildChain() {
    var main = el('div', { class: 'chain__main' });
    for (var i = 0; i < 4; i++) {
      if (i > 0) main.appendChild(el('span', { class: 'chain__arrow', 'aria-hidden': 'true' }));
      main.appendChild(statusButton(i));
    }
    var back = el('div', { class: 'chain__return' });
    back.appendChild(statusButton(4));
    back.appendChild(el('span', { class: 'chain__return-note' }, 'Из «На проверке» обратно в «В работе»'));
    chainEl.appendChild(main);
    chainEl.appendChild(back);
  }

  function renderStatus(index) {
    statusButtons.forEach(function (btn, i) {
      btn.setAttribute('aria-pressed', String(i === index));
    });
    var s = STATUSES[index];
    detailEl.textContent = '';
    var p = el('p');
    p.appendChild(el('strong', {}, s.title + '. '));
    p.appendChild(document.createTextNode(s.who + ' ' + s.text));
    detailEl.appendChild(p);
  }

  if (chainEl && detailEl) {
    buildChain();
    renderStatus(0);
  }
})();
