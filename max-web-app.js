var v = Object.defineProperty;
var g = (i, e, t) => e in i ? v(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var n = (i, e, t) => g(i, typeof e != "symbol" ? e + "" : e, t);
class u {
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
const c = class c {
  constructor() {
    n(this, "rawInitData");
    const e = this.extractInitData();
    if (e)
      this.rawInitData = e, sessionStorage.setItem(c.WEB_APP_DATA_KEY, e);
    else {
      const t = sessionStorage.getItem(c.WEB_APP_DATA_KEY);
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
    return new URLSearchParams(t).get(c.WEB_APP_DATA_KEY);
  }
  extractInitData() {
    try {
      const e = this.getHashString(location.hash);
      if (e) return e;
      const t = performance.getEntriesByType("navigation")[0], s = t && new URL(t.name).hash, a = s && this.getHashString(s);
      return a || null;
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
n(c, "WEB_APP_DATA_KEY", "WebAppData");
let h = c;
class w {
  constructor({
    saveKey: e,
    getKey: t,
    restoreKey: s,
    clearKeys: a
  }) {
    n(this, "saveKey");
    n(this, "getKey");
    n(this, "restoreKey");
    n(this, "clearKeys");
    this.saveKey = e, this.getKey = t, this.restoreKey = s, this.clearKeys = a;
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
   * Метод, для попытки восстановления ключа, который ранее существовал на текущем устройстве
   */
  restoreItem(e) {
    return this.restoreKey({ key: e });
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
const E = 1e4, f = /^https:\/\/.*\.(?:max|oneme)\.ru$/;
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
    this.isIframe() ? window.addEventListener("message", async (e) => {
      if (!(!f.test(e.origin) || typeof e.data != "string"))
        try {
          const { type: t, ...s } = JSON.parse(e.data);
          t != null && t.startsWith("WebApp") && await this.receiveEvent(t, s);
        } catch (t) {
          console.error("Ошибка при обработке сообщения:", t);
        }
    }) : this.webviewBridge = window.WebViewHandler, this.BackButton = new u({
      postBackButtonEvent: (e) => this.postEvent("WebAppSetupBackButton", { isVisible: e }),
      onClick: (e) => this.onEvent("WebAppBackButtonPressed", e),
      offClick: (e) => this.offEvent("WebAppBackButtonPressed", e)
    }), this.swipesBehaviorManager = new d({
      postSwipesBehaviorEvent: (e) => this.postEvent("WebAppSetupSwipesBehavior", { allowVerticalSwipes: e })
    }), this.initDataManager = new h(), this.SecureStorage = new w({
      saveKey: (e) => this.postEventAsync("WebAppSecureStorageSaveKey", e),
      getKey: (e) => this.postEventAsync("WebAppSecureStorageGetKey", e),
      restoreKey: (e) => this.postEventAsync("WebAppSecureStorageRestoreKey", e),
      clearKeys: () => this.postEventAsync("WebAppSecureStorageClear")
    }), this.DeviceStorage = new y({
      saveKey: (e) => this.postEventAsync("WebAppDeviceStorageSaveKey", e),
      getKey: (e) => this.postEventAsync("WebAppDeviceStorageGetKey", e),
      clearKeys: () => this.postEventAsync("WebAppDeviceStorageClear")
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
    return new Promise((s, a) => {
      const r = crypto.randomUUID();
      this.pendingRequests.set(r, { resolve: s, reject: a }), this.sendEventByClientType(e, { ...t, requestId: r }), setTimeout(a, E);
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
    var a, r;
    if (t && "error" in s)
      console.log(`[WebApp] Получена ошибка: ${e}`, s), (a = this.pendingRequests.get(t)) == null || a.reject(s), this.pendingRequests.delete(t);
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
window.WebApp = new b();
