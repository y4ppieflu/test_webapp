var d = Object.defineProperty;
var p = (s, e, t) => e in s ? d(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var r = (s, e, t) => p(s, typeof e != "symbol" ? e + "" : e, t);
const u = (s) => {
  var t;
  const e = s.split("WebApp")[1];
  return e ? (t = e.match(/([A-Z][a-z]*)/g)) == null ? void 0 : t.map((n) => n.toLowerCase()).join("_") : "unknown_method";
};
function h() {
  if (crypto && (crypto != null && crypto.randomUUID))
    return crypto.randomUUID();
  if (crypto && (crypto != null && crypto.getRandomValues)) {
    const e = new Uint8Array(16);
    crypto.getRandomValues(e);
    let t = "";
    for (let n = 0; n < e.length; n++)
      t += e[n].toString(16).padStart(2, "0");
    return t;
  }
  let s = Date.now().toString(36);
  for (; s.length < 32; )
    s += Math.random().toString(36).slice(2);
  return s.slice(0, 32);
}
const w = /^https:\/\/.*\.(?:max|oneme)\.ru$/;
class g {
  constructor(e) {
    r(this, "webviewBridge");
    r(this, "messageCallback");
    r(this, "sendEvent");
    this.messageCallback = e, this.isIframe() ? (this.sendEvent = this.sendOverIframe, this.initializeIframeTransport()) : typeof window < "u" && window.PrivateWebViewHandler ? (this.webviewBridge = window.PrivateWebViewHandler, this.sendEvent = this.sendOverWebView) : this.sendEvent = this.sendFallback;
  }
  isIframe() {
    return typeof window < "u" && window.self !== window.top;
  }
  initializeIframeTransport() {
    window.addEventListener("message", async (e) => {
      if (!(!w.test(e.origin) || typeof e.data != "string"))
        try {
          const { type: t, ...n } = JSON.parse(e.data);
          t != null && t.startsWith("WebApp") && this.messageCallback && this.messageCallback(t, n);
        } catch (t) {
          console.error("[WebApp] Ошибка при обработке сообщения: ", t);
        }
    });
  }
  sendOverIframe(e, t) {
    window.parent.postMessage(JSON.stringify({ type: e, ...t }), "*");
  }
  sendOverWebView(e, t) {
    var n;
    (n = this.webviewBridge) == null || n.postEvent(e, JSON.stringify(t));
  }
  sendFallback(e) {
    console.warn("[WebApp] Событие не отправлено - транспорт недоступен:", e);
  }
}
class m {
  constructor(e) {
    r(this, "pendingRequests", /* @__PURE__ */ new Map());
    r(this, "sendEvent");
    this.sendEvent = e;
  }
  /**
   * Отправка события с ожиданием ответа
   */
  createRequest(e, t, n = {}) {
    const { timeout: i = 1e4 } = n;
    return new Promise((o, l) => {
      const a = h(), c = setTimeout(() => {
        this.deletePendingRequest(a), l({
          error: {
            code: `client.${u(e)}.request_timeout`
          }
        });
      }, i);
      this.pendingRequests.set(a, {
        resolve: o,
        reject: l,
        timeoutId: c
      }), this.sendEvent(e, { ...t, requestId: a });
    });
  }
  /**
   * Обработка ответа на запрос
   * Вызывается только когда eventData.requestId существует
   */
  handleResponse(e, t) {
    const { requestId: n, ...i } = t, o = this.pendingRequests.get(n);
    if (!o) {
      console.warn(`[WebApp] Получен ответ на неизвестный запрос: ${e}`);
      return;
    }
    "error" in i ? (console.error(`[WebApp] Получена ошибка: ${e}`, i), o.reject(i)) : (console.log(`[WebApp] Получено событие: ${e}`, i), o.resolve(i)), this.clearTimeout(n), this.deletePendingRequest(n);
  }
  clearTimeout(e) {
    const t = this.pendingRequests.get(e);
    t && clearTimeout(t.timeoutId);
  }
  deletePendingRequest(e) {
    this.pendingRequests.get(e) && this.pendingRequests.delete(e);
  }
}
class v {
  constructor() {
    r(this, "transport");
    r(this, "requestController");
    this.transport = new g(async (e, t) => {
      await this.receiveEvent(e, t);
    }), this.requestController = new m((e, t) => {
      this.transport.sendEvent(e, t);
    });
  }
  /**
   * Обработка полученного события
   */
  async receiveEvent(e, t) {
    this.requestController.handleResponse(e, t);
  }
  /**
   * Функция, которую используют нативные клиенты для отправки ответа
   */
  async sendEvent(e, t = "{}") {
    try {
      this.receiveEvent(e, JSON.parse(t));
    } catch (n) {
      console.warn(n);
    }
  }
  sendRequest(e, t) {
    return this.requestController.createRequest(e, t);
  }
}
const f = new v();
window.PrivateWebApp = f;
