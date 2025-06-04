var u = Object.defineProperty;
var v = (a, e, t) => e in a ? u(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var n = (a, e, t) => v(a, typeof e != "symbol" ? e + "" : e, t);
class g {
  constructor({
    postBackButtonEvent: e,
    onClick: t,
    offClick: s
  }) {
    n(this, "visible", !1);
    n(this, "postBackButtonEvent");
    n(this, "onClick");
    n(this, "offClick");
    this.postBackButtonEvent = e, this.onClick = t, this.offClick = s;
  }
  get isVisible() {
    return this.visible;
  }
  show() {
    this.visible = !0, this.postBackButtonEvent(!0);
  }
  hide() {
    this.visible = !1, this.postBackButtonEvent(!1);
  }
}
class d {
  constructor({
    postSwipesBehaviorEvent: e
  }) {
    n(this, "enabled", !0);
    n(this, "postSwipesBehaviorEvent");
    this.postSwipesBehaviorEvent = e;
  }
  get isEnabled() {
    return this.enabled;
  }
  enable() {
    this.enabled = !0, this.postSwipesBehaviorEvent(!0);
  }
  disable() {
    this.enabled = !1, this.postSwipesBehaviorEvent(!1);
  }
}
const h = class h {
  constructor() {
    n(this, "rawInitData");
    const e = this.extractInitData();
    if (e)
      this.rawInitData = e, sessionStorage.setItem(h.WEB_APP_DATA_KEY, e);
    else {
      const t = sessionStorage.getItem(h.WEB_APP_DATA_KEY);
      this.rawInitData = t;
    }
  }
  /**
   * Геттер для получения сырых данных инициализации.
   */
  get initData() {
    return this.rawInitData;
  }
  /**
   * Геттер для получения распарсенных данных инициализации.
   */
  get initDataUnsafe() {
    return this.parseInitData(this.rawInitData);
  }
  /**
   * Получает строку из хэша.
   * @param hash - хэш.
   * @returns строка из хэша.
   */
  getHashString(e) {
    const t = e.toString().replace(/^#/, "");
    return new URLSearchParams(t).get(h.WEB_APP_DATA_KEY);
  }
  extractInitData() {
    try {
      const e = this.getHashString(location.hash);
      if (e) return e;
      const t = performance.getEntriesByType("navigation")[0], s = t && new URL(t.name).hash, i = s && this.getHashString(s);
      return i || null;
    } catch (e) {
      return console.warn("Ошибка при извлечении init data:", e), null;
    }
  }
  getUserInitData(e) {
    try {
      const t = JSON.parse(e);
      if (t && typeof t == "object")
        return {
          first_name: t.first_name,
          last_name: t.last_name,
          username: t.username,
          language_code: t.language_code,
          photo_url: t.photo_url,
          id: Number(t.id)
        };
    } catch (t) {
      console.warn("Ошибка при парсинге данных пользователя:", t);
    }
  }
  getChatInitData(e) {
    try {
      const t = JSON.parse(e);
      if (t && typeof t == "object")
        return {
          id: t.id,
          type: t.type
        };
    } catch (t) {
      console.warn("Ошибка при парсинге данных чата:", t);
    }
  }
  parseInitData(e) {
    const t = {};
    if (!e)
      return t;
    try {
      const s = decodeURIComponent(e);
      new URLSearchParams(s).forEach((r, o) => {
        switch (o) {
          case "hash":
          case "ip":
          case "query_id":
          case "start_param": {
            t[o] = r;
            break;
          }
          case "auth_date": {
            t[o] = Number(r);
            break;
          }
          case "user": {
            t[o] = this.getUserInitData(r);
            break;
          }
          case "chat": {
            t[o] = this.getChatInitData(r);
            break;
          }
          default:
            console.warn(`Неизвестный параметр: ${o}`);
        }
      });
    } catch (s) {
      console.warn("Ошибка при парсинге init data:", s);
    }
    return t;
  }
};
n(h, "WEB_APP_DATA_KEY", "WebAppData");
let c = h;
class w {
  constructor({
    saveKey: e,
    getKey: t,
    clearKeys: s
  }) {
    n(this, "saveKey");
    n(this, "getKey");
    n(this, "clearKeys");
    this.saveKey = e, this.getKey = t, this.clearKeys = s;
  }
  /**
   * Метод, который сохраняет переданную пару "ключ-значение" в защищенном хранилище устройства
   */
  setItem(e, t) {
    return this.saveKey({ key: e, value: t });
  }
  /**
   * Метод, который получает значение из защищённого хранилища устройства по указанному ключу
   */
  getItem(e) {
    return this.getKey({ key: e });
  }
  /**
   * Метод, который удаляет значение из защищённого хранилища устройства по указанному ключу
   */
  removeItem(e) {
    return this.saveKey({ key: e, value: null });
  }
  /**
   * Метод, который очищает все ключи, ранее сохраненные ботом в защищённом хранилище устройства
   */
  clear() {
    return this.clearKeys();
  }
}
class y {
  constructor({
    saveKey: e,
    getKey: t,
    clearKeys: s
  }) {
    n(this, "saveKey");
    n(this, "getKey");
    n(this, "clearKeys");
    this.saveKey = e, this.getKey = t, this.clearKeys = s;
  }
  /**
   * Метод, который сохраняет переданную пару "ключ-значение" в локальном хранилище устройства
   */
  setItem(e, t) {
    return this.saveKey({ key: e, value: t });
  }
  /**
   * Метод, который получает значение из локального хранилища устройства по указанному ключу
   */
  getItem(e) {
    return this.getKey({ key: e });
  }
  /**
   * Метод, который удаляет значение из локального хранилища устройства по указанному ключу
   */
  removeItem(e) {
    return this.saveKey({ key: e, value: null });
  }
  /**
   * Метод, который очищает все ключи, ранее сохраненные ботом в локальном хранилище устройства
   */
  clear() {
    return this.clearKeys();
  }
}
const f = 1e4, E = /^https:\/\/.*\.(?:max|oneme)\.ru$/;
class b {
  constructor() {
    n(this, "eventHandlers", /* @__PURE__ */ new Map());
    // Храним запросы, ожидающие ответа
    n(this, "pendingRequests", /* @__PURE__ */ new Map());
    n(this, "webviewBridge");
    n(this, "swipesBehaviorManager");
    n(this, "initDataManager");
    n(this, "SecureStorage");
    n(this, "DeviceStorage");
    n(this, "BackButton");
    /**
     * Обёртка для автоматического добавления query_id к параметрам
     */
    n(this, "withQueryId", (e) => (t = {}) => {
      var i;
      const s = (i = this.initDataUnsafe) == null ? void 0 : i.query_id;
      return e({ ...t || {}, queryId: s });
    });
    this.isIframe() ? window.addEventListener("message", async (e) => {
      if (!(!E.test(e.origin) || typeof e.data != "string"))
        try {
          const { type: t, ...s } = JSON.parse(e.data);
          t != null && t.startsWith("WebApp") && await this.receiveEvent(t, s);
        } catch (t) {
          console.error("Ошибка при обработке сообщения:", t);
        }
    }) : this.webviewBridge = window.WebViewHandler, this.BackButton = new g({
      postBackButtonEvent: (e) => this.postEvent("WebAppSetupBackButton", { isVisible: e }),
      onClick: (e) => this.onEvent("WebAppBackButtonPressed", e),
      offClick: (e) => this.offEvent("WebAppBackButtonPressed", e)
    }), this.swipesBehaviorManager = new d({
      postSwipesBehaviorEvent: (e) => this.postEvent("WebAppSetupSwipesBehavior", { allowVerticalSwipes: e })
    }), this.initDataManager = new c(), this.SecureStorage = new w({
      saveKey: this.withQueryId(
        (e) => this.postEventAsync("WebAppSecureStorageSaveKey", e)
      ),
      getKey: this.withQueryId(
        (e) => this.postEventAsync("WebAppSecureStorageGetKey", e)
      ),
      clearKeys: this.withQueryId(
        (e) => this.postEventAsync("WebAppSecureStorageClear", e)
      )
    }), this.DeviceStorage = new y({
      saveKey: this.withQueryId(
        (e) => this.postEventAsync("WebAppDeviceStorageSaveKey", e)
      ),
      getKey: this.withQueryId(
        (e) => this.postEventAsync("WebAppDeviceStorageGetKey", e)
      ),
      clearKeys: this.withQueryId(
        (e) => this.postEventAsync("WebAppDeviceStorageClear", e)
      )
    });
  }
  /**
   * Сырые данные инициализации
   */
  get initData() {
    return this.initDataManager.initData;
  }
  /**
   * Распарсенные данные инициализации
   */
  get initDataUnsafe() {
    return this.initDataManager.initDataUnsafe;
  }
  /**
   * Состояние вертикальных свайпов
   */
  get isVerticalSwipesEnabled() {
    return this.swipesBehaviorManager.isEnabled;
  }
  isIframe() {
    return window.self !== window.top;
  }
  /**
   * Стандартная отправка событий (без ожидания ответа)
   */
  postEvent(e, t = {}, s) {
    this.sendEventByClientType(e, t), s == null || s();
  }
  /**
   * Отправка события с ожиданием ответа
   */
  postEventAsync(e, t = {}) {
    return new Promise((s, i) => {
      const r = crypto.randomUUID();
      this.pendingRequests.set(r, { resolve: s, reject: i }), this.sendEventByClientType(e, { ...t, requestId: r }), setTimeout(i, f);
    });
  }
  /**
   * Отправка события в зависимости от типа
   */
  sendEventByClientType(e, t) {
    this.isIframe() ? window.parent.postMessage(JSON.stringify({ type: e, ...t }), "*") : this.webviewBridge && this.webviewBridge.postEvent(e, JSON.stringify(t));
  }
  /**
   * Обработка полученного события
   */
  async receiveEvent(e, { requestId: t, ...s }) {
    var i, r;
    if (t && "error" in s)
      console.log(`[WebApp] Получена ошибка: ${e}`, s), (i = this.pendingRequests.get(t)) == null || i.reject(s), this.pendingRequests.delete(t);
    else if (t && !("error" in s))
      console.log(`[WebApp] Получено событие: ${e}`, s), (r = this.pendingRequests.get(t)) == null || r.resolve(s), this.pendingRequests.delete(t);
    else {
      const o = this.eventHandlers.get(e);
      o == null || o.forEach((p) => {
        try {
          p(s);
        } catch (l) {
          console.error(`Ошибка в обработке события "${e}":`, l);
        }
      });
    }
  }
  /**
   * Функция, которую используют нативные клиенты для отправки ответа
   */
  async sendEvent(e, t = "{}") {
    try {
      this.receiveEvent(e, JSON.parse(t));
    } catch (s) {
      console.warn(s);
    }
  }
  /**
   * Подписка на событие с использованием колбэка
   */
  onEvent(e, t) {
    let s = this.eventHandlers.get(e);
    return s || (s = /* @__PURE__ */ new Set(), this.eventHandlers.set(e, s)), s.add(t), () => {
      this.offEvent(e, t);
    };
  }
  /**
   * Удаление подписки на событие
   */
  offEvent(e, t) {
    const s = this.eventHandlers.get(e);
    s && (s.delete(t), s.size === 0 && this.eventHandlers.delete(e));
  }
  /**
   * Закрытие приложения
   */
  close() {
    this.postEvent("WebAppClose", {}, () => {
      console.log("Приложение закрыто");
    });
  }
  /**
   * Инициализация WebApp API
   */
  ready() {
    this.postEvent("WebAppReady", {}, () => {
      console.log("WebApp готово к работе");
    });
  }
  /**
   * Запрос номера телефона
   */
  requestContact() {
    return this.postEventAsync("WebAppRequestPhone");
  }
  /**
   * Подтверждать закрытие миниаппа с помощью всплывающего окна
   */
  enableClosingConfirmation() {
    this.postEvent("WebAppSetupClosingBehavior", { needConfirmation: !0 });
  }
  /**
   * Отключение подтверждения закрытия миниаппа
   */
  disableClosingConfirmation() {
    this.postEvent("WebAppSetupClosingBehavior", { needConfirmation: !1 });
  }
  /**
   * Открытие ссылки во внешнем браузере
   */
  openLink(e) {
    this.postEvent("WebAppOpenLink", { url: e });
  }
  /**
   * Открытие диплинка связанного с max.ru
   */
  openMaxLink(e) {
    this.postEvent("WebAppOpenMaxLink", { url: e });
  }
  /**
   * Включение вертикальных свайпов
   */
  enableVerticalSwipes() {
    this.swipesBehaviorManager.enable();
  }
  /**
   * Отключение вертикальных свайпов
   */
  disableVerticalSwipes() {
    this.swipesBehaviorManager.disable();
  }
  /**
   * Скачивание файла
   */
  downloadFile(e, t) {
    return this.postEventAsync("WebAppDownloadFile", { url: e, file_name: t });
  }
}
const S = new b();
window.WebApp = S;
