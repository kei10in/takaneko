// ==UserScript==
// @name               Allow Background Play in Audee membership
// @description        Allow background play for Audee membership users.
// @author             kei10in
// @version            1.0.0
// @match              https://audee-membership.jp/*
// @grant              none
// @inject-into        page
// @run-at             document-start
// ==/UserScript==
(() => {
  // ==== グローバルデバッグフラグ ====
  // window.__takanekonoAllowBackgroundPlayDebug が true のときだけコンソール出力します。
  // 例: 開発者ツールのコンソールで → window.__takanekonoAllowBackgroundPlayDebug = true
  if (typeof window !== "undefined" && !("__takanekonoAllowBackgroundPlayDebug" in window)) {
    try {
      Object.defineProperty(window, "__takanekonoAllowBackgroundPlayDebug", {
        value: false,
        writable: true,
        configurable: true,
        enumerable: false,
      });
    } catch (_) {
      // defineProperty が失敗する環境では単純代入にフォールバック
      window.__takanekonoAllowBackgroundPlayDebug = false;
    }
  }
  const debugEnabled = () => !!(window && window.__takanekonoAllowBackgroundPlayDebug);
  const dlog = (...args) => {
    if (debugEnabled()) {
      try {
        console.log(...args);
      } catch (_) {
        /* noop */
      }
    }
  };

  // ==== 設定（閾値など） ====
  const GA_URL_PATTERNS = [
    /googletagmanager\.com\/gtag\/js/i,
    /googletagmanager\.com\/gtm\.js/i,
    /google-analytics\.com/i,
    /analytics\.google\.com/i,
  ];
  const NEAR_LOAD_WINDOW_MS = 1500; // リソース読み込み直後の「近接」判定

  // ==== ユーティリティ ====
  const now = () => performance.now();
  const isGAUrl = (url = "") => GA_URL_PATTERNS.some((re) => re.test(url));
  const classifyFromStack = (stack = "") => {
    const m = GA_URL_PATTERNS.find((re) => re.test(stack));
    return !!m;
  };

  // 直近で読み込まれた GA 系リソースの時刻を追跡
  const gaResourceLoads = [];
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function (tagName, ...rest) {
    const el = originalCreateElement(tagName, ...rest);
    if (String(tagName).toLowerCase() === "script") {
      const desc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
      // src 設定時に監視
      if (desc) {
        Object.defineProperty(el, "src", {
          ...desc,
          set(value) {
            try {
              desc.set.call(this, value);
            } catch (e) {
              /* noop */
            }
            if (isGAUrl(value)) {
              el.addEventListener("load", () => gaResourceLoads.push({ url: value, t: now() }));
            }
          },
          get() {
            return desc.get.call(this);
          },
        });
      }
    }
    return el;
  };

  // 既存 <script> の load も拾う（後貼り対応）
  Array.from(document.scripts).forEach((s) => {
    if (s.src && isGAUrl(s.src)) {
      if (s.dataset.__gaLoadHooked) return;
      s.dataset.__gaLoadHooked = "1";
      s.addEventListener("load", () => gaResourceLoads.push({ url: s.src, t: now() }));
      // すでに読み込み済みなら直ちに記録
      if (s.readyState === "complete" || s.readyState === "loaded") {
        gaResourceLoads.push({ url: s.src, t: now() });
      }
    }
  });

  // gtag 呼出し中フラグ
  let inGtagCall = 0;
  if (typeof window.gtag === "function" && !window.gtag.__wrappedForDetect) {
    const origGtag = window.gtag;
    const wrapped = function (...args) {
      try {
        inGtagCall++;
        return origGtag.apply(this, args);
      } finally {
        inGtagCall--;
      }
    };
    wrapped.__wrappedForDetect = true;
    window.gtag = wrapped;
  }

  // ==== 監視本体 ====
  const originalAdd = EventTarget.prototype.addEventListener;
  const originalRemove = EventTarget.prototype.removeEventListener;

  const store = [];
  const removed = new WeakSet();

  function scoreAttribution(meta) {
    let score = 0;
    if (meta.stackMatchesGA) score += 3;
    if (meta.currentScriptGA) score += 3;
    if (meta.inGtagCall) score += 2;
    if (meta.nearGALoad) score += 1;
    return score;
  }

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    const t0 = now();
    const stack = new Error().stack || "";
    const currentScriptSrc = (document.currentScript && document.currentScript.src) || "";
    const meta = {
      time: performance.timeOrigin + t0,
      target: this,
      type,
      listener,
      options,
      stack,
      stackMatchesGA: classifyFromStack(stack),
      currentScriptSrc,
      currentScriptGA: isGAUrl(currentScriptSrc),
      inGtagCall: inGtagCall > 0,
      nearGALoad: false,
    };

    // 近接タイミング判定（最近の GA リソース load との差）
    const last = gaResourceLoads[gaResourceLoads.length - 1];
    if (last && t0 - last.t <= NEAR_LOAD_WINDOW_MS) {
      meta.nearGALoad = true;
    }

    meta.heuristicScore = scoreAttribution(meta);
    meta.suspect = type === "visibilitychange" && meta.heuristicScore >= 3;

    const rec = { kind: "add", ...meta };
    store.push(rec);

    // デバッグ出力（必要ならコメントアウト解除）
    if (type === "visibilitychange") {
      dlog(
        `[visibilitychange] add by ${meta.suspect ? "🟢LIKELY GTAG/GTM" : "⚪️other"} | score=${meta.heuristicScore}`,
        {
          listener,
          options,
          currentScriptSrc,
          inGtagCall: meta.inGtagCall,
          nearGALoad: meta.nearGALoad,
          stack,
        },
      );

      if (meta.suspect) {
        return originalAdd.call(this, type, listener, options);
      }
    } else {
      return originalAdd.call(this, type, listener, options);
    }
  };

  EventTarget.prototype.removeEventListener = function (type, listener, options) {
    const stack = new Error().stack || "";
    removed.add(listener);
    store.push({
      kind: "remove",
      time: performance.timeOrigin + now(),
      target: this,
      type,
      listener,
      options,
      stack,
    });
    return originalRemove.call(this, type, listener, options);
  };

  // ==== 参照用 API ====
  window.__vismon = {
    getAll() {
      return store.slice();
    },
    getVisibilityChange() {
      return store.filter((e) => e.type === "visibilitychange");
    },
    getSuspectedGtag() {
      return store.filter((e) => e.type === "visibilitychange" && e.kind === "add" && e.suspect);
    },
    explain(rec) {
      if (!rec) return "";
      const reasons = [];
      if (rec.stackMatchesGA) reasons.push("stack に GA/gtm の URL");
      if (rec.currentScriptGA) reasons.push("currentScript が GA/gtm");
      if (rec.inGtagCall) reasons.push("gtag 呼出し中に登録");
      if (rec.nearGALoad) reasons.push(`GA リソース直後(${NEAR_LOAD_WINDOW_MS}ms 以内)`);
      return `score=${rec.heuristicScore} → ${reasons.join(" + ") || "根拠なし"}`;
    },
  };

  dlog("[__vismon] ready. 例: __vismon.getSuspectedGtag()");
})();
