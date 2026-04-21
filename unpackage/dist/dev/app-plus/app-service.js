if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  const ON_UNLOAD = "onUnload";
  const ON_PAGE_SCROLL = "onPageScroll";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onUnload = /* @__PURE__ */ createLifeCycleHook(
    ON_UNLOAD,
    2
    /* HookFlags.PAGE */
  );
  const onPageScroll = /* @__PURE__ */ createLifeCycleHook(
    ON_PAGE_SCROLL,
    2
    /* HookFlags.PAGE */
  );
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$k = {
    __name: "AppTabBar",
    props: {
      current: {
        type: String,
        required: true
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const items = [
        { path: "/pages/home/index", label: "首页" },
        { path: "/pages/destinations/index", label: "目的地" },
        { path: "/pages/guides/index", label: "攻略指南" },
        { path: "/pages/account/index", label: "我的" }
      ];
      function go(path) {
        if (props.current === path) {
          return;
        }
        uni.reLaunch({ url: path });
      }
      const __returned__ = { props, items, go };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tabbar-wrap" }, [
      vue.createElementVNode("view", { class: "tabbar card" }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.items, (item) => {
            return vue.createElementVNode("view", {
              key: item.path,
              class: vue.normalizeClass(["tab-item", { active: $props.current === item.path }]),
              onClick: ($event) => $setup.go(item.path)
            }, [
              vue.createElementVNode(
                "text",
                { class: "tab-label" },
                vue.toDisplayString(item.label),
                1
                /* TEXT */
              )
            ], 10, ["onClick"]);
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])
    ]);
  }
  const AppTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-8715b27c"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/AppTabBar.vue"]]);
  const API_ORIGIN = "https://yd.frp-arm.com:44637";
  const API_BASE_URL = `${API_ORIGIN}/api`;
  const LEGACY_API_ORIGINS = [
    "https://111.20.31.227:34144",
    "http://111.20.31.227:34144",
    "https://frp-arm.com:44637",
    "http://frp-arm.com:44637"
  ];
  const LEGACY_API_HOSTS = [
    "111.20.31.227:34144",
    "frp-arm.com:44637"
  ];
  function normalizeApiAssetUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) {
      return "";
    }
    if (/^https?:\/\//i.test(raw)) {
      const matched = LEGACY_API_ORIGINS.find((origin) => raw.startsWith(origin));
      return matched ? `${API_ORIGIN}${raw.slice(matched.length)}` : raw;
    }
    const matchedHost = LEGACY_API_HOSTS.find((host) => {
      return raw === host || raw.startsWith(`${host}/`) || raw.startsWith(`${host}?`);
    });
    if (matchedHost) {
      const suffix = raw.slice(matchedHost.length);
      return suffix.startsWith("/") || suffix.startsWith("?") ? `${API_ORIGIN}${suffix}` : `${API_ORIGIN}/${suffix}`;
    }
    if (raw.startsWith("/")) {
      return `${API_ORIGIN}${raw}`;
    }
    return `${API_ORIGIN}/${raw}`;
  }
  function hasApiBaseUrl() {
    return Boolean(API_BASE_URL && API_BASE_URL.trim());
  }
  function normalizeLegacyUrl(value) {
    const text = String(value || "");
    if (!text) {
      return "";
    }
    if (/^https?:\/\//i.test(text) || /^(111\.20\.31\.227:34144|frp-arm\.com:44637)(\/|\?|$)/i.test(text) || text.startsWith("/")) {
      return normalizeApiAssetUrl(text);
    }
    return text;
  }
  function normalizePayloadUrls(value) {
    if (Array.isArray(value)) {
      return value.map(normalizePayloadUrls);
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, normalizePayloadUrls(item)])
      );
    }
    if (typeof value === "string") {
      return normalizeLegacyUrl(value);
    }
    return value;
  }
  function parseResponseData(text) {
    const raw = String(text || "");
    if (!raw) {
      return {};
    }
    try {
      return normalizePayloadUrls(JSON.parse(raw));
    } catch (error) {
      return raw;
    }
  }
  function buildRequestBody(data, headers = {}) {
    if (data === void 0 || data === null) {
      return null;
    }
    const contentType = String(headers["Content-Type"] || headers["content-type"] || "").toLowerCase();
    if (contentType.includes("application/json") && typeof data !== "string") {
      return JSON.stringify(data);
    }
    return data;
  }
  function canUsePlusRequest(url) {
    return /^https:/i.test(String(url || "")) && typeof plus !== "undefined" && plus.net && typeof plus.net.XMLHttpRequest === "function";
  }
  function plusRequest({ url, method = "GET", data, headers = {}, timeout = 2e4 }) {
    return new Promise((resolve, reject) => {
      const xhr = new plus.net.XMLHttpRequest();
      xhr.timeout = timeout;
      xhr.open(method, url);
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          xhr.setRequestHeader(key, value);
        }
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }
        formatAppLog("log", "at common/app-http.js:83", "[app-http] plus response", {
          url,
          method,
          statusCode: Number(xhr.status || 0)
        });
        resolve({
          statusCode: Number(xhr.status || 0),
          data: parseResponseData(xhr.responseText)
        });
      };
      xhr.onerror = () => {
        formatAppLog("error", "at common/app-http.js:96", "[app-http] plus fail", { url, method, readyState: xhr.readyState, status: xhr.status });
        reject(new Error("网络请求失败"));
      };
      xhr.ontimeout = () => {
        formatAppLog("error", "at common/app-http.js:101", "[app-http] plus timeout", { url, method, timeout });
        reject(new Error("请求超时"));
      };
      xhr.send(buildRequestBody(data, headers));
    });
  }
  function uniRequest(options) {
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (res) => resolve({
          ...res,
          data: normalizePayloadUrls(res.data)
        }),
        fail: (error) => {
          formatAppLog("error", "at common/app-http.js:118", "[app-http] uni fail", {
            url: options == null ? void 0 : options.url,
            method: options == null ? void 0 : options.method,
            error,
            errMsg: error == null ? void 0 : error.errMsg
          });
          reject(error);
        }
      });
    });
  }
  function requestJson(options) {
    const method = String((options == null ? void 0 : options.method) || "GET").toUpperCase();
    const shouldUsePlusRequest = canUsePlusRequest(options == null ? void 0 : options.url) && ["GET", "POST", "PUT", "DELETE"].includes(method);
    formatAppLog("log", "at common/app-http.js:133", "[app-http] request", {
      url: options == null ? void 0 : options.url,
      method,
      transport: shouldUsePlusRequest ? "plus.net.XMLHttpRequest" : "uni.request"
    });
    if (shouldUsePlusRequest) {
      return plusRequest(options);
    }
    return uniRequest(options);
  }
  function downloadRemoteFile(url) {
    return new Promise((resolve, reject) => {
      const normalizedUrl = normalizeLegacyUrl(url);
      if (/^https:/i.test(String(normalizedUrl || "")) && typeof plus !== "undefined" && plus.downloader && typeof plus.downloader.createDownload === "function") {
        const filename = `_doc/cache/image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const task = plus.downloader.createDownload(normalizedUrl, { filename }, (download2, status) => {
          if (status === 200 && download2.filename) {
            resolve({ statusCode: status, tempFilePath: download2.filename });
            return;
          }
          reject(new Error(`下载失败(${status || 0})`));
        });
        task.start();
        return;
      }
      uni.downloadFile({
        url: normalizedUrl,
        success: (res) => resolve(res),
        fail: (error) => reject(error)
      });
    });
  }
  const _sfc_main$j = {
    __name: "CachedImage",
    props: {
      src: {
        type: String,
        required: true
      },
      mode: {
        type: String,
        default: "aspectFill"
      },
      lazyLoad: {
        type: Boolean,
        default: true
      },
      containerClass: {
        type: String,
        default: ""
      },
      imageClass: {
        type: String,
        default: ""
      },
      fallbackToRemote: {
        type: Boolean,
        default: true
      }
    },
    emits: ["load", "error"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const props = __props;
      const loading = vue.ref(true);
      const currentSrc = vue.ref("");
      function canUseRemoteFallback() {
        const platform = uni.getSystemInfoSync().platform;
        return props.fallbackToRemote && (platform === "devtools" || platform === "web");
      }
      function canUseDirectRemote(url) {
        const raw = String(url || "");
        return canUseRemoteFallback() || props.fallbackToRemote && raw.startsWith(API_ORIGIN);
      }
      function toDisplayPath(filePath) {
        const raw = String(filePath || "").trim();
        if (!raw) {
          return "";
        }
        if (/^(https?:|file:|content:|blob:|data:)/i.test(raw)) {
          return raw;
        }
        if (raw.startsWith("/static/") || raw.startsWith("static/")) {
          return raw.startsWith("/") ? raw : `/${raw}`;
        }
        if (typeof plus !== "undefined" && plus.io && typeof plus.io.convertLocalFileSystemURL === "function") {
          const absolutePath = plus.io.convertLocalFileSystemURL(raw);
          if (absolutePath) {
            return absolutePath.startsWith("file://") ? absolutePath : `file://${absolutePath}`;
          }
        }
        return raw;
      }
      function storageKey(url) {
        return `cached-image:${encodeURIComponent(url)}`;
      }
      async function resolveImage(url) {
        if (!url) {
          currentSrc.value = "";
          loading.value = false;
          return;
        }
        loading.value = true;
        if (!/^https?:\/\//.test(url)) {
          currentSrc.value = toDisplayPath(url);
          loading.value = false;
          return;
        }
        const key = storageKey(url);
        const cachedPath = uni.getStorageSync(key);
        if (cachedPath) {
          currentSrc.value = toDisplayPath(cachedPath);
          loading.value = false;
          return;
        }
        if (canUseDirectRemote(url)) {
          currentSrc.value = url;
          loading.value = false;
          return;
        }
        currentSrc.value = "";
        try {
          const downloadRes = await downloadRemoteFile(url);
          if (downloadRes.statusCode !== 200 || !downloadRes.tempFilePath) {
            loading.value = false;
            return;
          }
          if (typeof plus !== "undefined" && downloadRes.tempFilePath.startsWith("_doc/")) {
            uni.setStorageSync(key, downloadRes.tempFilePath);
            currentSrc.value = toDisplayPath(downloadRes.tempFilePath);
            return;
          }
          const saveRes = await uni.saveFile({ tempFilePath: downloadRes.tempFilePath });
          if (saveRes.savedFilePath) {
            uni.setStorageSync(key, saveRes.savedFilePath);
            currentSrc.value = toDisplayPath(saveRes.savedFilePath);
            return;
          }
        } catch (error) {
          if (canUseDirectRemote(url)) {
            currentSrc.value = url;
          }
        } finally {
          loading.value = false;
        }
      }
      function handleLoad() {
        loading.value = false;
        emit("load", currentSrc.value || props.src);
      }
      function handleError() {
        loading.value = false;
        if (canUseDirectRemote(props.src)) {
          currentSrc.value = props.src;
          emit("error", props.src);
          return;
        }
        currentSrc.value = "";
        emit("error", props.src);
      }
      vue.watch(
        () => props.src,
        (value) => {
          resolveImage(value);
        },
        { immediate: true }
      );
      const __returned__ = { emit, props, loading, currentSrc, canUseRemoteFallback, canUseDirectRemote, toDisplayPath, storageKey, resolveImage, handleLoad, handleError, ref: vue.ref, watch: vue.watch, get downloadRemoteFile() {
        return downloadRemoteFile;
      }, get API_ORIGIN() {
        return API_ORIGIN;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["cached-image", $props.containerClass])
      },
      [
        $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "image-placeholder"
        }, [
          vue.createElementVNode("view", { class: "image-shimmer" })
        ])) : vue.createCommentVNode("v-if", true),
        vue.withDirectives(vue.createElementVNode("image", {
          class: vue.normalizeClass($props.imageClass),
          src: $setup.currentSrc,
          mode: $props.mode,
          "lazy-load": $props.lazyLoad,
          onLoad: $setup.handleLoad,
          onError: $setup.handleError
        }, null, 42, ["src", "mode", "lazy-load"]), [
          [vue.vShow, !$setup.loading]
        ])
      ],
      2
      /* CLASS */
    );
  }
  const CachedImage = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-7d2a8804"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/CachedImage.vue"]]);
  function normalizeDestinationImage(value) {
    const raw = String(value || "").trim();
    if (!raw) {
      return "";
    }
    if (raw.startsWith("/static/") || raw.startsWith("static/")) {
      return raw.startsWith("/") ? raw : `/${raw}`;
    }
    return normalizeApiAssetUrl(raw);
  }
  function createScenicSpot({
    id,
    name,
    navigationName,
    navigationAddress,
    location: location2,
    region,
    category,
    rating,
    longitude,
    latitude,
    description,
    image,
    weather,
    tips,
    suggestion,
    liveTitle,
    liveHint,
    liveKeyword
  }) {
    return {
      id,
      name,
      navigationName: navigationName || name,
      navigationAddress: navigationAddress || location2,
      location: location2,
      region: normalizeRegion(region),
      category,
      rating,
      coordinates: { longitude, latitude },
      description,
      image: normalizeDestinationImage(image),
      weather,
      tips,
      suggestion,
      liveTitle,
      liveHint,
      liveKeyword
    };
  }
  function normalizeRegion(region) {
    const regionMap = {
      "乌鲁木齐": "乌鲁木齐市",
      "乌鲁木齐周边": "乌鲁木齐市",
      "克拉玛依": "克拉玛依市",
      "吐鲁番": "吐鲁番市",
      "昌吉": "昌吉州",
      "博州": "博州",
      "巴州": "巴州",
      "阿克苏": "阿克苏地区",
      "喀什": "喀什地区",
      "和田": "和田地区",
      "伊犁": "伊犁州",
      "塔城": "塔城地区",
      "阿勒泰": "阿勒泰地区",
      "帕米尔高原": "喀什地区",
      "南疆环线": "巴州",
      "阿拉尔": "阿克苏地区"
    };
    return regionMap[region] || region;
  }
  const destinationList = [
    createScenicSpot({
      id: 1,
      name: "天山天池",
      navigationName: "天山天池风景区游客中心",
      navigationAddress: "新疆昌吉回族自治州阜康市天山天池风景名胜区游客中心",
      location: "新疆阜康",
      region: "乌鲁木齐周边",
      category: "湖泊雪山",
      rating: "4.8",
      longitude: 88.1506,
      latitude: 43.8789,
      description: "高山湖泊与雪岭森林相映成景，是新疆最经典的入门景区之一。",
      image: "/static/destinations/01.jpg",
      weather: { condition: "晴转多云", temperature: "18°C", humidity: "46%", wind: "3级山风" },
      tips: ["建议上午抵达，湖面颜色更通透", "山上温差明显，带外套更稳妥", "适合缆车加环湖步道组合游玩"],
      suggestion: "适合半日到一日游，兼顾家庭游客与首次来新疆的观光需求。",
      liveTitle: "天山天池景区直播",
      liveHint: "先看直播可判断湖面能见度、天气和游客密度。",
      liveKeyword: "天山天池 景区直播"
    }),
    createScenicSpot({
      id: 2,
      name: "喀纳斯景区",
      location: "新疆阿勒泰布尔津",
      region: "阿勒泰",
      category: "湖泊雪山",
      rating: "4.9",
      longitude: 87.0347,
      latitude: 48.713,
      description: "以湖色、雪山、林海与图瓦风情闻名，是北疆核心景区。",
      image: "/static/destinations/02.jpg",
      weather: { condition: "多云", temperature: "13°C", humidity: "58%", wind: "2级山谷风" },
      tips: ["旺季住宿紧张，尽量提前预订", "清晨和傍晚最适合拍照", "建议预留完整一天以上"],
      suggestion: "适合深度摄影和自然风光爱好者，秋季层林尽染尤为出片。",
      liveTitle: "喀纳斯湖景直播",
      liveHint: "直播适合确认云层、湖色和当日景区人流。",
      liveKeyword: "喀纳斯 景区直播"
    }),
    createScenicSpot({
      id: 3,
      name: "赛里木湖",
      location: "新疆博州博乐",
      region: "博州",
      category: "湖泊雪山",
      rating: "4.9",
      longitude: 81.2014,
      latitude: 44.6002,
      description: "被称为大西洋最后一滴眼泪，湖岸、雪山与草甸构成纯净风景。",
      image: "/static/destinations/03.jpg",
      weather: { condition: "晴", temperature: "16°C", humidity: "41%", wind: "4级湖风" },
      tips: ["环湖自驾体验最好", "湖边风大，注意保暖", "花期和日落都很值得停留"],
      suggestion: "适合自驾党和情侣游客，可与果子沟、霍城线路串联。",
      liveTitle: "赛里木湖风景直播",
      liveHint: "可通过直播先看湖色、天气和沿岸光线。",
      liveKeyword: "赛里木湖 直播"
    }),
    createScenicSpot({
      id: 4,
      name: "白沙湖景区",
      location: "新疆喀什塔县",
      region: "帕米尔高原",
      category: "湖泊雪山",
      rating: "4.8",
      longitude: 75.2436,
      latitude: 38.4412,
      description: "白沙山与蓝绿色湖水并置，画面干净而强烈，是帕米尔经典打卡点。",
      image: "/static/destinations/04.jpg",
      weather: { condition: "晴", temperature: "11°C", humidity: "32%", wind: "3级高原风" },
      tips: ["海拔较高，行动不要过急", "晴天湖色更惊艳", "与卡拉库里湖适合一天连游"],
      suggestion: "适合帕米尔公路旅行中的轻停留和高原风光拍摄。",
      liveTitle: "白沙湖实况直播",
      liveHint: "可用来观察高原天气与能见度变化。",
      liveKeyword: "白沙湖 直播"
    }),
    createScenicSpot({
      id: 5,
      name: "那拉提草原",
      navigationName: "那拉提旅游风景区",
      location: "新疆伊犁新源",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 83.0565,
      latitude: 43.4711,
      description: "空中草原层次起伏，适合看牧场、花海与雪岭线条。",
      image: "/static/destinations/05.jpg",
      weather: { condition: "晴间多云", temperature: "20°C", humidity: "44%", wind: "2级草原风" },
      tips: ["骑马和观景车都很受欢迎", "午后紫外线强，注意防晒", "适合慢慢逛，不建议赶行程"],
      suggestion: "适合亲子、情侣和想感受伊犁草原氛围的游客。",
      liveTitle: "那拉提草原直播",
      liveHint: "直播有助于判断草原天气、云层和草场状态。",
      liveKeyword: "那拉提草原 直播"
    }),
    createScenicSpot({
      id: 6,
      name: "喀拉峻草原",
      navigationName: "喀拉峻大草原",
      location: "新疆伊犁特克斯",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 82.6947,
      latitude: 43.2089,
      description: "人体草原、峡谷草甸与远山起伏交织，观景层次非常丰富。",
      image: "/static/destinations/06.jpg",
      weather: { condition: "多云", temperature: "19°C", humidity: "47%", wind: "3级山谷风" },
      tips: ["山路较多，尽量穿防滑鞋", "适合航拍和广角风景", "与特克斯八卦城可组合线路"],
      suggestion: "适合重景观路线，适合一天深度看草原和峡谷。",
      liveTitle: "喀拉峻草原直播",
      liveHint: "可通过直播先看草场颜色和天气。",
      liveKeyword: "喀拉峻草原 直播"
    }),
    createScenicSpot({
      id: 7,
      name: "巴音布鲁克景区",
      location: "新疆巴州和静",
      region: "巴州",
      category: "草原森林",
      rating: "4.7",
      longitude: 84.1472,
      latitude: 43.0339,
      description: "九曲十八弯与开阔草原相结合，是新疆看落日的招牌景区。",
      image: "/static/destinations/07.jpg",
      weather: { condition: "晴", temperature: "17°C", humidity: "50%", wind: "3级草甸风" },
      tips: ["最佳时段在傍晚", "观景台风大，注意保暖", "旺季排队时间较长要预留余量"],
      suggestion: "适合落日摄影和草原线游玩，建议和独库沿线一起安排。",
      liveTitle: "巴音布鲁克直播",
      liveHint: "适合提前看当日云层和日落条件。",
      liveKeyword: "巴音布鲁克 直播"
    }),
    createScenicSpot({
      id: 8,
      name: "禾木景区",
      navigationName: "禾木风景区",
      location: "新疆阿勒泰布尔津",
      region: "阿勒泰",
      category: "草原森林",
      rating: "4.9",
      longitude: 86.9962,
      latitude: 48.5485,
      description: "木屋村落、白桦林与晨雾构成了北疆最受欢迎的童话式风景。",
      image: "/static/destinations/08.jpg",
      weather: { condition: "多云", temperature: "10°C", humidity: "61%", wind: "2级林间风" },
      tips: ["清晨观景台值得早起", "秋季景色最好但人也最多", "夜晚温度低，注意保暖"],
      suggestion: "适合慢节奏住一晚，体验晨雾、木屋和白桦林。",
      liveTitle: "禾木村景直播",
      liveHint: "直播可以判断晨雾和当天游客量。",
      liveKeyword: "禾木村 直播"
    }),
    createScenicSpot({
      id: 9,
      name: "喀什古城",
      location: "新疆喀什",
      region: "喀什",
      category: "古城人文",
      rating: "4.9",
      longitude: 75.9897,
      latitude: 39.4704,
      description: "街巷、土墙与市井生活交织，是体验南疆烟火气的代表景区。",
      image: "/static/destinations/09.jpg",
      weather: { condition: "晴", temperature: "24°C", humidity: "29%", wind: "2级微风" },
      tips: ["傍晚逛老城最有氛围", "建议穿舒适鞋，步行较多", "适合和夜市、美食线路搭配"],
      suggestion: "适合城市漫游、人文拍摄和夜游体验。",
      liveTitle: "喀什古城街景直播",
      liveHint: "可用来观察当下人流和夜景氛围。",
      liveKeyword: "喀什古城 直播"
    }),
    createScenicSpot({
      id: 10,
      name: "交河故城",
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "古城人文",
      rating: "4.6",
      longitude: 89.1446,
      latitude: 42.9512,
      description: "世界上保存较完整的生土建筑古城之一，遗址感非常强。",
      image: "/static/destinations/10.jpg",
      weather: { condition: "晴热", temperature: "31°C", humidity: "16%", wind: "2级热风" },
      tips: ["白天非常晒，尽量避开正午", "适合配讲解更容易看懂", "和火焰山、坎儿井可连线"],
      suggestion: "适合对丝路历史和遗址建筑感兴趣的游客。",
      liveTitle: "交河故城直播",
      liveHint: "可先看现场日照和游客密度。",
      liveKeyword: "交河故城 直播"
    }),
    createScenicSpot({
      id: 11,
      name: "坎儿井民俗园",
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "古城人文",
      rating: "4.5",
      longitude: 89.1906,
      latitude: 42.9511,
      description: "集中展示坎儿井灌溉智慧，是理解吐鲁番绿洲文明的重要一站。",
      image: "/static/destinations/11.jpg",
      weather: { condition: "晴", temperature: "30°C", humidity: "19%", wind: "2级微风" },
      tips: ["可和葡萄沟同天安排", "适合带孩子了解工程智慧", "景区讲解内容值得听一段"],
      suggestion: "适合半日人文线路中的知识型体验。",
      liveTitle: "坎儿井景区直播",
      liveHint: "适合先看景区热度与当日开放情况。",
      liveKeyword: "坎儿井 直播"
    }),
    createScenicSpot({
      id: 12,
      name: "库车王府",
      navigationName: "库车王府景区",
      location: "新疆阿克苏库车",
      region: "阿克苏",
      category: "古城人文",
      rating: "4.4",
      longitude: 82.9631,
      latitude: 41.7174,
      description: "兼具历史府邸与民族风情展示，适合了解库车老城文化。",
      image: "/static/destinations/12.jpg",
      weather: { condition: "晴", temperature: "27°C", humidity: "25%", wind: "2级微风" },
      tips: ["适合配库车老城一起逛", "中午偏晒，尽量上午去", "可顺带体验南疆美食"],
      suggestion: "适合城市文化轻游和历史打卡。",
      liveTitle: "库车王府直播",
      liveHint: "可先看场内活动和游客情况。",
      liveKeyword: "库车王府 直播"
    }),
    createScenicSpot({
      id: 13,
      name: "库木塔格沙漠",
      location: "新疆鄯善",
      region: "吐鲁番",
      category: "沙漠峡谷",
      rating: "4.7",
      longitude: 90.2315,
      latitude: 42.8602,
      description: "城市与沙漠相连的独特景观，适合体验沙海与落日。",
      image: "/static/destinations/13.jpg",
      weather: { condition: "晴热", temperature: "32°C", humidity: "14%", wind: "3级偏东风" },
      tips: ["注意补水防晒", "傍晚比白天舒服很多", "可体验滑沙与骑骆驼项目"],
      suggestion: "适合轻沙漠体验和亲子玩乐，不必走得太深入。",
      liveTitle: "库木塔格沙漠直播",
      liveHint: "适合先看风沙和落日状态。",
      liveKeyword: "库木塔格沙漠 直播"
    }),
    createScenicSpot({
      id: 14,
      name: "天山神秘大峡谷",
      location: "新疆阿克苏库车",
      region: "阿克苏",
      category: "沙漠峡谷",
      rating: "4.8",
      longitude: 83.6959,
      latitude: 41.7725,
      description: "红色峡谷线条凌厉，光影变化强烈，是南疆最有震撼感的峡谷之一。",
      image: "/static/destinations/14.jpg",
      weather: { condition: "晴", temperature: "28°C", humidity: "23%", wind: "2级山口风" },
      tips: ["尽量穿防滑鞋", "下雨天留意临时关闭信息", "适合广角和竖构图拍摄"],
      suggestion: "适合喜欢地貌和大片感风景的游客。",
      liveTitle: "神秘大峡谷直播",
      liveHint: "可提前观察天气和光照条件。",
      liveKeyword: "天山神秘大峡谷 直播"
    }),
    createScenicSpot({
      id: 15,
      name: "乌尔禾魔鬼城",
      location: "新疆克拉玛依",
      region: "克拉玛依",
      category: "沙漠峡谷",
      rating: "4.6",
      longitude: 85.7634,
      latitude: 46.0879,
      description: "雅丹地貌广阔奇诡，日落时分色调尤为震撼。",
      image: "/static/destinations/15.jpg",
      weather: { condition: "晴", temperature: "25°C", humidity: "20%", wind: "4级风" },
      tips: ["傍晚观光车体验最佳", "风沙较大注意护目", "适合电影感照片"],
      suggestion: "适合与北疆环线搭配，突出地貌体验。",
      liveTitle: "魔鬼城实况直播",
      liveHint: "直播有助于判断天空和光线层次。",
      liveKeyword: "魔鬼城 直播"
    }),
    createScenicSpot({
      id: 16,
      name: "塔克拉玛干沙漠",
      location: "新疆塔里木盆地",
      region: "南疆环线",
      category: "沙漠峡谷",
      rating: "4.7",
      longitude: 83.6177,
      latitude: 39.0128,
      description: "广袤沙海与穿沙公路组成极具西域张力的探险风景。",
      image: "/static/destinations/16.jpg",
      weather: { condition: "晴热", temperature: "29°C", humidity: "18%", wind: "4级偏东风" },
      tips: ["补水与遮阳必须到位", "尽量跟正规线路或车队", "日出日落最有氛围"],
      suggestion: "适合越野、自驾和重度风景体验者。",
      liveTitle: "塔克拉玛干直播",
      liveHint: "可先看风沙和道路天气情况。",
      liveKeyword: "塔克拉玛干沙漠 直播"
    }),
    createScenicSpot({
      id: 17,
      name: "泽普金湖杨景区",
      location: "新疆喀什泽普",
      region: "喀什",
      category: "胡杨湿地",
      rating: "4.7",
      longitude: 77.2708,
      latitude: 38.1846,
      description: "胡杨、湿地和湖岸并存，秋季色彩层次很丰富。",
      image: "/static/destinations/17.jpg",
      weather: { condition: "晴", temperature: "22°C", humidity: "34%", wind: "2级微风" },
      tips: ["秋天是最佳季节", "适合轻松散步和慢拍", "建议安排半天即可"],
      suggestion: "适合秋季南疆线路中的轻休闲景区。",
      liveTitle: "金湖杨秋景直播",
      liveHint: "可先看胡杨色彩和天气状态。",
      liveKeyword: "泽普金湖杨 直播"
    }),
    createScenicSpot({
      id: 18,
      name: "轮台胡杨林公园",
      location: "新疆巴州轮台",
      region: "巴州",
      category: "胡杨湿地",
      rating: "4.8",
      longitude: 84.2556,
      latitude: 41.7812,
      description: "塔里木胡杨林规模大，秋色与河道湿地组合很有辨识度。",
      image: "/static/destinations/18.jpg",
      weather: { condition: "晴", temperature: "20°C", humidity: "31%", wind: "2级河谷风" },
      tips: ["秋季黄金期游客较多", "景区较大，适合观光车", "逆光和黄昏很适合拍照"],
      suggestion: "适合秋季专项摄影和胡杨主题旅行。",
      liveTitle: "轮台胡杨林直播",
      liveHint: "适合确认叶色、光线和当日客流。",
      liveKeyword: "轮台胡杨林 直播"
    }),
    createScenicSpot({
      id: 19,
      name: "博斯腾湖",
      location: "新疆巴州博湖",
      region: "巴州",
      category: "胡杨湿地",
      rating: "4.6",
      longitude: 86.8207,
      latitude: 41.8576,
      description: "湖区开阔，芦苇湿地和水上项目都比较成熟，是巴州休闲景区代表。",
      image: "/static/destinations/19.jpg",
      weather: { condition: "晴", temperature: "21°C", humidity: "45%", wind: "3级湖风" },
      tips: ["适合夏秋季前往", "可选择乘船项目", "注意湖边风力变化"],
      suggestion: "适合家庭休闲和亲水轻度游玩。",
      liveTitle: "博斯腾湖直播",
      liveHint: "可先看湖面风况和天气。",
      liveKeyword: "博斯腾湖 直播"
    }),
    createScenicSpot({
      id: 20,
      name: "可可托海景区",
      location: "新疆阿勒泰富蕴",
      region: "阿勒泰",
      category: "峡谷地貌",
      rating: "4.8",
      longitude: 89.8374,
      latitude: 46.9876,
      description: "峡谷、河谷、矿坑与白桦林组合独特，四季景观差异明显。",
      image: "/static/destinations/20.jpg",
      weather: { condition: "多云", temperature: "12°C", humidity: "56%", wind: "2级山风" },
      tips: ["景区纵深较大，穿舒适鞋", "秋色和溪流特别适合拍摄", "建议预留大半天"],
      suggestion: "适合自然控和摄影用户，值得慢逛。",
      liveTitle: "可可托海直播",
      liveHint: "直播可帮助判断山谷天气和客流。",
      liveKeyword: "可可托海 直播"
    }),
    createScenicSpot({
      id: 21,
      name: "江布拉克景区",
      location: "新疆昌吉奇台",
      region: "昌吉",
      category: "峡谷地貌",
      rating: "4.7",
      longitude: 89.6812,
      latitude: 43.9248,
      description: "麦田、山谷和林带线条优美，是天山北麓的高颜值景区。",
      image: "/static/destinations/21.jpg",
      weather: { condition: "晴", temperature: "19°C", humidity: "42%", wind: "2级山地风" },
      tips: ["夏季麦浪和秋色都值得看", "自驾体验更自由", "可拍公路与田野层次"],
      suggestion: "适合周末自驾和轻摄影路线。",
      liveTitle: "江布拉克实况直播",
      liveHint: "适合提前看天气和田野状态。",
      liveKeyword: "江布拉克 直播"
    }),
    createScenicSpot({
      id: 22,
      name: "帕米尔旅游区",
      location: "新疆喀什塔县",
      region: "帕米尔高原",
      category: "峡谷地貌",
      rating: "4.9",
      longitude: 75.2261,
      latitude: 37.7789,
      description: "雪峰、公路、高原湖泊与边境风光并存，是新疆极具辨识度的大景区。",
      image: "/static/destinations/22.jpg",
      weather: { condition: "晴", temperature: "9°C", humidity: "28%", wind: "3级高原风" },
      tips: ["注意高海拔适应", "证件带齐", "建议预留整天甚至两天"],
      suggestion: "适合公路旅行和高原风景重度爱好者。",
      liveTitle: "帕米尔旅游区直播",
      liveHint: "适合看能见度、天气与路况氛围。",
      liveKeyword: "帕米尔 直播"
    }),
    createScenicSpot({
      id: 23,
      name: "国际大巴扎",
      navigationName: "新疆国际大巴扎",
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "城市夜游",
      rating: "4.5",
      longitude: 87.6168,
      latitude: 43.7776,
      description: "香料、织物和手工艺品汇聚，是体验城市烟火气的热门地标。",
      image: "/static/destinations/23.jpg",
      weather: { condition: "晴", temperature: "26°C", humidity: "24%", wind: "2级微风" },
      tips: ["夜景灯光更出片", "可重点逛美食区和手工艺区", "高峰时段注意保管物品"],
      suggestion: "适合城市半日游，吃喝逛拍都比较集中。",
      liveTitle: "大巴扎实况直播",
      liveHint: "先看直播能快速判断夜市热度与营业状态。",
      liveKeyword: "乌鲁木齐大巴扎 直播"
    }),
    createScenicSpot({
      id: 24,
      name: "葡萄沟景区",
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "城市夜游",
      rating: "4.5",
      longitude: 89.1601,
      latitude: 42.9964,
      description: "葡萄长廊、绿洲庭院与民俗表演结合，是吐鲁番经典休闲景区。",
      image: "/static/destinations/24.jpg",
      weather: { condition: "晴热", temperature: "30°C", humidity: "18%", wind: "2级微风" },
      tips: ["适合下午和傍晚游玩", "可顺带体验葡萄采摘季", "适合带长辈和小孩"],
      suggestion: "适合轻松休闲路线，与火焰山、坎儿井串联很顺。",
      liveTitle: "葡萄沟景区直播",
      liveHint: "可先看园区绿荫状态和游客热度。",
      liveKeyword: "葡萄沟 直播"
    }),
    createScenicSpot({
      id: 25,
      name: "卡拉库里湖",
      location: "新疆喀什塔县",
      region: "帕米尔高原",
      category: "湖泊雪山",
      rating: "4.8",
      longitude: 75.0955,
      latitude: 38.4471,
      description: "湖面倒映慕士塔格峰，适合高原公路旅行中的经典停留。",
      image: "/static/destinations/25.png",
      weather: { condition: "晴", temperature: "8°C", humidity: "30%", wind: "3级高原风" },
      tips: ["高海拔地区注意节奏", "晴天倒影效果更好", "可与白沙湖顺路联游"],
      suggestion: "适合帕米尔线观景打卡和高原风景拍摄。",
      liveTitle: "卡拉库里湖直播",
      liveHint: "适合提前看天气、云层和雪山能见度。",
      liveKeyword: "卡拉库里湖 直播"
    }),
    createScenicSpot({
      id: 26,
      name: "慕士塔格冰川公园",
      location: "新疆喀什塔县",
      region: "帕米尔高原",
      category: "湖泊雪山",
      rating: "4.7",
      longitude: 75.1172,
      latitude: 38.2835,
      description: "雪峰、冰川与高原地貌并置，是帕米尔线上视觉冲击很强的景区。",
      image: "/static/destinations/26.gif",
      weather: { condition: "多云", temperature: "4°C", humidity: "36%", wind: "4级山风" },
      tips: ["注意保暖和防晒", "适合晴朗天气前往", "海拔较高量力而行"],
      suggestion: "适合想近距离看冰川和雪峰的高原旅行者。",
      liveTitle: "慕士塔格冰川直播",
      liveHint: "可先看云层厚度和现场雪线状态。",
      liveKeyword: "慕士塔格冰川 直播"
    }),
    createScenicSpot({
      id: 27,
      name: "昭苏湿地公园",
      location: "新疆伊犁昭苏",
      region: "伊犁",
      category: "草原森林",
      rating: "4.6",
      longitude: 81.1381,
      latitude: 43.1578,
      description: "湿地花海与草原开阔感并存，适合夏季看天马与花田。",
      image: "/static/destinations/27.png",
      weather: { condition: "晴", temperature: "18°C", humidity: "48%", wind: "2级草甸风" },
      tips: ["夏季花期更适合前往", "清晨光线更柔和", "可和天马浴河线路搭配"],
      suggestion: "适合轻松拍照和伊犁夏季花海体验。",
      liveTitle: "昭苏湿地直播",
      liveHint: "可先看花海状态和当天天气。",
      liveKeyword: "昭苏湿地 直播"
    }),
    createScenicSpot({
      id: 28,
      name: "夏塔景区",
      location: "新疆伊犁昭苏",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 80.6549,
      latitude: 42.8957,
      description: "雪山、草原与古道并存，是伊犁兼具徒步感和大景观的代表景区。",
      image: "/static/destinations/28.jpg",
      weather: { condition: "多云", temperature: "14°C", humidity: "53%", wind: "3级山口风" },
      tips: ["步道较长建议量力而行", "带防风外套", "适合晴天或多云天气前往"],
      suggestion: "适合喜欢雪山草原和轻徒步的游客。",
      liveTitle: "夏塔古道直播",
      liveHint: "直播可以先看天气和雪山显露情况。",
      liveKeyword: "夏塔景区 直播"
    }),
    createScenicSpot({
      id: 29,
      name: "特克斯八卦城",
      location: "新疆伊犁特克斯",
      region: "伊犁",
      category: "古城人文",
      rating: "4.5",
      longitude: 82.5006,
      latitude: 43.2176,
      description: "城市布局独特，适合感受伊犁县城生活和俯瞰式城市格局。",
      image: "/static/destinations/29.jpg",
      weather: { condition: "晴", temperature: "23°C", humidity: "37%", wind: "2级微风" },
      tips: ["适合傍晚逛夜市", "可搭配离街美食", "航拍视角更能体现特色"],
      suggestion: "适合城市轻游和伊犁县城文化体验。",
      liveTitle: "特克斯八卦城直播",
      liveHint: "可先看街区热度和夜间氛围。",
      liveKeyword: "特克斯八卦城 直播"
    }),
    createScenicSpot({
      id: 30,
      name: "高昌故城",
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "古城人文",
      rating: "4.6",
      longitude: 89.5261,
      latitude: 42.8589,
      description: "丝路古城遗址规模大，和交河故城一起构成吐鲁番人文主线。",
      image: "/static/destinations/30.jpg",
      weather: { condition: "晴热", temperature: "32°C", humidity: "15%", wind: "2级热风" },
      tips: ["建议早晚游览", "遗址面积大注意补水", "配讲解更容易看懂"],
      suggestion: "适合对西域历史和古城遗址感兴趣的游客。",
      liveTitle: "高昌故城直播",
      liveHint: "适合看日照强度和当日游客量。",
      liveKeyword: "高昌故城 直播"
    }),
    createScenicSpot({
      id: 31,
      name: "火焰山景区",
      navigationName: "吐鲁番火焰山景区",
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "沙漠峡谷",
      rating: "4.4",
      longitude: 89.4922,
      latitude: 42.9127,
      description: "红色山体与炽热感十足的地貌画面，是吐鲁番最具辨识度的地标之一。",
      image: "/static/destinations/31.jpg",
      weather: { condition: "晴热", temperature: "36°C", humidity: "10%", wind: "2级热风" },
      tips: ["尽量避开午后高温", "带足饮用水", "适合短时打卡不宜久留"],
      suggestion: "适合吐鲁番经典线路中的短停留型景区。",
      liveTitle: "火焰山实况直播",
      liveHint: "可先看现场热度和游客密度。",
      liveKeyword: "火焰山 直播"
    }),
    createScenicSpot({
      id: 32,
      name: "温宿大峡谷",
      location: "新疆阿克苏温宿",
      region: "阿克苏",
      category: "沙漠峡谷",
      rating: "4.7",
      longitude: 79.2216,
      latitude: 41.4889,
      description: "红层峡谷色彩浓烈，线条变化丰富，极具西部荒野感。",
      image: "/static/destinations/32.png",
      weather: { condition: "晴", temperature: "27°C", humidity: "21%", wind: "3级峡谷风" },
      tips: ["穿防滑鞋更方便", "晴天更能体现色彩层次", "适合广角拍摄"],
      suggestion: "适合地貌控和阿克苏自驾线路用户。",
      liveTitle: "温宿大峡谷直播",
      liveHint: "适合提前看天气、光影和开放状态。",
      liveKeyword: "温宿大峡谷 直播"
    }),
    createScenicSpot({
      id: 33,
      name: "罗布人村寨",
      location: "新疆巴州尉犁",
      region: "巴州",
      category: "胡杨湿地",
      rating: "4.5",
      longitude: 86.2676,
      latitude: 40.5972,
      description: "胡杨、塔里木河与沙漠民俗融合，兼具风景与文化体验。",
      image: "/static/destinations/33.jpg",
      weather: { condition: "晴", temperature: "24°C", humidity: "29%", wind: "2级河谷风" },
      tips: ["秋季胡杨更有看点", "适合拍水岸和胡杨倒影", "可体验民俗展示项目"],
      suggestion: "适合巴州线轻文化和秋景体验。",
      liveTitle: "罗布人村寨直播",
      liveHint: "适合提前看胡杨状态和当日天气。",
      liveKeyword: "罗布人村寨 直播"
    }),
    createScenicSpot({
      id: 34,
      name: "天鹅河景区",
      location: "新疆巴州库尔勒",
      region: "巴州",
      category: "胡杨湿地",
      rating: "4.4",
      longitude: 86.1709,
      latitude: 41.7259,
      description: "城市湿地与水系景观融为一体，适合夜景和休闲散步。",
      image: "/static/destinations/34.jpg",
      weather: { condition: "晴", temperature: "22°C", humidity: "40%", wind: "2级河风" },
      tips: ["傍晚最适合散步", "适合带孩子轻松走走", "夜景灯光更有氛围"],
      suggestion: "适合城市休闲和库尔勒夜游。",
      liveTitle: "天鹅河景区直播",
      liveHint: "可先看夜景灯光和现场热度。",
      liveKeyword: "天鹅河 直播"
    }),
    createScenicSpot({
      id: 35,
      name: "独库公路北段观景线",
      location: "新疆独山子",
      region: "克拉玛依",
      category: "峡谷地貌",
      rating: "4.9",
      longitude: 84.9187,
      latitude: 44.3281,
      description: "雪山、草原、峡谷和公路天际线不断切换，是新疆自驾必打卡路线。",
      image: "/static/destinations/35.jpg",
      weather: { condition: "多云", temperature: "15°C", humidity: "46%", wind: "3级山口风" },
      tips: ["关注通车时间", "天气变化快需备外套", "适合多停靠几处观景点"],
      suggestion: "适合自驾党和喜欢一路看多种地貌的人群。",
      liveTitle: "独库公路北段直播",
      liveHint: "可用于看天气、车流和山口云层。",
      liveKeyword: "独库公路 直播"
    }),
    createScenicSpot({
      id: 36,
      name: "安集海大峡谷",
      location: "新疆塔城沙湾",
      region: "塔城",
      category: "峡谷地貌",
      rating: "4.7",
      longitude: 85.4408,
      latitude: 44.1651,
      description: "彩色冲刷地貌层理分明，是近年很热门的航拍型景区。",
      image: "/static/destinations/36.png",
      weather: { condition: "晴", temperature: "21°C", humidity: "33%", wind: "3级峡谷风" },
      tips: ["注意安全边界不要靠边", "晴天色彩更浓烈", "适合广角和无人机拍摄"],
      suggestion: "适合短途自驾和重画面感拍摄。",
      liveTitle: "安集海大峡谷直播",
      liveHint: "可提前看天气和地貌观感。",
      liveKeyword: "安集海大峡谷 直播"
    }),
    createScenicSpot({
      id: 37,
      name: "乌孙古道入口景区",
      location: "新疆伊犁特克斯",
      region: "伊犁",
      category: "峡谷地貌",
      rating: "4.6",
      longitude: 82.0277,
      latitude: 42.9294,
      description: "峡谷、河谷与古道徒步氛围并存，适合户外向游客。",
      image: "/static/destinations/37.jpg",
      weather: { condition: "多云", temperature: "13°C", humidity: "54%", wind: "3级山谷风" },
      tips: ["建议跟有经验线路", "提前看天气", "穿徒步鞋更稳妥"],
      suggestion: "适合轻户外或想感受古道氛围的游客。",
      liveTitle: "乌孙古道直播",
      liveHint: "可先看云层和谷地天气。",
      liveKeyword: "乌孙古道 直播"
    }),
    createScenicSpot({
      id: 38,
      name: "新疆博物馆",
      navigationName: "新疆维吾尔自治区博物馆",
      navigationAddress: "新疆维吾尔自治区乌鲁木齐市沙依巴克区西北路581号",
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "古城人文",
      rating: "4.8",
      longitude: 87.58,
      latitude: 43.8221,
      description: "系统展示新疆历史、民族与丝路文明，是入疆后很适合第一站了解背景的地方。",
      image: "/static/destinations/38.jpg",
      weather: { condition: "晴", temperature: "25°C", humidity: "27%", wind: "2级微风" },
      tips: ["建议预约并错峰参观", "先看常设展更有效率", "适合亲子和知识型游客"],
      suggestion: "适合作为新疆旅行的背景铺垫站。",
      liveTitle: "新疆博物馆周边直播",
      liveHint: "可先看当日排队和客流情况。",
      liveKeyword: "新疆博物馆 直播"
    }),
    createScenicSpot({
      id: 39,
      name: "红山公园",
      navigationName: "乌鲁木齐红山公园",
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "城市夜游",
      rating: "4.4",
      longitude: 87.6162,
      latitude: 43.8031,
      description: "城市高点视野开阔，适合看乌鲁木齐日落和夜景轮廓。",
      image: "/static/destinations/39.jpg",
      weather: { condition: "晴", temperature: "24°C", humidity: "28%", wind: "2级晚风" },
      tips: ["傍晚更适合登高", "适合城市俯瞰照片", "安排1到2小时即可"],
      suggestion: "适合城市轻松游和夜景打卡。",
      liveTitle: "红山公园夜景直播",
      liveHint: "适合观察夕阳和城市灯光状态。",
      liveKeyword: "红山公园 直播"
    }),
    createScenicSpot({
      id: 40,
      name: "达坂城古镇",
      location: "新疆乌鲁木齐达坂城",
      region: "乌鲁木齐周边",
      category: "城市夜游",
      rating: "4.3",
      longitude: 88.3128,
      latitude: 43.3584,
      description: "风车、古镇街巷与边塞氛围并置，适合乌鲁木齐周边短途。",
      image: "/static/destinations/40.jpg",
      weather: { condition: "晴", temperature: "23°C", humidity: "22%", wind: "4级风" },
      tips: ["风力较强注意保暖", "适合周边半日游", "可顺带体验风车景观"],
      suggestion: "适合城市周边轻出行和边塞风情打卡。",
      liveTitle: "达坂城古镇直播",
      liveHint: "适合先看风力和古镇热度。",
      liveKeyword: "达坂城古镇 直播"
    }),
    createScenicSpot({
      id: 41,
      name: "果子沟大桥观景台",
      location: "新疆伊犁霍城",
      region: "伊犁",
      category: "峡谷地貌",
      rating: "4.8",
      longitude: 81.0562,
      latitude: 44.2298,
      description: "山谷、公路桥和森林牧坡同框，是伊犁入门级大片机位。",
      image: "/static/destinations/41.jpg",
      weather: { condition: "晴", temperature: "17°C", humidity: "43%", wind: "3级山谷风" },
      tips: ["上午逆光少更好拍", "观景点停车要注意安全", "适合搭配赛里木湖同日路线"],
      suggestion: "适合伊犁自驾途中短暂停留和拍全景。",
      liveTitle: "果子沟观景直播",
      liveHint: "适合先看云层和桥面能见度。",
      liveKeyword: "果子沟大桥 直播"
    }),
    createScenicSpot({
      id: 42,
      name: "霍城薰衣草庄园",
      location: "新疆伊犁霍城",
      region: "伊犁",
      category: "草原森林",
      rating: "4.5",
      longitude: 80.9331,
      latitude: 44.1096,
      description: "花田色块和远山同框，是伊犁夏季热门赏花景区。",
      image: "/static/destinations/42.jpg",
      weather: { condition: "晴", temperature: "22°C", humidity: "39%", wind: "2级微风" },
      tips: ["花期集中在夏季", "建议穿浅色衣服更出片", "傍晚光线更柔和"],
      suggestion: "适合夏季打卡和轻松拍照。",
      liveTitle: "霍城薰衣草直播",
      liveHint: "可先看花田开放状态和天气。",
      liveKeyword: "霍城薰衣草 直播"
    }),
    createScenicSpot({
      id: 43,
      name: "琼库什台",
      location: "新疆伊犁特克斯",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 82.9923,
      latitude: 42.9948,
      description: "原生态村落和起伏草坡保留着很强的边地自然气质。",
      image: "/static/destinations/43.png",
      weather: { condition: "多云", temperature: "13°C", humidity: "55%", wind: "2级山风" },
      tips: ["路况变化快，尽量白天进出", "住一晚更能感受氛围", "适合徒步和骑马"],
      suggestion: "适合慢旅行和想看原生态草原村落的游客。",
      liveTitle: "琼库什台直播",
      liveHint: "适合看天气和山间云雾状态。",
      liveKeyword: "琼库什台 直播"
    }),
    createScenicSpot({
      id: 44,
      name: "唐布拉草原",
      location: "新疆伊犁尼勒克",
      region: "伊犁",
      category: "草原森林",
      rating: "4.7",
      longitude: 83.3072,
      latitude: 43.5634,
      description: "百里画廊串联草场、雪山和溪谷，是伊犁另一条高颜值景观线。",
      image: "/static/destinations/44.jpg",
      weather: { condition: "晴", temperature: "18°C", humidity: "45%", wind: "3级谷风" },
      tips: ["适合自驾慢慢停靠", "夏季景色最稳定", "注意午后阵雨变化"],
      suggestion: "适合景观自驾和家庭用户。",
      liveTitle: "唐布拉直播",
      liveHint: "可先看草场天气和道路状态。",
      liveKeyword: "唐布拉草原 直播"
    }),
    createScenicSpot({
      id: 45,
      name: "乌伦古湖",
      location: "新疆阿勒泰福海",
      region: "阿勒泰",
      category: "湖泊雪山",
      rating: "4.5",
      longitude: 87.4942,
      latitude: 47.2211,
      description: "湖面宽阔，适合看日落、候鸟和安静湖岸风景。",
      image: "/static/destinations/45.jpg",
      weather: { condition: "晴", temperature: "15°C", humidity: "49%", wind: "3级湖风" },
      tips: ["傍晚适合看落日", "风大时注意保暖", "适合安静休闲型游客"],
      suggestion: "适合阿勒泰线中安静看湖的半日游。",
      liveTitle: "乌伦古湖直播",
      liveHint: "适合先看风况和落日云层。",
      liveKeyword: "乌伦古湖 直播"
    }),
    createScenicSpot({
      id: 46,
      name: "五彩滩",
      location: "新疆阿勒泰布尔津",
      region: "阿勒泰",
      category: "峡谷地貌",
      rating: "4.8",
      longitude: 86.7557,
      latitude: 48.1248,
      description: "额尔齐斯河岸边的彩色丘陵，在夕阳下层次感非常强。",
      image: "/static/destinations/46.jpg",
      weather: { condition: "晴", temperature: "14°C", humidity: "42%", wind: "3级河谷风" },
      tips: ["最佳时段在傍晚", "风大时注意帽子和外套", "适合拍河岸层理变化"],
      suggestion: "适合短时打卡和黄昏摄影。",
      liveTitle: "五彩滩直播",
      liveHint: "可先看夕阳和云层条件。",
      liveKeyword: "五彩滩 直播"
    }),
    createScenicSpot({
      id: 47,
      name: "白哈巴村",
      location: "新疆阿勒泰哈巴河",
      region: "阿勒泰",
      category: "草原森林",
      rating: "4.8",
      longitude: 86.6174,
      latitude: 48.9067,
      description: "边境木屋村与林海山谷交织，氛围安静而原始。",
      image: "/static/destinations/47.jpg",
      weather: { condition: "多云", temperature: "9°C", humidity: "59%", wind: "2级林风" },
      tips: ["适合住一晚看晨景", "注意边境证件要求", "秋季色彩最丰富"],
      suggestion: "适合慢住和边境风情体验。",
      liveTitle: "白哈巴村直播",
      liveHint: "可先看晨雾、云层和村庄热度。",
      liveKeyword: "白哈巴村 直播"
    }),
    createScenicSpot({
      id: 48,
      name: "木垒胡杨林",
      location: "新疆昌吉木垒",
      region: "昌吉",
      category: "胡杨湿地",
      rating: "4.6",
      longitude: 90.2864,
      latitude: 44.0168,
      description: "胡杨林与荒原气质兼具，秋色层次分明。",
      image: "/static/destinations/48.jpg",
      weather: { condition: "晴", temperature: "17°C", humidity: "34%", wind: "2级微风" },
      tips: ["秋天最适合前往", "适合长焦和逆光拍摄", "尽量避开大风天"],
      suggestion: "适合秋季摄影和昌吉周边自驾。",
      liveTitle: "木垒胡杨林直播",
      liveHint: "适合先看叶色和天气状态。",
      liveKeyword: "木垒胡杨林 直播"
    }),
    createScenicSpot({
      id: 49,
      name: "天山大峡谷",
      location: "新疆乌鲁木齐县",
      region: "乌鲁木齐周边",
      category: "峡谷地貌",
      rating: "4.6",
      longitude: 87.6287,
      latitude: 43.3616,
      description: "峡谷、林地和山间水系兼具，是乌鲁木齐周边热门短途景区。",
      image: "/static/destinations/49.jpg",
      weather: { condition: "晴", temperature: "18°C", humidity: "41%", wind: "2级山风" },
      tips: ["适合周末当天往返", "带防晒和轻外套", "适合家庭轻徒步"],
      suggestion: "适合乌鲁木齐近郊休闲和山地短线出游。",
      liveTitle: "天山大峡谷直播",
      liveHint: "可先看天气和道路情况。",
      liveKeyword: "天山大峡谷 直播"
    }),
    createScenicSpot({
      id: 50,
      name: "南山牧场",
      location: "新疆乌鲁木齐县",
      region: "乌鲁木齐周边",
      category: "草原森林",
      rating: "4.5",
      longitude: 87.3598,
      latitude: 43.4756,
      description: "草坡、松林和山野度假氛围浓厚，是乌鲁木齐人的经典周末景区。",
      image: "/static/destinations/50.jpg",
      weather: { condition: "多云", temperature: "16°C", humidity: "46%", wind: "2级山地风" },
      tips: ["适合露营和短住", "早晚温差明显", "周末人流较多"],
      suggestion: "适合近郊休闲和家庭轻出游。",
      liveTitle: "南山牧场直播",
      liveHint: "可先看草场天气和周末热度。",
      liveKeyword: "南山牧场 直播"
    }),
    createScenicSpot({
      id: 51,
      name: "博格达峰观景区",
      location: "新疆阜康",
      region: "乌鲁木齐周边",
      category: "湖泊雪山",
      rating: "4.6",
      longitude: 88.1035,
      latitude: 43.9064,
      description: "雪峰轮廓清晰，适合和天池线路联动看天山山体结构。",
      image: "/static/destinations/51.jpg",
      weather: { condition: "晴", temperature: "12°C", humidity: "38%", wind: "3级山风" },
      tips: ["晴天视野更好", "清晨更容易见到主峰轮廓", "适合长焦拍雪山"],
      suggestion: "适合雪山观景和天池周边补充游。",
      liveTitle: "博格达峰观景直播",
      liveHint: "适合确认能见度和云层变化。",
      liveKeyword: "博格达峰 直播"
    }),
    createScenicSpot({
      id: 52,
      name: "木特塔尔沙漠公园",
      location: "新疆和田洛浦",
      region: "和田",
      category: "沙漠峡谷",
      rating: "4.4",
      longitude: 80.0912,
      latitude: 37.1008,
      description: "和田一带的沙漠体验点，适合感受南疆边缘沙海风景。",
      image: "/static/destinations/52.jpg",
      weather: { condition: "晴热", temperature: "31°C", humidity: "12%", wind: "3级偏东风" },
      tips: ["注意高温和补水", "适合日落时段体验", "建议跟景区项目走"],
      suggestion: "适合和田线路中的轻沙漠项目体验。",
      liveTitle: "和田沙漠公园直播",
      liveHint: "可先看风沙和日落状态。",
      liveKeyword: "和田沙漠 直播"
    }),
    createScenicSpot({
      id: 53,
      name: "尼雅遗址展示区",
      location: "新疆和田民丰",
      region: "和田",
      category: "古城人文",
      rating: "4.3",
      longitude: 82.7208,
      latitude: 37.0914,
      description: "承载精绝古国历史想象，是南疆深线很有辨识度的人文点。",
      image: "/static/destinations/53.jpg",
      weather: { condition: "晴", temperature: "28°C", humidity: "18%", wind: "2级热风" },
      tips: ["适合对西域历史感兴趣的人", "路线较远需预留时间", "建议提前了解背景故事"],
      suggestion: "适合深度南疆历史线用户。",
      liveTitle: "尼雅遗址周边直播",
      liveHint: "适合先看天气和现场开放状态。",
      liveKeyword: "尼雅遗址 直播"
    }),
    createScenicSpot({
      id: 54,
      name: "和田团城",
      location: "新疆和田市",
      region: "和田",
      category: "城市夜游",
      rating: "4.4",
      longitude: 79.9228,
      latitude: 37.1143,
      description: "老街更新后更适合漫游，能体验南疆城市日常生活与夜色。",
      image: "/static/destinations/54.jpg",
      weather: { condition: "晴", temperature: "26°C", humidity: "24%", wind: "2级微风" },
      tips: ["晚上更有氛围", "适合边走边吃", "适合轻松逛街拍照"],
      suggestion: "适合和田市区半日游和夜游。",
      liveTitle: "和田团城直播",
      liveHint: "可先看街区热度和夜景状态。",
      liveKeyword: "和田团城 直播"
    }),
    createScenicSpot({
      id: 55,
      name: "博乐河谷湿地",
      location: "新疆博州博乐",
      region: "博州",
      category: "胡杨湿地",
      rating: "4.4",
      longitude: 82.0593,
      latitude: 44.9049,
      description: "河谷湿地与城市边缘景观结合，适合轻松看水岸和候鸟。",
      image: "/static/destinations/55.jpg",
      weather: { condition: "晴", temperature: "19°C", humidity: "47%", wind: "2级河风" },
      tips: ["清晨适合看鸟和拍倒影", "适合亲子散步", "安排1到2小时即可"],
      suggestion: "适合作为赛里木湖周边补充休闲点。",
      liveTitle: "博乐河谷湿地直播",
      liveHint: "适合先看水面风况和天气。",
      liveKeyword: "博乐湿地 直播"
    }),
    createScenicSpot({
      id: 56,
      name: "精河木特塔尔胡杨林",
      location: "新疆博州精河",
      region: "博州",
      category: "胡杨湿地",
      rating: "4.5",
      longitude: 82.8861,
      latitude: 44.6784,
      description: "秋季胡杨黄叶和河岸线条结合，适合博州秋季自驾。",
      image: "/static/destinations/56.jpg",
      weather: { condition: "晴", temperature: "17°C", humidity: "35%", wind: "2级微风" },
      tips: ["秋色最适合打卡", "适合逆光拍摄", "尽量选择晴天"],
      suggestion: "适合秋季胡杨轻摄影和短途自驾。",
      liveTitle: "精河胡杨林直播",
      liveHint: "可先看叶色和天气。",
      liveKeyword: "精河胡杨林 直播"
    }),
    createScenicSpot({
      id: 57,
      name: "克孜尔石窟",
      location: "新疆阿克苏拜城",
      region: "阿克苏",
      category: "古城人文",
      rating: "4.7",
      longitude: 82.9588,
      latitude: 41.7816,
      description: "中国早期佛教石窟代表之一，适合深入了解龟兹文化。",
      image: "/static/destinations/57.jpg",
      weather: { condition: "晴", temperature: "25°C", humidity: "24%", wind: "2级微风" },
      tips: ["建议配讲解参观", "部分洞窟开放有限", "适合和库车人文线串联"],
      suggestion: "适合历史、壁画和佛教艺术爱好者。",
      liveTitle: "克孜尔石窟周边直播",
      liveHint: "可先看当日开放和客流情况。",
      liveKeyword: "克孜尔石窟 直播"
    }),
    createScenicSpot({
      id: 58,
      name: "托木尔大峡谷",
      location: "新疆阿克苏温宿",
      region: "阿克苏",
      category: "沙漠峡谷",
      rating: "4.7",
      longitude: 79.1863,
      latitude: 41.4546,
      description: "红色岩层与大峡谷地貌冲击强烈，是温宿线路代表性景区。",
      image: "/static/destinations/58.png",
      weather: { condition: "晴", temperature: "28°C", humidity: "19%", wind: "3级峡谷风" },
      tips: ["适合晴天前往", "穿防滑鞋更稳妥", "注意景区开放时段"],
      suggestion: "适合阿克苏地貌型自驾路线。",
      liveTitle: "托木尔大峡谷直播",
      liveHint: "适合先看光影和天气。",
      liveKeyword: "托木尔大峡谷 直播"
    }),
    createScenicSpot({
      id: 59,
      name: "塔里木胡杨林公园",
      location: "新疆阿拉尔",
      region: "阿拉尔",
      category: "胡杨湿地",
      rating: "4.6",
      longitude: 81.3386,
      latitude: 40.5609,
      description: "胡杨林、河道和秋色相互映衬，是南疆秋季热门观景点。",
      image: "/static/destinations/59.jpg",
      weather: { condition: "晴", temperature: "20°C", humidity: "27%", wind: "2级河风" },
      tips: ["秋季最值得前往", "适合观景车+步行结合", "逆光更有层次"],
      suggestion: "适合秋景摄影和胡杨主题旅行。",
      liveTitle: "塔里木胡杨林直播",
      liveHint: "适合先看叶色和天气。",
      liveKeyword: "塔里木胡杨林 直播"
    }),
    createScenicSpot({
      id: 60,
      name: "塔河源景区",
      location: "新疆阿拉尔",
      region: "阿拉尔",
      category: "胡杨湿地",
      rating: "4.3",
      longitude: 81.2861,
      latitude: 40.5475,
      description: "河岸湿地与绿洲景观结合，适合城市周边休闲看水。",
      image: "/static/destinations/60.jpg",
      weather: { condition: "晴", temperature: "22°C", humidity: "33%", wind: "2级微风" },
      tips: ["适合傍晚散步", "适合亲子和老人", "安排半日即可"],
      suggestion: "适合阿拉尔城市休闲游。",
      liveTitle: "塔河源直播",
      liveHint: "可先看水面和当日天气。",
      liveKeyword: "塔河源 直播"
    }),
    createScenicSpot({
      id: 61,
      name: "白杨沟景区",
      location: "新疆昌吉呼图壁",
      region: "昌吉",
      category: "峡谷地貌",
      rating: "4.4",
      longitude: 86.7185,
      latitude: 43.7778,
      description: "山谷林地和溪流环境比较清爽，是昌吉近郊热门短线景区。",
      image: "/static/destinations/61.jpg",
      weather: { condition: "多云", temperature: "17°C", humidity: "44%", wind: "2级山风" },
      tips: ["适合周末当天往返", "穿运动鞋更舒服", "适合夏季避暑"],
      suggestion: "适合近郊轻徒步和家庭休闲。",
      liveTitle: "白杨沟景区直播",
      liveHint: "适合先看山里天气。",
      liveKeyword: "白杨沟 直播"
    }),
    createScenicSpot({
      id: 62,
      name: "玛纳斯国家湿地公园",
      location: "新疆昌吉玛纳斯",
      region: "昌吉",
      category: "胡杨湿地",
      rating: "4.4",
      longitude: 86.1877,
      latitude: 44.3295,
      description: "湿地候鸟资源丰富，适合亲子自然观察和轻休闲散步。",
      image: "/static/destinations/62.jpg",
      weather: { condition: "晴", temperature: "19°C", humidity: "48%", wind: "2级微风" },
      tips: ["清晨适合观鸟", "适合带孩子认识湿地生态", "安排半日较合适"],
      suggestion: "适合昌吉方向的自然轻游。",
      liveTitle: "玛纳斯湿地直播",
      liveHint: "可先看天气和水面状况。",
      liveKeyword: "玛纳斯湿地 直播"
    }),
    createScenicSpot({
      id: 63,
      name: "平定准噶尔勒铭碑",
      location: "新疆伊犁昭苏",
      region: "伊犁",
      category: "古城人文",
      rating: "4.3",
      longitude: 80.4933,
      latitude: 42.9517,
      description: "位于昭苏格登山，是清乾隆时期为纪念平定准噶尔而立的重要纪功碑，也是新疆很有代表性的边疆历史碑刻遗存。",
      image: "/static/destinations/63.jpg",
      weather: { condition: "晴", temperature: "18°C", humidity: "36%", wind: "2级微风" },
      tips: ["更适合结合昭苏或夏塔线路顺路探访", "边境方向路程较远，建议提前确认道路和开放情况", "对清代新疆史、碑刻和边界史感兴趣会更有收获"],
      suggestion: "适合昭苏方向的人文补充游和新疆边疆史深度旅行。",
      liveTitle: "格登山碑周边实况",
      liveHint: "该点更偏历史遗存，建议出发前确认天气与路况。",
      liveKeyword: "格登碑 昭苏"
    }),
    createScenicSpot({
      id: 64,
      name: "吐峪沟石窟与麻扎村",
      location: "新疆吐鲁番鄯善",
      region: "吐鲁番",
      category: "古城人文",
      rating: "4.5",
      longitude: 89.4283,
      latitude: 42.8575,
      description: "兼具佛教石窟、古村聚落和峡谷绿洲气质，是吐鲁番较有历史层次感的小众人文点。",
      image: "/static/destinations/64.jpg",
      weather: { condition: "晴", temperature: "29°C", humidity: "18%", wind: "2级微风" },
      tips: ["适合搭配高昌故城或火焰山线路", "建议慢走看村落细节", "对宗教遗存和聚落史更有感觉的人会更喜欢"],
      suggestion: "适合吐鲁番深度人文半日游。",
      liveTitle: "吐峪沟周边实况",
      liveHint: "更适合看天气和现场通达情况。",
      liveKeyword: "吐峪沟 麻扎村"
    }),
    createScenicSpot({
      id: 65,
      name: "惠远古城钟鼓楼片区",
      location: "新疆伊犁霍城",
      region: "伊犁",
      category: "古城人文",
      rating: "4.4",
      longitude: 80.8784,
      latitude: 44.0352,
      description: "保留清代伊犁将军府城历史记忆，适合了解伊犁边疆治理与古城格局。",
      image: "/static/destinations/65.jpg",
      weather: { condition: "晴", temperature: "22°C", humidity: "35%", wind: "2级微风" },
      tips: ["适合与霍城薰衣草或伊犁河谷线路搭配", "建议配合历史背景一起看", "古城氛围偏安静，适合慢逛"],
      suggestion: "适合伊犁线中的小众清代边疆史打卡。",
      liveTitle: "惠远古城周边实况",
      liveHint: "适合先看天气与古城街区状态。",
      liveKeyword: "惠远古城 霍城"
    }),
    createScenicSpot({
      id: 66,
      name: "靖远寺",
      location: "新疆伊犁霍城惠远镇",
      region: "伊犁",
      category: "古城人文",
      rating: "4.4",
      longitude: 80.8851,
      latitude: 44.0341,
      description: "伊犁地区颇具代表性的藏传佛教寺院遗存之一，适合串联惠远古城一线看边疆宗教文化。",
      image: "/static/destinations/66.jpg",
      weather: { condition: "晴", temperature: "21°C", humidity: "37%", wind: "2级微风" },
      tips: ["适合和惠远古城一起安排", "保持安静更适合参观寺院空间", "对清代伊犁历史感兴趣会更有收获"],
      suggestion: "适合边疆宗教文化与清代伊犁史主题游。",
      liveTitle: "靖远寺周边实况",
      liveHint: "建议先看天气与现场开放状态。",
      liveKeyword: "靖远寺 惠远"
    }),
    createScenicSpot({
      id: 67,
      name: "阿克苏文庙",
      location: "新疆阿克苏市",
      region: "阿克苏",
      category: "古城人文",
      rating: "4.3",
      longitude: 80.2639,
      latitude: 41.1714,
      description: "阿克苏市区内较少被旅行者专门停留的历史遗存，适合补充看南疆城市里的传统礼制建筑线索。",
      image: "/static/destinations/67.jpg",
      weather: { condition: "晴", temperature: "27°C", humidity: "22%", wind: "2级微风" },
      tips: ["适合与库车或阿克苏市区人文点一起安排", "更适合历史向游客", "停留时间不用太长但适合细看"],
      suggestion: "适合南疆城市历史脉络补充型打卡。",
      liveTitle: "阿克苏文庙周边实况",
      liveHint: "出发前建议确认开放情况。",
      liveKeyword: "阿克苏文庙"
    })
  ];
  ["全部", ...new Set(destinationList.map((item) => item.category))];
  const regionOrder = [
    "乌鲁木齐市",
    "克拉玛依市",
    "吐鲁番市",
    "昌吉州",
    "博州",
    "巴州",
    "阿克苏地区",
    "喀什地区",
    "和田地区",
    "伊犁州",
    "塔城地区",
    "阿勒泰地区"
  ];
  ["全部", ...regionOrder.filter((item) => destinationList.some((spot) => spot.region === item))];
  const destinationCultureMap = {
    1: {
      overview: "天山天池位于博格达峰北麓，是新疆最具代表性的高山湖泊景区之一，湖水、雪峰、云杉林和山地步道共同构成了经典的天山风光。",
      history: "天池古称“瑶池”，在中国传统神话里常被附会为西王母宴游之地。清代以来，这里逐渐被纳入新疆山岳湖泊名胜体系，后来成为近现代新疆旅游开发最早的一批核心景区。",
      highlights: "适合把神话意象、雪山湖泊和家庭轻观光放在同一条线路里理解，也是很多游客认识新疆山地景观的第一站。"
    },
    2: {
      overview: "喀纳斯景区位于阿勒泰深山林区，以高山湖泊、针叶林、河谷、图瓦村落和四季分明的色彩变化著称，是北疆自然景观的代表。",
      history: "喀纳斯长期是阿尔泰山游牧、狩猎与山地交通活动的区域，周边图瓦人聚落保留了独特生活方式。近几十年随着生态旅游发展，喀纳斯逐渐从边远山地目的地成长为全国知名的自然风景区。",
      highlights: "它不只是看一片湖，更重要的是湖区、村落、白桦林和山地文化共同构成的完整北疆风景系统。"
    },
    3: {
      overview: "赛里木湖位于新疆西部高原盆地边缘，湖面开阔，周边雪山、草场和天光变化明显，是伊犁与博州一线极具代表性的湖泊景观。",
      history: "赛里木湖常被称作“大西洋最后一滴眼泪”，这一名称来自它所处的西风影响地带和高原湖泊意象。历史上这里也是西天山交通与草场活动的重要区域，近现代逐步发展为新疆经典环湖自驾目的地。",
      highlights: "比起单点打卡，赛里木湖更适合从“环湖”视角去体验，历史上的通道感和今天的公路旅行体验在这里连接得很自然。"
    },
    4: {
      overview: "白沙湖景区位于帕米尔高原公路沿线，白沙山、湖水、雪峰背景和高海拔通道景观共同形成了极具辨识度的画面。",
      history: "白沙湖所在区域长期是喀喇昆仑与帕米尔交通线的重要路段，历史上的商旅、使节和边地往来都曾经过这一带。今天游客熟悉的“白沙山白沙湖”景观，本质上是高原风沙堆积与山地湖泊共同作用形成的自然地貌。",
      highlights: "这里最值得理解的是“路上的风景”意义，它不仅是一个湖，更是帕米尔公路旅行情绪和节奏的重要开场。"
    },
    5: {
      overview: "那拉提草原位于伊犁河谷东部山地，是新疆最有名的高山草原景区之一，牧场、雪岭、河谷和空中草原层次丰富。",
      history: "那拉提一带自古就是游牧活动区域，哈萨克牧民的转场传统和草原生活方式深深影响了这里的景观气质。近现代随着伊犁草原旅游的发展，那拉提逐渐成为新疆草原意象最典型的代表之一。",
      highlights: "相比只看一片草地，那拉提更适合从“游牧草原文化”和“天山立体牧场景观”两个角度去体会。"
    },
    7: {
      overview: "巴音布鲁克景区位于天山腹地高寒草原区，以开阔草场、湿地河曲和九曲十八弯落日景观闻名。",
      history: "巴音布鲁克在蒙古语中常被解释为“丰富的泉水”，其形成与高山盆地水系和草原湿地环境密切相关。这里长期是重要牧场区域，后来随着独库公路和草原旅游线路成熟，成为新疆草原与落日摄影的标志性目的地。",
      highlights: "它的魅力不只在一个观景台，而在“高山草原+湿地水系+傍晚光线”共同构成的辽阔感。"
    },
    8: {
      overview: "禾木景区以木屋村落、白桦林、河谷晨雾和山地草坡闻名，是阿勒泰地区最具童话感的目的地之一。",
      history: "禾木一带与图瓦人聚居历史相关，村落格局、木屋样式和生活方式保留了明显的山地聚落特色。随着北疆生态旅游和摄影旅行兴起，禾木逐渐从边远村落变成全国知名的秋季风景地。",
      highlights: "这里最值得看的其实是“村落与自然的关系”，晨雾、木屋和白桦林一起才构成完整的禾木气质。"
    },
    9: {
      overview: "喀什古城是南疆最具辨识度的人文景区之一，街巷肌理、土建筑风貌、巴扎生活和多民族交流氛围共同构成了古城魅力。",
      history: "喀什自古就是丝绸之路上的重镇，连接中亚、南亚与西域腹地。古城片区长期承担商贸、手工业与居民生活功能，因此它的历史价值不仅在建筑本身，也在持续延续的城市生活传统。",
      highlights: "这里适合把“老城街巷”“手工艺”“夜市”和“丝路商贸记忆”放在一起看，会比单纯拍照更有意思。"
    },
    10: {
      overview: "交河故城位于吐鲁番盆地，是中国现存保存较完整的大型生土古城遗址之一，城址布局和残存街巷仍能看出古代都市结构。",
      history: "交河故城始建较早，曾是古代车师前国的重要都城，后又成为高昌地区的重要军事与交通节点。因为地处丝绸之路干线附近，它在西域政权更替、商旅往来和佛教传播过程中都占有重要位置。",
      highlights: "相比一般古迹，交河故城最值得看的是遗址本身保存下来的空间秩序，能直观感受到古代西域城市的规模和组织方式。"
    },
    11: {
      overview: "坎儿井民俗园集中展示了吐鲁番绿洲灌溉智慧，是理解当地为何能在火洲环境中形成农业文明的重要窗口。",
      history: "坎儿井系统是新疆绿洲社会极具代表性的地下引水工程，依靠暗渠、竖井和地势落差把山前潜流引入耕地与聚落。它凝结了长期因地制宜的水利经验，也支撑了吐鲁番历史上的农业、聚落和商旅补给。",
      highlights: "看坎儿井时最好把它当成“工程文明遗产”来看，而不只是一个景点，它解释了吐鲁番很多历史现象的基础。"
    },
    12: {
      overview: "库车王府是阿克苏库车地区很有代表性的历史建筑景点，兼具地方政权记忆、居住空间和民俗展示功能。",
      history: "库车古称龟兹，是西域历史文化重镇。今天游客看到的王府与晚近时期地方行政和王公家族活动相关，也承接了库车作为南疆交通节点和文化汇聚地的城市历史。",
      highlights: "如果和库车老城、克孜尔石窟一起看，会更容易理解龟兹文化从宗教艺术到城市生活的连续性。"
    },
    13: {
      overview: "库木塔格沙漠位于鄯善城区边缘，是少见的“城市紧贴沙漠”景观，黄沙、绿洲和城镇边界关系非常鲜明。",
      history: "库木塔格名字本身就带有典型的西域地理色彩，这片沙漠与吐鲁番盆地东缘的风沙堆积环境紧密相关。它所在区域历史上既受丝路交通影响，也长期体现着绿洲与沙海对峙的生存格局。",
      highlights: "这里最特别的不是沙漠本身有多极端，而是城市、绿洲和沙丘几乎无缝衔接的反差感。"
    },
    14: {
      overview: "天山神秘大峡谷是库车地区最著名的红层峡谷景观之一，峡壁高耸、色彩浓烈、通道曲折，视觉冲击很强。",
      history: "峡谷形成于长期风化与流水切割作用，所展现的红色岩层也和库车一带复杂的地质构造有关。它所在区域与古龟兹文化圈距离不远，因此常被放进“库车自然地貌+丝路人文”组合线路里一起体验。",
      highlights: "适合把它理解成南疆地貌代表作之一，和库车的人文古迹形成很强反差。"
    },
    15: {
      overview: "乌尔禾魔鬼城是准噶尔盆地西北缘著名雅丹地貌区，风蚀残丘广布，形态奇诡，特别适合看日落和荒野感画面。",
      history: "“魔鬼城”的名字来自强风穿过雅丹地貌时产生的呼啸声，也反映了人们对这种荒凉奇观的早期直观感受。近现代随着影视作品传播和公路旅行兴起，这里逐渐成为新疆地貌景观的代表名片。",
      highlights: "如果想理解“西部荒原感”为什么这么有冲击力，乌尔禾魔鬼城是很好的实景教材。"
    },
    16: {
      overview: "塔克拉玛干沙漠是塔里木盆地核心区域的超级沙海景观，沙丘尺度巨大、地表起伏延绵，是新疆荒漠意象最强烈的地方之一。",
      history: "塔克拉玛干长期存在于丝路南北道的地理叙事中，古代绿洲城市和商旅通道大多绕沙漠边缘分布。它不只是自然景观，也深刻影响了南疆聚落、交通和文明布局。",
      highlights: "看塔克拉玛干时，最值得感受的是“沙海如何定义绿洲文明边界”。"
    },
    17: {
      overview: "泽普金湖杨景区以胡杨、湿地、水岸和秋色层次见长，是喀什地区较受欢迎的秋季轻休闲景区。",
      history: "金湖杨所展现的是叶尔羌河流域典型的绿洲边缘生态景观，胡杨林与河岸水系共同塑造了南疆秋色记忆。它也反映了南疆很多地区“河流决定景观”的生态规律。",
      highlights: "如果想看南疆更柔和、适合慢走的秋景，这里是很好的代表。"
    },
    18: {
      overview: "轮台胡杨林公园是塔里木河流域重要的胡杨观赏地之一，秋季金黄树冠与河道湿地共同构成很强的视觉记忆。",
      history: "轮台一带长期处于塔里木河生态带影响之下，胡杨林因此成为当地最有代表性的自然符号之一。随着秋季摄影旅游兴起，这里逐渐成为新疆胡杨主题线路中的核心节点。",
      highlights: "这里最适合从“河流生态带”角度理解胡杨，而不只是把它当一片黄叶林。"
    },
    19: {
      overview: "博斯腾湖是新疆重要的大型内陆淡水湖之一，湖面开阔、芦苇湿地丰富，同时兼具休闲旅游和亲水体验属性。",
      history: "博斯腾湖与焉耆盆地水系和绿洲农业关系密切，历史上不仅影响区域生态，也影响周边聚落发展与渔业活动。近现代旅游开发后，它逐渐成为巴州较成熟的湖泊休闲景区。",
      highlights: "相比高山湖泊的壮阔，它更偏向“绿洲湖区生活感”和家庭休闲属性。"
    },
    20: {
      overview: "可可托海景区融合了峡谷河流、白桦林、花岗岩山体和矿业遗址，是阿勒泰地区兼具自然与工业记忆的独特景区。",
      history: "可可托海不仅有自然景观，也承载着新中国矿业开发的重要历史记忆，尤其与稀有金属矿开采和工业建设有关。它因此常被认为是新疆少有的“风景与工业史并存”的目的地。",
      highlights: "这里适合同时看自然风景和矿业历史，气质会比单纯山水景区更厚重。"
    },
    21: {
      overview: "江布拉克景区位于天山北麓山地农业与草原过渡带，麦田、林带、山谷与远山轮廓共同构成很有层次的田园景观。",
      history: "江布拉克所在区域体现了新疆农牧交错地带的景观特征，山地农业、牧场和交通线长期共同塑造了这片区域的面貌。近年它因麦浪、公路和轻摄影氛围而被更多游客认识。",
      highlights: "这里适合看“田野与山地”如何叠加，而不是单纯当作一个草原景区。"
    },
    22: {
      overview: "帕米尔旅游区覆盖塔县及周边高原公路风景带，雪峰、湖泊、河谷、边境风情和高原村落共同构成了大尺度景观。",
      history: "帕米尔自古就是中亚与南疆之间的重要通道，历史上商旅、使节、驻防和边地交流都与这里密切相关。现代游客走的公路，在很大程度上也延续了这片高原“交通走廊”的历史属性。",
      highlights: "理解帕米尔最好的方式不是只盯一个点，而是把它看成一条有历史深度的高原风景线路。"
    },
    23: {
      overview: "国际大巴扎是乌鲁木齐极具标志性的城市地标，集市、餐饮、手工艺和建筑意象汇聚，适合快速感受城市烟火气。",
      history: "“巴扎”在新疆城市文化中长期意味着交易、社交和日常生活交汇的公共空间。国际大巴扎是在现代城市建设背景下形成的集中展示区，但其文化意义仍然延续了传统巴扎的商业与交流属性。",
      highlights: "它不是传统古迹，却是理解现代新疆城市商业文化和游客体验逻辑的重要场景。"
    },
    24: {
      overview: "葡萄沟景区以绿洲水系、葡萄种植和庭院民俗体验著称，是吐鲁番最经典的休闲类景区之一。",
      history: "吐鲁番盆地依靠坎儿井灌溉和绿洲农业形成了闻名的葡萄文化，葡萄沟正是这一农业文明最直观的展示区域。它既体现了自然条件的严酷，也体现了绿洲居民长期经营水土的能力。",
      highlights: "游葡萄沟时，如果能把葡萄、庭院和坎儿井水利联系起来看，会更能理解吐鲁番“火洲绿洲”的由来。"
    },
    25: {
      overview: "卡拉库里湖位于慕士塔格峰脚下，是帕米尔公路线上最经典的高原湖泊景观点之一。",
      history: "这片湖区长期属于帕米尔交通通道上的自然地标，雪峰、湖泊与牧场共同定义了高原旅行的视觉记忆。卡拉库里湖之所以广为人知，也和现代公路旅行让它更容易被看见有关。",
      highlights: "它最大的价值在于“雪峰倒影+高原公路”这个极具帕米尔辨识度的组合。"
    },
    26: {
      overview: "慕士塔格冰川公园以雪峰、冰川和高原山地景观为核心，是帕米尔线上最具高海拔视觉冲击的自然景区之一。",
      history: "慕士塔格峰长期是帕米尔高原地理认知中的重要坐标，其冰川与雪山景观也一直影响着周边公路旅行和高原探险叙事。现代景区开发使更多游客能够近距离接触这类高山冰川景观。",
      highlights: "如果想感受帕米尔的“高度感”和冰川尺度，这里比普通观景点更直接。"
    },
    27: {
      overview: "昭苏湿地公园把湿地、花海、草场与天马文化线路连接起来，是伊犁夏季比较轻盈的自然景观目的地。",
      history: "昭苏地区长期以草原和马文化著称，湿地景观则进一步丰富了当地夏季自然资源类型。它在现代旅游线路里常与油菜花、草原和天马活动一起出现。",
      highlights: "这里适合从“夏季昭苏风貌”整体去看，而不是只盯单一景观。"
    },
    28: {
      overview: "夏塔景区集合雪山、河谷、草原和古道遗迹，是伊犁兼具自然大景和历史通道意味的代表线路。",
      history: "夏塔古道在历史上是连接天山南北的重要通行路线之一，也因此带有明显的古道文化记忆。今天游客看到的步道和雪山风景，背后仍能感受到这条古交通线的历史痕迹。",
      highlights: "这里的独特之处在于“古道感”，风景之外还自带一种历史行旅氛围。"
    },
    29: {
      overview: "特克斯八卦城是伊犁州极具辨识度的县城地标，以放射状道路和城市格局闻名，适合看城市布局与县城生活。",
      history: "特克斯八卦城的规划常被与传统方位观念和八卦意象联系在一起，现代城市形态因此拥有鲜明记忆点。它既是功能性县城，也因为独特布局而成为新疆少见的“城市格局型景点”。",
      highlights: "这里最值得看的是整体布局概念，而不是单体建筑，俯瞰视角会比步行更能体现它的特色。"
    },
    30: {
      overview: "高昌故城是吐鲁番地区规模宏大的古城遗址，与交河故城一起构成新疆东天山南麓极重要的丝路历史板块。",
      history: "高昌在古代西域历史中占据重要位置，曾长期作为区域政治、商业和佛教文化中心之一。因为位于丝路要冲，高昌故城见证了多民族、多政权和多宗教在西域交汇发展的过程。",
      highlights: "如果想系统了解吐鲁番古城文明，高昌故城和交河故城最好放在一条人文线里一起看。"
    },
    31: {
      overview: "火焰山景区以连绵赤红山体和极端热感形象著称，是吐鲁番最广为人知的自然地标之一。",
      history: "火焰山在地理上属于典型的干热荒漠地貌景观，而在文化传播上又因《西游记》的经典叙事而拥有极高知名度。现实地貌与文学想象在这里叠加，使它成为新疆少见的“地理与文化双重符号”。",
      highlights: "它更适合被看作吐鲁番气候与文化意象的象征，而不只是一个短时打卡点。"
    },
    32: {
      overview: "温宿大峡谷以红层峡谷、断崖和层理地貌为特色，是阿克苏地区非常有代表性的地貌型景区。",
      history: "这片峡谷的景观形成与长期地质构造抬升、风化和流水切割密切相关，也因此成为新疆西部红层地貌的重要展示区。随着自驾旅游普及，它逐渐成为阿克苏地貌名片之一。",
      highlights: "如果喜欢“纯地貌张力”，温宿大峡谷是南疆非常典型的一站。"
    },
    33: {
      overview: "罗布人村寨把胡杨、塔里木河、沙漠与民俗展示结合在一起，是巴州兼具景观和文化气息的复合型景区。",
      history: "“罗布人”所承载的是塔里木河流域边缘居民的生活记忆，围绕河流、渔猎、胡杨和沙地环境形成了鲜明地方特征。景区化展示让游客更容易从一个点理解河流与人群的关系。",
      highlights: "这里的核心不是某一栋建筑，而是“水、林、沙、人”四者如何组合。"
    },
    34: {
      overview: "天鹅河景区是库尔勒城市水系和湿地景观的代表，适合看城市滨水生活和夜景氛围。",
      history: "库尔勒城市发展与水系治理长期相关，天鹅河景区则体现了现代城市与水环境共建后的景观成果。它更多代表当代城市休闲文化，而不是传统古迹型景区。",
      highlights: "这类景区的价值在“城市生活感”，很适合补充南疆大景之外的日常面向。"
    },
    35: {
      overview: "独库公路北段观景线串联雪山、草场、峡谷和高山公路，是新疆公路旅行最经典的风景线路之一。",
      history: "独库公路具有鲜明的现代交通建设历史意义，它极大缩短了南北疆之间的通行距离，也因此在新疆地理认知中拥有特殊地位。如今它既是一条交通通道，也是一条带有时代记忆的风景公路。",
      highlights: "独库的价值在“路”本身，沿途不断切换的地貌和交通工程意义共同构成它的魅力。"
    },
    38: {
      overview: "新疆博物馆是了解新疆历史、民族文化和丝绸之路文明最系统的公共文化场馆之一。",
      history: "博物馆通过考古文物、历史文献和专题展览，呈现了新疆从古代西域到近现代的发展脉络。很多游客把它作为入疆第一站，正是因为它能为后续看古城、石窟、草原和绿洲提供背景框架。",
      highlights: "如果行程里有人文内容，新疆博物馆很适合作为“先补课再出发”的总入口。"
    },
    39: {
      overview: "红山公园是乌鲁木齐城市中心极具代表性的地标型公园，高点视野和城市轮廓观赏价值很突出。",
      history: "红山在乌鲁木齐城市记忆中占据重要位置，不仅是地貌标志，也长期参与城市公共生活和地方形象构建。很多本地人对乌鲁木齐的认知，都离不开红山这一象征性空间。",
      highlights: "它最适合从“城市地标”而非传统景区角度理解。"
    },
    40: {
      overview: "达坂城古镇把边塞意象、风车景观和周边通道文化结合起来，是乌鲁木齐周边较有辨识度的短途目的地。",
      history: "达坂城长期与交通关口、边地通道和歌谣文化联系在一起，在新疆流行文化叙事中也有较高辨识度。今天的古镇体验虽然偏旅游化，但仍延续了这一地区的边塞印象。",
      highlights: "这里更像一个“新疆边塞印象窗口”，适合短时间感受地域氛围。"
    },
    41: {
      overview: "果子沟大桥观景台位于伊犁交通咽喉地带，桥梁工程、山谷地形与森林牧坡同框，是很典型的现代新疆公路景观。",
      history: "果子沟自古就是伊犁交通要道之一，历史上商旅和军政往来都要经过这条山口通道。现代大桥的建成则让这条古老通道拥有了新的工程地标意义。",
      highlights: "这里最有意思的是“古通道+现代桥梁”的叠加感，很适合放在伊犁自驾叙事里理解。"
    },
    42: {
      overview: "霍城薰衣草庄园以花田景观和伊犁河谷夏季色彩闻名，是近年来很受欢迎的轻摄影型景区。",
      history: "霍城所处的伊犁河谷气候条件适合薰衣草种植，这种经济作物后来逐渐转化为当地重要的观光资源。它体现的是现代农业与旅游结合后形成的新景观。",
      highlights: "它虽然没有深厚古代历史，但很能代表今天伊犁夏季旅游的轻盈一面。"
    },
    43: {
      overview: "琼库什台是伊犁地区保存较好的一类原生态山地村落，草坡、木屋、河谷和牧道共同构成很强的边地感。",
      history: "琼库什台长期与山地牧业和转场生活相关，村落形态也体现了高山草原居住环境的特点。近年随着徒步和慢旅行兴起，它从相对冷门的山村逐渐成为伊犁深度游的重要节点。",
      highlights: "它的吸引力在“慢”，住下来感受村落、草原和道路关系，会比快进快出更值得。"
    },
    45: {
      overview: "乌伦古湖是阿勒泰地区重要的湖泊景观之一，湖岸开阔、风力明显，适合安静看水面与落日变化。",
      history: "乌伦古湖与阿勒泰北部水系和区域生态环境联系紧密，在当地渔业与湖区生活中也具有长期意义。相比热门景区，它保留了更强的地方性与安静感。",
      highlights: "这里适合不赶景点、想看更松弛湖景的人。"
    },
    46: {
      overview: "五彩滩位于额尔齐斯河岸，是阿勒泰地区极具代表性的彩色丘陵与河岸复合景观。",
      history: "五彩滩的地貌层理来自长期风蚀、水蚀与沉积作用，河流与岸坡共同塑造了今天极具层次感的地表。它在近现代旅游传播中逐渐成为北疆“黄昏地貌摄影”代表点。",
      highlights: "这里最关键的是时间，傍晚的低角度光线几乎决定了五彩滩的表现力。"
    },
    47: {
      overview: "白哈巴村是阿勒泰边境线附近极具代表性的木屋村落之一，森林、山谷和边境气息让它有很强的静谧感。",
      history: "白哈巴与图瓦人聚落和边境山地生活方式相关，村庄的木屋、道路和生活节奏都带有明显边地特色。因为地理位置特殊，它也在新疆旅游地图上始终具有独特存在感。",
      highlights: "相比禾木，它更安静、更边境，也更适合住下来体会村落气质。"
    },
    48: {
      overview: "木垒胡杨林以秋季胡杨色彩和荒原背景为特色，是昌吉方向颇有辨识度的胡杨观赏地。",
      history: "木垒地区处在山前与荒漠过渡地带，胡杨林景观因此兼具苍劲和空旷感。它体现了新疆东部较为典型的干旱区树木景观特征。",
      highlights: "如果喜欢更粗粝、更安静的秋色，木垒胡杨林会很对味。"
    },
    49: {
      overview: "天山大峡谷是乌鲁木齐近郊很成熟的山地峡谷景区，林地、溪流、山谷和轻徒步线路结合得比较完整。",
      history: "它所在区域属于天山北坡山地休闲带的一部分，长期承担乌鲁木齐周边市民短途出游功能。虽然不是古迹型景点，但很能代表现代城市近郊休闲旅游的发展。",
      highlights: "适合把它当作“乌鲁木齐周边山地日常生活景观”来看。"
    },
    50: {
      overview: "南山牧场是乌鲁木齐人熟悉的近郊草原度假区域，草坡、松林和山地营地氛围很浓。",
      history: "南山一带长期与牧场、避暑和近郊度假活动联系在一起，也是乌鲁木齐城市外扩后最早形成大众周末休闲认知的区域之一。它在本地生活里有很强的日常性。",
      highlights: "比起远途大景，南山牧场更像乌鲁木齐城市生活的“后花园”。"
    },
    51: {
      overview: "博格达峰观景区适合从更直接的角度观察东天山主峰轮廓和山体结构，是天池周边重要的补充观景点。",
      history: "博格达峰在新疆山岳意象中一直具有很强代表性，也是天山天池神话和现实地理叙事的重要背景。围绕它形成的观景线路，让游客更容易把雪峰和湖泊放在同一套天山认知里。",
      highlights: "如果想把“天山”看得更具体，博格达峰是非常关键的视觉锚点。"
    },
    52: {
      overview: "木特塔尔沙漠公园是和田方向较容易接近的沙漠体验点，适合感受南疆边缘沙海与日落氛围。",
      history: "和田绿洲与沙漠长期相伴，沙海边缘景观本身就构成了当地生活与文化的背景。类似木特塔尔这样的景区，某种程度上让游客以更轻松方式接触这种绿洲边缘生态。",
      highlights: "它适合做和田线路里的“第一层沙漠体验”。"
    },
    53: {
      overview: "尼雅遗址展示区与精绝古国历史想象紧密相连，是和田深线极具辨识度的人文目的地。",
      history: "尼雅遗址所在区域与古代丝路南道绿洲文明关系密切，相关考古发现让人们重新认识了塔克拉玛干南缘古代聚落与商旅网络。它因此在西域考古与精绝文化讨论中占有特殊位置。",
      highlights: "这里适合带着“古国消失在沙海边缘”的想象去看，会更能体会它的人文重量。"
    },
    54: {
      overview: "和田团城是和田市区很有生活感的老街片区，适合看南疆城市街巷、夜色与日常烟火气。",
      history: "团城承接了和田老城区的生活空间记忆，街巷尺度和城市肌理里仍能感受到地方居住传统。经过更新之后，它也成为展示和田城市形象的重要窗口。",
      highlights: "这里最适合边走边看，把它当“南疆城市日常样本”会更有意思。"
    },
    55: {
      overview: "博乐河谷湿地是博州城市边缘较轻松的自然休闲点，水岸、湿地和候鸟元素让整体氛围更平和。",
      history: "这类河谷湿地景观与博州地区水系治理和城市边缘生态恢复关系紧密，更多体现的是现代生态空间建设。它为赛里木湖等大景观之外提供了更日常的自然体验。",
      highlights: "适合作为长线行程里的节奏放缓点。"
    },
    56: {
      overview: "精河木特塔尔胡杨林是博州方向较受欢迎的秋色景点，胡杨、河岸和金色叶片共同构成秋季短途自驾亮点。",
      history: "胡杨林的存在依赖干旱区河流生态带，这也让它成为理解新疆西部绿洲边缘景观的一个切口。随着秋景旅游流行，这里逐渐被纳入更多博州自驾线路。",
      highlights: "它更适合轻摄影和短线自驾，氛围安静、不算重景区。"
    },
    57: {
      overview: "克孜尔石窟是中国早期佛教石窟艺术的重要代表之一，也是理解龟兹文化的关键遗址。",
      history: "石窟开凿年代较早，曾是古代龟兹地区佛教传播和壁画艺术发展的重要中心。它在中西文化交流史上意义很大，因为许多艺术风格和题材都体现了丝绸之路文化交汇的特征。",
      highlights: "如果对新疆人文感兴趣，克孜尔石窟几乎是必须看的节点，它能把“龟兹”从地名变成具体可感的文化现场。"
    },
    58: {
      overview: "托木尔大峡谷是阿克苏地区红层峡谷的重要代表，地貌尺度大、层次丰富，画面感极强。",
      history: "它与温宿大峡谷一样，都是新疆西南部复杂地质与长期侵蚀作用的结果。作为景区名称中的“托木尔”，也让它与天山南麓更广阔的山地地理联系起来。",
      highlights: "如果偏爱“大开大合”的地貌风景，托木尔大峡谷非常直接。"
    },
    59: {
      overview: "塔里木胡杨林公园以大面积胡杨、河道和秋季色彩著称，是南疆胡杨主题旅行中的热门景区。",
      history: "胡杨林与塔里木河水系关系密切，它们共同构成了南疆绿洲边缘极具代表性的生态景观。人们之所以对胡杨有强烈情感，也与其在干旱环境中顽强生长、长期进入西域文学和影像表达有关。",
      highlights: "这里适合从生态和审美两个角度看：一面是生境系统，一面是秋色与树形带来的强烈视觉记忆。"
    },
    60: {
      overview: "塔河源景区以河岸湿地与绿洲环境为主，适合阿拉尔方向的城市周边休闲和慢节奏看水。",
      history: "名称里的“塔河”本身就提示了与塔里木河流域生态空间的联系。它更多体现的是现代城市周边生态景观的营造，而非传统古迹型历史。",
      highlights: "这种景区的价值在放松和补充体验，适合长线旅行中的轻量停留。"
    },
    61: {
      overview: "白杨沟景区是昌吉近郊较受欢迎的山谷溪流型景区，适合夏季短途避暑和轻徒步。",
      history: "白杨沟所在区域长期属于天山北坡近郊山地休闲带的一部分，随着城市周边旅游发展，它逐渐成为本地周末出游的经典选择。它更偏生活性景区，而非重历史景区。",
      highlights: "适合把它当作“近郊山谷呼吸站”，不用带太强的打卡心态。"
    },
    62: {
      overview: "玛纳斯国家湿地公园以湿地、水鸟和开阔生态环境为主，是昌吉方向兼具自然观察与家庭休闲属性的景区。",
      history: "湿地公园代表的是现代生态保护与科普展示理念，体现了当地在水域、生境和鸟类资源保护上的持续投入。它的“历史”更多来自生态治理与保护实践，而不是古代遗址脉络。",
      highlights: "很适合亲子和轻科普旅行，尤其适合作为节奏缓一点的自然观察点。"
    },
    63: {
      overview: "平定准噶尔勒铭碑位于昭苏县格登山，是清代纪念平定准噶尔战事的重要御碑，也是新疆边疆历史遗存中辨识度很高的一类碑刻文物。",
      history: "这座碑全称“平定准噶尔勒铭格登山之碑”，与清乾隆时期的格登山之战和后续新疆边疆秩序重建密切相关。它不仅是纪功碑，也在晚清边界交涉中被当作格登山属于中国的重要历史证据。",
      highlights: "它更适合当作“历史现场”去看，重点不是建筑规模，而是碑文、立碑背景以及它在新疆边疆史中的象征意义。"
    },
    64: {
      overview: "吐峪沟石窟与麻扎村兼具石窟遗存、古村风貌与峡谷绿洲环境，是吐鲁番很有层次感的小众人文点。",
      history: "吐峪沟一带与佛教传播、古代聚落发展和后来的伊斯兰文化空间都有联系，形成了很特别的多阶段文化叠加。这里既能看到早期宗教遗存，也能感受到村落生活延续下来的历史肌理。",
      highlights: "它最大的魅力是“一个地方能看到多种文化时间层”，非常适合慢慢逛。"
    },
    65: {
      overview: "惠远古城钟鼓楼片区是伊犁清代军政城池体系的重要记忆点，适合看古城格局和边疆治理历史。",
      history: "惠远古城与清代伊犁将军驻防体系关系密切，是当时新疆西部军政管理的重要节点之一。今天虽然古城整体形态已非原貌，但钟鼓楼片区仍能帮助游客建立对清代伊犁边疆城市的直观想象。",
      highlights: "适合把伊犁从“风景伊犁”扩展到“边疆历史伊犁”的理解层面。"
    },
    66: {
      overview: "靖远寺是伊犁地区较有代表性的清代寺院空间遗存之一，建筑与场域气质都偏安静克制。",
      history: "它与清代伊犁地区多民族、多宗教并存的边疆社会结构相关，也从侧面反映了当时的军政与宗教空间关系。和惠远古城放在一起看，会更容易理解伊犁的复合历史面貌。",
      highlights: "这类点位不靠热闹取胜，而是靠“历史空间感”和安静氛围。"
    },
    67: {
      overview: "阿克苏文庙是南疆城市中较少被游客主动纳入路线的礼制建筑遗存，适合补充城市历史层次。",
      history: "文庙作为传统儒学祭祀与教化空间，反映了不同时期中原礼制文化在新疆地方城市中的落地方式。它的意义更多在城市文化史和制度传播，而非单纯建筑规模。",
      highlights: "如果你想在南疆旅行里看到更少见的“城市制度史线索”，文庙是很合适的一站。"
    }
  };
  const destinationTravelMetaMap = {
    1: { season: "5月-10月", stay: "半天-1天", audience: "家庭游客、首次来新疆游客、轻观光用户" },
    2: { season: "6月-10月，秋季最佳", stay: "1天-2天", audience: "摄影爱好者、自然风光游客、深度旅行用户" },
    3: { season: "5月-10月", stay: "半天-1天", audience: "自驾游客、情侣、湖景摄影用户" },
    5: { season: "6月-9月", stay: "1天", audience: "亲子、情侣、草原体验用户" },
    8: { season: "6月-10月，秋季最佳", stay: "1天-2天", audience: "慢旅行用户、摄影爱好者、住宿体验游客" },
    9: { season: "4月-10月，夜游更佳", stay: "半天-1天", audience: "人文游客、城市漫游用户、美食爱好者" },
    10: { season: "4月-10月，避开正午", stay: "2小时-半天", audience: "历史爱好者、丝路文化游客、讲解型参观用户" },
    11: { season: "4月-10月", stay: "1小时-3小时", audience: "亲子、知识型游客、吐鲁番人文线用户" },
    15: { season: "5月-10月，傍晚最佳", stay: "2小时-半天", audience: "自驾游客、地貌摄影用户、电影感风景爱好者" },
    20: { season: "6月-10月，秋季最佳", stay: "半天-1天", audience: "自然控、摄影用户、工业历史感兴趣游客" },
    22: { season: "6月-9月", stay: "1天-2天", audience: "高原公路旅行用户、重度风景爱好者、边境线路游客" },
    23: { season: "全年可去，夜间更热闹", stay: "2小时-半天", audience: "城市游客、美食用户、伴手礼采购人群" },
    24: { season: "5月-9月", stay: "2小时-半天", audience: "家庭游客、长辈、轻松休闲用户" },
    30: { season: "4月-10月，早晚更舒适", stay: "半天", audience: "西域历史爱好者、遗址参观用户、深度人文游客" },
    35: { season: "6月-9月，以通车期为准", stay: "半天-1天", audience: "自驾党、公路旅行用户、多地貌体验游客" },
    38: { season: "全年可去", stay: "2小时-半天", audience: "亲子、历史文化游客、首次来新疆用户" },
    41: { season: "5月-10月", stay: "30分钟-2小时", audience: "自驾游客、风景摄影用户、伊犁环线游客" },
    53: { season: "4月-10月", stay: "半天", audience: "深度历史爱好者、西域考古兴趣用户、南疆长线游客" },
    57: { season: "4月-10月", stay: "半天", audience: "佛教艺术爱好者、历史用户、人文深度游客" },
    59: { season: "9月-11月，秋季最佳", stay: "半天-1天", audience: "秋景摄影用户、胡杨主题旅行者、自驾游客" },
    63: { season: "4月-10月", stay: "1小时-2小时", audience: "清代边疆史爱好者、碑刻研究兴趣用户、小众人文游客" },
    64: { season: "4月-10月", stay: "2小时-半天", audience: "宗教遗存爱好者、古村漫游用户、吐鲁番深度人文游客" },
    65: { season: "4月-10月", stay: "1小时-3小时", audience: "清代伊犁史爱好者、小众古城游客、安静慢逛用户" },
    66: { season: "4月-10月", stay: "1小时-2小时", audience: "边疆宗教文化爱好者、人文深度游客、惠远线顺路游客" },
    67: { season: "4月-10月", stay: "1小时左右", audience: "南疆城市史爱好者、文庙建筑兴趣用户、小众打卡游客" }
  };
  const destinationVisitMetaMap = {
    1: { ticket: "旺季约 95-155 元", openHours: "通常 08:30-19:00" },
    2: { ticket: "旺季约 160-230 元", openHours: "通常 08:00-20:00" },
    3: { ticket: "旺季约 70-145 元", openHours: "通常 08:30-20:00" },
    5: { ticket: "旺季约 95-135 元", openHours: "通常 08:30-19:30" },
    8: { ticket: "旺季约 50-100 元", openHours: "通常 08:00-20:00" },
    9: { ticket: "古城主街区多为免费，部分体验单收费", openHours: "全天开放，夜游更热闹" },
    10: { ticket: "约 70-120 元", openHours: "通常 09:00-19:00" },
    11: { ticket: "约 40-80 元", openHours: "通常 09:00-19:00" },
    15: { ticket: "约 45-80 元", openHours: "通常 09:00-20:00" },
    20: { ticket: "约 90-150 元", openHours: "通常 08:30-19:30" },
    22: { ticket: "按片区或联票浮动，约 80-200 元", openHours: "通常 09:00-20:00" },
    23: { ticket: "主街区免费，演出或项目另收费", openHours: "全天开放，商铺多在 10:00 后营业" },
    24: { ticket: "约 60-100 元", openHours: "通常 08:30-19:30" },
    30: { ticket: "约 70-120 元", openHours: "通常 09:00-19:00" },
    35: { ticket: "公路通行本身免费，个别观景点单独收费", openHours: "以当年通车时间和天气管制为准" },
    38: { ticket: "多为免费或预约制，特展可能单独收费", openHours: "通常 10:00-18:30，周一闭馆情况需确认" },
    41: { ticket: "多为免费观景，停车或平台项目可能收费", openHours: "全天可看，白天能见度更好" },
    53: { ticket: "约 30-80 元，视展示区开放而定", openHours: "通常 10:00-18:00" },
    57: { ticket: "约 55-120 元", openHours: "通常 10:00-18:30，部分洞窟限流开放" },
    59: { ticket: "旺季约 50-100 元", openHours: "通常 09:00-20:00" },
    63: { ticket: "多为免费或低门票参考，建议以现场公示为准", openHours: "多为白天可看，建议 10:00-18:00 之间前往" },
    64: { ticket: "门票多为低门槛参考，联动片区以现场为准", openHours: "通常建议白天参观，约 10:00-18:00" },
    65: { ticket: "多为免费或低门票参考", openHours: "通常白天开放，约 10:00-18:00" },
    66: { ticket: "多为免费或低门票参考", openHours: "通常白天开放，寺院空间以现场公告为准" },
    67: { ticket: "多为免费或低门票参考", openHours: "通常 10:00-18:00 左右，建议提前确认" }
  };
  const safetyMapCategoryDefaults = {
    "湖泊雪山": {
      zoom: 14,
      coverage: "核心湖岸、主观景台、游客中心一线",
      terrainRisk: "临水区域湿滑，山地风力和温差变化明显。",
      weatherRisk: "午后风大、低温和阵雨切换快。",
      signalRisk: "观景台外沿和山体背坡可能出现信号波动。",
      safeRoute: ["先到游客中心确认天气", "优先走主观景步道", "天色变差时沿原路折返"],
      servicePoints: ["游客中心问询台", "主入口集合区", "景区摆渡上车点"]
    },
    "草原森林": {
      zoom: 13,
      coverage: "主入口、栈道草场、摆渡车停靠点一线",
      terrainRisk: "草坡、木栈道和泥地在降雨后容易打滑。",
      weatherRisk: "山地草原天气突变快，午后易起风。",
      signalRisk: "林地深处和远离服务站区域信号偏弱。",
      safeRoute: ["先进主服务区补给", "优先走官方栈道和观景车路线", "避免独自进入偏远草坡"],
      servicePoints: ["游客服务站", "观景车停靠点", "临时避雨棚或休息点"]
    },
    "古城人文": {
      zoom: 15,
      coverage: "主街区、游客服务点、出口街口一线",
      terrainRisk: "巷道较密，夜间和高峰时段需注意人流。",
      weatherRisk: "夏季高温暴晒明显，夜游注意补水。",
      signalRisk: "整体信号较稳，但老街深巷定位可能偏移。",
      safeRoute: ["先记住主入口和出口", "按主街-支巷-主街顺序行走", "与同行人员约定集合点"],
      servicePoints: ["游客中心", "警务室或安保点", "主街出口集合点"]
    },
    "沙漠峡谷": {
      zoom: 13,
      coverage: "主入口、观景平台、返程通道一线",
      terrainRisk: "峡谷边缘、沙坡和碎石路段风险较高。",
      weatherRisk: "大风、高温和临时封闭风险较高。",
      signalRisk: "峡谷深处和沙丘后侧信号容易中断。",
      safeRoute: ["先确认封闭公告", "沿景区既定观景路线行走", "不要离开防护栏或越过警戒线"],
      servicePoints: ["主入口检票区", "观景平台集合点", "返程摆渡车停靠点"]
    },
    "胡杨湿地": {
      zoom: 14,
      coverage: "主栈道、水岸观景带、服务区一线",
      terrainRisk: "木栈道、湿地区域和临水边缘较滑。",
      weatherRisk: "秋季早晚温差大，风力会影响体感。",
      signalRisk: "湿地深处和林带边缘信号可能波动。",
      safeRoute: ["优先走木栈道主线", "不要进入封闭湿地区", "返程前确认集合时间"],
      servicePoints: ["游客中心", "观景木栈道入口", "临水警示点"]
    },
    "峡谷地貌": {
      zoom: 13,
      coverage: "景区入口、主观景台、返程道路一线",
      terrainRisk: "断崖、碎石坡和边缘区域要严格控距。",
      weatherRisk: "山区风雨和落石风险要实时关注公告。",
      signalRisk: "峡谷深处或山口区域信号不稳定。",
      safeRoute: ["先看主观景点再向外延展", "不要跨越护栏拍照", "天气转坏时直接回主入口"],
      servicePoints: ["主入口服务点", "观景台集合区", "景区返程道路口"]
    },
    "城市夜游": {
      zoom: 15,
      coverage: "主街区、停车点、夜游出口一线",
      terrainRisk: "夜间人流密集，注意随身物品和分流路线。",
      weatherRisk: "夏季夜游仍需补水，冬季注意路面结冰。",
      signalRisk: "整体信号稳定，地下停车区可能减弱。",
      safeRoute: ["先确认停车点或打车点", "夜游优先走主亮化街区", "离场高峰尽量提前返程"],
      servicePoints: ["游客咨询台", "主入口安保点", "网约车上车点"]
    }
  };
  const destinationSafetyMapMap = {
    1: {
      coverage: "天池主入口、游客中心、湖滨步道、观景平台一线",
      emergencyLevel: "中高",
      emergencyContacts: ["景区游客中心", "景区医务点", "阜康当地急救 120"],
      highlights: ["建议把车停在官方停车区后乘摆渡进入", "环湖步道是最适合家庭游客的安全主线"],
      poiKeywords: ["游客中心", "景区入口", "停车场", "观景台", "医务室"],
      guideMapSourceName: "项目整理版导览图",
      guideMapImage: "/static/guide-maps/01-tianchi.jpg",
      keyPoints: [
        { id: "tianchi-center", name: "天池湖滨核心区", keyword: "核心区", longitude: 88.1548, latitude: 43.8803, address: "天池湖滨步道一带" },
        { id: "tianchi-visitor", name: "游客中心", keyword: "游客中心", longitude: 88.1506, latitude: 43.8789, address: "天山天池游客服务区" },
        { id: "tianchi-view", name: "主观景台", keyword: "观景台", longitude: 88.1592, latitude: 43.8821, address: "天池主观景方向" },
        { id: "tianchi-parking", name: "官方停车区", keyword: "停车场", longitude: 88.1478, latitude: 43.8774, address: "主入口停车换乘区域" }
      ],
      routePoints: [
        { longitude: 88.1478, latitude: 43.8774 },
        { longitude: 88.1506, latitude: 43.8789 },
        { longitude: 88.1548, latitude: 43.8803 },
        { longitude: 88.1592, latitude: 43.8821 }
      ]
    },
    2: {
      coverage: "喀纳斯换乘中心、湖滨观景段、返程车站一线",
      emergencyLevel: "高",
      emergencyContacts: ["景区换乘中心服务台", "景区医疗救助点", "布尔津当地急救 120"],
      highlights: ["景区纵深大，先确认返程车时间", "山区天气变化快，优先保存核心观景路线"],
      poiKeywords: ["换乘中心", "游客中心", "停车场", "观景台", "医务室"],
      guideMapSourceName: "项目整理版导览图",
      guideMapImage: "/static/guide-maps/02-kanas.jpg",
      keyPoints: [
        { id: "kanas-hub", name: "换乘中心", keyword: "换乘中心", longitude: 87.0278, latitude: 48.7084, address: "景区换乘与游客集散区" },
        { id: "kanas-lake", name: "喀纳斯湖核心观景区", keyword: "核心区", longitude: 87.0347, latitude: 48.713, address: "湖滨主观景区域" },
        { id: "kanas-view", name: "湖滨观景台", keyword: "观景台", longitude: 87.0386, latitude: 48.7161, address: "临湖观景带" },
        { id: "kanas-medical", name: "医疗救助点", keyword: "医务室", longitude: 87.0304, latitude: 48.7099, address: "换乘中心附近" }
      ],
      routePoints: [
        { longitude: 87.0278, latitude: 48.7084 },
        { longitude: 87.0304, latitude: 48.7099 },
        { longitude: 87.0347, latitude: 48.713 },
        { longitude: 87.0386, latitude: 48.7161 }
      ]
    },
    3: {
      coverage: "东门入口、游客服务区、环湖主观景段、返程道路一线",
      emergencyLevel: "中高",
      emergencyContacts: ["景区游客中心", "景区医务服务点", "博乐当地急救 120"],
      highlights: ["环湖线很长，先确认返程方向和补给点", "湖边风力变化快，拍照时不要离主路过远"],
      poiKeywords: ["游客中心", "东门", "停车场", "观景台", "医务室"],
      guideMapSourceName: "项目整理版导览图",
      guideMapImage: "/static/guide-maps/03-sayram.jpg",
      keyPoints: [
        { id: "sailimu-east-gate", name: "东门入口", keyword: "景区入口", longitude: 81.2014, latitude: 44.6002, address: "赛里木湖东门一带" },
        { id: "sailimu-visitor", name: "游客服务区", keyword: "游客中心", longitude: 81.2087, latitude: 44.5986, address: "景区主服务区" },
        { id: "sailimu-view", name: "湖岸观景带", keyword: "观景台", longitude: 81.2185, latitude: 44.6027, address: "湖滨观景段" },
        { id: "sailimu-parking", name: "停车补给点", keyword: "停车场", longitude: 81.2126, latitude: 44.5965, address: "游客服务区附近" }
      ],
      routePoints: [
        { longitude: 81.2014, latitude: 44.6002 },
        { longitude: 81.2087, latitude: 44.5986 },
        { longitude: 81.2126, latitude: 44.5965 },
        { longitude: 81.2185, latitude: 44.6027 }
      ]
    },
    5: {
      coverage: "主服务区、空中草原线、观景平台、返程停车点一线",
      emergencyLevel: "中高",
      emergencyContacts: ["那拉提游客中心", "景区医务服务点", "新源当地急救 120"],
      highlights: ["草原景区尺度大，建议优先走官方观景车与主栈道", "天气变坏时先回主服务区再决定是否继续深入"],
      poiKeywords: ["游客中心", "景区入口", "观景台", "停车场", "医务室"],
      guideMapSourceName: "项目整理版导览图",
      guideMapImage: "/static/guide-maps/05-nalati.jpg",
      keyPoints: [
        { id: "nalati-visitor", name: "游客中心", keyword: "游客中心", longitude: 83.0489, latitude: 43.4638, address: "那拉提主服务区" },
        { id: "nalati-sky-grassland", name: "空中草原核心区", keyword: "核心区", longitude: 83.0565, latitude: 43.4711, address: "空中草原主观景方向" },
        { id: "nalati-view", name: "主观景台", keyword: "观景台", longitude: 83.0619, latitude: 43.4744, address: "草原主观景带" },
        { id: "nalati-parking", name: "停车换乘区", keyword: "停车场", longitude: 83.0456, latitude: 43.4624, address: "游客中心旁" }
      ],
      routePoints: [
        { longitude: 83.0456, latitude: 43.4624 },
        { longitude: 83.0489, latitude: 43.4638 },
        { longitude: 83.0565, latitude: 43.4711 },
        { longitude: 83.0619, latitude: 43.4744 }
      ]
    },
    9: {
      coverage: "古城东门、主街区、游客中心、夜游出口一线",
      emergencyLevel: "中",
      emergencyContacts: ["古城游客中心", "古城警务站", "喀什当地急救 120"],
      highlights: ["先记住东门或西门这类大地标", "夜游时建议把集合点设在主街宽阔区域"],
      poiKeywords: ["游客中心", "东门", "西门", "警务站", "停车场"],
      guideMapSourceName: "项目整理版导览图",
      guideMapImage: "/static/guide-maps/09-kashgar-old-city.jpg",
      keyPoints: [
        { id: "kashgar-east-gate", name: "古城东门", keyword: "东门", longitude: 75.9897, latitude: 39.4704, address: "喀什古城东门" },
        { id: "kashgar-center", name: "主街核心区", keyword: "核心区", longitude: 75.9879, latitude: 39.4689, address: "主街区漫游核心段" },
        { id: "kashgar-west-gate", name: "古城西门", keyword: "西门", longitude: 75.9847, latitude: 39.4681, address: "喀什古城西侧出口" },
        { id: "kashgar-police", name: "警务站", keyword: "警务站", longitude: 75.9888, latitude: 39.4697, address: "东门附近安保点" }
      ],
      routePoints: [
        { longitude: 75.9897, latitude: 39.4704 },
        { longitude: 75.9888, latitude: 39.4697 },
        { longitude: 75.9879, latitude: 39.4689 },
        { longitude: 75.9847, latitude: 39.4681 }
      ]
    },
    22: {
      coverage: "帕米尔主观景点、公路停靠区、游客补给点一线",
      emergencyLevel: "高",
      emergencyContacts: ["沿线游客服务站", "塔县县城医院", "塔县急救 120"],
      highlights: ["高原地区务必控制节奏", "离开县城前先备好离线图和补给"],
      poiKeywords: ["服务站", "观景台", "停车点", "补给点", "卫生室"]
    }
  };
  const guideMapFilenameMap = {
    1: "01-tianchi.jpg",
    2: "02-kanas.jpg",
    3: "03-sayram.jpg",
    4: "04-baisha-lake.jpg",
    5: "05-nalati.jpg",
    6: "06-kalajun.jpg",
    7: "07-bayinbuluke.jpg",
    8: "08-hemu.jpg",
    9: "09-kashgar-old-city.jpg",
    10: "10-jiaohe.jpg",
    11: "11-karez.jpg",
    12: "12-kuqa-palace.jpg",
    13: "13-kumtag-desert.jpg",
    14: "14-mysterious-canyon.jpg",
    15: "15-wuerhe-yardang.jpg",
    16: "16-taklamakan.jpg",
    17: "17-zepu-populus.jpg",
    18: "18-luntai-populus.jpg",
    19: "19-bosten-lake.jpg",
    20: "20-keketuohai.jpg",
    21: "21-jiangbulake.jpg",
    22: "22-pamir.jpg",
    23: "23-grand-bazaar.jpg",
    24: "24-grape-valley.jpg",
    25: "25-karakul-lake.jpg",
    26: "26-muztag-glacier.jpg",
    27: "27-zhaosu-wetland.jpg",
    28: "28-xiata.jpg",
    29: "29-tekes.jpg",
    30: "30-gaochang.jpg",
    31: "31-flaming-mountain.jpg",
    32: "32-wensu-canyon.jpg",
    33: "33-lopnur-village.jpg",
    34: "34-swan-river.jpg",
    35: "35-dukou-north.jpg",
    36: "36-anjihai-canyon.jpg",
    37: "37-wusun-trail.jpg",
    38: "38-xinjiang-museum.jpg",
    39: "39-hongshan-park.jpg",
    40: "40-dabancheng.jpg",
    41: "41-guozigou-bridge.jpg",
    42: "42-huocheng-lavender.jpg",
    43: "43-qiongkushitai.jpg",
    44: "44-tangbula.jpg",
    45: "45-ulungur-lake.jpg",
    46: "46-wucaitan.jpg",
    47: "47-baihaba.jpg",
    48: "48-mulei-populus.jpg",
    49: "49-tianshan-canyon.jpg",
    50: "50-nanshan-pasture.jpg",
    51: "51-bogda-view.jpg",
    52: "52-mutetaar-desert.jpg",
    53: "53-niya-ruins.jpg",
    54: "54-hotan-old-town.jpg",
    55: "55-bole-wetland.jpg",
    56: "56-jinghe-populus.jpg",
    57: "57-kizil-grottoes.jpg",
    58: "58-tomur-canyon.jpg",
    59: "59-tarim-populus.jpg",
    60: "60-tahe-source.jpg",
    61: "61-baiyanggou.jpg",
    62: "62-manas-wetland.jpg",
    63: "63-junggar-stele.jpg",
    64: "64-tuyugou.jpg",
    65: "65-huiyuan-old-city.jpg",
    66: "66-jingyuan-temple.jpg",
    67: "67-aksu-confucius-temple.jpg"
  };
  function getDefaultGuideMapImage(id) {
    const fileName = guideMapFilenameMap[Number(id)];
    return fileName ? `/static/guide-maps/${fileName}` : "";
  }
  function getDestinationById(id) {
    return destinationList.find((item) => String(item.id) === String(id));
  }
  function getDestinationCulture(id) {
    const destination = getDestinationById(id);
    if (!destination) {
      return null;
    }
    const customContent = destinationCultureMap[String(destination.id)] || destinationCultureMap[destination.id];
    if (customContent) {
      return customContent;
    }
    return {
      overview: `${destination.name}位于${destination.location}，以${destination.category}体验为主，当前页面已收录基础景观介绍、游玩建议和路线信息。`,
      history: `${destination.name}目前在应用内以景观与玩法信息为主，更详细的历史沿革和地名由来还可以继续补充官方资料、地方志或景区展陈内容。`,
      highlights: destination.suggestion
    };
  }
  function getDestinationTravelMeta(id) {
    const destination = getDestinationById(id);
    if (!destination) {
      return null;
    }
    const customMeta = destinationTravelMetaMap[String(destination.id)] || destinationTravelMetaMap[destination.id];
    if (customMeta) {
      return customMeta;
    }
    const categoryDefaults = {
      "湖泊雪山": {
        season: "5月-10月",
        stay: "半天-1天",
        audience: "自然风光游客、自驾游客、摄影爱好者"
      },
      "草原森林": {
        season: "6月-9月",
        stay: "半天-1天",
        audience: "亲子、情侣、慢旅行用户"
      },
      "古城人文": {
        season: "4月-10月",
        stay: "2小时-半天",
        audience: "历史文化游客、城市漫游用户、讲解参观用户"
      },
      "沙漠峡谷": {
        season: "4月-10月，避开高温或恶劣天气",
        stay: "2小时-半天",
        audience: "地貌爱好者、自驾游客、摄影用户"
      },
      "胡杨湿地": {
        season: "9月-11月，秋季最佳",
        stay: "2小时-半天",
        audience: "秋景游客、亲子、轻休闲用户"
      },
      "峡谷地貌": {
        season: "5月-10月",
        stay: "2小时-半天",
        audience: "自驾游客、地貌摄影用户、轻徒步用户"
      },
      "城市夜游": {
        season: "全年可去，春夏秋更舒适",
        stay: "1小时-半天",
        audience: "城市漫游用户、夜游游客、美食爱好者"
      }
    };
    return categoryDefaults[destination.category] || {
      season: "全年可结合天气安排",
      stay: "2小时-半天",
      audience: "首次来访游客、轻松游用户"
    };
  }
  function getDestinationVisitMeta(id) {
    const destination = getDestinationById(id);
    if (!destination) {
      return null;
    }
    const customMeta = destinationVisitMetaMap[String(destination.id)] || destinationVisitMetaMap[destination.id];
    if (customMeta) {
      return customMeta;
    }
    const categoryDefaults = {
      "湖泊雪山": {
        ticket: "门票多在 50-150 元区间，旺季可能浮动",
        openHours: "通常 08:30-19:30，旺季延长情况较常见"
      },
      "草原森林": {
        ticket: "门票多在 50-135 元区间，区间车可能另算",
        openHours: "通常 08:30-20:00"
      },
      "古城人文": {
        ticket: "门票多在 30-120 元区间，部分老城街区免费",
        openHours: "通常 09:00-19:00，夜游街区可更晚"
      },
      "沙漠峡谷": {
        ticket: "门票多在 40-120 元区间，项目体验可能另收费",
        openHours: "通常 09:00-20:00，受天气影响较大"
      },
      "胡杨湿地": {
        ticket: "门票多在 30-100 元区间",
        openHours: "通常 09:00-19:30，秋季旺季可能调整"
      },
      "峡谷地貌": {
        ticket: "门票多在 30-120 元区间",
        openHours: "通常 09:00-19:30"
      },
      "城市夜游": {
        ticket: "许多公共街区免费，个别演出或项目单收费",
        openHours: "全天或白天开放，夜间商户营业时间更长"
      }
    };
    return categoryDefaults[destination.category] || {
      ticket: "门票信息建议以景区当日公示为准",
      openHours: "开放时间建议以景区当日公告为准"
    };
  }
  function getDestinationSafetyMap(id) {
    const destination = getDestinationById(id);
    if (!destination) {
      return null;
    }
    const categoryConfig = safetyMapCategoryDefaults[destination.category] || {
      zoom: 14,
      coverage: "主入口与核心游览线",
      terrainRisk: "请优先沿景区官方游线活动。",
      weatherRisk: "请关注当天天气和景区公告。",
      signalRisk: "远离主服务区时注意信号变化。",
      safeRoute: ["先到游客中心获取信息", "沿主游线活动", "遇到天气变化及时返程"],
      servicePoints: ["游客中心", "主入口", "集合点"]
    };
    const customConfig = destinationSafetyMapMap[String(destination.id)] || destinationSafetyMapMap[destination.id] || {};
    return {
      title: `${destination.name}安全图`,
      zoom: customConfig.zoom || categoryConfig.zoom,
      coverage: customConfig.coverage || categoryConfig.coverage,
      emergencyLevel: customConfig.emergencyLevel || "中",
      terrainRisk: customConfig.terrainRisk || categoryConfig.terrainRisk,
      weatherRisk: customConfig.weatherRisk || categoryConfig.weatherRisk,
      signalRisk: customConfig.signalRisk || categoryConfig.signalRisk,
      safeRoute: customConfig.safeRoute || categoryConfig.safeRoute,
      servicePoints: customConfig.servicePoints || categoryConfig.servicePoints,
      emergencyContacts: customConfig.emergencyContacts || ["景区游客中心", "当地急救 120", "公安报警 110"],
      poiKeywords: customConfig.poiKeywords || ["游客中心", "景区入口", "停车场", "观景台", "服务点"],
      keyPoints: customConfig.keyPoints || [],
      routePoints: customConfig.routePoints || [],
      guideMapSourceName: customConfig.guideMapSourceName || "",
      guideMapSourceUrl: customConfig.guideMapSourceUrl || "",
      guideMapImage: customConfig.guideMapImage || getDefaultGuideMapImage(destination.id),
      highlights: customConfig.highlights || [
        "建议在景区入口处先确认返程路线。",
        "弱网区域优先依赖离线安全图和景区指示牌。"
      ],
      note: "当前安全图用于景区核心区域参考，不替代景区实时管制、官方公告和现场安保指引。"
    };
  }
  function getDouyinSearchUrl(keyword) {
    return `https://www.douyin.com/search/${encodeURIComponent(keyword)}?type=live`;
  }
  function getDouyinAppSearchUrls(keyword) {
    const encodedKeyword = encodeURIComponent(String(keyword || "").trim());
    if (!encodedKeyword) {
      return [];
    }
    return [
      `snssdk1128://search?keyword=${encodedKeyword}&from=app`,
      `snssdk2329://search?keyword=${encodedKeyword}&from=app`,
      `douyin://search?keyword=${encodedKeyword}`
    ];
  }
  const AMAP_WEB_KEY = "b16ee0a6a8f641e974a51521ca00b6f0";
  const AMAP_SECURITY_JS_CODE = "27cce8a4c1772a6589c3ee78cf2f31e7";
  function hasAmapKey() {
    return Boolean(AMAP_WEB_KEY) && !AMAP_WEB_KEY.includes("请在这里填入");
  }
  function hasAmapSecurityCode() {
    return Boolean(AMAP_SECURITY_JS_CODE) && !AMAP_SECURITY_JS_CODE.includes("请在这里填入");
  }
  function request$5(url, data = {}) {
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method: "GET",
        data,
        success: (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          resolve(res.data);
        },
        fail: reject
      });
    });
  }
  function getStaticMapUrl({ longitude, latitude, markers = [], paths = [], zoom = 11, size = "750*360" }) {
    if (!hasAmapKey() || longitude === void 0 || latitude === void 0) {
      return "";
    }
    const markerText = markers.map((item) => `${item.size || "mid"},0xC44536,${item.label || ""}:${item.longitude},${item.latitude}`).join("|");
    const pathText = paths.filter((item) => Array.isArray(item == null ? void 0 : item.points) && item.points.length >= 2).map((item) => {
      const style = [item.weight || 6, item.color || "0xC44536", item.fillColor || "0x00000000"];
      const points = item.points.map((point) => `${point.longitude},${point.latitude}`).join(";");
      return `${style.join(",")}:${points}`;
    }).join("|");
    const params = [
      `key=${encodeURIComponent(AMAP_WEB_KEY)}`,
      `size=${encodeURIComponent(size)}`,
      "scale=2",
      `zoom=${zoom}`,
      `center=${longitude},${latitude}`
    ];
    if (markerText) {
      params.push(`markers=${encodeURIComponent(markerText)}`);
    }
    if (pathText) {
      params.push(`paths=${encodeURIComponent(pathText)}`);
    }
    return `https://restapi.amap.com/v3/staticmap?${params.join("&")}`;
  }
  async function searchPlaceText(keywords, location2, city) {
    if (!hasAmapKey() || !keywords) {
      return [];
    }
    const cityValue = String(city || "").trim();
    const data = await request$5("https://restapi.amap.com/v3/place/text", {
      key: AMAP_WEB_KEY,
      keywords,
      offset: 5,
      page: 1,
      extensions: "base",
      location: location2 ? `${location2.longitude},${location2.latitude}` : void 0,
      city: cityValue || void 0,
      citylimit: cityValue ? true : void 0
    });
    if (data.status !== "1" || !Array.isArray(data.pois)) {
      return [];
    }
    return data.pois;
  }
  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }
  function extractNavigationAreas(regionText) {
    const raw = String(regionText || "").trim().replace(/^新疆维吾尔自治区/, "").replace(/^新疆/, "").trim();
    if (!raw) {
      return [];
    }
    const knownAreas = [
      "乌鲁木齐",
      "伊犁",
      "阿勒泰",
      "喀什",
      "阿克苏",
      "吐鲁番",
      "昌吉",
      "博州",
      "巴州",
      "克拉玛依",
      "塔城",
      "哈密",
      "和田",
      "克州",
      "阿拉尔",
      "图木舒克",
      "五家渠",
      "石河子",
      "北屯",
      "铁门关",
      "双河",
      "可克达拉",
      "昆玉",
      "胡杨河",
      "阜康",
      "布尔津",
      "博乐",
      "塔县",
      "新源",
      "特克斯",
      "和静",
      "库车",
      "鄯善",
      "富蕴",
      "奇台",
      "昭苏",
      "温宿",
      "尉犁",
      "库尔勒",
      "沙湾",
      "霍城",
      "博湖",
      "轮台",
      "泽普",
      "吐鲁番",
      "乌鲁木齐",
      "达坂城"
    ];
    const result = [];
    knownAreas.forEach((item) => {
      if (raw.includes(item) && !result.includes(item)) {
        result.push(item);
      }
    });
    if (result.length) {
      return result;
    }
    return raw.split(/[\s/、,-]+/).map((item) => item.trim()).filter(Boolean);
  }
  function buildNavigationSearchKeywords(name, address, region) {
    const values = [
      String(name || "").trim(),
      [name, address].filter(Boolean).join(" "),
      [region, name].filter(Boolean).join(" "),
      [region, address].filter(Boolean).join(" "),
      [region, name, address].filter(Boolean).join(" "),
      String(address || "").trim()
    ];
    return [...new Set(values.filter(Boolean))];
  }
  function scoreNavigationPoi(poi, name, address, locationHint) {
    const poiName = normalizeText(poi == null ? void 0 : poi.name);
    const poiAddress = normalizeText(poi == null ? void 0 : poi.address);
    const targetName = normalizeText(name);
    const targetAddress = normalizeText(address);
    const targetText = `${targetName} ${targetAddress}`;
    const poiText = `${poiName} ${poiAddress}`;
    let score = 0;
    const adminKeywords = ["管理委员会", "管委会", "委员会", "管理处", "政务", "政府", "机关", "旅游局", "办公区"];
    const scenicKeywords = ["景区", "风景区", "风景名胜区", "游客中心", "游客服务中心", "游客服务区", "停车场", "入口", "售票处", "检票口"];
    if (targetName && poiName === targetName) {
      score += 140;
    } else if (targetName && (poiName.includes(targetName) || targetName.includes(poiName))) {
      score += 90;
    }
    if (targetAddress && poiAddress.includes(targetAddress)) {
      score += 110;
    } else if (targetAddress && targetAddress.includes(poiAddress) && poiAddress) {
      score += 60;
    }
    if (scenicKeywords.some((item) => targetText.includes(item)) && scenicKeywords.some((item) => poiText.includes(item))) {
      score += 40;
    }
    if (adminKeywords.some((item) => poiText.includes(item)) && !adminKeywords.some((item) => targetText.includes(item))) {
      score -= 260;
    }
    if (locationHint && Number.isFinite(Number(locationHint.longitude)) && Number.isFinite(Number(locationHint.latitude))) {
      const distance = getCoordinateDistanceMeters(locationHint, poi);
      if (distance <= 100) {
        score += 80;
      } else if (distance <= 500) {
        score += 50;
      } else if (distance <= 1500) {
        score += 20;
      }
    }
    return score;
  }
  function getCoordinateDistanceMeters(from, to) {
    const rad = Math.PI / 180;
    const lat1 = Number(from.latitude) * rad;
    const lat2 = Number(to.latitude) * rad;
    const deltaLat = lat2 - lat1;
    const deltaLng = (Number(to.longitude) - Number(from.longitude)) * rad;
    const sinLat = Math.sin(deltaLat / 2);
    const sinLng = Math.sin(deltaLng / 2);
    const a = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
    return 6371e3 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  async function resolveNavigationPoint({ name, address = "", region = "", longitude, latitude }) {
    if (!hasAmapKey() || !name) {
      return null;
    }
    const locationHint = Number.isFinite(Number(longitude)) && Number.isFinite(Number(latitude)) ? { longitude: Number(longitude), latitude: Number(latitude) } : null;
    const keywordsList = buildNavigationSearchKeywords(name, address, region);
    const cityCandidates = extractNavigationAreas(region || address);
    const candidates = [];
    const used = /* @__PURE__ */ new Set();
    for (const keywords of keywordsList) {
      const citySearches = cityCandidates.length ? [...cityCandidates, ""] : [""];
      for (const city of citySearches) {
        const pois = await searchPlaceText(keywords, locationHint, city);
        pois.forEach((item) => {
          const normalized = normalizePoi(item, keywords);
          if (!normalized) {
            return;
          }
          const uniqueKey = `${normalized.name}-${normalized.longitude.toFixed(6)}-${normalized.latitude.toFixed(6)}`;
          if (used.has(uniqueKey)) {
            return;
          }
          used.add(uniqueKey);
          candidates.push(normalized);
        });
      }
    }
    if (!candidates.length) {
      return null;
    }
    return candidates.map((item) => ({
      ...item,
      score: scoreNavigationPoi(item, name, address, locationHint)
    })).sort((left, right) => right.score - left.score)[0];
  }
  function normalizePoi(item, keyword = "") {
    const [longitude, latitude] = String((item == null ? void 0 : item.location) || "").split(",").map((value) => Number(value));
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      return null;
    }
    return {
      id: item.id || `${keyword}-${item.name || ""}-${longitude}-${latitude}`,
      keyword,
      name: item.name || keyword || "景区点位",
      longitude,
      latitude,
      address: item.address || item.pname || item.cityname || "",
      type: item.type || ""
    };
  }
  async function reverseGeocode(longitude, latitude, extensions = "base") {
    if (!hasAmapKey()) {
      return null;
    }
    const data = await request$5("https://restapi.amap.com/v3/geocode/regeo", {
      key: AMAP_WEB_KEY,
      location: `${longitude},${latitude}`,
      extensions
    });
    if (data.status !== "1" || !data.regeocode) {
      throw new Error(data.info || "逆地理编码失败");
    }
    return data.regeocode;
  }
  function normalizeLocationPart(value) {
    if (Array.isArray(value)) {
      return String(value[0] || "").trim();
    }
    return String(value || "").trim();
  }
  function compactLocationLabel(parts) {
    return parts.map((item) => String(item || "").trim()).filter(Boolean).join(" ");
  }
  async function getNearbyLocationOptions(longitude, latitude) {
    if (!hasAmapKey()) {
      return [];
    }
    const regeo = await reverseGeocode(longitude, latitude, "all");
    const address = (regeo == null ? void 0 : regeo.addressComponent) || {};
    const city = normalizeLocationPart(address.city) || normalizeLocationPart(address.province);
    const district = normalizeLocationPart(address.district);
    const options = [];
    const used = /* @__PURE__ */ new Set();
    const pushOption = (label, source = "") => {
      const value = compactLocationLabel([city, label]);
      if (!value || used.has(value)) {
        return;
      }
      used.add(value);
      options.push({
        label: value,
        value,
        source
      });
    };
    pushOption(compactLocationLabel([district]), "district");
    const businessAreas = Array.isArray(address.businessAreas) ? address.businessAreas : [];
    businessAreas.forEach((item) => {
      pushOption(compactLocationLabel([district, item == null ? void 0 : item.name]), "business");
    });
    const aois = Array.isArray(regeo == null ? void 0 : regeo.aois) ? regeo.aois : [];
    aois.slice(0, 5).forEach((item) => {
      pushOption(compactLocationLabel([district, item == null ? void 0 : item.name]), "aoi");
    });
    const pois = Array.isArray(regeo == null ? void 0 : regeo.pois) ? regeo.pois : [];
    pois.slice(0, 8).forEach((item) => {
      pushOption(compactLocationLabel([district, item == null ? void 0 : item.name]), "poi");
    });
    if (!options.length) {
      pushOption(compactLocationLabel([district]) || normalizeLocationPart(address.province) || "新疆同城", "fallback");
    }
    return options;
  }
  async function getLiveWeather(adcode) {
    if (!hasAmapKey() || !adcode) {
      return null;
    }
    const data = await request$5("https://restapi.amap.com/v3/weather/weatherInfo", {
      key: AMAP_WEB_KEY,
      city: adcode,
      extensions: "base"
    });
    if (data.status !== "1" || !data.lives || !data.lives.length) {
      throw new Error(data.info || "天气获取失败");
    }
    return data.lives[0];
  }
  async function getDrivingRoute(origin, destination) {
    var _a, _b;
    if (!hasAmapKey() || !origin || !destination) {
      return null;
    }
    const data = await request$5("https://restapi.amap.com/v3/direction/driving", {
      key: AMAP_WEB_KEY,
      origin: `${origin.longitude},${origin.latitude}`,
      destination: `${destination.longitude},${destination.latitude}`,
      strategy: 0,
      extensions: "all"
    });
    if (data.status !== "1" || !((_b = (_a = data.route) == null ? void 0 : _a.paths) == null ? void 0 : _b.length)) {
      throw new Error(data.info || "驾车路线获取失败");
    }
    return {
      ...data.route.paths[0],
      taxiCost: data.route.taxi_cost || ""
    };
  }
  async function getWalkingRoute(origin, destination) {
    var _a, _b;
    if (!hasAmapKey() || !origin || !destination) {
      return null;
    }
    const data = await request$5("https://restapi.amap.com/v3/direction/walking", {
      key: AMAP_WEB_KEY,
      origin: `${origin.longitude},${origin.latitude}`,
      destination: `${destination.longitude},${destination.latitude}`
    });
    if (data.status !== "1" || !((_b = (_a = data.route) == null ? void 0 : _a.paths) == null ? void 0 : _b.length)) {
      throw new Error(data.info || "步行路线获取失败");
    }
    return data.route.paths[0];
  }
  async function getCurrentLocation(options = {}) {
    const preferredProviders = Array.isArray(options.providers) ? options.providers.map((item) => String(item || "").toLowerCase()).filter(Boolean) : [];
    formatAppLog("log", "at services/amap.js:464", "[hiking-location] getCurrentLocation start", {
      highAccuracy: Boolean(options.highAccuracy),
      allowGpsOffline: Boolean(options.allowGpsOffline),
      coordsType: String(options.coordsType || ""),
      providers: preferredProviders,
      gpsTimeout: Number(options.gpsTimeout || 18e3),
      gpsMaximumAgeMs: Number(options.gpsMaximumAgeMs || 12e4),
      networkTimeout: Number(options.networkTimeout || 6e3),
      networkMaximumAgeMs: Number(options.networkMaximumAgeMs || 3e4),
      isAndroidRuntime: isAndroidRuntime()
    });
    await ensureLocationPermission();
    const attempts = [];
    const gpsTimeout = Number(options.gpsTimeout || 18e3);
    const networkTimeout = Number(options.networkTimeout || 6e3);
    const providerFactories = {
      gps: () => isAndroidRuntime() ? {
        label: "android-gps",
        run: () => requestAndroidProviderLocation("gps", { ...options, timeout: gpsTimeout, maximumAgeMs: Number(options.gpsMaximumAgeMs || 12e4) })
      } : null,
      network: () => isAndroidRuntime() ? {
        label: "android-network",
        run: () => requestAndroidProviderLocation("network", { ...options, timeout: networkTimeout, maximumAgeMs: Number(options.networkMaximumAgeMs || 3e4) })
      } : null,
      system: () => ({ label: "plus-geolocation", run: () => requestPlusLocation(options) }),
      "plus-geolocation": () => ({ label: "plus-geolocation", run: () => requestPlusLocation(options) }),
      gcj02: () => ({ label: "uni-gcj02", run: () => requestUniLocation("gcj02") }),
      "uni-gcj02": () => ({ label: "uni-gcj02", run: () => requestUniLocation("gcj02") }),
      wgs84: () => ({ label: "uni-wgs84", run: () => requestUniLocation("wgs84") }),
      "uni-wgs84": () => ({ label: "uni-wgs84", run: () => requestUniLocation("wgs84") })
    };
    const fallbackProviderOrder = isAndroidRuntime() ? ["gps", "network", "system", "gcj02", "wgs84"] : ["system", "gcj02", "wgs84"];
    const providerOrder = preferredProviders.length ? preferredProviders : fallbackProviderOrder;
    const seenLabels = /* @__PURE__ */ new Set();
    providerOrder.forEach((providerName) => {
      const factory = providerFactories[providerName];
      if (!factory) {
        return;
      }
      const attempt = factory();
      if (!attempt || seenLabels.has(attempt.label)) {
        return;
      }
      seenLabels.add(attempt.label);
      attempts.push(attempt);
    });
    formatAppLog("log", "at services/amap.js:521", "[hiking-location] attempts prepared", attempts.map((item) => item.label));
    let lastError = null;
    const errors = [];
    for (const attempt of attempts) {
      try {
        formatAppLog("log", "at services/amap.js:527", `[hiking-location] trying ${attempt.label}`);
        const location2 = await attempt.run();
        if (location2) {
          formatAppLog("log", "at services/amap.js:530", `[hiking-location] success via ${attempt.label}`, location2);
          return location2;
        }
      } catch (error) {
        lastError = error;
        const message = normalizeLocationError(error);
        errors.push(`${attempt.label}: ${message}`);
        formatAppLog("warn", "at services/amap.js:537", `[hiking-location] failed via ${attempt.label}`, error);
      }
    }
    const detail = errors.length ? `；${errors.join(" | ")}` : "";
    formatAppLog("error", "at services/amap.js:542", "[hiking-location] all attempts failed", errors);
    throw new Error(`${normalizeLocationError(lastError) || "定位失败，请检查系统定位服务是否开启"}${detail}`);
  }
  function normalizeLocationError(error) {
    if (!error) {
      return "定位失败，请检查系统定位服务是否开启";
    }
    if (typeof error === "string") {
      return error;
    }
    const parts = [
      error.errMsg,
      error.message,
      error.reason,
      error.code ? `code=${error.code}` : ""
    ].filter(Boolean);
    const text = parts.join(" | ");
    const raw = JSON.stringify(error);
    if (/auth deny|permission|authorize|获取定位权限失败|code=1501|code=PERMISSION_DENIED/i.test(text + raw)) {
      return "定位权限未开启，请在系统设置中允许“丝路疆寻”访问位置信息";
    }
    if (/service disabled|LOCATION_SWITCH_OFF|gps|定位服务|系统定位服务未开启/i.test(text + raw)) {
      return "系统定位服务未开启，请先打开手机定位开关";
    }
    return text || raw || "定位失败，请检查系统定位服务是否开启";
  }
  function isAndroidRuntime() {
    return typeof plus !== "undefined" && plus.os && plus.os.name === "Android" && plus.android;
  }
  function ensureLocationPermission() {
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.os || plus.os.name !== "Android") {
        resolve();
        return;
      }
      const android = plus.android;
      if (!android || typeof android.requestPermissions !== "function") {
        resolve();
        return;
      }
      const permissions = [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ];
      if (permissions.some((permission) => hasAndroidPermission(permission))) {
        resolve();
        return;
      }
      android.requestPermissions(
        permissions,
        (result) => {
          const granted = Array.isArray(result == null ? void 0 : result.granted) ? result.granted : [];
          const deniedAlways = Array.isArray(result == null ? void 0 : result.deniedAlways) ? result.deniedAlways : [];
          const deniedPresent = Array.isArray(result == null ? void 0 : result.deniedPresent) ? result.deniedPresent : [];
          if (granted.includes("android.permission.ACCESS_FINE_LOCATION") || granted.includes("android.permission.ACCESS_COARSE_LOCATION") || permissions.some((permission) => hasAndroidPermission(permission))) {
            resolve();
            return;
          }
          if (deniedAlways.length || deniedPresent.length) {
            reject(new Error("定位权限未开启，请在系统设置中允许“丝路疆寻”访问位置信息"));
            return;
          }
          resolve();
        },
        (error) => {
          reject(new Error(normalizeLocationError(error)));
        }
      );
    });
  }
  function hasAndroidPermission(permission) {
    if (typeof plus === "undefined" || !plus.android || !permission) {
      return false;
    }
    try {
      const main = plus.android.runtimeMainActivity();
      const PackageManager = plus.android.importClass("android.content.pm.PackageManager");
      return main.checkSelfPermission(permission) === PackageManager.PERMISSION_GRANTED;
    } catch (error) {
      return false;
    }
  }
  function openAppPermissionSettings() {
    if (typeof plus === "undefined" || !plus.os || plus.os.name !== "Android" || !plus.android) {
      return false;
    }
    try {
      const main = plus.android.runtimeMainActivity();
      const Intent = plus.android.importClass("android.content.Intent");
      const Settings = plus.android.importClass("android.provider.Settings");
      const Uri = plus.android.importClass("android.net.Uri");
      const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      intent.setData(Uri.parse(`package:${main.getPackageName()}`));
      main.startActivity(intent);
      return true;
    } catch (error) {
      formatAppLog("warn", "at services/amap.js:662", "[hiking-location] open settings failed", error);
      return false;
    }
  }
  function requestUniLocation(type = "gcj02") {
    return new Promise((resolve, reject) => {
      formatAppLog("log", "at services/amap.js:669", `[hiking-location] uni.getLocation start (${type})`);
      uni.getLocation({
        type,
        isHighAccuracy: true,
        highAccuracyExpireTime: 12e3,
        geocode: false,
        success: (location2) => {
          resolve({
            ...location2,
            provider: `uni-${type}`,
            coordinateSystem: type,
            source: "uni.getLocation"
          });
        },
        fail: reject
      });
    });
  }
  function requestPlusLocation(options = {}) {
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.geolocation || typeof plus.geolocation.getCurrentPosition !== "function") {
        reject(new Error("当前环境不支持 plus 定位"));
        return;
      }
      const requestedCoordsType = String(options.coordsType || "gcj02").toLowerCase();
      const plusCoordsType = requestedCoordsType === "wgs84" ? "gcj02" : requestedCoordsType;
      formatAppLog("log", "at services/amap.js:698", "[hiking-location] plus.geolocation start", {
        timeout: Number(options.timeout || 12e3),
        coordsType: plusCoordsType
      });
      plus.geolocation.getCurrentPosition(
        (position) => {
          const coords = (position == null ? void 0 : position.coords) || {};
          resolve({
            latitude: Number(coords.latitude),
            longitude: Number(coords.longitude),
            altitude: Number(coords.altitude || 0),
            accuracy: Number(coords.accuracy || 0),
            speed: Number(coords.speed || 0),
            bearing: Number(coords.heading || 0),
            timestamp: Number(position.timestamp || Date.now()),
            provider: String(coords.provider || position.provider || "plus-geolocation"),
            coordinateSystem: String(position.coordsType || plusCoordsType || "gcj02"),
            source: "plus.geolocation"
          });
        },
        (error) => {
          reject(new Error((error == null ? void 0 : error.message) || "plus 定位失败"));
        },
        {
          enableHighAccuracy: true,
          timeout: Number(options.timeout || 12e3),
          maximumAge: 0,
          provider: "system",
          coordsType: plusCoordsType
        }
      );
    });
  }
  function requestAndroidProviderLocation(providerName, options = {}) {
    return new Promise((resolve, reject) => {
      if (!isAndroidRuntime()) {
        reject(new Error("当前环境不支持 Android 原生定位"));
        return;
      }
      let locationManager = null;
      let listener = null;
      let timer = null;
      let finished = false;
      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (locationManager && listener) {
          try {
            locationManager.removeUpdates(listener);
          } catch (error) {
          }
        }
        listener = null;
        locationManager = null;
      };
      const finishResolve = (value) => {
        if (finished) {
          return;
        }
        finished = true;
        cleanup();
        resolve(value);
      };
      const finishReject = (error) => {
        if (finished) {
          return;
        }
        finished = true;
        cleanup();
        reject(error);
      };
      try {
        formatAppLog("log", "at services/amap.js:782", "[hiking-location] android provider start", {
          providerName,
          timeout: Number(options.timeout || (providerName === "gps" ? 8e3 : 5e3)),
          maximumAgeMs: Number(options.maximumAgeMs || 15e3)
        });
        const main = plus.android.runtimeMainActivity();
        const Context = plus.android.importClass("android.content.Context");
        plus.android.importClass("android.location.LocationManager");
        const locationManagerObject = main.getSystemService(Context.LOCATION_SERVICE);
        plus.android.importClass(locationManagerObject);
        locationManager = locationManagerObject;
        if (!locationManager || !locationManager.isProviderEnabled(providerName)) {
          finishReject(new Error(providerName === "gps" ? "GPS 未开启" : "网络定位不可用"));
          return;
        }
        const cached = normalizeAndroidLocation(locationManager.getLastKnownLocation(providerName), providerName, "android-last-known");
        const maximumAgeMs = Number(options.maximumAgeMs || 15e3);
        if (cached && Date.now() - cached.timestamp <= maximumAgeMs) {
          formatAppLog("log", "at services/amap.js:803", "[hiking-location] android provider cached hit", {
            providerName,
            ageMs: Date.now() - cached.timestamp,
            accuracy: cached.accuracy,
            source: cached.source
          });
          finishResolve(cached);
          return;
        }
        listener = plus.android.implements("android.location.LocationListener", {
          onLocationChanged(location2) {
            const normalized = normalizeAndroidLocation(location2, providerName, "android-live");
            if (normalized) {
              finishResolve(normalized);
            }
          },
          onProviderDisabled(name) {
            finishReject(new Error(`${String(name || providerName).toUpperCase()} 已关闭`));
          },
          onProviderEnabled() {
          },
          onStatusChanged() {
          }
        });
        const timeout = Number(options.timeout || (providerName === "gps" ? 8e3 : 5e3));
        timer = setTimeout(() => {
          const lastKnown = normalizeAndroidLocation(locationManager.getLastKnownLocation(providerName), providerName, "android-timeout-last-known");
          if (lastKnown) {
            formatAppLog("warn", "at services/amap.js:831", "[hiking-location] android provider timeout fallback", {
              providerName,
              ageMs: Date.now() - lastKnown.timestamp,
              accuracy: lastKnown.accuracy,
              source: lastKnown.source
            });
            finishResolve(lastKnown);
            return;
          }
          finishReject(new Error(`${providerName.toUpperCase()} 定位超时`));
        }, timeout);
        if (typeof locationManager.requestSingleUpdate === "function") {
          locationManager.requestSingleUpdate(providerName, listener, main.getMainLooper());
          return;
        }
        locationManager.requestLocationUpdates(providerName, 0, 0, listener, main.getMainLooper());
      } catch (error) {
        finishReject(new Error(normalizeLocationError(error)));
      }
    });
  }
  function normalizeAndroidLocation(location2, providerName, source) {
    if (!location2) {
      return null;
    }
    try {
      plus.android.importClass(location2);
    } catch (error) {
      return null;
    }
    const latitude = Number(location2.getLatitude());
    const longitude = Number(location2.getLongitude());
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    const altitude = typeof location2.hasAltitude === "function" && location2.hasAltitude() ? Number(location2.getAltitude()) : 0;
    const accuracy = typeof location2.hasAccuracy === "function" && location2.hasAccuracy() ? Number(location2.getAccuracy()) : 0;
    const speed = typeof location2.hasSpeed === "function" && location2.hasSpeed() ? Number(location2.getSpeed()) : 0;
    const bearing = typeof location2.hasBearing === "function" && location2.hasBearing() ? Number(location2.getBearing()) : 0;
    const timestamp = Number(location2.getTime ? location2.getTime() : Date.now());
    const provider = String(location2.getProvider ? location2.getProvider() : providerName || "android-location");
    return {
      latitude,
      longitude,
      altitude,
      accuracy,
      speed,
      bearing,
      timestamp,
      provider,
      coordinateSystem: "wgs84",
      source
    };
  }
  const _sfc_main$i = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentCoords = vue.ref(null);
      const showSideMenu = vue.ref(false);
      const pageScrollTop = vue.ref(0);
      const pullDownY = vue.ref(0);
      const isTransitioning = vue.ref(false);
      const touchStartY = vue.ref(0);
      const featuredDestinations = vue.computed(() => {
        if (!currentCoords.value) {
          return destinationList.slice(0, 3).map((item) => ({ ...item, distanceText: "" }));
        }
        return destinationList.map((item) => {
          const distanceKm = getDistanceKm2(currentCoords.value, item.coordinates);
          return {
            ...item,
            distanceKm,
            distanceText: formatDistance(distanceKm)
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
      });
      const featuredSectionTitle = vue.computed(() => currentCoords.value ? "附近景区" : "精选景区");
      const featuredColumns = vue.computed(() => splitAlternatingColumns(featuredDestinations.value));
      const nicheDestinationIds = [48, 52, 55, 58, 62];
      const nicheDestinations = vue.computed(() => destinationList.filter((item) => nicheDestinationIds.includes(item.id)));
      const nicheColumns = vue.computed(() => splitAlternatingColumns(nicheDestinations.value));
      onLoad(async () => {
        try {
          const location2 = await getCurrentLocation();
          currentCoords.value = {
            longitude: location2.longitude,
            latitude: location2.latitude
          };
        } catch (error) {
          currentCoords.value = null;
        }
      });
      onPageScroll((event) => {
        pageScrollTop.value = event.scrollTop || 0;
      });
      function handleTouchStart(event) {
        var _a;
        if (pageScrollTop.value > 5) {
          touchStartY.value = 0;
          return;
        }
        const touch = (_a = event.touches) == null ? void 0 : _a[0];
        touchStartY.value = (touch == null ? void 0 : touch.clientY) || 0;
        isTransitioning.value = false;
      }
      function handleTouchMove(event) {
        var _a;
        if (!touchStartY.value || pageScrollTop.value > 5)
          return;
        const touch = (_a = event.touches) == null ? void 0 : _a[0];
        const currentY = (touch == null ? void 0 : touch.clientY) || 0;
        const deltaY = currentY - touchStartY.value;
        if (deltaY > 0) {
          pullDownY.value = deltaY * 0.4;
        } else {
          pullDownY.value = 0;
        }
      }
      function handleTouchEnd() {
        touchStartY.value = 0;
        if (pullDownY.value > 0) {
          isTransitioning.value = true;
          pullDownY.value = 0;
        }
      }
      const heroBgStyle = vue.computed(() => {
        const scale = 1 + pullDownY.value * 25e-4;
        return {
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: isTransitioning.value ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
        };
      });
      const contentStyle = vue.computed(() => {
        return {
          transform: `translateY(${pullDownY.value}px)`,
          transition: isTransitioning.value ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
        };
      });
      function goToDestinations() {
        uni.reLaunch({ url: "/pages/destinations/index" });
      }
      function openDetail(id) {
        uni.navigateTo({ url: `/pages/destination-detail/index?id=${id}` });
      }
      function openHikingMode() {
        uni.navigateTo({ url: "/pages/hiking/index" });
      }
      function openSideMenu() {
        showSideMenu.value = true;
      }
      function closeSideMenu() {
        showSideMenu.value = false;
      }
      function openHikingFromMenu() {
        closeSideMenu();
        openHikingMode();
      }
      function openAiForDestination(item) {
        const context = [
          `景区名称：${item.name}`,
          `所在地区：${item.location}`,
          `景区分类：${item.category}`,
          `景区介绍：${item.description}`,
          `适合玩法：${item.suggestion}`,
          `游玩提示：${item.tips.join("；")}`
        ].join("\n");
        navigateToAiAssistant({
          title: item.name,
          desc: item.description,
          source: "首页",
          prompt: `我准备去${item.name}，请先告诉我这个景区最适合怎么安排。`,
          context,
          autoAsk: false
        });
      }
      function navigateToAiAssistant(params) {
        const query = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join("&");
        uni.navigateTo({ url: `/pages/ai-assistant/index?${query}` });
      }
      function getDistanceKm2(from, to) {
        if (!from || !to) {
          return Number.POSITIVE_INFINITY;
        }
        const toRad = (value) => value * Math.PI / 180;
        const earthRadius = 6371;
        const dLat = toRad(to.latitude - from.latitude);
        const dLng = toRad(to.longitude - from.longitude);
        const lat1 = toRad(from.latitude);
        const lat2 = toRad(to.latitude);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
      }
      function formatDistance(distanceKm) {
        if (!Number.isFinite(distanceKm)) {
          return "";
        }
        if (distanceKm < 1) {
          return `约 ${Math.round(distanceKm * 1e3)} 米`;
        }
        return `约 ${distanceKm.toFixed(1)} 公里`;
      }
      function splitAlternatingColumns(list) {
        return list.reduce(
          (columns, item, index) => {
            if (index % 2 === 0) {
              columns.left.push(item);
            } else {
              columns.right.push(item);
            }
            return columns;
          },
          { left: [], right: [] }
        );
      }
      const __returned__ = { currentCoords, showSideMenu, pageScrollTop, pullDownY, isTransitioning, touchStartY, featuredDestinations, featuredSectionTitle, featuredColumns, nicheDestinationIds, nicheDestinations, nicheColumns, handleTouchStart, handleTouchMove, handleTouchEnd, heroBgStyle, contentStyle, goToDestinations, openDetail, openHikingMode, openSideMenu, closeSideMenu, openHikingFromMenu, openAiForDestination, navigateToAiAssistant, getDistanceKm: getDistanceKm2, formatDistance, splitAlternatingColumns, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onPageScroll() {
        return onPageScroll;
      }, AppTabBar, CachedImage, get destinationList() {
        return destinationList;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode(
        "view",
        {
          class: "page-scroll",
          onTouchstart: $setup.handleTouchStart,
          onTouchmove: $setup.handleTouchMove,
          onTouchend: $setup.handleTouchEnd,
          onTouchcancel: $setup.handleTouchEnd
        },
        [
          vue.createElementVNode("view", { class: "hero hero-gradient atlas-hero" }, [
            vue.createElementVNode(
              "view",
              {
                class: "hero-bg-image",
                style: vue.normalizeStyle($setup.heroBgStyle)
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", { class: "hero-silk-band hero-silk-band-left" }),
            vue.createElementVNode("view", { class: "hero-silk-band hero-silk-band-right" }),
            vue.createElementVNode("view", { class: "hero-overlay" }),
            vue.createElementVNode("view", { class: "hero-topbar" }, [
              vue.createElementVNode("view", {
                class: "menu-toggle",
                onClick: $setup.openSideMenu
              }, [
                vue.createElementVNode("text", { class: "menu-line" }),
                vue.createElementVNode("text", { class: "menu-line" }),
                vue.createElementVNode("text", { class: "menu-line short-line" })
              ])
            ]),
            vue.createElementVNode("view", { class: "hero-content" }, [
              vue.createElementVNode("text", { class: "hero-kicker" }, "Seeking the Silk Road in Xinjiang"),
              vue.createElementVNode("text", { class: "hero-title" }, "丝路疆寻"),
              vue.createElementVNode("text", { class: "hero-subtitle" }, "沿着丝路风景，开启一段辽阔而热烈的旅程")
            ])
          ]),
          vue.createElementVNode(
            "view",
            {
              class: "main-content",
              style: vue.normalizeStyle($setup.contentStyle)
            },
            [
              vue.createElementVNode("view", { class: "section section-block featured-section atlas-panel featured-panel" }, [
                vue.createElementVNode("view", { class: "section-head" }, [
                  vue.createElementVNode("view", { class: "section-copy" }, [
                    vue.createElementVNode("text", { class: "section-kicker" }, "Curated Selection"),
                    vue.createElementVNode(
                      "text",
                      { class: "section-title editorial-title" },
                      vue.toDisplayString($setup.featuredSectionTitle),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("text", {
                    class: "link-text",
                    onClick: $setup.goToDestinations
                  }, "查看全部")
                ]),
                vue.createElementVNode("view", { class: "featured-list waterfall-grid" }, [
                  vue.createElementVNode("view", { class: "waterfall-column" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.featuredColumns.left, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "destination-card editorial-card",
                          onClick: ($event) => $setup.openDetail(item.id)
                        }, [
                          vue.createElementVNode("view", { class: "editorial-media-wrap" }, [
                            vue.createElementVNode("view", { class: "image-wrap editorial-image atlas-silk-sheen" }, [
                              vue.createVNode($setup["CachedImage"], {
                                src: item.image,
                                "image-class": "cover-image"
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "editorial-image-mask" }),
                              vue.createElementVNode("view", { class: "rating-badge-glass editorial-rating-badge" }, [
                                vue.createElementVNode("text", { class: "icon-star" }, "★"),
                                vue.createElementVNode(
                                  "text",
                                  { class: "rating-num" },
                                  vue.toDisplayString(item.rating),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "destination-body editorial-body" }, [
                            vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "destination-title" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("view", {
                                class: "mini-ai-tag editorial-ai-tag",
                                onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                              }, [
                                vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                                vue.createElementVNode("text", null, "Ask AI")
                              ], 8, ["onClick"])
                            ]),
                            vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                              vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                              vue.createElementVNode("text", { class: "destination-meta" }, [
                                vue.createTextVNode(
                                  vue.toDisplayString(item.location),
                                  1
                                  /* TEXT */
                                ),
                                item.distanceText ? (vue.openBlock(), vue.createElementBlock(
                                  "text",
                                  { key: 0 },
                                  " · " + vue.toDisplayString(item.distanceText),
                                  1
                                  /* TEXT */
                                )) : vue.createCommentVNode("v-if", true)
                              ])
                            ]),
                            vue.createElementVNode(
                              "text",
                              { class: "destination-desc-short" },
                              vue.toDisplayString(item.description),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  vue.createElementVNode("view", { class: "waterfall-column" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.featuredColumns.right, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "destination-card editorial-card",
                          onClick: ($event) => $setup.openDetail(item.id)
                        }, [
                          vue.createElementVNode("view", { class: "editorial-media-wrap" }, [
                            vue.createElementVNode("view", { class: "image-wrap editorial-image atlas-silk-sheen" }, [
                              vue.createVNode($setup["CachedImage"], {
                                src: item.image,
                                "image-class": "cover-image"
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "editorial-image-mask" }),
                              vue.createElementVNode("view", { class: "rating-badge-glass editorial-rating-badge" }, [
                                vue.createElementVNode("text", { class: "icon-star" }, "★"),
                                vue.createElementVNode(
                                  "text",
                                  { class: "rating-num" },
                                  vue.toDisplayString(item.rating),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "destination-body editorial-body" }, [
                            vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "destination-title" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("view", {
                                class: "mini-ai-tag editorial-ai-tag",
                                onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                              }, [
                                vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                                vue.createElementVNode("text", null, "Ask AI")
                              ], 8, ["onClick"])
                            ]),
                            vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                              vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                              vue.createElementVNode("text", { class: "destination-meta" }, [
                                vue.createTextVNode(
                                  vue.toDisplayString(item.location),
                                  1
                                  /* TEXT */
                                ),
                                item.distanceText ? (vue.openBlock(), vue.createElementBlock(
                                  "text",
                                  { key: 0 },
                                  " · " + vue.toDisplayString(item.distanceText),
                                  1
                                  /* TEXT */
                                )) : vue.createCommentVNode("v-if", true)
                              ])
                            ]),
                            vue.createElementVNode(
                              "text",
                              { class: "destination-desc-short" },
                              vue.toDisplayString(item.description),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "section section-block niche-section atlas-panel" }, [
                vue.createElementVNode("view", { class: "section-head" }, [
                  vue.createElementVNode("view", { class: "section-copy centered-copy" }, [
                    vue.createElementVNode("text", { class: "section-kicker secondary-kicker" }, "Hidden Gems"),
                    vue.createElementVNode("text", { class: "section-title editorial-title" }, "小众推荐")
                  ])
                ]),
                vue.createElementVNode("text", { class: "muted-text niche-note" }, "适合想避开常规热门点的人"),
                vue.createElementVNode("view", { class: "niche-list editorial-niche-list waterfall-grid" }, [
                  vue.createElementVNode("view", { class: "waterfall-column" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.nicheColumns.left, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: vue.normalizeClass(["niche-card editorial-niche-card", { "is-reversed": index % 2 === 1 }]),
                          onClick: ($event) => $setup.openDetail(item.id)
                        }, [
                          vue.createElementVNode("view", { class: "niche-media-shell" }, [
                            vue.createElementVNode("view", { class: "image-wrap glass-wrap niche-image-wrap" }, [
                              vue.createVNode($setup["CachedImage"], {
                                src: item.image,
                                "image-class": "cover-image"
                              }, null, 8, ["src"])
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "destination-body niche-body editorial-niche-body" }, [
                            vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "destination-title niche-title" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("view", {
                                class: "mini-ai-tag editorial-ai-tag",
                                onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                              }, [
                                vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                                vue.createElementVNode("text", null, "Ask AI")
                              ], 8, ["onClick"])
                            ]),
                            vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                              vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                              vue.createElementVNode(
                                "text",
                                { class: "destination-meta" },
                                vue.toDisplayString(item.location),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode(
                              "text",
                              { class: "destination-desc-short niche-desc" },
                              vue.toDisplayString(item.description),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "niche-reason" },
                              vue.toDisplayString(item.suggestion),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  vue.createElementVNode("view", { class: "waterfall-column" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.nicheColumns.right, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: vue.normalizeClass(["niche-card editorial-niche-card", { "is-reversed": index % 2 === 0 }]),
                          onClick: ($event) => $setup.openDetail(item.id)
                        }, [
                          vue.createElementVNode("view", { class: "niche-media-shell" }, [
                            vue.createElementVNode("view", { class: "image-wrap glass-wrap niche-image-wrap" }, [
                              vue.createVNode($setup["CachedImage"], {
                                src: item.image,
                                "image-class": "cover-image"
                              }, null, 8, ["src"])
                            ])
                          ]),
                          vue.createElementVNode("view", { class: "destination-body niche-body editorial-niche-body" }, [
                            vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "destination-title niche-title" },
                                vue.toDisplayString(item.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("view", {
                                class: "mini-ai-tag editorial-ai-tag",
                                onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                              }, [
                                vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                                vue.createElementVNode("text", null, "Ask AI")
                              ], 8, ["onClick"])
                            ]),
                            vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                              vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                              vue.createElementVNode(
                                "text",
                                { class: "destination-meta" },
                                vue.toDisplayString(item.location),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode(
                              "text",
                              { class: "destination-desc-short niche-desc" },
                              vue.toDisplayString(item.description),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "niche-reason" },
                              vue.toDisplayString(item.suggestion),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode("view", { class: "bottom-space" })
        ],
        32
        /* NEED_HYDRATION */
      ),
      $setup.showSideMenu ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "side-menu-mask",
        onClick: $setup.closeSideMenu
      }, [
        vue.createElementVNode("view", {
          class: "side-menu-panel",
          onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "side-menu-head" }, [
            vue.createElementVNode("text", { class: "side-menu-title" }, "丝路疆寻"),
            vue.createElementVNode("text", {
              class: "side-menu-close",
              onClick: $setup.closeSideMenu
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "side-menu-copy" }, "把常用入口收进这里，首页画面更干净。"),
          vue.createElementVNode("view", {
            class: "side-menu-item primary-item",
            onClick: $setup.openHikingFromMenu
          }, [
            vue.createElementVNode("view", { class: "side-menu-icon" }, "🚶"),
            vue.createElementVNode("view", { class: "side-menu-content" }, [
              vue.createElementVNode("text", { class: "side-menu-label" }, "徒步模式"),
              vue.createElementVNode("text", { class: "side-menu-desc" }, "定位、离线地图、SOS 与露营风险提示")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/home/index" })
    ]);
  }
  const PagesHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-4978fed5"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/home/index.vue"]]);
  function request$4(url, data = {}) {
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method: "GET",
        timeout: 15e3,
        data,
        success: (res) => {
          var _a;
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || `HTTP ${res.statusCode}`));
            return;
          }
          resolve(res.data);
        },
        fail: reject
      });
    });
  }
  function hasContentApi() {
    return hasApiBaseUrl();
  }
  function mergeDestinationWithLocal(item) {
    if (!item) {
      return item;
    }
    const local = getDestinationById(item.id);
    if (!local) {
      return item;
    }
    return {
      ...local,
      ...item,
      image: local.image || item.image || ""
    };
  }
  function getLocalDestinationList() {
    return destinationList;
  }
  function getDestinationCategories(list = destinationList) {
    return ["全部", ...new Set(list.map((item) => item.category).filter(Boolean))];
  }
  function getDestinationRegions(list = destinationList) {
    const regionOrder2 = [
      "乌鲁木齐市",
      "克拉玛依市",
      "吐鲁番市",
      "昌吉州",
      "博州",
      "巴州",
      "阿克苏地区",
      "喀什地区",
      "和田地区",
      "伊犁州",
      "塔城地区",
      "阿勒泰地区"
    ];
    const knownRegions = regionOrder2.filter((item) => list.some((spot) => spot.region === item));
    const extraRegions = [...new Set(list.map((item) => item.region).filter(Boolean))].filter((item) => !regionOrder2.includes(item));
    return ["全部", ...knownRegions, ...extraRegions];
  }
  async function getDestinationFeed(params = {}) {
    if (!hasContentApi()) {
      return destinationList;
    }
    try {
      const data = await request$4(`${API_BASE_URL}/destinations`, params);
      return Array.isArray(data == null ? void 0 : data.list) ? data.list.map(mergeDestinationWithLocal) : destinationList;
    } catch (error) {
      return destinationList;
    }
  }
  const _sfc_main$h = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchQuery = vue.ref("");
      const currentCategory = vue.ref("全部");
      const currentRegion = vue.ref("全部");
      const showFilterPanel = vue.ref(false);
      const destinations = vue.ref(getLocalDestinationList());
      const categories = vue.computed(() => getDestinationCategories(destinations.value));
      const regions = vue.computed(() => getDestinationRegions(destinations.value));
      const filteredDestinations = vue.computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return destinations.value.filter((item) => {
          const matchesCategory = currentCategory.value === "全部" || item.category === currentCategory.value;
          const matchesRegion = currentRegion.value === "全部" || item.region === currentRegion.value;
          const searchText = [item.name, item.location, item.region, item.category].join(" ").toLowerCase();
          const matchesSearch = !query || searchText.includes(query);
          return matchesCategory && matchesRegion && matchesSearch;
        });
      });
      const destinationColumns = vue.computed(() => splitAlternatingColumns(filteredDestinations.value));
      onShow(async () => {
        destinations.value = await getDestinationFeed();
        if (!categories.value.includes(currentCategory.value)) {
          currentCategory.value = "全部";
        }
        if (!regions.value.includes(currentRegion.value)) {
          currentRegion.value = "全部";
        }
      });
      function openDetail(id) {
        uni.navigateTo({ url: `/pages/destination-detail/index?id=${id}` });
      }
      function openFilterPanel() {
        showFilterPanel.value = true;
      }
      function closeFilterPanel() {
        showFilterPanel.value = false;
      }
      function resetFilters() {
        currentCategory.value = "全部";
        currentRegion.value = "全部";
      }
      function openAiForDestination(item) {
        const context = [
          `景区名称：${item.name}`,
          `所在地区：${item.location}`,
          `景区分类：${item.category}`,
          `景区介绍：${item.description}`,
          `适合玩法：${item.suggestion || "可结合当地路线灵活安排"}`,
          `游玩提示：${Array.isArray(item.tips) && item.tips.length ? item.tips.join("；") : "建议根据季节和天气提前确认开放信息"}`
        ].join("\n");
        navigateToAiAssistant({
          title: item.name,
          desc: item.description,
          source: "目的地页",
          prompt: `我准备去${item.name}，请先告诉我这个景区最适合怎么安排。`,
          context,
          autoAsk: false
        });
      }
      function navigateToAiAssistant(params) {
        const query = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join("&");
        uni.navigateTo({ url: `/pages/ai-assistant/index?${query}` });
      }
      function splitAlternatingColumns(list) {
        return list.reduce(
          (columns, item, index) => {
            if (index % 2 === 0) {
              columns.left.push(item);
            } else {
              columns.right.push(item);
            }
            return columns;
          },
          { left: [], right: [] }
        );
      }
      const __returned__ = { searchQuery, currentCategory, currentRegion, showFilterPanel, destinations, categories, regions, filteredDestinations, destinationColumns, openDetail, openFilterPanel, closeFilterPanel, resetFilters, openAiForDestination, navigateToAiAssistant, splitAlternatingColumns, computed: vue.computed, ref: vue.ref, get onShow() {
        return onShow;
      }, AppTabBar, CachedImage, get getDestinationCategories() {
        return getDestinationCategories;
      }, get getDestinationFeed() {
        return getDestinationFeed;
      }, get getDestinationRegions() {
        return getDestinationRegions;
      }, get getLocalDestinationList() {
        return getLocalDestinationList;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient top-banner section atlas-hero" }, [
          vue.createElementVNode("view", { class: "hero-overlay" }),
          vue.createElementVNode("view", { class: "banner-content" }, [
            vue.createElementVNode("text", { class: "section-kicker" }, "Curated Atlas"),
            vue.createElementVNode("text", { class: "banner-title" }, "探索新疆景区"),
            vue.createElementVNode("text", { class: "banner-subtitle" }, "把草原、峡谷、湖泊与胡杨林，收进一份可以慢慢翻阅的目的地清单。"),
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.createElementVNode("text", { class: "search-mark" }, "搜"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchQuery = $event),
                  class: "search-input",
                  placeholder: "搜索景区、地区或分类..."
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.searchQuery]
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block result-panel atlas-panel floating-panel" }, [
          vue.createElementVNode("view", { class: "toolbar-row" }, [
            vue.createElementVNode("view", { class: "section-copy" }, [
              vue.createElementVNode("text", { class: "section-kicker secondary-kicker" }, "Destination Feed"),
              vue.createElementVNode(
                "text",
                { class: "section-title editorial-title" },
                vue.toDisplayString($setup.currentCategory === "全部" && $setup.currentRegion === "全部" ? "全部目的地" : "筛选结果"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "filter-trigger",
              onClick: $setup.openFilterPanel
            }, [
              vue.createElementVNode("text", { class: "filter-icon" }, "筛"),
              vue.createElementVNode("text", null, "筛选")
            ])
          ]),
          $setup.currentCategory !== "全部" || $setup.currentRegion !== "全部" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "active-filters"
          }, [
            $setup.currentCategory !== "全部" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "active-chip",
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.currentCategory = "全部")
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.currentCategory),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "chip-close" }, "×")
            ])) : vue.createCommentVNode("v-if", true),
            $setup.currentRegion !== "全部" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "active-chip",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.currentRegion = "全部")
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.currentRegion),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "chip-close" }, "×")
            ])) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "result-meta-row" }, [
            vue.createElementVNode(
              "text",
              { class: "muted-text" },
              "共找到 " + vue.toDisplayString($setup.filteredDestinations.length) + " 个景区",
              1
              /* TEXT */
            ),
            $setup.searchQuery ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "muted-text"
              },
              "关键词：" + vue.toDisplayString($setup.searchQuery),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          $setup.filteredDestinations.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "featured-list waterfall-grid"
          }, [
            vue.createElementVNode("view", { class: "waterfall-column" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.destinationColumns.left, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "destination-card editorial-card",
                    onClick: ($event) => $setup.openDetail(item.id)
                  }, [
                    vue.createElementVNode("view", { class: "editorial-media-wrap" }, [
                      vue.createElementVNode("view", { class: "image-wrap editorial-image atlas-silk-sheen" }, [
                        vue.createVNode($setup["CachedImage"], {
                          src: item.image,
                          "image-class": "cover-image"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "editorial-image-mask" }),
                        vue.createElementVNode("view", { class: "rating-badge-glass editorial-rating-badge" }, [
                          vue.createElementVNode("text", { class: "icon-star" }, "★"),
                          vue.createElementVNode(
                            "text",
                            { class: "rating-num" },
                            vue.toDisplayString(item.rating),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "destination-body editorial-body" }, [
                      vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "destination-title" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", {
                          class: "mini-ai-tag editorial-ai-tag",
                          onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                        }, [
                          vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                          vue.createElementVNode("text", null, "Ask AI")
                        ], 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "editorial-chip-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "editorial-info-chip" },
                          vue.toDisplayString(item.category),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "editorial-info-chip editorial-info-chip-soft" },
                          vue.toDisplayString(item.region),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                        vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                        vue.createElementVNode(
                          "text",
                          { class: "destination-meta" },
                          vue.toDisplayString(item.location),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "destination-desc-short" },
                        vue.toDisplayString(item.description),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "waterfall-column" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.destinationColumns.right, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "destination-card editorial-card",
                    onClick: ($event) => $setup.openDetail(item.id)
                  }, [
                    vue.createElementVNode("view", { class: "editorial-media-wrap" }, [
                      vue.createElementVNode("view", { class: "image-wrap editorial-image atlas-silk-sheen" }, [
                        vue.createVNode($setup["CachedImage"], {
                          src: item.image,
                          "image-class": "cover-image"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "editorial-image-mask" }),
                        vue.createElementVNode("view", { class: "rating-badge-glass editorial-rating-badge" }, [
                          vue.createElementVNode("text", { class: "icon-star" }, "★"),
                          vue.createElementVNode(
                            "text",
                            { class: "rating-num" },
                            vue.toDisplayString(item.rating),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "destination-body editorial-body" }, [
                      vue.createElementVNode("view", { class: "title-row editorial-title-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "destination-title" },
                          vue.toDisplayString(item.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", {
                          class: "mini-ai-tag editorial-ai-tag",
                          onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                        }, [
                          vue.createElementVNode("text", { class: "icon-sparkle" }, "✦"),
                          vue.createElementVNode("text", null, "Ask AI")
                        ], 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "editorial-chip-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "editorial-info-chip" },
                          vue.toDisplayString(item.category),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "editorial-info-chip editorial-info-chip-soft" },
                          vue.toDisplayString(item.region),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "meta-row editorial-meta-row" }, [
                        vue.createElementVNode("text", { class: "icon-location" }, "📍"),
                        vue.createElementVNode(
                          "text",
                          { class: "destination-meta" },
                          vue.toDisplayString(item.location),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "destination-desc-short" },
                        vue.toDisplayString(item.description),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-state-title" }, "暂时没有匹配的目的地"),
            vue.createElementVNode("text", { class: "empty-state-copy" }, "换个关键词，或在筛选面板里重置分类与地区试试。")
          ]))
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      $setup.showFilterPanel ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "filter-mask",
        onClick: $setup.closeFilterPanel
      }, [
        vue.createElementVNode("view", {
          class: "filter-panel",
          onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "filter-panel-head" }, [
            vue.createElementVNode("text", { class: "filter-panel-title" }, "筛选目的地"),
            vue.createElementVNode("text", {
              class: "filter-panel-close",
              onClick: $setup.closeFilterPanel
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "filter-group" }, [
            vue.createElementVNode("text", { class: "filter-group-title" }, "景区分类"),
            vue.createElementVNode("view", { class: "filter-chip-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.categories, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item,
                    class: vue.normalizeClass(["filter-chip", { active: $setup.currentCategory === item }]),
                    onClick: ($event) => $setup.currentCategory = item
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "filter-group" }, [
            vue.createElementVNode("text", { class: "filter-group-title" }, "所在地区"),
            vue.createElementVNode("view", { class: "filter-chip-grid" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.regions, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item,
                    class: vue.normalizeClass(["filter-chip region-chip", { active: $setup.currentRegion === item }]),
                    onClick: ($event) => $setup.currentRegion = item
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "filter-actions" }, [
            vue.createElementVNode("view", {
              class: "filter-reset-btn",
              onClick: $setup.resetFilters
            }, "重置"),
            vue.createElementVNode("view", {
              class: "filter-apply-btn",
              onClick: $setup.closeFilterPanel
            }, "查看结果")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/destinations/index" })
    ]);
  }
  const PagesDestinationsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-9dd01296"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/destinations/index.vue"]]);
  const AUTH_API_BASE_URL = API_BASE_URL;
  const AUTH_TOKEN_STORAGE = "meet-xinjiang-auth-token";
  const AUTH_USER_STORAGE = "meet-xinjiang-auth-user";
  function hasAuthApiBaseUrl() {
    return Boolean(AUTH_API_BASE_URL && AUTH_API_BASE_URL.trim());
  }
  function normalizeStoredUser(user) {
    if (!user || typeof user !== "object") {
      return user;
    }
    const avatarUrl = normalizeApiAssetUrl(user.avatar_url || user.avatar);
    return {
      ...user,
      avatar_url: avatarUrl,
      avatar: avatarUrl
    };
  }
  function getStoredAuthToken() {
    const token = uni.getStorageSync(AUTH_TOKEN_STORAGE);
    return typeof token === "string" ? token : "";
  }
  function getStoredAuthUser() {
    try {
      const raw = uni.getStorageSync(AUTH_USER_STORAGE);
      return raw ? normalizeStoredUser(JSON.parse(raw)) : null;
    } catch (error) {
      return null;
    }
  }
  function saveAuthSession({ token, user }) {
    uni.setStorageSync(AUTH_TOKEN_STORAGE, token || "");
    uni.setStorageSync(AUTH_USER_STORAGE, JSON.stringify(normalizeStoredUser(user) || null));
  }
  function clearAuthSession() {
    uni.removeStorageSync(AUTH_TOKEN_STORAGE);
    uni.removeStorageSync(AUTH_USER_STORAGE);
  }
  function normalizeLocation(location2) {
    if (!location2) {
      return null;
    }
    const latitude = Number(location2.latitude);
    const longitude = Number(location2.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude,
      altitude: Number(location2.altitude || 0),
      accuracy: Number(location2.accuracy || 0),
      speed: Number(location2.speed || 0),
      bearing: Number(location2.bearing || location2.heading || 0),
      timestamp: Number(location2.timestamp || Date.now()),
      segmentIndex: Number.isFinite(Number(location2.segmentIndex)) ? Number(location2.segmentIndex) : 0,
      provider: String(location2.provider || location2.sourceProvider || ""),
      source: String(location2.source || ""),
      coordinateSystem: String(location2.coordinateSystem || location2.coordsType || "")
    };
  }
  function formatCoordinate(value, type) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return "--";
    }
    const suffix = type === "lat" ? numeric >= 0 ? "N" : "S" : numeric >= 0 ? "E" : "W";
    return `${Math.abs(numeric).toFixed(5)}°${suffix}`;
  }
  function getDistanceKm(from, to) {
    const start = normalizeLocation(from);
    const end = normalizeLocation(to);
    if (!start || !end) {
      return 0;
    }
    const rad = Math.PI / 180;
    const lat1 = start.latitude * rad;
    const lat2 = end.latitude * rad;
    const deltaLat = lat2 - lat1;
    const deltaLng = (end.longitude - start.longitude) * rad;
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function sumTrackDistanceKm(points = []) {
    if (!Array.isArray(points) || points.length < 2) {
      return 0;
    }
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      const previous = normalizeLocation(points[index - 1]);
      const current = normalizeLocation(points[index]);
      if (!previous || !current) {
        continue;
      }
      if (Number(previous.segmentIndex || 0) !== Number(current.segmentIndex || 0)) {
        continue;
      }
      total += getDistanceKm(previous, current);
    }
    return total;
  }
  function buildTrackPolyline(points = []) {
    if (!Array.isArray(points) || !points.length) {
      return [];
    }
    const normalizedPoints = points.map(normalizeLocation).filter(Boolean);
    const segments = [];
    let currentSegmentKey = null;
    let currentSegmentPoints = [];
    normalizedPoints.forEach((item) => {
      const nextKey = Number(item.segmentIndex || 0);
      if (currentSegmentKey === null || currentSegmentKey !== nextKey) {
        if (currentSegmentPoints.length) {
          segments.push(currentSegmentPoints);
        }
        currentSegmentKey = nextKey;
        currentSegmentPoints = [];
      }
      currentSegmentPoints.push({ latitude: item.latitude, longitude: item.longitude });
    });
    if (currentSegmentPoints.length) {
      segments.push(currentSegmentPoints);
    }
    return segments.filter((segment) => segment.length).map((segment) => ({
      points: segment,
      color: "#FF7A00",
      width: 5,
      borderColor: "#C14F00",
      borderWidth: 1
    }));
  }
  function buildCurrentMarker(location2, isTracking = false, profile = {}) {
    const normalized = normalizeLocation(location2);
    if (!normalized) {
      return [];
    }
    const avatarUrl = String(profile.avatarUrl || "").trim();
    const avatarInitial = String(profile.avatarInitial || "游").trim().slice(0, 1) || "游";
    const statusText = isTracking ? "记录中" : "当前位置";
    return [
      {
        id: 1,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        width: 44,
        height: 44,
        avatarUrl,
        avatarInitial,
        statusText,
        callout: {
          content: statusText,
          display: "ALWAYS",
          fontSize: 11,
          borderRadius: 12,
          bgColor: "#1C1C1E",
          color: "#FFFFFF",
          padding: 6
        }
      }
    ];
  }
  function formatMetric(value, digits = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return "--";
    }
    return numeric.toFixed(digits);
  }
  function normalizeGuideTrack(track) {
    if (!track) {
      return null;
    }
    const source = Array.isArray(track) ? { points: track } : track;
    const points = Array.isArray(source.points) ? source.points.map(normalizeLocation).filter(Boolean) : [];
    if (!points.length) {
      return null;
    }
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const durationMs = resolveTrackDuration(source.durationMs, startPoint, endPoint);
    const distanceKm = resolveTrackDistance(source.distanceKm, points);
    const altitudeGain = resolveAltitudeGain(source.altitudeGain, points);
    const segmentCount = resolveSegmentCount(points);
    return {
      points,
      pointCount: Number(source.pointCount) || points.length,
      segmentCount,
      startPoint,
      endPoint,
      distanceKm,
      durationMs,
      altitudeGain,
      capturedAt: Number(source.capturedAt) || endPoint.timestamp || Date.now()
    };
  }
  function createGuideTrackPayload(points = [], extras = {}) {
    const normalized = normalizeGuideTrack({ points, ...extras });
    if (!normalized) {
      return null;
    }
    return {
      points: normalized.points,
      pointCount: normalized.pointCount,
      segmentCount: normalized.segmentCount,
      distanceKm: normalized.distanceKm,
      durationMs: normalized.durationMs,
      altitudeGain: normalized.altitudeGain,
      capturedAt: normalized.capturedAt,
      startPoint: normalized.startPoint,
      endPoint: normalized.endPoint
    };
  }
  function formatTrackDuration(durationMs) {
    const totalMinutes = Math.max(0, Math.round(Number(durationMs || 0) / 6e4));
    if (!totalMinutes) {
      return "刚开始";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (!hours) {
      return `${minutes} 分钟`;
    }
    if (!minutes) {
      return `${hours} 小时`;
    }
    return `${hours} 小时 ${minutes} 分钟`;
  }
  function resolveTrackDuration(rawDuration, startPoint, endPoint) {
    const durationMs = Number(rawDuration);
    if (Number.isFinite(durationMs) && durationMs > 0) {
      return durationMs;
    }
    const startTime = Number((startPoint == null ? void 0 : startPoint.timestamp) || 0);
    const endTime = Number((endPoint == null ? void 0 : endPoint.timestamp) || 0);
    if (startTime > 0 && endTime >= startTime) {
      return endTime - startTime;
    }
    return 0;
  }
  function resolveTrackDistance(rawDistance, points) {
    const distanceKm = Number(rawDistance);
    if (Number.isFinite(distanceKm) && distanceKm > 0) {
      return distanceKm;
    }
    return sumTrackDistanceKm(points);
  }
  function resolveAltitudeGain(rawAltitudeGain, points) {
    var _a, _b;
    const altitudeGain = Number(rawAltitudeGain);
    if (Number.isFinite(altitudeGain) && altitudeGain > 0) {
      return altitudeGain;
    }
    let totalGain = 0;
    for (let index = 1; index < points.length; index += 1) {
      const delta = Number(((_a = points[index]) == null ? void 0 : _a.altitude) || 0) - Number(((_b = points[index - 1]) == null ? void 0 : _b.altitude) || 0);
      if (delta > 0) {
        totalGain += delta;
      }
    }
    return totalGain;
  }
  function resolveSegmentCount(points = []) {
    if (!Array.isArray(points) || !points.length) {
      return 0;
    }
    const segmentKeys = new Set(
      points.map((item) => Number((item == null ? void 0 : item.segmentIndex) || 0)).filter((item) => Number.isFinite(item))
    );
    return segmentKeys.size || 1;
  }
  const PUBLISHED_GUIDES_STORAGE = "meet-xinjiang-published-guides";
  const defaultCoverOptions = [
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Nalati_Grassland_2.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fc/East_gate_of_the_Ancient_City_of_Kashi_%2820230923104429%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1d/%E4%B8%AD%E5%9B%BD%E6%96%B0%E7%96%86%E9%84%AF%E5%96%84%E5%8E%BF%E5%BA%93%E6%9C%A8%E5%A1%94%E6%A0%BC%E6%B2%99%E6%BC%A0_China_Xinjiang%2C_Piqan_County_Desert_Chi_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/%E5%A4%A9%E5%B1%B1%E5%A4%A9%E6%B1%A02_-_panoramio.jpg"
  ];
  const defaultAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160";
  function deriveContentType(item = {}, images = []) {
    if (item.contentType) {
      return item.contentType;
    }
    if (item.video) {
      return "视频";
    }
    if (images.length) {
      return "图文";
    }
    return "文字";
  }
  function normalizeGuide(item = {}, index = 0) {
    if (!item.id || !item.title) {
      return null;
    }
    const images = Array.isArray(item.images) && item.images.length ? item.images.filter(Boolean) : item.image ? [item.image] : [];
    const contentType = deriveContentType(item, images);
    const previewImage = images[0] || item.videoPoster || item.image || "";
    const summaryText = item.excerpt || item.summary || "";
    const hikingTrack = normalizeGuideTrack(item.hikingTrack);
    return {
      id: item.id,
      destinationId: item.destinationId ? Number(item.destinationId) : null,
      title: item.title,
      category: item.category || "旅行分享",
      readTime: item.readTime || "3 分钟阅读",
      author: item.author || item.nickname || "新疆旅行者",
      publishDate: item.publishDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      views: item.views || "0",
      likes: item.likes || "0",
      location: item.location || item.locationTag || "新疆同城",
      image: previewImage,
      images,
      excerpt: summaryText,
      highlights: Array.isArray(item.highlights) ? item.highlights.slice(0, 3) : [],
      sections: Array.isArray(item.sections) ? item.sections : [],
      tips: Array.isArray(item.tips) ? item.tips : [],
      nickname: item.nickname || "新疆旅行者",
      authorAvatar: item.authorAvatar || defaultAvatar,
      primaryTab: item.primaryTab || "发现",
      cityTab: item.cityTab || "同城",
      subCategory: item.subCategory || "推荐",
      contentType,
      likesCount: Number(item.likesCount) || 0,
      saveCount: Number(item.saveCount) || 0,
      commentCount: Number(item.commentCount) || 0,
      coverAspectRatio: Number(item.coverAspectRatio) || (previewImage ? 1.42 : 0.9),
      badgeCount: Number(item.badgeCount) || 0,
      locationTag: item.locationTag || item.location || "新疆同城",
      imageCount: images.length,
      video: item.video || "",
      videoPoster: item.videoPoster || "",
      summaryText,
      hasMedia: Boolean(previewImage || item.video),
      hikingTrack,
      isUserPublished: true
    };
  }
  function saveFile(tempFilePath) {
    return new Promise((resolve, reject) => {
      uni.saveFile({
        tempFilePath,
        success: (res) => resolve(res.savedFilePath || tempFilePath),
        fail: reject
      });
    });
  }
  async function persistLocalFile(filePath = "") {
    if (!filePath) {
      return "";
    }
    if (/^(https?:|wxfile:|file:|_doc|_downloads|\/|[A-Za-z]:\\)/.test(filePath)) {
      return filePath;
    }
    try {
      return await saveFile(filePath);
    } catch (error) {
      return filePath;
    }
  }
  async function persistGuideImages(filePaths = []) {
    const list = Array.isArray(filePaths) ? filePaths.filter(Boolean).slice(0, 9) : [];
    const savedPaths = [];
    for (const filePath of list) {
      savedPaths.push(await persistLocalFile(filePath));
    }
    return savedPaths;
  }
  function getPublishedGuides() {
    try {
      const raw = uni.getStorageSync(PUBLISHED_GUIDES_STORAGE);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map((item, index) => normalizeGuide(item, index)).filter(Boolean).sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate)) || String(b.id).localeCompare(String(a.id)));
    } catch (error) {
      return [];
    }
  }
  function getPublishedGuideById(id) {
    return getPublishedGuides().find((item) => item.id === id) || null;
  }
  function savePublishedGuides(list) {
    uni.setStorageSync(PUBLISHED_GUIDES_STORAGE, JSON.stringify(Array.isArray(list) ? list : []));
  }
  function addPublishedGuide(payload, user = {}) {
    const current = getPublishedGuides();
    const guide = normalizeGuide(
      {
        ...payload,
        id: payload.id || `published-${Date.now()}`,
        author: user.nickname || payload.author,
        nickname: user.nickname || payload.nickname || "新疆旅行者",
        authorAvatar: user.avatar_url || payload.authorAvatar || defaultAvatar,
        publishDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        images: Array.isArray(payload.images) ? payload.images.filter(Boolean) : [],
        primaryTab: "发现",
        cityTab: "同城",
        badgeCount: 1,
        likesCount: 0,
        saveCount: 0,
        commentCount: 0,
        isUserPublished: true
      },
      current.length
    );
    if (!guide) {
      return null;
    }
    const next = [guide, ...current];
    savePublishedGuides(next);
    return guide;
  }
  const GUIDE_API_BASE = API_BASE_URL;
  function hasGuideApi() {
    return hasApiBaseUrl() && Boolean(GUIDE_API_BASE);
  }
  function buildUrl$1(path, params = {}) {
    const query = Object.entries(params).filter(([, value]) => value !== void 0 && value !== null && value !== "").map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    return query ? `${GUIDE_API_BASE}${path}?${query}` : `${GUIDE_API_BASE}${path}`;
  }
  function request$3(method, path, data, token = getStoredAuthToken()) {
    return new Promise((resolve, reject) => {
      const headers = {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      };
      requestJson({
        url: buildUrl$1(path, method === "GET" ? data : void 0),
        method,
        timeout: 2e4,
        headers,
        header: headers,
        data: method === "GET" ? void 0 : data
      }).then((res) => {
        var _a;
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const error = new Error(((_a = res.data) == null ? void 0 : _a.message) || `HTTP ${res.statusCode}`);
          error.statusCode = res.statusCode;
          reject(error);
          return;
        }
        resolve(res.data || {});
      }).catch((error) => {
        reject(new Error((error == null ? void 0 : error.message) || "无法连接攻略服务，请检查服务器地址或网络。"));
      });
    });
  }
  function normalizeGuideEntity(item) {
    if (!item || typeof item !== "object") {
      return item;
    }
    return {
      ...item,
      destinationId: item.destinationId ? Number(item.destinationId) : null,
      image: normalizeApiAssetUrl(item.image),
      images: Array.isArray(item.images) ? item.images.map(normalizeApiAssetUrl).filter(Boolean) : [],
      authorAvatar: normalizeApiAssetUrl(item.authorAvatar),
      video: normalizeApiAssetUrl(item.video),
      videoPoster: normalizeApiAssetUrl(item.videoPoster),
      hikingTrack: normalizeGuideTrack(item.hikingTrack)
    };
  }
  function uploadGuideMedia(filePath, mediaType = "image", token = getStoredAuthToken()) {
    return new Promise((resolve, reject) => {
      if (!hasGuideApi()) {
        reject(new Error("攻略服务地址未配置。"));
        return;
      }
      if (!token) {
        reject(new Error("登录状态失效，请重新登录。"));
        return;
      }
      uni.uploadFile({
        url: `${GUIDE_API_BASE}/guides/media`,
        filePath,
        name: "file",
        formData: { mediaType },
        timeout: 6e4,
        header: { Authorization: `Bearer ${token}` },
        success: (res) => {
          try {
            const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error((data == null ? void 0 : data.message) || "媒体上传失败。"));
              return;
            }
            resolve(data || {});
          } catch {
            reject(new Error("媒体上传响应解析失败。"));
          }
        },
        fail: () => {
          reject(new Error("媒体上传失败，请检查网络。"));
        }
      });
    });
  }
  async function createGuide(payload, token = getStoredAuthToken()) {
    if (hasGuideApi()) {
      const data = await request$3("POST", "/guides", payload, token);
      return normalizeGuideEntity((data == null ? void 0 : data.data) || null);
    }
    const savedImages = await persistGuideImages(payload.images);
    const savedVideo = payload.video ? await persistLocalFile(payload.video) : "";
    const savedVideoPoster = payload.videoPoster ? await persistLocalFile(payload.videoPoster) : "";
    return addPublishedGuide(
      {
        ...payload,
        image: payload.image || savedImages[0] || savedVideoPoster || "",
        images: savedImages,
        video: savedVideo,
        videoPoster: savedVideoPoster
      },
      getStoredAuthUser() || {}
    );
  }
  async function getGuideFeed(params = {}) {
    const publishedGuides = getPublishedGuides();
    if (!hasGuideApi()) {
      return publishedGuides;
    }
    const data = await request$3("GET", "/guides", params);
    return Array.isArray(data == null ? void 0 : data.list) ? data.list.map(normalizeGuideEntity) : [];
  }
  function normalizeSearchToken(value = "") {
    return String(value || "").trim().toLowerCase().replace(/[\s\-_/()（）【】\[\]、,，.。:：·]+/g, "");
  }
  function scoreGuideAgainstDestination(guide = {}, destination = {}) {
    const destinationName = normalizeSearchToken(destination.name);
    const haystacks = {
      title: normalizeSearchToken(guide.title),
      location: normalizeSearchToken([guide.location, guide.locationTag].filter(Boolean).join(" ")),
      excerpt: normalizeSearchToken([guide.excerpt, guide.summaryText].filter(Boolean).join(" ")),
      highlights: normalizeSearchToken(Array.isArray(guide.highlights) ? guide.highlights.join(" ") : "")
    };
    let score = 0;
    if (destinationName && haystacks.title.includes(destinationName)) {
      score += 10;
    }
    if (destinationName && haystacks.location.includes(destinationName)) {
      score += 8;
    }
    if (destinationName && haystacks.excerpt.includes(destinationName)) {
      score += 6;
    }
    if (destinationName && haystacks.highlights.includes(destinationName)) {
      score += 5;
    }
    return score;
  }
  async function getRelatedGuidesForDestination(destination, limit = 3) {
    if (!(destination == null ? void 0 : destination.name)) {
      return [];
    }
    if (destination.id) {
      const exactMatches = await getGuideFeed({ destinationId: destination.id });
      if (exactMatches.length) {
        return exactMatches.slice(0, Math.max(1, Number(limit) || 3));
      }
    }
    const guides = await getGuideFeed();
    return guides.map((guide) => ({
      ...guide,
      _relatedScore: scoreGuideAgainstDestination(guide, destination)
    })).filter((guide) => guide._relatedScore >= 6).sort((a, b) => {
      if (b._relatedScore !== a._relatedScore) {
        return b._relatedScore - a._relatedScore;
      }
      return String(b.publishDate || "").localeCompare(String(a.publishDate || ""));
    }).slice(0, Math.max(1, Number(limit) || 3)).map(({ _relatedScore, ...guide }) => guide);
  }
  async function getGuideDetail(id) {
    if (!hasGuideApi()) {
      return getPublishedGuideById(id);
    }
    const data = await request$3("GET", `/guides/${encodeURIComponent(id)}`);
    return normalizeGuideEntity((data == null ? void 0 : data.data) || null);
  }
  async function getGuideComments(slug) {
    if (!hasGuideApi())
      return [];
    const data = await request$3("GET", `/guides/${encodeURIComponent(slug)}/comments`);
    return Array.isArray(data == null ? void 0 : data.list) ? data.list.map((item) => ({
      ...item,
      avatarUrl: normalizeApiAssetUrl(item.avatarUrl),
      authorAvatar: normalizeApiAssetUrl(item.authorAvatar)
    })) : [];
  }
  async function postGuideComment(slug, content, token) {
    const data = await request$3("POST", `/guides/${encodeURIComponent(slug)}/comments`, { content }, token);
    return (data == null ? void 0 : data.comment) ? {
      ...data.comment,
      avatarUrl: normalizeApiAssetUrl(data.comment.avatarUrl),
      authorAvatar: normalizeApiAssetUrl(data.comment.authorAvatar)
    } : null;
  }
  async function deleteGuideComment(slug, commentId, token) {
    const data = await request$3("DELETE", `/guides/${encodeURIComponent(slug)}/comments/${encodeURIComponent(commentId)}`, void 0, token);
    return Boolean(data == null ? void 0 : data.ok);
  }
  async function likeGuide(slug, token) {
    const data = await request$3("POST", `/guides/${encodeURIComponent(slug)}/like`, void 0, token);
    return data || null;
  }
  async function unlikeGuide(slug, token) {
    const data = await request$3("DELETE", `/guides/${encodeURIComponent(slug)}/like`, void 0, token);
    return data || null;
  }
  async function saveGuide(slug, token) {
    const data = await request$3("POST", `/guides/${encodeURIComponent(slug)}/save`, void 0, token);
    return data || null;
  }
  async function unsaveGuide(slug, token) {
    const data = await request$3("DELETE", `/guides/${encodeURIComponent(slug)}/save`, void 0, token);
    return data || null;
  }
  const _sfc_main$g = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const primaryTabs = ["关注", "发现", "同城"];
      const allSubTabs = ["推荐", "自驾", "美食", "安全", "徒步", "住宿"];
      const visibleSubTabs = allSubTabs.slice(0, 5);
      const sortOptions = [
        { value: "recommended", label: "推荐排序", description: "保持当前推荐流顺序" },
        { value: "latest", label: "最新发布", description: "优先查看最近更新的攻略" },
        { value: "hot", label: "热度优先", description: "按点赞、收藏和评论综合排序" }
      ];
      const activePrimaryTab = vue.ref("发现");
      const activeSubTab = vue.ref("推荐");
      const guides = vue.ref([]);
      const showCategoryPanel = vue.ref(false);
      const showSearchBar = vue.ref(false);
      const showSortPanel = vue.ref(false);
      const loading = vue.ref(false);
      const errorMessage = vue.ref("");
      const detectedCity = vue.ref("");
      const cityLoading = vue.ref(false);
      const searchQuery = vue.ref("");
      const sortMode = vue.ref("recommended");
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const isLoggedIn = vue.computed(() => Boolean(getStoredAuthToken() && currentUser.value));
      const filteredGuides = vue.computed(() => {
        const keyword = normalizeSearchText(searchQuery.value);
        const matched = guides.value.filter((item) => {
          const primaryMatched = activePrimaryTab.value === "同城" ? isSameCityGuide(item) : true;
          if (!primaryMatched) {
            return false;
          }
          if (activeSubTab.value === "推荐") {
            return matchesGuideSearch(item, keyword);
          }
          return item.subCategory === activeSubTab.value && matchesGuideSearch(item, keyword);
        });
        return sortGuides(matched, sortMode.value);
      });
      const feedBadgeCount = vue.computed(() => {
        return guides.value.reduce((total, item) => total + (item.badgeCount || 0), 0);
      });
      const emptyTitle = vue.computed(() => {
        if (activePrimaryTab.value === "关注" && !isLoggedIn.value) {
          return "登录后查看关注流";
        }
        if (activePrimaryTab.value === "关注") {
          return "关注流还没有内容";
        }
        if (activePrimaryTab.value === "同城") {
          if (searchQuery.value) {
            return `没有找到与“${searchQuery.value}”相关的同城攻略`;
          }
          return detectedCity.value ? `${detectedCity.value} 暂时还没有内容` : "定位后查看同城流";
        }
        if (searchQuery.value) {
          return `没有找到与“${searchQuery.value}”相关的攻略`;
        }
        return "这个分类暂时还没有内容";
      });
      const emptyDescription = vue.computed(() => {
        if (activePrimaryTab.value === "关注" && !isLoggedIn.value) {
          return "先登录并关注感兴趣的作者，之后他们发布的新攻略会优先出现在这里。";
        }
        if (activePrimaryTab.value === "关注") {
          return "去发现页逛逛并关注喜欢的作者，新的内容发布后会自动出现在这里。";
        }
        if (activePrimaryTab.value === "同城") {
          if (searchQuery.value) {
            return "试试换个作者名、标题关键词，或者切换分类后再搜。";
          }
          return detectedCity.value ? `暂时还没有来自 ${detectedCity.value} 的攻略，稍后再刷新看看。` : "允许定位后，这里会自动显示你当前城市的攻略，比如人在乌鲁木齐就看乌鲁木齐。";
        }
        if (searchQuery.value) {
          return "可以搜索作者昵称、攻略标题、摘要里的关键词，或者切换排序方式看看。";
        }
        return "可以切换分类看看，或者稍后重新刷新真实攻略流。";
      });
      const waterfallColumns = vue.computed(() => {
        const left = [];
        const right = [];
        let leftHeight = 0;
        let rightHeight = 0;
        filteredGuides.value.forEach((item) => {
          const estimatedHeight = estimateFeedCardHeight(item);
          if (leftHeight <= rightHeight) {
            left.push(item);
            leftHeight += estimatedHeight;
            return;
          }
          right.push(item);
          rightHeight += estimatedHeight;
        });
        return { left, right };
      });
      const leftColumn = vue.computed(() => waterfallColumns.value.left);
      const rightColumn = vue.computed(() => waterfallColumns.value.right);
      onShow(() => {
        loadGuides();
      });
      vue.watch(activePrimaryTab, () => {
        loadGuides();
      });
      function setPrimaryTab(tab) {
        activePrimaryTab.value = tab;
      }
      function setSubTab(tab) {
        activeSubTab.value = tab;
      }
      function toggleCategoryPanel() {
        showSortPanel.value = false;
        showCategoryPanel.value = !showCategoryPanel.value;
      }
      function toggleSearchBar() {
        showCategoryPanel.value = false;
        showSortPanel.value = false;
        showSearchBar.value = !showSearchBar.value;
        if (!showSearchBar.value) {
          clearSearch();
        }
      }
      function clearSearch() {
        searchQuery.value = "";
      }
      function toggleSortPanel() {
        showCategoryPanel.value = false;
        showSearchBar.value = false;
        showSortPanel.value = !showSortPanel.value;
      }
      function selectSort(value) {
        sortMode.value = value;
        showSortPanel.value = false;
      }
      function selectCategory(tab) {
        activeSubTab.value = tab;
        showCategoryPanel.value = false;
      }
      function coverStyle(item) {
        const ratio = Number(item.coverAspectRatio) || 1.45;
        return {
          height: `${Math.round(280 * ratio)}rpx`
        };
      }
      function estimateFeedCardHeight(item) {
        if (hasVisualCover(item)) {
          return 260 + Math.round((Number(item.coverAspectRatio) || 1.4) * 120);
        }
        const summaryLength = noteSummary(item).slice(0, 80).length;
        return 320 + Math.ceil(summaryLength / 18) * 26;
      }
      function hasVisualCover(item) {
        return Boolean(item == null ? void 0 : item.image);
      }
      function noteSummary(item) {
        return (item == null ? void 0 : item.summaryText) || (item == null ? void 0 : item.excerpt) || (Array.isArray(item == null ? void 0 : item.highlights) ? item.highlights.map((tag) => `#${tag}`).join(" ") : "") || "发布了一条新的新疆旅行笔记。";
      }
      function displayAuthorAvatar(item) {
        var _a, _b, _c;
        if ((item == null ? void 0 : item.authorId) && ((_a = currentUser.value) == null ? void 0 : _a.id) && item.authorId === currentUser.value.id) {
          return ((_b = currentUser.value) == null ? void 0 : _b.avatar_url) || ((_c = currentUser.value) == null ? void 0 : _c.avatar) || item.authorAvatar || "";
        }
        return (item == null ? void 0 : item.authorAvatar) || "";
      }
      function hasAuthorAvatar(item) {
        return Boolean(String(displayAuthorAvatar(item) || "").trim());
      }
      function authorAvatarFallbackText(item) {
        const source = String((item == null ? void 0 : item.nickname) || (item == null ? void 0 : item.author) || "游").trim();
        return source.slice(0, 1).toUpperCase();
      }
      function matchesGuideSearch(item, keyword) {
        if (!keyword) {
          return true;
        }
        const haystack = [
          item == null ? void 0 : item.nickname,
          item == null ? void 0 : item.author,
          item == null ? void 0 : item.title,
          item == null ? void 0 : item.excerpt,
          item == null ? void 0 : item.summaryText,
          item == null ? void 0 : item.location,
          item == null ? void 0 : item.locationTag,
          item == null ? void 0 : item.category,
          ...Array.isArray(item == null ? void 0 : item.highlights) ? item.highlights : []
        ].filter(Boolean).map(normalizeSearchText);
        return haystack.some((text) => text.includes(keyword));
      }
      function normalizeSearchText(value) {
        return String(value || "").trim().toLowerCase();
      }
      function sortGuides(list, mode) {
        const items = Array.isArray(list) ? [...list] : [];
        if (mode === "latest") {
          return items.sort((left, right) => getGuideTime(right) - getGuideTime(left));
        }
        if (mode === "hot") {
          return items.sort((left, right) => getGuideHotScore(right) - getGuideHotScore(left));
        }
        return items;
      }
      function getGuideTime(item) {
        const raw = (item == null ? void 0 : item.publishDate) || (item == null ? void 0 : item.createdAt) || "";
        const stamp = Date.parse(raw);
        return Number.isFinite(stamp) ? stamp : 0;
      }
      function getGuideHotScore(item) {
        return Number((item == null ? void 0 : item.likesCount) || 0) * 3 + Number((item == null ? void 0 : item.saveCount) || 0) * 2 + Number((item == null ? void 0 : item.commentCount) || 0) * 4;
      }
      function formatCount(value) {
        const count = Number(value) || 0;
        if (count >= 1e3) {
          return `${(count / 1e3).toFixed(1)}k`;
        }
        return `${count}`;
      }
      function openGuide(id) {
        uni.navigateTo({
          url: `/pages/guide-detail/index?id=${encodeURIComponent(id)}`
        });
      }
      function openAiAssistant() {
        uni.navigateTo({ url: "/pages/ai-assistant/index" });
      }
      function publishGuide() {
        if (!currentUser.value) {
          uni.showModal({
            title: "先登录再发布",
            content: "发布功能会使用当前登录昵称回流到信息流，先去登录页完成账号登录。",
            success: (res) => {
              if (res.confirm) {
                uni.navigateTo({ url: "/pages/auth/index?mode=login" });
              }
            }
          });
          return;
        }
        uni.navigateTo({ url: "/pages/guide-publish/index" });
      }
      async function loadGuides() {
        if (activePrimaryTab.value === "关注" && !isLoggedIn.value) {
          guides.value = [];
          errorMessage.value = "";
          loading.value = false;
          return;
        }
        loading.value = true;
        errorMessage.value = "";
        try {
          if (activePrimaryTab.value === "同城") {
            await ensureDetectedCity();
          }
          const params = activePrimaryTab.value === "关注" ? { scope: "following" } : {};
          guides.value = await getGuideFeed(params);
        } catch (error) {
          guides.value = [];
          errorMessage.value = error.message || "无法连接攻略服务，请稍后重试。";
        } finally {
          loading.value = false;
        }
      }
      async function ensureDetectedCity() {
        var _a, _b;
        if (detectedCity.value || cityLoading.value) {
          return;
        }
        cityLoading.value = true;
        try {
          const location2 = await getCurrentLocation();
          const regeo = await reverseGeocode(location2.longitude, location2.latitude);
          const city = normalizeCityName(
            ((_a = regeo == null ? void 0 : regeo.addressComponent) == null ? void 0 : _a.city) || ((_b = regeo == null ? void 0 : regeo.addressComponent) == null ? void 0 : _b.district) || ""
          );
          detectedCity.value = city;
        } catch {
          detectedCity.value = "";
        } finally {
          cityLoading.value = false;
        }
      }
      function normalizeCityName(value) {
        const text = String(value || "").trim();
        return text.replace(/特别行政区$|自治区$|自治州$|地区$|市$|县$|区$/g, "");
      }
      function isSameCityGuide(item) {
        if ((item == null ? void 0 : item.cityTab) !== "同城") {
          return false;
        }
        if (!detectedCity.value) {
          return true;
        }
        const candidates = [item == null ? void 0 : item.locationTag, item == null ? void 0 : item.location, item == null ? void 0 : item.title, item == null ? void 0 : item.summaryText].filter(Boolean).map(normalizeCityName);
        return candidates.some((text) => text.includes(detectedCity.value) || detectedCity.value.includes(text));
      }
      const __returned__ = { primaryTabs, allSubTabs, visibleSubTabs, sortOptions, activePrimaryTab, activeSubTab, guides, showCategoryPanel, showSearchBar, showSortPanel, loading, errorMessage, detectedCity, cityLoading, searchQuery, sortMode, systemInfo, statusBarHeight, statusBarStyle, currentUser, isLoggedIn, filteredGuides, feedBadgeCount, emptyTitle, emptyDescription, waterfallColumns, leftColumn, rightColumn, setPrimaryTab, setSubTab, toggleCategoryPanel, toggleSearchBar, clearSearch, toggleSortPanel, selectSort, selectCategory, coverStyle, estimateFeedCardHeight, hasVisualCover, noteSummary, displayAuthorAvatar, hasAuthorAvatar, authorAvatarFallbackText, matchesGuideSearch, normalizeSearchText, sortGuides, getGuideTime, getGuideHotScore, formatCount, openGuide, openAiAssistant, publishGuide, loadGuides, ensureDetectedCity, normalizeCityName, isSameCityGuide, computed: vue.computed, ref: vue.ref, watch: vue.watch, get onShow() {
        return onShow;
      }, AppTabBar, CachedImage, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      }, get reverseGeocode() {
        return reverseGeocode;
      }, get getGuideFeed() {
        return getGuideFeed;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell guides-page" }, [
      vue.createElementVNode("view", { class: "page-scroll guides-scroll" }, [
        vue.createElementVNode("view", { class: "hero-shell hero-gradient" }, [
          vue.createElementVNode(
            "view",
            {
              class: "status-space",
              style: vue.normalizeStyle($setup.statusBarStyle)
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode("view", { class: "hero-topbar section" }, [
            vue.createElementVNode("view", {
              class: "hero-action left-action chat-entry",
              onClick: $setup.openAiAssistant
            }, "💬"),
            vue.createElementVNode("view", { class: "primary-tabs" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.primaryTabs, (tab) => {
                  return vue.createElementVNode("view", {
                    key: tab,
                    class: vue.normalizeClass(["primary-tab", { active: $setup.activePrimaryTab === tab }]),
                    onClick: ($event) => $setup.setPrimaryTab(tab)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "primary-label" },
                      vue.toDisplayString(tab),
                      1
                      /* TEXT */
                    ),
                    tab === "发现" && $setup.feedBadgeCount ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: "tab-badge"
                      },
                      vue.toDisplayString($setup.feedBadgeCount),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true),
                    $setup.activePrimaryTab === tab ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "primary-indicator"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "hero-actions" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["hero-action", { active: $setup.showSearchBar }]),
                  onClick: $setup.toggleSearchBar
                },
                "⌕",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["hero-action text-action", { active: $setup.showSortPanel }]),
                  onClick: $setup.toggleSortPanel
                },
                "筛",
                2
                /* CLASS */
              )
            ])
          ]),
          $setup.showSearchBar ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "section search-shell"
          }, [
            vue.createElementVNode("view", { class: "search-bar" }, [
              vue.createElementVNode("text", { class: "search-icon" }, "⌕"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchQuery = $event),
                  class: "search-input",
                  type: "text",
                  "confirm-type": "search",
                  maxlength: "40",
                  placeholder: "搜索作者、标题或相关内容",
                  "placeholder-class": "search-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.searchQuery]
              ]),
              $setup.searchQuery ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "search-clear",
                onClick: $setup.clearSearch
              }, "×")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("text", { class: "search-hint" }, "支持搜索作者昵称、攻略标题、摘要和标签")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "subnav-shell section" }, [
          vue.createElementVNode("scroll-view", {
            class: "subnav-scroll",
            "scroll-x": ""
          }, [
            vue.createElementVNode("view", { class: "subnav-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.visibleSubTabs, (tab) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: tab,
                    class: vue.normalizeClass(["subnav-chip", { active: $setup.activeSubTab === tab }]),
                    onClick: ($event) => $setup.setSubTab(tab)
                  }, vue.toDisplayString(tab), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", {
            class: "subnav-more",
            onClick: $setup.toggleCategoryPanel
          }, [
            vue.createElementVNode("text", { class: "more-icon" }, "▾")
          ])
        ]),
        vue.createElementVNode("view", { class: "section waterfall-shell" }, [
          $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state card"
          }, [
            vue.createElementVNode("text", { class: "section-title" }, "正在加载攻略"),
            vue.createElementVNode("text", { class: "empty-copy" }, "正在从服务器同步最新的新疆攻略内容。")
          ])) : $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state card"
          }, [
            vue.createElementVNode("text", { class: "section-title" }, "加载失败"),
            vue.createElementVNode(
              "text",
              { class: "empty-copy" },
              vue.toDisplayString($setup.errorMessage),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", {
              class: "retry-btn",
              onClick: $setup.loadGuides
            }, "重新加载")
          ])) : $setup.leftColumn.length || $setup.rightColumn.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "waterfall-grid"
          }, [
            vue.createElementVNode("view", { class: "waterfall-column" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.leftColumn, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "feed-card",
                    onClick: ($event) => $setup.openGuide(item.id)
                  }, [
                    $setup.hasVisualCover(item) ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: "cover-shell",
                        style: vue.normalizeStyle($setup.coverStyle(item))
                      },
                      [
                        vue.createVNode($setup["CachedImage"], {
                          src: item.image,
                          "image-class": "cover-image"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "cover-mask" }),
                        vue.createElementVNode("view", { class: "cover-badges" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "content-pill" },
                            vue.toDisplayString(item.contentType),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "location-pill" },
                            vue.toDisplayString(item.locationTag),
                            1
                            /* TEXT */
                          )
                        ]),
                        item.contentType === "视频" ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "video-badge"
                        }, "▶ 视频")) : vue.createCommentVNode("v-if", true),
                        item.imageCount > 1 ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 1,
                            class: "image-count-badge"
                          },
                          vue.toDisplayString(item.imageCount) + " 图",
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ],
                      4
                      /* STYLE */
                    )) : (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "text-note-shell"
                    }, [
                      vue.createElementVNode("view", { class: "text-note-head" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "content-pill solid-pill" },
                          vue.toDisplayString(item.contentType),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "location-mini" },
                          vue.toDisplayString(item.locationTag),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "text-note-copy" },
                        vue.toDisplayString($setup.noteSummary(item)),
                        1
                        /* TEXT */
                      )
                    ])),
                    vue.createElementVNode("view", { class: "feed-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "feed-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "author-row" }, [
                        $setup.hasAuthorAvatar(item) ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                          key: 0,
                          src: $setup.displayAuthorAvatar(item),
                          "container-class": "author-avatar-shell",
                          "image-class": "author-avatar"
                        }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                          key: 1,
                          class: "author-avatar-shell author-avatar-fallback"
                        }, [
                          vue.createElementVNode(
                            "text",
                            { class: "author-avatar-fallback-text" },
                            vue.toDisplayString($setup.authorAvatarFallbackText(item)),
                            1
                            /* TEXT */
                          )
                        ])),
                        vue.createElementVNode(
                          "text",
                          { class: "author-name" },
                          vue.toDisplayString(item.nickname),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "author-dot" }, "·"),
                        vue.createElementVNode(
                          "text",
                          { class: "author-meta" },
                          vue.toDisplayString(item.category),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "feed-footer" }, [
                        vue.createElementVNode("view", { class: "stat-chip" }, [
                          vue.createElementVNode("text", { class: "stat-icon" }, "♡"),
                          vue.createElementVNode(
                            "text",
                            { class: "stat-text" },
                            vue.toDisplayString($setup.formatCount(item.likesCount)),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "stat-chip muted-chip" }, [
                          vue.createElementVNode("text", { class: "stat-icon" }, "⌑"),
                          vue.createElementVNode(
                            "text",
                            { class: "stat-text" },
                            vue.toDisplayString($setup.formatCount(item.commentCount)),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "waterfall-column" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.rightColumn, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "feed-card",
                    onClick: ($event) => $setup.openGuide(item.id)
                  }, [
                    $setup.hasVisualCover(item) ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: "cover-shell",
                        style: vue.normalizeStyle($setup.coverStyle(item))
                      },
                      [
                        vue.createVNode($setup["CachedImage"], {
                          src: item.image,
                          "image-class": "cover-image"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "cover-mask" }),
                        vue.createElementVNode("view", { class: "cover-badges" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "content-pill" },
                            vue.toDisplayString(item.contentType),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "location-pill" },
                            vue.toDisplayString(item.locationTag),
                            1
                            /* TEXT */
                          )
                        ]),
                        item.contentType === "视频" ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "video-badge"
                        }, "▶ 视频")) : vue.createCommentVNode("v-if", true),
                        item.imageCount > 1 ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 1,
                            class: "image-count-badge"
                          },
                          vue.toDisplayString(item.imageCount) + " 图",
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ],
                      4
                      /* STYLE */
                    )) : (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "text-note-shell"
                    }, [
                      vue.createElementVNode("view", { class: "text-note-head" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "content-pill solid-pill" },
                          vue.toDisplayString(item.contentType),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "location-mini" },
                          vue.toDisplayString(item.locationTag),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "text-note-copy" },
                        vue.toDisplayString($setup.noteSummary(item)),
                        1
                        /* TEXT */
                      )
                    ])),
                    vue.createElementVNode("view", { class: "feed-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "feed-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "author-row" }, [
                        $setup.hasAuthorAvatar(item) ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                          key: 0,
                          src: $setup.displayAuthorAvatar(item),
                          "container-class": "author-avatar-shell",
                          "image-class": "author-avatar"
                        }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                          key: 1,
                          class: "author-avatar-shell author-avatar-fallback"
                        }, [
                          vue.createElementVNode(
                            "text",
                            { class: "author-avatar-fallback-text" },
                            vue.toDisplayString($setup.authorAvatarFallbackText(item)),
                            1
                            /* TEXT */
                          )
                        ])),
                        vue.createElementVNode(
                          "text",
                          { class: "author-name" },
                          vue.toDisplayString(item.nickname),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "author-dot" }, "·"),
                        vue.createElementVNode(
                          "text",
                          { class: "author-meta" },
                          vue.toDisplayString(item.publishDate),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "feed-footer" }, [
                        vue.createElementVNode("view", { class: "stat-chip" }, [
                          vue.createElementVNode("text", { class: "stat-icon" }, "♡"),
                          vue.createElementVNode(
                            "text",
                            { class: "stat-text" },
                            vue.toDisplayString($setup.formatCount(item.likesCount)),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "stat-chip muted-chip" }, [
                          vue.createElementVNode("text", { class: "stat-icon" }, "⌑"),
                          vue.createElementVNode(
                            "text",
                            { class: "stat-text" },
                            vue.toDisplayString($setup.formatCount(item.saveCount)),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "empty-state card"
          }, [
            vue.createElementVNode(
              "text",
              { class: "section-title" },
              vue.toDisplayString($setup.emptyTitle),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "empty-copy" },
              vue.toDisplayString($setup.emptyDescription),
              1
              /* TEXT */
            )
          ]))
        ]),
        vue.createElementVNode("view", { class: "bottom-space extra-space" })
      ]),
      $setup.showCategoryPanel ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "category-mask",
        onClick: $setup.toggleCategoryPanel
      }, [
        vue.createElementVNode("view", {
          class: "category-panel",
          onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "panel-head" }, [
            vue.createElementVNode("text", { class: "panel-title" }, "全部分类"),
            vue.createElementVNode("view", {
              class: "panel-close",
              onClick: $setup.toggleCategoryPanel
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "category-grid" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.allSubTabs, (tab) => {
                return vue.createElementVNode("view", {
                  key: tab,
                  class: vue.normalizeClass(["category-item", { active: $setup.activeSubTab === tab }]),
                  onClick: ($event) => $setup.selectCategory(tab)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "category-label" },
                    vue.toDisplayString(tab),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $setup.showSortPanel ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "category-mask",
        onClick: $setup.toggleSortPanel
      }, [
        vue.createElementVNode("view", {
          class: "sort-panel",
          onClick: _cache[2] || (_cache[2] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "panel-head" }, [
            vue.createElementVNode("text", { class: "panel-title" }, "排序方式"),
            vue.createElementVNode("view", {
              class: "panel-close",
              onClick: $setup.toggleSortPanel
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "sort-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.sortOptions, (option) => {
                return vue.createElementVNode("view", {
                  key: option.value,
                  class: vue.normalizeClass(["sort-item", { active: $setup.sortMode === option.value }]),
                  onClick: ($event) => $setup.selectSort(option.value)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "sort-label" },
                    vue.toDisplayString(option.label),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "sort-desc" },
                    vue.toDisplayString(option.description),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: $setup.publishGuide
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+"),
        vue.createElementVNode("text", { class: "fab-label" }, "发布")
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/guides/index" })
    ]);
  }
  const PagesGuidesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-4aabec35"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guides/index.vue"]]);
  const GUIDE_TRACK_PREVIEW_STORAGE_KEY = "guide-track-preview-payload";
  let guideTrackPreviewMemory = null;
  function saveGuideTrackPreview(payload) {
    guideTrackPreviewMemory = normalizeGuideTrackPreviewPayload(payload);
    formatAppLog("log", "at common/guide-track-preview.js:6", "[guide-track-preview] save payload", summarizeGuideTrackPreviewPayload(guideTrackPreviewMemory));
  }
  function loadGuideTrackPreview() {
    if (guideTrackPreviewMemory) {
      formatAppLog("log", "at common/guide-track-preview.js:11", "[guide-track-preview] load from memory", summarizeGuideTrackPreviewPayload(guideTrackPreviewMemory));
      return guideTrackPreviewMemory;
    }
    try {
      const raw = uni.getStorageSync(GUIDE_TRACK_PREVIEW_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      guideTrackPreviewMemory = normalizeGuideTrackPreviewPayload(parsed);
      formatAppLog("log", "at common/guide-track-preview.js:23", "[guide-track-preview] load from storage", summarizeGuideTrackPreviewPayload(guideTrackPreviewMemory));
      return guideTrackPreviewMemory;
    } catch (error) {
      formatAppLog("error", "at common/guide-track-preview.js:26", "[guide-track-preview] load failed", error);
      return null;
    }
  }
  function clearGuideTrackPreview() {
    formatAppLog("log", "at common/guide-track-preview.js:32", "[guide-track-preview] clear payload");
    guideTrackPreviewMemory = null;
    try {
      uni.removeStorageSync(GUIDE_TRACK_PREVIEW_STORAGE_KEY);
    } catch (error) {
    }
  }
  function normalizeGuideTrackPreviewPayload(payload) {
    var _a;
    if (!payload || typeof payload !== "object") {
      return null;
    }
    const track = payload.track && typeof payload.track === "object" ? {
      points: Array.isArray(payload.track.points) ? payload.track.points.map((point) => ({
        latitude: Number(point == null ? void 0 : point.latitude),
        longitude: Number(point == null ? void 0 : point.longitude),
        altitude: Number((point == null ? void 0 : point.altitude) || 0),
        timestamp: Number((point == null ? void 0 : point.timestamp) || 0)
      })) : [],
      pointCount: Number(payload.track.pointCount || 0),
      distanceKm: Number(payload.track.distanceKm || 0),
      durationMs: Number(payload.track.durationMs || 0),
      altitudeGain: Number(payload.track.altitudeGain || 0),
      capturedAt: Number(payload.track.capturedAt || 0)
    } : null;
    if (!((_a = track == null ? void 0 : track.points) == null ? void 0 : _a.length)) {
      return null;
    }
    return {
      title: String(payload.title || ""),
      track
    };
  }
  function summarizeGuideTrackPreviewPayload(payload) {
    var _a, _b, _c, _d, _e;
    if (!payload) {
      return null;
    }
    return {
      title: payload.title,
      pointCount: Number(((_a = payload.track) == null ? void 0 : _a.pointCount) || ((_c = (_b = payload.track) == null ? void 0 : _b.points) == null ? void 0 : _c.length) || 0),
      pointsLength: Array.isArray((_d = payload.track) == null ? void 0 : _d.points) ? payload.track.points.length : 0,
      distanceKm: Number(((_e = payload.track) == null ? void 0 : _e.distanceKm) || 0)
    };
  }
  const TIANDITU_PROVIDER = "tianditu";
  const TIANDITU_KEY = "58f4f23a5a026d8bc9f289c7156b0b1a";
  function hasTiandituKey() {
    return Boolean(TIANDITU_KEY) && !TIANDITU_KEY.includes("请在这里填入");
  }
  const TIANDITU_LAYERS = {
    vector: {
      layer: "vec_w",
      annotation: "cva_w",
      label: "天地图矢量"
    },
    imagery: {
      layer: "img_w",
      annotation: "cia_w",
      label: "天地图影像"
    },
    terrain: {
      layer: "ter_w",
      annotation: "cta_w",
      label: "天地图地形"
    }
  };
  function buildTileUrl(layer) {
    if (!hasTiandituKey() || !layer) {
      return "";
    }
    return `https://t0.tianditu.gov.cn/DataServer?T=${encodeURIComponent(layer)}&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TIANDITU_KEY)}`;
  }
  function getTiandituLayerConfig(mode = "terrain") {
    const config = TIANDITU_LAYERS[mode] || TIANDITU_LAYERS.terrain;
    return {
      provider: TIANDITU_PROVIDER,
      mode,
      label: config.label,
      tileUrl: buildTileUrl(config.layer),
      annotationUrl: buildTileUrl(config.annotation),
      ready: hasTiandituKey()
    };
  }
  const TILE_PACK_STORAGE_KEY = "meet-xinjiang-hiking-tile-packs";
  const OFFLINE_TILE_ROOT = "_doc/offline-tiles";
  const DEFAULT_HIKING_TILE_PACK_ID = "hiking-active-area";
  function getPackStore() {
    try {
      const raw = uni.getStorageSync(TILE_PACK_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }
  function savePackStore(store) {
    uni.setStorageSync(TILE_PACK_STORAGE_KEY, JSON.stringify(store || {}));
  }
  function getOfflineTilePack(packId = DEFAULT_HIKING_TILE_PACK_ID) {
    const store = getPackStore();
    return store[String(packId)] || null;
  }
  function saveOfflineTilePack(packId, record) {
    const store = getPackStore();
    store[String(packId)] = record;
    savePackStore(store);
    return record;
  }
  function removeOfflineTilePack(packId = DEFAULT_HIKING_TILE_PACK_ID) {
    const store = getPackStore();
    delete store[String(packId)];
    savePackStore(store);
  }
  function resolveOfflineTileSource({ packId = DEFAULT_HIKING_TILE_PACK_ID, mode = "imagery", layerType = "base", x, y, z, fallbackUrl = "" }) {
    const pack = getOfflineTilePack(packId);
    if (!pack || pack.status !== "ready") {
      return fallbackUrl;
    }
    if (!Array.isArray(pack.zooms) || !pack.zooms.includes(Number(z))) {
      return fallbackUrl;
    }
    if (!Array.isArray(pack.layers) || !pack.layers.includes(mode) || layerType === "annotation" && !pack.hasAnnotation) {
      return fallbackUrl;
    }
    const relativePath = buildTileRelativePath(packId, mode, layerType, z, x, y);
    if (typeof plus !== "undefined" && plus.io && typeof plus.io.convertLocalFileSystemURL === "function") {
      const absolutePath = plus.io.convertLocalFileSystemURL(relativePath);
      if (absolutePath) {
        return absolutePath.startsWith("file://") ? absolutePath : `file://${absolutePath}`;
      }
    }
    return relativePath;
  }
  function getOfflineTilePackSummary(packId = DEFAULT_HIKING_TILE_PACK_ID) {
    const pack = getOfflineTilePack(packId);
    if (!pack) {
      return { ready: false, text: "未下载离线底图" };
    }
    if (pack.status === "downloading") {
      return { ready: false, text: `离线底图下载中 ${Math.round(Number(pack.progress || 0))}%` };
    }
    if (pack.status === "ready") {
      return { ready: true, text: "离线底图已就绪" };
    }
    return { ready: false, text: "离线底图未完成" };
  }
  function buildHikingTilePackPlan({
    packId = DEFAULT_HIKING_TILE_PACK_ID,
    name = "徒步区域离线底图",
    points = [],
    center = null,
    minZoom = 12,
    maxZoom = 16,
    mode = "imagery",
    paddingKm = 2
  } = {}) {
    const normalizedPoints = [
      ...(Array.isArray(points) ? points : []).map(normalizeLocation).filter(Boolean),
      normalizeLocation(center)
    ].filter(Boolean);
    if (!normalizedPoints.length) {
      throw new Error("当前没有可用于下载离线底图的定位范围");
    }
    const bounds = expandBounds(computeBounds(normalizedPoints), paddingKm);
    const zooms = [];
    for (let zoom = Math.max(3, Number(minZoom || 12)); zoom <= Math.min(18, Number(maxZoom || 16)); zoom += 1) {
      zooms.push(zoom);
    }
    const tileList = buildTileTaskList({ packId, bounds, zooms, mode });
    return {
      packId,
      name,
      mode,
      zooms,
      bounds,
      tasks: tileList
    };
  }
  async function downloadOfflineTilePack(plan, options = {}) {
    if (!plan || !Array.isArray(plan.tasks) || !plan.tasks.length) {
      throw new Error("离线底图任务为空");
    }
    const existing = getOfflineTilePack(plan.packId);
    saveOfflineTilePack(plan.packId, {
      ...existing,
      packId: plan.packId,
      name: plan.name,
      mode: plan.mode,
      zooms: plan.zooms,
      bounds: plan.bounds,
      layers: [plan.mode],
      hasAnnotation: plan.tasks.some((task) => task.layerType === "annotation"),
      totalTiles: plan.tasks.length,
      downloadedTiles: 0,
      progress: 0,
      status: "downloading",
      updatedAt: Date.now()
    });
    let downloadedTiles = 0;
    let sizeBytes = 0;
    const concurrency = Math.max(1, Math.min(6, Number(options.concurrency || 4)));
    let cursor = 0;
    let aborted = false;
    async function worker() {
      while (!aborted && cursor < plan.tasks.length) {
        const task = plan.tasks[cursor];
        cursor += 1;
        const bytes = await downloadTask(task);
        if (aborted) {
          return;
        }
        sizeBytes += bytes;
        downloadedTiles += 1;
        const progress = Math.min(100, downloadedTiles / plan.tasks.length * 100);
        saveOfflineTilePack(plan.packId, {
          ...getOfflineTilePack(plan.packId),
          downloadedTiles,
          progress,
          sizeBytes,
          status: downloadedTiles >= plan.tasks.length ? "ready" : "downloading",
          updatedAt: Date.now()
        });
        if (typeof options.onProgress === "function") {
          options.onProgress({ downloadedTiles, totalTiles: plan.tasks.length, progress });
        }
      }
    }
    try {
      await Promise.all(Array.from({ length: concurrency }, () => worker()));
    } catch (error) {
      aborted = true;
      saveOfflineTilePack(plan.packId, {
        ...getOfflineTilePack(plan.packId),
        status: "error",
        errorMessage: (error == null ? void 0 : error.message) || "离线底图下载失败",
        updatedAt: Date.now()
      });
      throw error;
    }
    const record = {
      ...getOfflineTilePack(plan.packId),
      status: "ready",
      progress: 100,
      sizeBytes,
      errorMessage: "",
      updatedAt: Date.now()
    };
    saveOfflineTilePack(plan.packId, record);
    return record;
  }
  async function deleteOfflineTilePack(packId = DEFAULT_HIKING_TILE_PACK_ID) {
    const relativeRoot = `${OFFLINE_TILE_ROOT}/${encodeURIComponent(String(packId))}`;
    await removeRelativePath(relativeRoot).catch(() => {
    });
    removeOfflineTilePack(packId);
  }
  function buildTileTaskList({ packId, bounds, zooms, mode }) {
    const config = getTiandituLayerConfig(mode);
    if (!config.tileUrl) {
      throw new Error("离线底图服务未配置");
    }
    const tasks = [];
    zooms.forEach((zoom) => {
      const { minX, maxX, minY, maxY } = getTileRange(bounds, zoom);
      for (let x = minX; x <= maxX; x += 1) {
        for (let y = minY; y <= maxY; y += 1) {
          tasks.push({
            url: fillTileUrl(config.tileUrl, x, y, zoom),
            relativePath: buildTileRelativePath(packId, mode, "base", zoom, x, y),
            x,
            y,
            z: zoom,
            layerType: "base",
            mode
          });
          if (config.annotationUrl) {
            tasks.push({
              url: fillTileUrl(config.annotationUrl, x, y, zoom),
              relativePath: buildTileRelativePath(packId, mode, "annotation", zoom, x, y),
              x,
              y,
              z: zoom,
              layerType: "annotation",
              mode
            });
          }
        }
      }
    });
    return tasks;
  }
  async function downloadTask(task) {
    const fileExists = await checkRelativePathExists(task.relativePath);
    if (fileExists) {
      return 0;
    }
    if (typeof plus !== "undefined" && plus.downloader && typeof plus.downloader.createDownload === "function") {
      return new Promise((resolve, reject) => {
        const downloadTask2 = plus.downloader.createDownload(task.url, { filename: task.relativePath }, (download2, status) => {
          if (status === 200) {
            resolve(Number(download2.downloadedSize || 0));
            return;
          }
          reject(new Error(`瓦片下载失败 (${status || 0})`));
        });
        downloadTask2.start();
      });
    }
    const response = await downloadByUni(task.url);
    if (Number(response == null ? void 0 : response.statusCode) !== 200 || !response.tempFilePath) {
      throw new Error("瓦片下载失败");
    }
    const savedFilePath = await saveDownloadedFile(response.tempFilePath, task.relativePath);
    return Number((response == null ? void 0 : response.totalBytesWritten) || (response == null ? void 0 : response.totalBytesExpectedToWrite) || 0) || (savedFilePath ? 1 : 0);
  }
  function downloadByUni(url) {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url,
        success: resolve,
        fail: reject
      });
    });
  }
  function saveDownloadedFile(tempFilePath, relativePath) {
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.io || typeof plus.io.resolveLocalFileSystemURL !== "function") {
        uni.saveFile({
          tempFilePath,
          success: ({ savedFilePath }) => resolve(savedFilePath || ""),
          fail: reject
        });
        return;
      }
      ensureRelativeDirectory(relativePath).then(() => {
        plus.io.resolveLocalFileSystemURL(tempFilePath, (entry) => {
          if (!entry || typeof entry.copyTo !== "function") {
            reject(new Error("临时瓦片文件不可用"));
            return;
          }
          const targetDirectory = getRelativeDirectory(relativePath);
          const targetName = getRelativeFilename(relativePath);
          plus.io.resolveLocalFileSystemURL(targetDirectory, (directoryEntry) => {
            entry.copyTo(directoryEntry, targetName, (copiedEntry) => {
              resolve((copiedEntry == null ? void 0 : copiedEntry.fullPath) || relativePath);
            }, reject);
          }, reject);
        }, reject);
      }).catch(reject);
    });
  }
  function ensureRelativeDirectory(relativePath) {
    const normalized = getRelativeDirectory(relativePath);
    const segments = normalized.split("/").filter(Boolean);
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.io || typeof plus.io.requestFileSystem !== "function") {
        resolve();
        return;
      }
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fileSystem) => {
        let current = fileSystem.root;
        const pathSegments = segments.slice(1);
        function step(index) {
          if (index >= pathSegments.length) {
            resolve(current);
            return;
          }
          current.getDirectory(pathSegments[index], { create: true }, (directoryEntry) => {
            current = directoryEntry;
            step(index + 1);
          }, reject);
        }
        step(0);
      }, reject);
    });
  }
  function getRelativeDirectory(relativePath) {
    const normalized = String(relativePath || "").replace(/\\/g, "/");
    const lastSlashIndex = normalized.lastIndexOf("/");
    return lastSlashIndex >= 0 ? normalized.slice(0, lastSlashIndex) : normalized;
  }
  function getRelativeFilename(relativePath) {
    const normalized = String(relativePath || "").replace(/\\/g, "/");
    const lastSlashIndex = normalized.lastIndexOf("/");
    return lastSlashIndex >= 0 ? normalized.slice(lastSlashIndex + 1) : normalized;
  }
  function checkRelativePathExists(relativePath) {
    return new Promise((resolve) => {
      if (typeof plus === "undefined" || !plus.io || typeof plus.io.resolveLocalFileSystemURL !== "function") {
        resolve(false);
        return;
      }
      plus.io.resolveLocalFileSystemURL(relativePath, () => resolve(true), () => resolve(false));
    });
  }
  function removeRelativePath(relativePath) {
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.io || typeof plus.io.resolveLocalFileSystemURL !== "function") {
        resolve();
        return;
      }
      plus.io.resolveLocalFileSystemURL(relativePath, (entry) => {
        if (entry && typeof entry.removeRecursively === "function") {
          entry.removeRecursively(resolve, reject);
          return;
        }
        if (entry && typeof entry.remove === "function") {
          entry.remove(resolve, reject);
          return;
        }
        resolve();
      }, () => resolve());
    });
  }
  function buildTileRelativePath(packId, mode, layerType, z, x, y) {
    return `${OFFLINE_TILE_ROOT}/${encodeURIComponent(String(packId))}/${mode}/${layerType}/${z}/${x}/${y}.png`;
  }
  function fillTileUrl(template, x, y, z) {
    return String(template || "").replace("{x}", String(x)).replace("{y}", String(y)).replace("{z}", String(z));
  }
  function getTileRange(bounds, zoom) {
    const northWest = lngLatToTile(bounds.west, bounds.north, zoom);
    const southEast = lngLatToTile(bounds.east, bounds.south, zoom);
    return {
      minX: Math.min(northWest.x, southEast.x),
      maxX: Math.max(northWest.x, southEast.x),
      minY: Math.min(northWest.y, southEast.y),
      maxY: Math.max(northWest.y, southEast.y)
    };
  }
  function lngLatToTile(longitude, latitude, zoom) {
    const boundedLat = Math.max(-85.05112878, Math.min(85.05112878, Number(latitude || 0)));
    const total = 2 ** zoom;
    const x = Math.floor((Number(longitude || 0) + 180) / 360 * total);
    const rad = boundedLat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * total);
    return { x, y };
  }
  function computeBounds(points) {
    return points.reduce((bounds, point) => ({
      north: Math.max(bounds.north, point.latitude),
      south: Math.min(bounds.south, point.latitude),
      east: Math.max(bounds.east, point.longitude),
      west: Math.min(bounds.west, point.longitude)
    }), {
      north: points[0].latitude,
      south: points[0].latitude,
      east: points[0].longitude,
      west: points[0].longitude
    });
  }
  function expandBounds(bounds, paddingKm) {
    const centerLat = (bounds.north + bounds.south) / 2;
    const latPadding = Number(paddingKm || 0) / 111;
    const lngPadding = Number(paddingKm || 0) / (111 * Math.max(0.2, Math.cos(centerLat * Math.PI / 180)));
    return {
      north: bounds.north + latPadding,
      south: bounds.south - latPadding,
      east: bounds.east + lngPadding,
      west: bounds.west - lngPadding
    };
  }
  const EARTH_RADIUS_METERS = 6378137;
  function simplifyTrackPoints(points = [], zoom = 16) {
    const normalized = Array.isArray(points) ? points.map(normalizeLocation).filter(Boolean).map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude
    })) : [];
    if (normalized.length <= 2) {
      return normalized;
    }
    const filtered = filterNearbyPoints(normalized, resolveMinDistanceMeters(zoom));
    if (filtered.length <= 2) {
      return filtered;
    }
    return douglasPeucker(filtered, resolveToleranceMeters(zoom));
  }
  function filterNearbyPoints(points, minDistanceMeters) {
    if (points.length <= 2 || minDistanceMeters <= 0) {
      return points.slice();
    }
    const filtered = [points[0]];
    for (let index = 1; index < points.length - 1; index += 1) {
      if (getDistanceMeters(filtered[filtered.length - 1], points[index]) >= minDistanceMeters) {
        filtered.push(points[index]);
      }
    }
    filtered.push(points[points.length - 1]);
    return filtered;
  }
  function douglasPeucker(points, toleranceMeters) {
    if (points.length <= 2 || toleranceMeters <= 0) {
      return points.slice();
    }
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    let maxDistance = 0;
    let splitIndex = -1;
    for (let index = 1; index < points.length - 1; index += 1) {
      const distance = getPerpendicularDistanceMeters(points[index], firstPoint, lastPoint);
      if (distance > maxDistance) {
        maxDistance = distance;
        splitIndex = index;
      }
    }
    if (maxDistance <= toleranceMeters || splitIndex === -1) {
      return [firstPoint, lastPoint];
    }
    const left = douglasPeucker(points.slice(0, splitIndex + 1), toleranceMeters);
    const right = douglasPeucker(points.slice(splitIndex), toleranceMeters);
    return [...left.slice(0, -1), ...right];
  }
  function getPerpendicularDistanceMeters(point, lineStart, lineEnd) {
    const start = projectToMeters(lineStart);
    const end = projectToMeters(lineEnd);
    const target = projectToMeters(point);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) {
      return Math.hypot(target.x - start.x, target.y - start.y);
    }
    const ratio = ((target.x - start.x) * dx + (target.y - start.y) * dy) / (dx * dx + dy * dy);
    const projection = ratio <= 0 ? start : ratio >= 1 ? end : {
      x: start.x + dx * ratio,
      y: start.y + dy * ratio
    };
    return Math.hypot(target.x - projection.x, target.y - projection.y);
  }
  function getDistanceMeters(from, to) {
    const start = projectToMeters(from);
    const end = projectToMeters(to);
    return Math.hypot(end.x - start.x, end.y - start.y);
  }
  function projectToMeters(point) {
    const longitude = Number((point == null ? void 0 : point.longitude) || 0);
    const latitude = clampLatitude(Number((point == null ? void 0 : point.latitude) || 0));
    const x = longitude * Math.PI * EARTH_RADIUS_METERS / 180;
    const y = Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) * EARTH_RADIUS_METERS;
    return { x, y };
  }
  function resolveToleranceMeters(zoom) {
    const numericZoom = Math.round(Number(zoom || 16));
    if (numericZoom >= 17)
      return 0.8;
    if (numericZoom >= 16)
      return 1.5;
    if (numericZoom >= 15)
      return 3;
    if (numericZoom >= 14)
      return 6;
    if (numericZoom >= 13)
      return 12;
    if (numericZoom >= 12)
      return 20;
    return 30;
  }
  function resolveMinDistanceMeters(zoom) {
    const numericZoom = Math.round(Number(zoom || 16));
    if (numericZoom >= 17)
      return 0;
    if (numericZoom >= 16)
      return 0.5;
    if (numericZoom >= 15)
      return 1;
    if (numericZoom >= 14)
      return 2;
    if (numericZoom >= 13)
      return 4;
    return 6;
  }
  function clampLatitude(value) {
    return Math.max(-85.05112878, Math.min(85.05112878, value));
  }
  const TILE_SIZE = 256;
  const TILE_RADIUS = 2;
  const _sfc_main$f = {
    __name: "HikingTileMapCompat",
    props: {
      mapCenter: {
        type: Object,
        default: null
      },
      mapScale: {
        type: Number,
        default: 15
      },
      mapPolyline: {
        type: Array,
        default: () => []
      },
      mapMarkers: {
        type: Array,
        default: () => []
      },
      mapModeKey: {
        type: String,
        default: "normal"
      },
      offlinePackId: {
        type: String,
        default: ""
      },
      showCenterMarker: {
        type: Boolean,
        default: true
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const GRID_SIZE = (TILE_RADIUS * 2 + 1) * TILE_SIZE;
      const props = __props;
      const tileErrorCount = vue.ref(0);
      const instance = vue.getCurrentInstance();
      const canvasId = `hiking-tile-track-canvas-${(instance == null ? void 0 : instance.uid) || Date.now()}`;
      const mapMode = vue.computed(() => {
        if (props.mapModeKey === "satellite") {
          return "imagery";
        }
        if (props.mapModeKey === "terrain") {
          return "terrain";
        }
        return "vector";
      });
      const tileConfig = vue.computed(() => getTiandituLayerConfig(mapMode.value));
      const zoomLevel = vue.computed(() => {
        const raw = Math.round(Number(props.mapScale || 15));
        return Math.max(3, Math.min(18, raw));
      });
      const projectedCenter = vue.computed(() => {
        var _a, _b;
        return projectToTile((_a = props.mapCenter) == null ? void 0 : _a.longitude, (_b = props.mapCenter) == null ? void 0 : _b.latitude, zoomLevel.value);
      });
      const gridStyle = vue.computed(() => {
        if (!projectedCenter.value) {
          return {};
        }
        const translateX = -((TILE_RADIUS + projectedCenter.value.fracX) * TILE_SIZE);
        const translateY = -((TILE_RADIUS + projectedCenter.value.fracY) * TILE_SIZE);
        return {
          width: `${GRID_SIZE}px`,
          height: `${GRID_SIZE}px`,
          transform: `translate(${translateX}px, ${translateY}px)`
        };
      });
      const tiles = vue.computed(() => {
        if (!projectedCenter.value || !tileConfig.value.ready || !tileConfig.value.tileUrl) {
          return [];
        }
        const total = 2 ** zoomLevel.value;
        const list = [];
        for (let row = -TILE_RADIUS; row <= TILE_RADIUS; row += 1) {
          for (let col = -TILE_RADIUS; col <= TILE_RADIUS; col += 1) {
            const tileX = modulo(projectedCenter.value.tileX + col, total);
            const tileY = clamp(projectedCenter.value.tileY + row, 0, total - 1);
            const left = (col + TILE_RADIUS) * TILE_SIZE;
            const top = (row + TILE_RADIUS) * TILE_SIZE;
            list.push({
              key: `${zoomLevel.value}-${tileX}-${tileY}`,
              baseUrl: resolveOfflineTileSource({
                packId: props.offlinePackId,
                mode: mapMode.value,
                layerType: "base",
                x: tileX,
                y: tileY,
                z: zoomLevel.value,
                fallbackUrl: fillTileUrl2(tileConfig.value.tileUrl, tileX, tileY, zoomLevel.value)
              }),
              annotationUrl: tileConfig.value.annotationUrl ? resolveOfflineTileSource({
                packId: props.offlinePackId,
                mode: mapMode.value,
                layerType: "annotation",
                x: tileX,
                y: tileY,
                z: zoomLevel.value,
                fallbackUrl: fillTileUrl2(tileConfig.value.annotationUrl, tileX, tileY, zoomLevel.value)
              }) : "",
              style: `left:${left}px;top:${top}px;width:${TILE_SIZE}px;height:${TILE_SIZE}px;`
            });
          }
        }
        return list;
      });
      const markerDots = vue.computed(() => {
        const source = Array.isArray(props.mapMarkers) && props.mapMarkers.length ? props.mapMarkers : props.showCenterMarker && props.mapCenter ? [props.mapCenter] : [];
        const list = source.map((item, index) => {
          var _a;
          const point = projectPoint(item == null ? void 0 : item.longitude, item == null ? void 0 : item.latitude);
          if (!point) {
            return null;
          }
          return {
            key: `marker-${index}`,
            style: `left:${point.x - 26}px;top:${point.y - 26}px;`,
            avatarUrl: String((item == null ? void 0 : item.avatarUrl) || ""),
            avatarInitial: String((item == null ? void 0 : item.avatarInitial) || "游").slice(0, 1) || "游",
            statusText: String((item == null ? void 0 : item.statusText) || ((_a = item == null ? void 0 : item.callout) == null ? void 0 : _a.content) || "当前位置")
          };
        }).filter(Boolean);
        return list.slice(0, 3);
      });
      const displayTrackPoints = vue.computed(() => {
        const line = Array.isArray(props.mapPolyline) ? props.mapPolyline[0] : null;
        const points = Array.isArray(line == null ? void 0 : line.points) ? line.points : [];
        return simplifyTrackPoints(points, zoomLevel.value);
      });
      const canvasStyle = vue.computed(() => `left:0;top:0;width:${GRID_SIZE}px;height:${GRID_SIZE}px;`);
      vue.onMounted(() => {
        var _a, _b;
        formatAppLog("log", "at pages/hiking/components/HikingTileMapCompat.vue:190", "[tile-map] mounted", {
          canvasId,
          scale: zoomLevel.value,
          hasCenter: Boolean(props.mapCenter),
          markerCount: Array.isArray(props.mapMarkers) ? props.mapMarkers.length : 0,
          polylinePoints: Array.isArray((_b = (_a = props.mapPolyline) == null ? void 0 : _a[0]) == null ? void 0 : _b.points) ? props.mapPolyline[0].points.length : 0
        });
        scheduleCanvasDraw();
      });
      vue.watch([projectedCenter, displayTrackPoints, zoomLevel], () => {
        formatAppLog("log", "at pages/hiking/components/HikingTileMapCompat.vue:201", "[tile-map] watch redraw", {
          canvasId,
          scale: zoomLevel.value,
          displayPoints: displayTrackPoints.value.length,
          hasProjectedCenter: Boolean(projectedCenter.value)
        });
        scheduleCanvasDraw();
      }, { deep: true });
      async function scheduleCanvasDraw() {
        formatAppLog("log", "at pages/hiking/components/HikingTileMapCompat.vue:211", "[tile-map] schedule draw", { canvasId });
        await vue.nextTick();
        drawTrackCanvas();
      }
      function drawTrackCanvas() {
        formatAppLog("log", "at pages/hiking/components/HikingTileMapCompat.vue:217", "[tile-map] draw start", { canvasId });
        const context = uni.createCanvasContext(canvasId, instance == null ? void 0 : instance.proxy);
        context.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
        const line = Array.isArray(props.mapPolyline) ? props.mapPolyline[0] : null;
        const color = (line == null ? void 0 : line.color) || "#ff7a00";
        const borderColor = (line == null ? void 0 : line.borderColor) || "#c14f00";
        const width = Math.max(4, Number((line == null ? void 0 : line.width) || 5));
        const points = displayTrackPoints.value.map((point) => projectPoint(point == null ? void 0 : point.longitude, point == null ? void 0 : point.latitude)).filter(Boolean);
        if (points.length >= 2) {
          context.beginPath();
          context.setLineJoin("round");
          context.setLineCap("round");
          context.setStrokeStyle(borderColor);
          context.setLineWidth(width + 2);
          context.moveTo(points[0].x, points[0].y);
          for (let index = 1; index < points.length; index += 1) {
            context.lineTo(points[index].x, points[index].y);
          }
          context.stroke();
          context.beginPath();
          context.setLineJoin("round");
          context.setLineCap("round");
          context.setStrokeStyle(color);
          context.setLineWidth(width);
          context.moveTo(points[0].x, points[0].y);
          for (let index = 1; index < points.length; index += 1) {
            context.lineTo(points[index].x, points[index].y);
          }
          context.stroke();
        }
        context.draw(false, () => {
          formatAppLog("log", "at pages/hiking/components/HikingTileMapCompat.vue:254", "[tile-map] draw complete", { canvasId, pointCount: points.length });
        });
      }
      function projectPoint(longitude, latitude) {
        if (!projectedCenter.value) {
          return null;
        }
        const projected = projectToTile(longitude, latitude, zoomLevel.value);
        if (!projected) {
          return null;
        }
        const originX = projectedCenter.value.tileX - TILE_RADIUS;
        const originY = projectedCenter.value.tileY - TILE_RADIUS;
        return {
          x: (projected.worldX - originX) * TILE_SIZE,
          y: (projected.worldY - originY) * TILE_SIZE
        };
      }
      function projectToTile(longitude, latitude, zoom) {
        const lng = Number(longitude);
        const lat = Number(latitude);
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
          return null;
        }
        const boundedLat = clamp(lat, -85.05112878, 85.05112878);
        const total = 2 ** zoom;
        const worldX = (lng + 180) / 360 * total;
        const rad = boundedLat * Math.PI / 180;
        const worldY = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * total;
        const tileX = Math.floor(worldX);
        const tileY = Math.floor(worldY);
        return {
          worldX,
          worldY,
          tileX,
          tileY,
          fracX: worldX - tileX,
          fracY: worldY - tileY
        };
      }
      function fillTileUrl2(template, x, y, z) {
        return String(template || "").replace("{x}", String(x)).replace("{y}", String(y)).replace("{z}", String(z));
      }
      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }
      function modulo(value, max) {
        return (value % max + max) % max;
      }
      function handleTileError() {
        tileErrorCount.value += 1;
      }
      const __returned__ = { TILE_SIZE, TILE_RADIUS, GRID_SIZE, props, tileErrorCount, instance, canvasId, mapMode, tileConfig, zoomLevel, projectedCenter, gridStyle, tiles, markerDots, displayTrackPoints, canvasStyle, scheduleCanvasDraw, drawTrackCanvas, projectPoint, projectToTile, fillTileUrl: fillTileUrl2, clamp, modulo, handleTileError, computed: vue.computed, getCurrentInstance: vue.getCurrentInstance, nextTick: vue.nextTick, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch, get resolveOfflineTileSource() {
        return resolveOfflineTileSource;
      }, get simplifyTrackPoints() {
        return simplifyTrackPoints;
      }, get getTiandituLayerConfig() {
        return getTiandituLayerConfig;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "tile-map" }, [
      vue.createElementVNode(
        "view",
        {
          class: "tile-grid",
          style: vue.normalizeStyle($setup.gridStyle)
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.tiles, (tile) => {
              return vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                {
                  key: tile.key
                },
                [
                  vue.createElementVNode("image", {
                    class: "tile-image",
                    src: tile.baseUrl,
                    mode: "scaleToFill",
                    style: vue.normalizeStyle(tile.style),
                    onError: $setup.handleTileError
                  }, null, 44, ["src"]),
                  tile.annotationUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "tile-image tile-annotation",
                    src: tile.annotationUrl,
                    mode: "scaleToFill",
                    style: vue.normalizeStyle(tile.style),
                    onError: $setup.handleTileError
                  }, null, 44, ["src"])) : vue.createCommentVNode("v-if", true)
                ],
                64
                /* STABLE_FRAGMENT */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createElementVNode(
            "canvas",
            {
              "canvas-id": $setup.canvasId,
              class: "track-canvas",
              style: vue.normalizeStyle($setup.canvasStyle),
              width: $setup.GRID_SIZE,
              height: $setup.GRID_SIZE
            },
            null,
            4
            /* STYLE */
          ),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.markerDots, (marker) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: marker.key,
                  class: "marker-dot",
                  style: vue.normalizeStyle(marker.style)
                },
                [
                  marker.avatarUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "marker-avatar",
                    src: marker.avatarUrl,
                    mode: "aspectFill"
                  }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      class: "marker-initial"
                    },
                    vue.toDisplayString(marker.avatarInitial),
                    1
                    /* TEXT */
                  )),
                  vue.createElementVNode("view", { class: "marker-core" }),
                  vue.createElementVNode(
                    "view",
                    { class: "marker-badge" },
                    vue.toDisplayString(marker.statusText),
                    1
                    /* TEXT */
                  )
                ],
                4
                /* STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const HikingTileMapCompat = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-949360fd"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingTileMapCompat.vue"]]);
  function normalizeUser(user) {
    if (!user || typeof user !== "object") {
      return user;
    }
    const avatarUrl = normalizeApiAssetUrl(user.avatar_url || user.avatar);
    return {
      ...user,
      avatar_url: avatarUrl,
      avatar: avatarUrl
    };
  }
  function normalizeResponseData(data) {
    if (!data || typeof data !== "object") {
      return data;
    }
    return {
      ...data,
      user: normalizeUser(data.user),
      data: data.data && typeof data.data === "object" ? {
        ...data.data,
        avatar_url: normalizeApiAssetUrl(data.data.avatar_url || data.data.avatar),
        avatar: normalizeApiAssetUrl(data.data.avatar || data.data.avatar_url)
      } : data.data
    };
  }
  function request$2(path, data) {
    return new Promise((resolve, reject) => {
      if (!hasAuthApiBaseUrl()) {
        reject(new Error("认证服务地址未配置，请先在 config/auth.js 中填写 AUTH_API_BASE_URL。"));
        return;
      }
      requestJson({
        url: `${AUTH_API_BASE_URL}${path}`,
        method: "POST",
        timeout: 15e3,
        headers: {
          "Content-Type": "application/json"
        },
        header: {
          "Content-Type": "application/json"
        },
        data
      }).then((res) => {
        var _a;
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || `请求失败(${res.statusCode})`));
          return;
        }
        resolve(normalizeResponseData(res.data || {}));
      }).catch((error) => {
        reject(new Error((error == null ? void 0 : error.message) || "无法连接认证服务，请检查服务器地址或网络。"));
      });
    });
  }
  async function loginWithPassword(payload) {
    return request$2("/auth/login", payload);
  }
  async function registerWithPassword(payload) {
    return request$2("/auth/register", payload);
  }
  function authRequest(path, method, token, data) {
    return new Promise((resolve, reject) => {
      if (!hasAuthApiBaseUrl()) {
        reject(new Error("认证服务地址未配置"));
        return;
      }
      const headers = {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      };
      formatAppLog("log", "at services/auth.js:86", "[auth-request] start", {
        path,
        method,
        hasToken: Boolean(token),
        payload: data
      });
      requestJson({
        url: `${AUTH_API_BASE_URL}${path}`,
        method,
        timeout: 15e3,
        headers,
        header: headers,
        data: method === "GET" ? void 0 : data
      }).then((res) => {
        var _a;
        formatAppLog("log", "at services/auth.js:100", "[auth-request] response", {
          path,
          method,
          statusCode: res == null ? void 0 : res.statusCode,
          data: res == null ? void 0 : res.data
        });
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || `请求失败(${res.statusCode})`));
          return;
        }
        resolve(normalizeResponseData(res.data || {}));
      }).catch((error) => {
        formatAppLog("error", "at services/auth.js:112", "[auth-request] fail", {
          path,
          method,
          error,
          errMsg: error == null ? void 0 : error.errMsg,
          message: error == null ? void 0 : error.message
        });
        reject(new Error((error == null ? void 0 : error.message) || "无法连接服务器"));
      });
    });
  }
  function uploadAvatar(token, filePath) {
    return new Promise((resolve, reject) => {
      if (!hasAuthApiBaseUrl()) {
        reject(new Error("认证服务地址未配置"));
        return;
      }
      uni.uploadFile({
        url: `${AUTH_API_BASE_URL}/users/me/avatar`,
        filePath,
        name: "avatar",
        header: { Authorization: `Bearer ${token}` },
        success: (res) => {
          const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error((data == null ? void 0 : data.message) || "上传失败"));
            return;
          }
          resolve(normalizeResponseData(data));
        },
        fail: () => reject(new Error("上传失败，请检查网络"))
      });
    });
  }
  function updateUserProfile(token, payload) {
    return authRequest("/users/me", "PATCH", token, payload);
  }
  function getMyProfile(token) {
    return authRequest("/users/me", "GET", token, void 0);
  }
  function getMyGuides(token) {
    return authRequest("/users/me/guides", "GET", token, void 0);
  }
  function getMyFavoriteGuides(token) {
    return authRequest("/users/me/favorites/guides", "GET", token, void 0);
  }
  function getMyStats(token) {
    return authRequest("/users/me/stats", "GET", token, void 0);
  }
  function followUser(token, userId) {
    return authRequest(`/users/${encodeURIComponent(userId)}/follow`, "POST", token, void 0);
  }
  function unfollowUser(token, userId) {
    return authRequest(`/users/${encodeURIComponent(userId)}/follow`, "DELETE", token, void 0);
  }
  const _sfc_main$e = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const guide = vue.ref(null);
      const activeImageIndex = vue.ref(0);
      const followLoading = vue.ref(false);
      const detailLoading = vue.ref(true);
      const isLiked = vue.ref(false);
      const isSaved = vue.ref(false);
      const likeCount = vue.ref(0);
      const saveCount = vue.ref(0);
      const likeSubmitting = vue.ref(false);
      const saveSubmitting = vue.ref(false);
      const comments = vue.ref([]);
      const commentInput = vue.ref("");
      const commentSubmitting = vue.ref(false);
      const commentInputFocused = vue.ref(false);
      const commentsLoading = vue.ref(false);
      const commentError = vue.ref("");
      const commentDeletingId = vue.ref("");
      const trackPreviewOpening = vue.ref(false);
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const guideImages = vue.computed(() => {
        var _a, _b;
        const images = (_a = guide.value) == null ? void 0 : _a.images;
        if (Array.isArray(images) && images.length) {
          return images;
        }
        return ((_b = guide.value) == null ? void 0 : _b.image) ? [guide.value.image] : [];
      });
      const hasVideo = vue.computed(() => {
        var _a;
        return Boolean((_a = guide.value) == null ? void 0 : _a.video);
      });
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const isOwnAuthor = vue.computed(() => {
        var _a, _b;
        const authorId = (_a = guide.value) == null ? void 0 : _a.authorId;
        return Boolean(authorId && ((_b = currentUser.value) == null ? void 0 : _b.id) && authorId === currentUser.value.id);
      });
      const currentUserAvatar = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = currentUser.value) == null ? void 0 : _b.avatar) || "";
      });
      const guideAuthorAvatar = vue.computed(() => {
        var _a;
        if (isOwnAuthor.value && currentUserAvatar.value) {
          return currentUserAvatar.value;
        }
        return ((_a = guide.value) == null ? void 0 : _a.authorAvatar) || "";
      });
      const authorInitial = vue.computed(() => {
        var _a, _b, _c;
        return getAvatarInitial(((_a = guide.value) == null ? void 0 : _a.nickname) || ((_b = guide.value) == null ? void 0 : _b.author) || ((_c = guide.value) == null ? void 0 : _c.email) || "");
      });
      const showFollowButton = vue.computed(() => {
        var _a;
        return Boolean((_a = guide.value) == null ? void 0 : _a.authorId);
      });
      const commentInputAvatar = vue.computed(() => currentUserAvatar.value);
      const commentInputInitial = vue.computed(() => {
        var _a, _b;
        return getAvatarInitial(((_a = currentUser.value) == null ? void 0 : _a.nickname) || ((_b = currentUser.value) == null ? void 0 : _b.email) || "");
      });
      const commentSubmitDisabled = vue.computed(() => commentSubmitting.value || !commentInput.value.trim());
      const commentSummary = vue.computed(() => {
        if (commentError.value) {
          return "评论加载失败，可重新刷新。";
        }
        if (!comments.value.length) {
          return "还没有人发言，欢迎留下第一条评论。";
        }
        return `已展示最新 ${comments.value.length} 条评论`;
      });
      function commentAvatar(comment) {
        var _a;
        if (comment == null ? void 0 : comment.avatarUrl) {
          return comment.avatarUrl;
        }
        if ((comment == null ? void 0 : comment.authorId) && ((_a = currentUser.value) == null ? void 0 : _a.id) && comment.authorId === currentUser.value.id) {
          return currentUserAvatar.value;
        }
        return "";
      }
      function getAvatarInitial(value) {
        const text = String(value || "").trim();
        if (!text) {
          return "游";
        }
        return text.slice(0, 1).toUpperCase();
      }
      const followButtonText = vue.computed(() => {
        var _a, _b, _c;
        if (!((_a = guide.value) == null ? void 0 : _a.authorId)) {
          return "作者";
        }
        if (isOwnAuthor.value) {
          return "我的";
        }
        if (followLoading.value) {
          return ((_b = guide.value) == null ? void 0 : _b.isFollowingAuthor) ? "处理中" : "关注中";
        }
        return ((_c = guide.value) == null ? void 0 : _c.isFollowingAuthor) ? "已关注" : "关注";
      });
      const detailTags = vue.computed(() => {
        if (!guide.value) {
          return [];
        }
        return [guide.value.locationTag, ...guide.value.highlights || []].filter(Boolean).map((item) => String(item).replace(/^#/, "").trim()).filter(Boolean).slice(0, 4);
      });
      const detailSummary = vue.computed(() => {
        var _a, _b;
        const summary = ((_a = guide.value) == null ? void 0 : _a.summaryText) || ((_b = guide.value) == null ? void 0 : _b.excerpt) || "";
        return String(summary || "").trim();
      });
      const guideTrack = vue.computed(() => {
        var _a;
        return ((_a = guide.value) == null ? void 0 : _a.hikingTrack) || null;
      });
      const guideTrackCenter = vue.computed(() => {
        var _a, _b;
        return ((_a = guideTrack.value) == null ? void 0 : _a.endPoint) || ((_b = guideTrack.value) == null ? void 0 : _b.startPoint) || null;
      });
      const guideTrackPolyline = vue.computed(() => {
        var _a;
        return buildTrackPolyline(((_a = guideTrack.value) == null ? void 0 : _a.points) || []);
      });
      const guideTrackDistanceText = vue.computed(() => {
        var _a;
        const distanceKm = Number(((_a = guideTrack.value) == null ? void 0 : _a.distanceKm) || 0);
        return distanceKm > 0 ? `${distanceKm.toFixed(2)} km` : "--";
      });
      const guideTrackDurationText = vue.computed(() => {
        var _a;
        return formatTrackDuration(((_a = guideTrack.value) == null ? void 0 : _a.durationMs) || 0);
      });
      const guideTrackAscentText = vue.computed(() => {
        var _a;
        const ascent = Number(((_a = guideTrack.value) == null ? void 0 : _a.altitudeGain) || 0);
        return ascent > 0 ? `${Math.round(ascent)} m` : "--";
      });
      const guideTrackCoordinateText = vue.computed(() => {
        const point = guideTrackCenter.value;
        if (!point) {
          return "--";
        }
        return `${formatCoordinate(point.latitude, "lat")} / ${formatCoordinate(point.longitude, "lng")}`;
      });
      const searchHint = vue.computed(() => {
        var _a;
        const primary = detailTags.value[0] || ((_a = guide.value) == null ? void 0 : _a.location) || "新疆旅游";
        return `${primary} 路线位置`;
      });
      onLoad(async (options) => {
        var _a, _b, _c, _d;
        const id = (options == null ? void 0 : options.id) || "";
        detailLoading.value = true;
        try {
          await refreshCurrentUser();
          guide.value = await getGuideDetail(id);
          likeCount.value = Number((_a = guide.value) == null ? void 0 : _a.likesCount) || 0;
          saveCount.value = Number((_b = guide.value) == null ? void 0 : _b.saveCount) || 0;
          isLiked.value = Boolean((_c = guide.value) == null ? void 0 : _c.isLiked);
          isSaved.value = Boolean((_d = guide.value) == null ? void 0 : _d.isSaved);
          await loadComments(id);
        } catch (error) {
          guide.value = null;
          uni.showToast({ title: error.message || "攻略加载失败", icon: "none" });
        } finally {
          detailLoading.value = false;
        }
        activeImageIndex.value = 0;
      });
      onShow(() => {
        trackPreviewOpening.value = false;
      });
      async function refreshCurrentUser() {
        const token = getStoredAuthToken();
        if (!token) {
          return;
        }
        try {
          const res = await getMyProfile(token);
          if (res == null ? void 0 : res.user) {
            saveAuthSession({ token, user: res.user });
          }
        } catch {
        }
      }
      async function toggleLike() {
        var _a;
        const token = getStoredAuthToken();
        if (!token) {
          promptLoginForComment("登录后才能点赞这条攻略。");
          return;
        }
        if (!((_a = guide.value) == null ? void 0 : _a.id) || likeSubmitting.value) {
          return;
        }
        likeSubmitting.value = true;
        try {
          const result = isLiked.value ? await unlikeGuide(guide.value.id, token) : await likeGuide(guide.value.id, token);
          isLiked.value = Boolean(result == null ? void 0 : result.liked);
          likeCount.value = Number(result == null ? void 0 : result.likesCount) || 0;
          saveCount.value = Number(result == null ? void 0 : result.saveCount) || saveCount.value;
          if (guide.value) {
            guide.value.likesCount = likeCount.value;
            guide.value.saveCount = saveCount.value;
            guide.value.isLiked = isLiked.value;
          }
          uni.showToast({ title: isLiked.value ? "已点赞" : "已取消点赞", icon: "none" });
        } catch (error) {
          if ((error == null ? void 0 : error.statusCode) === 401) {
            clearAuthSession();
            promptLoginForComment("登录状态已失效，请重新登录后再点赞。");
            return;
          }
          uni.showToast({ title: error.message || "点赞失败", icon: "none" });
        } finally {
          likeSubmitting.value = false;
        }
      }
      async function toggleSave() {
        var _a;
        const token = getStoredAuthToken();
        if (!token) {
          promptLoginForComment("登录后才能收藏这条攻略。");
          return;
        }
        if (!((_a = guide.value) == null ? void 0 : _a.id) || saveSubmitting.value) {
          return;
        }
        saveSubmitting.value = true;
        try {
          const result = isSaved.value ? await unsaveGuide(guide.value.id, token) : await saveGuide(guide.value.id, token);
          isSaved.value = Boolean(result == null ? void 0 : result.saved);
          likeCount.value = Number(result == null ? void 0 : result.likesCount) || likeCount.value;
          saveCount.value = Number(result == null ? void 0 : result.saveCount) || 0;
          if (guide.value) {
            guide.value.likesCount = likeCount.value;
            guide.value.saveCount = saveCount.value;
            guide.value.isSaved = isSaved.value;
          }
          uni.showToast({ title: isSaved.value ? "已收藏" : "已取消收藏", icon: "none" });
        } catch (error) {
          if ((error == null ? void 0 : error.statusCode) === 401) {
            clearAuthSession();
            promptLoginForComment("登录状态已失效，请重新登录后再收藏。");
            return;
          }
          uni.showToast({ title: error.message || "收藏失败", icon: "none" });
        } finally {
          saveSubmitting.value = false;
        }
      }
      function focusComment() {
        const token = getStoredAuthToken();
        if (!token) {
          promptLoginForComment("登录后才能评论，发送的内容会展示在这条攻略下。");
          return;
        }
        commentInputFocused.value = true;
      }
      function handleCommentBlur() {
        if (!commentInput.value.trim()) {
          commentInputFocused.value = false;
        }
      }
      async function loadComments(slug = ((_a) => (_a = guide.value) == null ? void 0 : _a.id)() || "") {
        if (!slug) {
          comments.value = [];
          commentError.value = "";
          commentsLoading.value = false;
          return;
        }
        commentsLoading.value = true;
        commentError.value = "";
        try {
          comments.value = await getGuideComments(slug);
        } catch (error) {
          comments.value = [];
          commentError.value = error.message || "评论加载失败，请稍后重试。";
        } finally {
          commentsLoading.value = false;
        }
      }
      function reloadComments() {
        var _a;
        loadComments(((_a = guide.value) == null ? void 0 : _a.id) || "");
      }
      async function submitComment() {
        var _a;
        const content = commentInput.value.trim();
        if (!content || commentSubmitting.value)
          return;
        if (content.length > 500) {
          uni.showToast({ title: "评论不能超过 500 字", icon: "none" });
          return;
        }
        const token = getStoredAuthToken();
        if (!token) {
          promptLoginForComment("登录后才能发表评论。");
          return;
        }
        const slug = ((_a = guide.value) == null ? void 0 : _a.id) || "";
        if (!slug) {
          uni.showToast({ title: "攻略信息缺失，请返回重试", icon: "none" });
          return;
        }
        commentSubmitting.value = true;
        try {
          const comment = await postGuideComment(slug, content, token);
          if (comment) {
            comments.value.unshift(comment);
            if (guide.value)
              guide.value.commentCount = (Number(guide.value.commentCount) || 0) + 1;
          }
          commentError.value = "";
          commentInput.value = "";
          commentInputFocused.value = false;
          await loadComments(slug);
          uni.showToast({ title: "评论成功", icon: "success" });
        } catch (e) {
          if ((e == null ? void 0 : e.statusCode) === 401) {
            clearAuthSession();
            commentInputFocused.value = false;
            promptLoginForComment("登录状态已失效，请重新登录后再评论。");
            return;
          }
          uni.showToast({ title: e.message || "评论失败", icon: "none" });
        } finally {
          commentSubmitting.value = false;
        }
      }
      function promptLoginForComment(content) {
        uni.showModal({
          title: "需要登录",
          content,
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({ url: "/pages/auth/index?mode=login" });
            }
          }
        });
      }
      function removeComment(comment) {
        if (!(comment == null ? void 0 : comment.id) || !comment.canDelete || commentDeletingId.value) {
          return;
        }
        uni.showModal({
          title: "删除评论",
          content: "删除后无法恢复，确认继续吗？",
          success: async ({ confirm }) => {
            var _a;
            if (!confirm) {
              return;
            }
            const token = getStoredAuthToken();
            if (!token) {
              uni.showToast({ title: "请先登录", icon: "none" });
              return;
            }
            commentDeletingId.value = comment.id;
            try {
              await deleteGuideComment(((_a = guide.value) == null ? void 0 : _a.id) || "", comment.id, token);
              comments.value = comments.value.filter((item) => item.id !== comment.id);
              if (guide.value) {
                guide.value.commentCount = Math.max((Number(guide.value.commentCount) || 0) - 1, 0);
              }
              uni.showToast({ title: "评论已删除", icon: "success" });
            } catch (error) {
              uni.showToast({ title: error.message || "删除失败", icon: "none" });
            } finally {
              commentDeletingId.value = "";
            }
          }
        });
      }
      function goBack() {
        if (getCurrentPages().length > 1) {
          uni.navigateBack();
          return;
        }
        uni.reLaunch({ url: "/pages/guides/index" });
      }
      function handleSwiperChange(event) {
        var _a;
        activeImageIndex.value = ((_a = event == null ? void 0 : event.detail) == null ? void 0 : _a.current) || 0;
      }
      function previewImage(index) {
        if (!guideImages.value.length) {
          return;
        }
        uni.previewImage({
          current: guideImages.value[index] || guideImages.value[0],
          urls: guideImages.value
        });
      }
      function openTrackPreview() {
        var _a, _b, _c, _d, _e, _f;
        if (!guideTrack.value) {
          formatAppLog("warn", "at pages/guide-detail/index.vue:668", "[guide-track-preview] skip open: no track");
          return;
        }
        if (trackPreviewOpening.value) {
          formatAppLog("warn", "at pages/guide-detail/index.vue:673", "[guide-track-preview] skip open: navigate locked");
          return;
        }
        trackPreviewOpening.value = true;
        formatAppLog("log", "at pages/guide-detail/index.vue:679", "[guide-track-preview] open from detail", {
          title: ((_a = guide.value) == null ? void 0 : _a.title) || "",
          pointCount: Number(((_b = guideTrack.value) == null ? void 0 : _b.pointCount) || ((_d = (_c = guideTrack.value) == null ? void 0 : _c.points) == null ? void 0 : _d.length) || 0),
          distanceKm: Number(((_e = guideTrack.value) == null ? void 0 : _e.distanceKm) || 0)
        });
        saveGuideTrackPreview({
          title: ((_f = guide.value) == null ? void 0 : _f.title) || "",
          track: guideTrack.value
        });
        formatAppLog("log", "at pages/guide-detail/index.vue:690", "[guide-track-preview] navigateTo start");
        uni.navigateTo({
          url: "/pages/track-preview/index",
          success(res) {
            formatAppLog("log", "at pages/guide-detail/index.vue:694", "[guide-track-preview] navigateTo success", res);
          },
          fail(error) {
            trackPreviewOpening.value = false;
            formatAppLog("error", "at pages/guide-detail/index.vue:698", "[guide-track-preview] navigateTo fail", error);
            if (!String((error == null ? void 0 : error.errMsg) || "").includes("locked")) {
              uni.showToast({ title: "打开路线预览失败", icon: "none" });
            }
          }
        });
      }
      async function handleFollowTap() {
        var _a;
        if (!((_a = guide.value) == null ? void 0 : _a.authorId) || isOwnAuthor.value || followLoading.value) {
          return;
        }
        const token = getStoredAuthToken();
        if (!token) {
          uni.showModal({
            title: "登录后可关注作者",
            content: "关注后，TA 发布的新攻略会优先出现在你的推荐流中。",
            success: ({ confirm }) => {
              if (confirm) {
                uni.navigateTo({ url: "/pages/auth/index?mode=login" });
              }
            }
          });
          return;
        }
        followLoading.value = true;
        try {
          const action = guide.value.isFollowingAuthor ? unfollowUser : followUser;
          const response = await action(token, guide.value.authorId);
          const profile = (response == null ? void 0 : response.data) || null;
          guide.value = {
            ...guide.value,
            isFollowingAuthor: Boolean(profile == null ? void 0 : profile.isFollowing),
            authorFollowerCount: Number(profile == null ? void 0 : profile.followerCount) || 0,
            authorFollowingCount: Number(profile == null ? void 0 : profile.followingCount) || 0
          };
          uni.showToast({
            title: guide.value.isFollowingAuthor ? "已关注作者" : "已取消关注",
            icon: "none"
          });
        } catch (error) {
          uni.showToast({ title: error.message || "操作失败", icon: "none" });
        } finally {
          followLoading.value = false;
        }
      }
      function formatCount(value) {
        const count = Number(value) || 0;
        if (count >= 1e4) {
          return `${(count / 1e4).toFixed(1)}w`;
        }
        if (count >= 1e3) {
          return `${(count / 1e3).toFixed(1)}k`;
        }
        return `${count}`;
      }
      function formatPublishMeta(value) {
        if (!value) {
          return "刚刚";
        }
        const text = String(value);
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          return text.slice(5).replace("-", "-");
        }
        return text;
      }
      function formatCommentTime(value) {
        if (!value) {
          return "刚刚";
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return String(value);
        }
        const diff = Date.now() - date.getTime();
        const minute = 60 * 1e3;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) {
          return "刚刚";
        }
        if (diff < hour) {
          return `${Math.max(1, Math.floor(diff / minute))} 分钟前`;
        }
        if (diff < day) {
          return `${Math.max(1, Math.floor(diff / hour))} 小时前`;
        }
        if (diff < day * 7) {
          return `${Math.max(1, Math.floor(diff / day))} 天前`;
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
      const __returned__ = { guide, activeImageIndex, followLoading, detailLoading, isLiked, isSaved, likeCount, saveCount, likeSubmitting, saveSubmitting, comments, commentInput, commentSubmitting, commentInputFocused, commentsLoading, commentError, commentDeletingId, trackPreviewOpening, systemInfo, statusBarHeight, statusBarStyle, guideImages, hasVideo, currentUser, isOwnAuthor, currentUserAvatar, guideAuthorAvatar, authorInitial, showFollowButton, commentInputAvatar, commentInputInitial, commentSubmitDisabled, commentSummary, commentAvatar, getAvatarInitial, followButtonText, detailTags, detailSummary, guideTrack, guideTrackCenter, guideTrackPolyline, guideTrackDistanceText, guideTrackDurationText, guideTrackAscentText, guideTrackCoordinateText, searchHint, refreshCurrentUser, toggleLike, toggleSave, focusComment, handleCommentBlur, loadComments, reloadComments, submitComment, promptLoginForComment, removeComment, goBack, handleSwiperChange, previewImage, openTrackPreview, handleFollowTap, formatCount, formatPublishMeta, formatCommentTime, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, CachedImage, get clearAuthSession() {
        return clearAuthSession;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get saveAuthSession() {
        return saveAuthSession;
      }, get formatTrackDuration() {
        return formatTrackDuration;
      }, get saveGuideTrackPreview() {
        return saveGuideTrackPreview;
      }, get buildTrackPolyline() {
        return buildTrackPolyline;
      }, get formatCoordinate() {
        return formatCoordinate;
      }, HikingTileMapCompat, get followUser() {
        return followUser;
      }, get getMyProfile() {
        return getMyProfile;
      }, get unfollowUser() {
        return unfollowUser;
      }, get deleteGuideComment() {
        return deleteGuideComment;
      }, get getGuideComments() {
        return getGuideComments;
      }, get getGuideDetail() {
        return getGuideDetail;
      }, get likeGuide() {
        return likeGuide;
      }, get postGuideComment() {
        return postGuideComment;
      }, get saveGuide() {
        return saveGuide;
      }, get unlikeGuide() {
        return unlikeGuide;
      }, get unsaveGuide() {
        return unsaveGuide;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "detail-page page-shell" }, [
      $setup.guide ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "detail-scroll page-scroll"
      }, [
        vue.createElementVNode(
          "view",
          {
            class: "status-space",
            style: vue.normalizeStyle($setup.statusBarStyle)
          },
          null,
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "topbar" }, [
          vue.createElementVNode("view", {
            class: "icon-btn",
            onClick: $setup.goBack
          }, "‹"),
          vue.createElementVNode("view", { class: "author-strip" }, [
            $setup.guideAuthorAvatar ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
              key: 0,
              src: $setup.guideAuthorAvatar,
              "container-class": "author-avatar-shell",
              "image-class": "author-avatar",
              style: { "width": "72rpx", "height": "72rpx", "border-radius": "50%", "flex-shrink": "0" }
            }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "author-avatar-shell author-avatar-placeholder"
            }, [
              vue.createElementVNode(
                "text",
                { class: "author-avatar-placeholder-text" },
                vue.toDisplayString($setup.authorInitial),
                1
                /* TEXT */
              )
            ])),
            vue.createElementVNode("view", { class: "author-copy" }, [
              vue.createElementVNode(
                "text",
                { class: "author-name" },
                vue.toDisplayString($setup.guide.nickname || $setup.guide.author),
                1
                /* TEXT */
              ),
              $setup.guide.authorFollowerCount || $setup.guide.authorFollowingCount ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "author-meta"
                },
                vue.toDisplayString($setup.formatCount($setup.guide.authorFollowerCount)) + " 粉丝 · " + vue.toDisplayString($setup.formatCount($setup.guide.authorFollowingCount)) + " 关注 ",
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("view", { class: "topbar-actions" }, [
            $setup.showFollowButton ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(["follow-btn", { active: $setup.guide.isFollowingAuthor, disabled: $setup.followLoading }]),
                onClick: $setup.handleFollowTap
              },
              vue.toDisplayString($setup.followButtonText),
              3
              /* TEXT, CLASS */
            )) : (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: "follow-btn muted-btn"
              },
              vue.toDisplayString($setup.followButtonText),
              1
              /* TEXT */
            )),
            vue.createElementVNode("view", { class: "icon-btn share-btn" }, "↗")
          ])
        ]),
        vue.createElementVNode("view", { class: "media-shell" }, [
          $setup.hasVideo ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "video-shell"
          }, [
            vue.createElementVNode("video", {
              class: "detail-video",
              src: $setup.guide.video,
              poster: $setup.guide.videoPoster || $setup.guide.image,
              controls: "",
              "object-fit": "cover"
            }, null, 8, ["src", "poster"])
          ])) : $setup.guideImages.length ? (vue.openBlock(), vue.createElementBlock("swiper", {
            key: 1,
            class: "media-swiper",
            circular: "",
            current: $setup.activeImageIndex,
            onChange: $setup.handleSwiperChange
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.guideImages, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("swiper-item", {
                  key: `${item}-${index}`
                }, [
                  vue.createElementVNode("view", {
                    class: "media-slide",
                    onClick: ($event) => $setup.previewImage(index)
                  }, [
                    vue.createVNode($setup["CachedImage"], {
                      src: item,
                      "image-class": "cover-image"
                    }, null, 8, ["src"])
                  ], 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ], 40, ["current"])) : vue.createCommentVNode("v-if", true),
          $setup.guideImages.length > 1 ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 2,
              class: "page-indicator"
            },
            vue.toDisplayString($setup.activeImageIndex + 1) + "/" + vue.toDisplayString($setup.guideImages.length),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          $setup.guideImages.length > 1 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "dot-indicator"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.guideImages, (item, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: `${item}-dot-${index}`,
                    class: vue.normalizeClass(["dot", { active: $setup.activeImageIndex === index }])
                  },
                  null,
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "content-shell section" }, [
          vue.createElementVNode(
            "text",
            { class: "note-title" },
            vue.toDisplayString($setup.guide.title),
            1
            /* TEXT */
          ),
          $setup.detailSummary ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "note-summary"
            },
            vue.toDisplayString($setup.detailSummary),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          $setup.detailTags.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "tag-row"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.detailTags, (item) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: item,
                    class: "tag-chip"
                  },
                  "#" + vue.toDisplayString(item),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "meta-row" }, [
            vue.createElementVNode(
              "text",
              { class: "meta-text" },
              "编辑于 " + vue.toDisplayString($setup.formatPublishMeta($setup.guide.publishDate)),
              1
              /* TEXT */
            )
          ])
        ]),
        $setup.guideTrack ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "track-section section"
        }, [
          vue.createElementVNode("view", { class: "track-section-head" }, [
            vue.createElementVNode("view", null, [
              vue.createElementVNode("text", { class: "track-section-title" }, "附带徒步轨迹"),
              vue.createElementVNode("text", { class: "track-section-subtitle" }, "这条笔记同步了一段真实路线，可直接查看大致走向。")
            ]),
            vue.createElementVNode(
              "text",
              { class: "track-section-badge" },
              vue.toDisplayString($setup.guideTrack.pointCount) + " 点",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "track-stat-row" }, [
            vue.createElementVNode("view", { class: "track-stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "track-stat-value" },
                vue.toDisplayString($setup.guideTrackDistanceText),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "track-stat-label" }, "路线距离")
            ]),
            vue.createElementVNode("view", { class: "track-stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "track-stat-value" },
                vue.toDisplayString($setup.guideTrackDurationText),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "track-stat-label" }, "记录时长")
            ]),
            vue.createElementVNode("view", { class: "track-stat-card" }, [
              vue.createElementVNode(
                "text",
                { class: "track-stat-value" },
                vue.toDisplayString($setup.guideTrackAscentText),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "track-stat-label" }, "累计爬升")
            ])
          ]),
          vue.createElementVNode("view", {
            class: "track-map-shell",
            onClick: $setup.openTrackPreview
          }, [
            vue.createVNode($setup["HikingTileMapCompat"], {
              "map-center": $setup.guideTrackCenter,
              "map-scale": 14,
              "map-polyline": $setup.guideTrackPolyline,
              "map-markers": [],
              "show-center-marker": false,
              "map-mode-key": "satellite"
            }, null, 8, ["map-center", "map-polyline"]),
            vue.createElementVNode("view", {
              class: "track-map-hint",
              onClick: $setup.openTrackPreview
            }, "放大查看路线")
          ]),
          vue.createElementVNode("view", { class: "track-meta-row" }, [
            vue.createElementVNode("text", { class: "track-meta-label" }, "终点坐标"),
            vue.createElementVNode(
              "text",
              { class: "track-meta-value" },
              vue.toDisplayString($setup.guideTrackCoordinateText),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "track-preview-action",
            onClick: $setup.openTrackPreview
          }, "查看大图")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "comment-head section" }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode(
              "text",
              { class: "comment-title" },
              "共 " + vue.toDisplayString($setup.formatCount($setup.guide.commentCount)) + " 条评论",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "comment-subtitle" },
              vue.toDisplayString($setup.commentsLoading ? "正在加载评论..." : $setup.commentSummary),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("text", { class: "comment-filter" }, "最新")
        ]),
        vue.createElementVNode("view", {
          class: "input-preview section",
          onClick: $setup.focusComment
        }, [
          $setup.commentInputAvatar ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
            key: 0,
            src: $setup.commentInputAvatar,
            "container-class": "comment-avatar-shell",
            "image-class": "comment-avatar",
            style: { "width": "72rpx", "height": "72rpx", "border-radius": "50%", "flex-shrink": "0" }
          }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "comment-avatar-shell comment-avatar-placeholder"
          }, [
            vue.createElementVNode(
              "text",
              { class: "comment-avatar-placeholder-text" },
              vue.toDisplayString($setup.commentInputInitial),
              1
              /* TEXT */
            )
          ])),
          vue.createElementVNode("view", { class: "fake-input" }, "留下你的想法吧")
        ]),
        $setup.commentsLoading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "comment-state section"
        }, [
          vue.createElementVNode("text", { class: "comment-state-text" }, "评论加载中...")
        ])) : $setup.commentError ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "comment-state section"
        }, [
          vue.createElementVNode(
            "text",
            { class: "comment-state-text" },
            vue.toDisplayString($setup.commentError),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", {
            class: "comment-retry",
            onClick: $setup.reloadComments
          }, "重新加载")
        ])) : $setup.comments.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "comment-list section"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.comments, (c) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: c.id,
                class: "comment-item"
              }, [
                $setup.commentAvatar(c) ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                  key: 0,
                  src: $setup.commentAvatar(c),
                  "container-class": "comment-avatar-shell",
                  "image-class": "comment-avatar",
                  style: { "width": "72rpx", "height": "72rpx", "border-radius": "50%", "flex-shrink": "0" }
                }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "comment-avatar-shell comment-avatar-placeholder"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "comment-avatar-placeholder-text" },
                    vue.toDisplayString($setup.getAvatarInitial(c.nickname)),
                    1
                    /* TEXT */
                  )
                ])),
                vue.createElementVNode("view", { class: "comment-body-wrap" }, [
                  vue.createElementVNode("view", { class: "comment-row-top" }, [
                    vue.createElementVNode("view", { class: "comment-user-meta" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "comment-name" },
                        vue.toDisplayString(c.nickname),
                        1
                        /* TEXT */
                      ),
                      c.authorId === $setup.guide.authorId ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "author-badge"
                      }, "作者")) : c.isAuthor ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 1,
                        class: "self-badge"
                      }, "我")) : vue.createCommentVNode("v-if", true)
                    ]),
                    c.canDelete ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      class: "comment-delete",
                      onClick: ($event) => $setup.removeComment(c)
                    }, vue.toDisplayString($setup.commentDeletingId === c.id ? "删除中" : "删除"), 9, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "comment-text comment-content" },
                    vue.toDisplayString(c.content),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "comment-date" },
                    vue.toDisplayString($setup.formatCommentTime(c.createdAt)),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 4,
          class: "comment-state section empty-comment-state"
        }, [
          vue.createElementVNode("text", { class: "comment-state-text" }, "还没有评论，来抢个沙发吧。")
        ])),
        vue.createElementVNode("view", { class: "bottom-space detail-bottom-space" })
      ])) : !$setup.detailLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-shell section"
      }, [
        vue.createElementVNode("text", { class: "empty-title" }, "攻略不存在"),
        vue.createElementVNode("view", {
          class: "primary-btn narrow-btn",
          onClick: $setup.goBack
        }, "返回上一页")
      ])) : vue.createCommentVNode("v-if", true),
      $setup.guide ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "action-bar"
      }, [
        vue.createElementVNode("view", { class: "action-composer" }, [
          vue.withDirectives(vue.createElementVNode("textarea", {
            class: vue.normalizeClass(["action-textarea", { focused: $setup.commentInputFocused }]),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.commentInput = $event),
            placeholder: "说点什么...",
            maxlength: "500",
            "auto-height": "",
            focus: $setup.commentInputFocused,
            "show-confirm-bar": false,
            "confirm-type": "send",
            "cursor-spacing": "24",
            onFocus: _cache[1] || (_cache[1] = ($event) => $setup.commentInputFocused = true),
            onBlur: $setup.handleCommentBlur,
            onConfirm: $setup.submitComment,
            onClick: $setup.focusComment
          }, null, 42, ["focus"]), [
            [vue.vModelText, $setup.commentInput]
          ]),
          vue.createElementVNode("view", { class: "composer-side" }, [
            vue.createElementVNode(
              "text",
              { class: "composer-count" },
              vue.toDisplayString($setup.commentInput.length) + "/500",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["comment-send-btn", { disabled: $setup.commentSubmitDisabled }]),
                onClick: $setup.submitComment
              },
              vue.toDisplayString($setup.commentSubmitting ? "发送中" : "发送"),
              3
              /* TEXT, CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "action-icons" }, [
          vue.createElementVNode("view", {
            class: "action-chip",
            onClick: $setup.toggleLike
          }, [
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $setup.isLiked ? "#ff4d5c" : "" })
              },
              vue.toDisplayString($setup.isLiked ? "♥" : "♡"),
              5
              /* TEXT, STYLE */
            ),
            vue.createTextVNode(
              " " + vue.toDisplayString($setup.formatCount($setup.likeCount)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "action-chip",
            onClick: $setup.toggleSave
          }, [
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $setup.isSaved ? "#f59e0b" : "" })
              },
              vue.toDisplayString($setup.isSaved ? "★" : "☆"),
              5
              /* TEXT, STYLE */
            ),
            vue.createTextVNode(
              " " + vue.toDisplayString($setup.formatCount($setup.saveCount)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode(
            "view",
            { class: "action-chip" },
            "◌ " + vue.toDisplayString($setup.formatCount($setup.guide.commentCount)),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesGuideDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-202be074"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guide-detail/index.vue"]]);
  const PI = Math.PI;
  const AXIS = 6378245;
  const OFFSET = 0.006693421622965943;
  function gcj02ToWgs84(longitude, latitude) {
    const lng = Number(longitude);
    const lat = Number(latitude);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return null;
    }
    if (isOutOfChina(lng, lat)) {
      return { longitude: lng, latitude: lat };
    }
    const delta = calcDelta(lng, lat);
    return {
      longitude: lng * 2 - delta.longitude,
      latitude: lat * 2 - delta.latitude
    };
  }
  function wgs84ToGcj02(longitude, latitude) {
    const lng = Number(longitude);
    const lat = Number(latitude);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return null;
    }
    if (isOutOfChina(lng, lat)) {
      return { longitude: lng, latitude: lat };
    }
    return calcDelta(lng, lat);
  }
  function isOutOfChina(longitude, latitude) {
    return longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271;
  }
  function calcDelta(longitude, latitude) {
    let dLat = transformLat(longitude - 105, latitude - 35);
    let dLng = transformLng(longitude - 105, latitude - 35);
    const radLat = latitude / 180 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180 / (AXIS * (1 - OFFSET) / (magic * sqrtMagic) * PI);
    dLng = dLng * 180 / (AXIS / sqrtMagic * Math.cos(radLat) * PI);
    return {
      longitude: longitude + dLng,
      latitude: latitude + dLat
    };
  }
  function transformLat(longitude, latitude) {
    let value = -100 + 2 * longitude + 3 * latitude + 0.2 * latitude * latitude;
    value += 0.1 * longitude * latitude + 0.2 * Math.sqrt(Math.abs(longitude));
    value += (20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2 / 3;
    value += (20 * Math.sin(latitude * PI) + 40 * Math.sin(latitude / 3 * PI)) * 2 / 3;
    value += (160 * Math.sin(latitude / 12 * PI) + 320 * Math.sin(latitude * PI / 30)) * 2 / 3;
    return value;
  }
  function transformLng(longitude, latitude) {
    let value = 300 + longitude + 2 * latitude + 0.1 * longitude * longitude;
    value += 0.1 * longitude * latitude + 0.1 * Math.sqrt(Math.abs(longitude));
    value += (20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2 / 3;
    value += (20 * Math.sin(longitude * PI) + 40 * Math.sin(longitude / 3 * PI)) * 2 / 3;
    value += (150 * Math.sin(longitude / 12 * PI) + 300 * Math.sin(longitude / 30 * PI)) * 2 / 3;
    return value;
  }
  const MIN_MAP_SCALE$1 = 12;
  const MAX_MAP_SCALE$1 = 18;
  const DEFAULT_MAP_SCALE = 15;
  const _sfc_main$d = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const track = vue.ref(null);
      const guideTitle = vue.ref("");
      const mapScale = vue.ref(DEFAULT_MAP_SCALE);
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const headerSubtitle = vue.computed(() => guideTitle.value || "徒步路线预览");
      const trackCenter = vue.computed(() => {
        var _a, _b;
        return ((_a = track.value) == null ? void 0 : _a.endPoint) || ((_b = track.value) == null ? void 0 : _b.startPoint) || null;
      });
      const trackPolyline = vue.computed(() => {
        var _a;
        return buildTrackPolyline(((_a = track.value) == null ? void 0 : _a.points) || []);
      });
      const mapTrackCenter = vue.computed(() => convertPointToMap(trackCenter.value));
      const mapTrackPolyline = vue.computed(() => {
        return trackPolyline.value.map((line) => ({
          ...line,
          points: Array.isArray(line == null ? void 0 : line.points) ? line.points.map((point) => convertPointToMap(point)).filter(Boolean) : []
        })).filter((line) => line.points.length);
      });
      const distanceText = vue.computed(() => {
        var _a;
        const distanceKm = Number(((_a = track.value) == null ? void 0 : _a.distanceKm) || 0);
        return distanceKm > 0 ? `${distanceKm.toFixed(2)} km` : "--";
      });
      const durationText = vue.computed(() => {
        var _a;
        return formatTrackDuration(((_a = track.value) == null ? void 0 : _a.durationMs) || 0);
      });
      const ascentText = vue.computed(() => {
        var _a;
        const ascent = Number(((_a = track.value) == null ? void 0 : _a.altitudeGain) || 0);
        return ascent > 0 ? `${Math.round(ascent)} m` : "--";
      });
      const pointCountText = vue.computed(() => {
        var _a, _b, _c;
        return `${Number(((_a = track.value) == null ? void 0 : _a.pointCount) || ((_c = (_b = track.value) == null ? void 0 : _b.points) == null ? void 0 : _c.length) || 0)} 点`;
      });
      const previewPoints = vue.computed(() => {
        var _a;
        return Array.isArray((_a = track.value) == null ? void 0 : _a.points) ? track.value.points.slice(0, 6) : [];
      });
      const coordinateText = vue.computed(() => {
        var _a;
        const points = Array.isArray((_a = track.value) == null ? void 0 : _a.points) ? track.value.points : [];
        const point = points.length ? points[points.length - 1] : null;
        if (!point) {
          return "--";
        }
        return `${formatCoordinate(point.latitude, "lat")} / ${formatCoordinate(point.longitude, "lng")}`;
      });
      onLoad(() => {
        const payload = loadGuideTrackPreview();
        guideTitle.value = String((payload == null ? void 0 : payload.title) || "").trim();
        track.value = normalizeGuideTrack(payload == null ? void 0 : payload.track);
      });
      onUnload(() => {
        clearGuideTrackPreview();
      });
      function formatPoint(point) {
        return `${formatCoordinate(point.latitude, "lat")} / ${formatCoordinate(point.longitude, "lng")}`;
      }
      function convertPointToMap(point) {
        const latitude = Number(point == null ? void 0 : point.latitude);
        const longitude = Number(point == null ? void 0 : point.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }
        const converted = wgs84ToGcj02(longitude, latitude);
        if (!converted) {
          return null;
        }
        return {
          ...point,
          longitude: converted.longitude,
          latitude: converted.latitude
        };
      }
      function zoomIn() {
        if (mapScale.value >= MAX_MAP_SCALE$1) {
          return;
        }
        mapScale.value += 1;
      }
      function zoomOut() {
        if (mapScale.value <= MIN_MAP_SCALE$1) {
          return;
        }
        mapScale.value -= 1;
      }
      function goBack() {
        if (getCurrentPages().length > 1) {
          uni.navigateBack();
          return;
        }
        uni.reLaunch({ url: "/pages/guides/index" });
      }
      const __returned__ = { MIN_MAP_SCALE: MIN_MAP_SCALE$1, MAX_MAP_SCALE: MAX_MAP_SCALE$1, DEFAULT_MAP_SCALE, track, guideTitle, mapScale, systemInfo, statusBarHeight, statusBarStyle, headerSubtitle, trackCenter, trackPolyline, mapTrackCenter, mapTrackPolyline, distanceText, durationText, ascentText, pointCountText, previewPoints, coordinateText, formatPoint, convertPointToMap, zoomIn, zoomOut, goBack, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onUnload() {
        return onUnload;
      }, get clearGuideTrackPreview() {
        return clearGuideTrackPreview;
      }, get loadGuideTrackPreview() {
        return loadGuideTrackPreview;
      }, get normalizeGuideTrack() {
        return normalizeGuideTrack;
      }, get formatTrackDuration() {
        return formatTrackDuration;
      }, get buildTrackPolyline() {
        return buildTrackPolyline;
      }, get formatCoordinate() {
        return formatCoordinate;
      }, get wgs84ToGcj02() {
        return wgs84ToGcj02;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "track-preview-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-space",
          style: vue.normalizeStyle($setup.statusBarStyle)
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "topbar" }, [
        vue.createElementVNode("view", {
          class: "icon-btn",
          onClick: $setup.goBack
        }, "‹"),
        vue.createElementVNode("view", { class: "topbar-copy" }, [
          vue.createElementVNode("text", { class: "topbar-title" }, "轨迹大图"),
          vue.createElementVNode(
            "text",
            { class: "topbar-subtitle" },
            vue.toDisplayString($setup.headerSubtitle),
            1
            /* TEXT */
          )
        ])
      ]),
      $setup.track ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "content-shell"
      }, [
        vue.createElementVNode("view", { class: "stat-row" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($setup.distanceText),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "路线距离")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($setup.durationText),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "记录时长")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($setup.ascentText),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "累计爬升")
          ])
        ]),
        vue.createElementVNode("view", { class: "safe-card" }, [
          vue.createElementVNode("text", { class: "safe-title" }, "路线概览"),
          vue.createElementVNode(
            "text",
            { class: "safe-copy" },
            "轨迹点数：" + vue.toDisplayString($setup.pointCountText),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "safe-copy" },
            "终点坐标：" + vue.toDisplayString($setup.coordinateText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "map-card" }, [
          $setup.mapTrackCenter ? (vue.openBlock(), vue.createElementBlock("map", {
            key: 0,
            class: "preview-map",
            latitude: $setup.mapTrackCenter.latitude,
            longitude: $setup.mapTrackCenter.longitude,
            scale: $setup.mapScale,
            polyline: $setup.mapTrackPolyline,
            markers: [],
            "show-location": false,
            "enable-overlooking": false,
            "enable-rotate": false,
            "enable-satellite": false,
            "enable-traffic": false
          }, null, 8, ["latitude", "longitude", "scale", "polyline"])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "map-empty"
          }, "暂无可展示的轨迹地图")),
          vue.createElementVNode("view", { class: "zoom-group" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["zoom-btn", { disabled: $setup.mapScale >= $setup.MAX_MAP_SCALE }]),
                onClick: $setup.zoomIn
              },
              "+",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["zoom-btn", { disabled: $setup.mapScale <= $setup.MIN_MAP_SCALE }]),
                onClick: $setup.zoomOut
              },
              "-",
              2
              /* CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "points-card" }, [
          vue.createElementVNode("view", { class: "points-head" }, [
            vue.createElementVNode("text", { class: "points-title" }, "轨迹点"),
            vue.createElementVNode(
              "text",
              { class: "points-badge" },
              vue.toDisplayString($setup.pointCountText),
              1
              /* TEXT */
            )
          ]),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.previewPoints, (point, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: `${index}-${point.latitude}-${point.longitude}`,
                class: "point-row"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "point-index" },
                  vue.toDisplayString(index + 1),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "point-text" },
                  vue.toDisplayString($setup.formatPoint(point)),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-shell"
      }, [
        vue.createElementVNode("text", { class: "empty-title" }, "未找到轨迹数据"),
        vue.createElementVNode("text", { class: "empty-subtitle" }, "请返回攻略详情页后重新打开大图。"),
        vue.createElementVNode("view", {
          class: "primary-btn",
          onClick: $setup.goBack
        }, "返回")
      ]))
    ]);
  }
  const PagesTrackPreviewIndex = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-31356f10"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/track-preview/index.vue"]]);
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    vue.toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening2) {
          debuggerEvents = event;
        } else if (isListening2 == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening2;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening2 = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening2 = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening2) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening2 = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening2 = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening2 = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = // ---
          vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  const HIKING_SAVED_TRACKS_KEY = "meet-xinjiang-hiking-saved-tracks";
  function buildStorageKey(scope = "guest") {
    const normalizedScope = String(scope || "guest").trim() || "guest";
    return `${HIKING_SAVED_TRACKS_KEY}:${normalizedScope}`;
  }
  function normalizeTrackId(track) {
    return String((track == null ? void 0 : track.id) || (track == null ? void 0 : track.capturedAt) || "").trim();
  }
  function readStorage(scope = "guest") {
    const raw = uni.getStorageSync(buildStorageKey(scope));
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  function writeStorage(scope, list) {
    uni.setStorageSync(buildStorageKey(scope), JSON.stringify(Array.isArray(list) ? list : []));
  }
  function getSavedHikingTracks(scope) {
    return readStorage(scope);
  }
  function saveSavedHikingTracks(scope, tracks) {
    writeStorage(scope, tracks);
    return Array.isArray(tracks) ? tracks : [];
  }
  function clearSavedHikingTracks(scope) {
    writeStorage(scope, []);
    return [];
  }
  function upsertSavedHikingTrack(scope, track) {
    const nextId = normalizeTrackId(track);
    const current = readStorage(scope);
    const filtered = nextId ? current.filter((item) => normalizeTrackId(item) !== nextId) : current;
    const next = [track, ...filtered];
    writeStorage(scope, next);
    return next;
  }
  function removeSavedHikingTrack(scope, trackId) {
    const normalizedTrackId = String(trackId || "").trim();
    const next = readStorage(scope).filter((item) => normalizeTrackId(item) !== normalizedTrackId);
    writeStorage(scope, next);
    return next;
  }
  function updateSavedHikingTrack(scope, trackId, updater) {
    const normalizedTrackId = String(trackId || "").trim();
    const current = readStorage(scope);
    const next = current.map((item) => {
      if (normalizeTrackId(item) !== normalizedTrackId) {
        return item;
      }
      const updated = typeof updater === "function" ? updater(item) : { ...item, ...updater || {} };
      return updated || item;
    });
    writeStorage(scope, next);
    return next;
  }
  const HIKING_SESSION_KEY = "meet-xinjiang-hiking-session";
  function buildSessionKey(scope = "guest") {
    const normalizedScope = String(scope || "guest").trim() || "guest";
    return `${HIKING_SESSION_KEY}:${normalizedScope}`;
  }
  function readSession(scope = "guest") {
    const scopedKey = buildSessionKey(scope);
    const raw = uni.getStorageSync(scopedKey) || (scope === "guest" ? uni.getStorageSync(HIKING_SESSION_KEY) : "");
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
      return null;
    }
  }
  function writeSession(session, scope = "guest") {
    uni.setStorageSync(buildSessionKey(scope), JSON.stringify(session || {}));
  }
  function getHikingSession(scope) {
    return readSession(scope);
  }
  function saveHikingSession(session, scope) {
    writeSession(session, scope);
    return session;
  }
  const HIKING_TRACK_API_BASE = API_BASE_URL;
  function hasHikingTrackApi() {
    return hasApiBaseUrl() && Boolean(HIKING_TRACK_API_BASE);
  }
  function buildUrl(path) {
    return `${HIKING_TRACK_API_BASE}${path}`;
  }
  function request$1(method, path, data, token = getStoredAuthToken()) {
    return new Promise((resolve, reject) => {
      if (!hasHikingTrackApi()) {
        reject(new Error("徒步轨迹服务地址未配置。"));
        return;
      }
      const headers = {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      };
      requestJson({
        url: buildUrl(path),
        method,
        timeout: 2e4,
        headers,
        header: headers,
        data: method === "GET" ? void 0 : data
      }).then((res) => {
        var _a;
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const error = new Error(((_a = res.data) == null ? void 0 : _a.message) || `HTTP ${res.statusCode}`);
          error.statusCode = res.statusCode;
          reject(error);
          return;
        }
        resolve(res.data || {});
      }).catch((error) => {
        reject(new Error((error == null ? void 0 : error.message) || "无法连接徒步轨迹服务，请检查服务器地址或网络。"));
      });
    });
  }
  async function getMyHikingTracks(token = getStoredAuthToken()) {
    const data = await request$1("GET", "/users/me/hiking-tracks", void 0, token);
    return Array.isArray(data == null ? void 0 : data.list) ? data.list : [];
  }
  async function createMyHikingTrack(payload, token = getStoredAuthToken()) {
    const data = await request$1("POST", "/users/me/hiking-tracks", payload, token);
    return (data == null ? void 0 : data.data) || null;
  }
  async function updateMyHikingTrack(trackId, payload, token = getStoredAuthToken()) {
    const data = await request$1("PATCH", `/users/me/hiking-tracks/${encodeURIComponent(trackId)}`, payload, token);
    return (data == null ? void 0 : data.data) || null;
  }
  async function deleteMyHikingTrack(trackId, token = getStoredAuthToken()) {
    const data = await request$1("DELETE", `/users/me/hiking-tracks/${encodeURIComponent(trackId)}`, void 0, token);
    return Boolean(data == null ? void 0 : data.ok);
  }
  const MAX_TRACK_POINTS = 1200;
  const MAX_ACCEPTABLE_ACCURACY = 120;
  const MIN_MOVEMENT_METERS = 2;
  const MAX_HIKING_SPEED_MPS = 5.5;
  const MAX_WALKING_JUMP_METERS = 120;
  let listenerBound = false;
  let locationUpdating = false;
  let trackingPollTimer = null;
  const useHikingStore = defineStore("hiking", () => {
    const isTracking = vue.ref(false);
    const currentLocation = vue.ref(null);
    const trackPoints = vue.ref([]);
    const trackingStartedAt = vue.ref(0);
    const trackingActiveFrom = vue.ref(0);
    const accumulatedDurationMs = vue.ref(0);
    const currentSegmentIndex = vue.ref(0);
    const savedTracks = vue.ref([]);
    const locationError = vue.ref("");
    const hydrated = vue.ref(false);
    const savedTracksLoading = vue.ref(false);
    const activeUserId = vue.ref("guest");
    const activeToken = vue.ref("");
    const loadTracksPromise = vue.ref(null);
    const trackSyncState = vue.ref("idle");
    const mapCenter = vue.computed(() => {
      if (!currentLocation.value) {
        return null;
      }
      return {
        latitude: currentLocation.value.latitude,
        longitude: currentLocation.value.longitude
      };
    });
    const hasMapLocation = vue.computed(() => Boolean(mapCenter.value));
    const mapPolyline = vue.computed(() => buildTrackPolyline(trackPoints.value));
    const hasTrackInProgress = vue.computed(() => Boolean(trackPoints.value.length || trackingStartedAt.value));
    const trackDurationMs = vue.computed(() => getElapsedTrackingDuration());
    const pendingSyncCount = vue.computed(() => savedTracks.value.filter((item) => isLocalTrackId(item == null ? void 0 : item.id)).length);
    const currentUserProfile = vue.computed(() => {
      const user = getStoredAuthUser() || null;
      const nickname = String((user == null ? void 0 : user.nickname) || "旅行者").trim();
      return {
        avatarUrl: String((user == null ? void 0 : user.avatar_url) || (user == null ? void 0 : user.avatar) || "").trim(),
        avatarInitial: (nickname || "旅").slice(0, 1)
      };
    });
    const trackSyncText = vue.computed(() => {
      if (savedTracksLoading.value && activeToken.value) {
        return pendingSyncCount.value ? `正在同步 ${pendingSyncCount.value} 条本地轨迹` : "正在同步云端轨迹";
      }
      if (pendingSyncCount.value > 0) {
        if (!activeToken.value || activeUserId.value === "guest") {
          return `已本地保存 ${pendingSyncCount.value} 条轨迹，登录后自动同步`;
        }
        return `${pendingSyncCount.value} 条轨迹待同步重试`;
      }
      if (trackSyncState.value === "synced") {
        return "轨迹已同步到云端";
      }
      if (trackSyncState.value === "saved") {
        return "轨迹已保存";
      }
      return "";
    });
    const trackSyncTone = vue.computed(() => {
      if (savedTracksLoading.value && activeToken.value) {
        return "syncing";
      }
      if (pendingSyncCount.value > 0) {
        return activeToken.value && activeUserId.value !== "guest" ? "warning" : "local";
      }
      if (trackSyncState.value === "synced") {
        return "synced";
      }
      return "neutral";
    });
    const mapMarkers = vue.computed(() => buildCurrentMarker(currentLocation.value, isTracking.value, currentUserProfile.value));
    function getSessionScope() {
      return activeUserId.value || "guest";
    }
    function readAuthScope() {
      const user = getStoredAuthUser();
      return {
        userId: String((user == null ? void 0 : user.id) || "guest"),
        token: getStoredAuthToken()
      };
    }
    function hydrateSession(scope = getSessionScope()) {
      var _a;
      const session = getHikingSession(scope);
      currentLocation.value = normalizeLocation(session == null ? void 0 : session.lastLocation);
      trackPoints.value = Array.isArray(session == null ? void 0 : session.points) ? session.points.map(normalizeLocation).filter(Boolean) : [];
      trackingStartedAt.value = Number((session == null ? void 0 : session.trackingStartedAt) || 0);
      trackingActiveFrom.value = Number((session == null ? void 0 : session.trackingActiveFrom) || 0);
      accumulatedDurationMs.value = Math.max(0, Number((session == null ? void 0 : session.accumulatedDurationMs) || 0));
      currentSegmentIndex.value = resolveNextSegmentIndex(trackPoints.value, Number((session == null ? void 0 : session.currentSegmentIndex) || 0));
      isTracking.value = Boolean(session == null ? void 0 : session.isTracking);
      if (isTracking.value && !trackingStartedAt.value) {
        trackingStartedAt.value = Number(((_a = trackPoints.value[0]) == null ? void 0 : _a.timestamp) || (session == null ? void 0 : session.updatedAt) || Date.now());
      }
      if (isTracking.value && !trackingActiveFrom.value) {
        trackingActiveFrom.value = Number((session == null ? void 0 : session.updatedAt) || Date.now());
      }
    }
    function loadLocalSavedTracks(scope = getSessionScope()) {
      return getSavedHikingTracks(scope).map(normalizeSavedTrack).filter(Boolean);
    }
    function persistSavedTracks(scope = getSessionScope()) {
      return saveSavedHikingTracks(scope, savedTracks.value);
    }
    function syncAuthScope() {
      const previousScope = activeUserId.value || "guest";
      const shouldAdoptGuestTracks = previousScope === "guest";
      const nextScope = readAuthScope();
      const scopeChanged = nextScope.userId !== activeUserId.value;
      const tokenChanged = nextScope.token !== activeToken.value;
      if (!scopeChanged && !tokenChanged) {
        return { ...nextScope, scopeChanged: false, tokenChanged: false };
      }
      activeUserId.value = nextScope.userId;
      activeToken.value = nextScope.token;
      loadTracksPromise.value = null;
      const scopedTracks = mergeSavedTracks(
        loadLocalSavedTracks(nextScope.userId),
        shouldAdoptGuestTracks && nextScope.userId !== "guest" ? loadLocalSavedTracks(previousScope) : []
      );
      savedTracks.value = scopedTracks;
      persistSavedTracks(nextScope.userId);
      if (previousScope !== nextScope.userId && previousScope === "guest" && nextScope.userId !== "guest") {
        clearSavedHikingTracks(previousScope);
      }
      savedTracksLoading.value = false;
      if (scopedTracks.length && !pendingSyncCount.value) {
        trackSyncState.value = nextScope.userId === "guest" ? "saved" : "synced";
      }
      hydrateSession(nextScope.userId);
      return {
        ...nextScope,
        scopeChanged,
        tokenChanged
      };
    }
    function hydrate() {
      const authScope = syncAuthScope();
      if (!hydrated.value) {
        hydrateSession(authScope.userId);
        hydrated.value = true;
      }
      if (isTracking.value) {
        ensureLocationListener();
        startLocationUpdates().catch((error) => {
          locationError.value = (error == null ? void 0 : error.message) || "定位监听启动失败";
        });
      }
      return authScope;
    }
    function ensureLocationListener() {
      if (listenerBound || typeof uni.onLocationChange !== "function") {
        return;
      }
      uni.onLocationChange((payload) => {
        const nextLocation = normalizeTrackLocation({
          ...payload,
          provider: (payload == null ? void 0 : payload.provider) || (payload == null ? void 0 : payload.sourceProvider) || "uni-location-update",
          source: (payload == null ? void 0 : payload.source) || "uni.onLocationChange"
        });
        if (!nextLocation) {
          formatAppLog("warn", "at stores/useHikingStore.js:222", "[hiking-track] receive invalid live point", payload);
          return;
        }
        formatAppLog("log", "at stores/useHikingStore.js:226", "[hiking-track] receive live point", {
          latitude: nextLocation.latitude,
          longitude: nextLocation.longitude,
          accuracy: nextLocation.accuracy,
          provider: nextLocation.provider,
          source: nextLocation.source,
          coordinateSystem: nextLocation.coordinateSystem
        });
        if (isTracking.value) {
          appendTrackPoint(nextLocation);
        } else {
          currentLocation.value = nextLocation;
          locationError.value = "";
          persistSession();
        }
      });
      listenerBound = true;
    }
    async function startLocationUpdates() {
      if (locationUpdating || typeof uni.startLocationUpdate !== "function") {
        return;
      }
      locationUpdating = true;
      await new Promise((resolve, reject) => {
        uni.startLocationUpdate({
          success: resolve,
          fail: reject
        });
      });
    }
    async function loadSavedTracks(options = {}) {
      const authScope = hydrate();
      if (!activeToken.value || activeUserId.value === "guest") {
        savedTracks.value = loadLocalSavedTracks(activeUserId.value);
        trackSyncState.value = savedTracks.value.length ? "saved" : "idle";
        loadTracksPromise.value = null;
        return savedTracks.value;
      }
      if (!hasHikingTrackApi()) {
        savedTracks.value = loadLocalSavedTracks(activeUserId.value);
        trackSyncState.value = pendingSyncCount.value ? "local" : "saved";
        return savedTracks.value;
      }
      if (!options.force && !authScope.scopeChanged && !authScope.tokenChanged && loadTracksPromise.value) {
        return loadTracksPromise.value;
      }
      savedTracksLoading.value = true;
      trackSyncState.value = "syncing";
      const currentScope = activeUserId.value;
      const currentToken = activeToken.value;
      const request2 = getMyHikingTracks(currentToken).then(async (list) => {
        if (activeUserId.value !== currentScope || activeToken.value !== currentToken) {
          return savedTracks.value;
        }
        const remoteTracks = list.map(normalizeSavedTrack).filter(Boolean);
        const localTracks = loadLocalSavedTracks(currentScope);
        const uploadedTracks = await syncPendingLocalTracks(localTracks, remoteTracks, currentToken);
        const mergedTracks = mergeSavedTracks(remoteTracks, uploadedTracks);
        savedTracks.value = mergedTracks;
        persistSavedTracks(currentScope);
        persistSession();
        trackSyncState.value = mergedTracks.some((item) => isLocalTrackId(item == null ? void 0 : item.id)) ? "local" : mergedTracks.length ? "synced" : "idle";
        return savedTracks.value;
      }).catch((error) => {
        if (activeUserId.value === currentScope && activeToken.value === currentToken) {
          savedTracks.value = loadLocalSavedTracks(currentScope);
          trackSyncState.value = savedTracks.value.length ? "local" : "idle";
        }
        throw error;
      }).finally(() => {
        if (loadTracksPromise.value === request2) {
          loadTracksPromise.value = null;
        }
        if (activeUserId.value === currentScope) {
          savedTracksLoading.value = false;
        }
      });
      loadTracksPromise.value = request2;
      return request2;
    }
    async function startTracking() {
      hydrate();
      ensureLocationListener();
      try {
        await startLocationUpdates();
        const now2 = Date.now();
        if (!trackingStartedAt.value) {
          trackingStartedAt.value = now2;
        }
        trackingActiveFrom.value = now2;
        currentSegmentIndex.value = trackPoints.value.length ? resolveNextSegmentIndex(trackPoints.value) : 0;
        isTracking.value = true;
        locationError.value = "";
        persistSession();
        startTrackingPoll();
        if (!currentLocation.value) {
          await refreshLocation({ appendWhenTracking: true });
        }
      } catch (error) {
        isTracking.value = false;
        locationError.value = (error == null ? void 0 : error.message) || "开始记录失败";
        persistSession();
        throw error;
      }
    }
    async function stopTracking() {
      hydrate();
      if (!isTracking.value) {
        return;
      }
      accumulatedDurationMs.value = getElapsedTrackingDuration();
      trackingActiveFrom.value = 0;
      isTracking.value = false;
      stopTrackingPoll();
      persistSession();
      if (typeof uni.stopLocationUpdate !== "function") {
        locationUpdating = false;
        return;
      }
      await new Promise((resolve) => {
        uni.stopLocationUpdate({
          complete: () => {
            locationUpdating = false;
            resolve();
          }
        });
      });
    }
    async function refreshLocation(options = {}) {
      hydrate();
      const requestOptions = {
        highAccuracy: true,
        allowGpsOffline: true,
        coordsType: "wgs84",
        providers: ["gcj02", "system", "network", "wgs84", "gps"],
        gpsTimeout: 18e3,
        gpsMaximumAgeMs: 3e3,
        networkTimeout: 6e3,
        networkMaximumAgeMs: 2e3,
        ...options
      };
      formatAppLog("log", "at stores/useHikingStore.js:393", "[hiking-track] refreshLocation start", {
        isTracking: isTracking.value,
        appendWhenTracking: Boolean(options.appendWhenTracking),
        requestOptions
      });
      const location2 = normalizeTrackLocation(await getCurrentLocation(requestOptions));
      if (!location2) {
        formatAppLog("error", "at stores/useHikingStore.js:402", "[hiking-track] refreshLocation invalid result");
        throw new Error("定位结果无效");
      }
      formatAppLog("log", "at stores/useHikingStore.js:406", "[hiking-track] refreshLocation resolved", {
        latitude: location2.latitude,
        longitude: location2.longitude,
        accuracy: location2.accuracy,
        provider: location2.provider,
        source: location2.source,
        coordinateSystem: location2.coordinateSystem
      });
      currentLocation.value = location2;
      locationError.value = "";
      if (isTracking.value || options.appendWhenTracking) {
        appendTrackPoint(location2);
      } else {
        persistSession();
      }
      return location2;
    }
    function appendTrackPoint(location2) {
      const normalized = normalizeTrackLocation(location2);
      if (!normalized) {
        return;
      }
      locationError.value = "";
      normalized.segmentIndex = Number.isFinite(Number(normalized.segmentIndex)) ? Number(normalized.segmentIndex) : Number(currentSegmentIndex.value || 0);
      const lastPoint = trackPoints.value[trackPoints.value.length - 1];
      if (shouldSkipTrackPoint(normalized, lastPoint)) {
        formatAppLog("log", "at stores/useHikingStore.js:441", "[hiking-track] skip point", {
          latitude: normalized.latitude,
          longitude: normalized.longitude,
          accuracy: normalized.accuracy,
          provider: normalized.provider,
          source: normalized.source
        });
        if (!currentLocation.value || shouldReplaceCurrentLocation(currentLocation.value, normalized)) {
          currentLocation.value = normalized;
          persistSession();
        }
        return;
      }
      if (lastPoint && Math.abs(lastPoint.latitude - normalized.latitude) < 1e-6 && Math.abs(lastPoint.longitude - normalized.longitude) < 1e-6 && Math.abs((lastPoint.timestamp || 0) - (normalized.timestamp || 0)) < 1500) {
        currentLocation.value = normalized;
        persistSession();
        return;
      }
      trackPoints.value = [...trackPoints.value, normalized].slice(-MAX_TRACK_POINTS);
      currentLocation.value = normalized;
      formatAppLog("log", "at stores/useHikingStore.js:468", "[hiking-track] append point", {
        pointCount: trackPoints.value.length,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        accuracy: normalized.accuracy,
        provider: normalized.provider,
        source: normalized.source,
        segmentIndex: normalized.segmentIndex
      });
      persistSession();
    }
    async function finishTracking() {
      hydrate();
      const durationMs = getElapsedTrackingDuration();
      const payload = createSavedTrack(trackPoints.value, { durationMs });
      if (!payload) {
        throw new Error("当前轨迹太短，至少记录两个有效点后再结束");
      }
      if (isTracking.value) {
        await stopTracking();
      }
      if (!activeToken.value || activeUserId.value === "guest") {
        const localTrack = normalizeSavedTrack({
          id: `local-${payload.capturedAt}`,
          ...payload
        });
        if (!localTrack) {
          throw new Error("轨迹保存失败，请稍后再试");
        }
        savedTracks.value = [localTrack, ...savedTracks.value.filter((item) => item.id !== localTrack.id)];
        upsertSavedHikingTrack(getSessionScope(), localTrack);
        trackSyncState.value = "local";
        resetActiveTrackState();
        return localTrack;
      }
      let savedTrack = null;
      try {
        const createdTrack = await createMyHikingTrack({ title: payload.title, ...payload }, activeToken.value);
        savedTrack = normalizeSavedTrack(createdTrack);
      } catch (error) {
        savedTrack = normalizeSavedTrack({
          id: `local-${payload.capturedAt}`,
          ...payload
        });
        if (!savedTrack) {
          throw error;
        }
      }
      if (!savedTrack) {
        throw new Error("轨迹保存失败，请稍后再试");
      }
      savedTracks.value = [savedTrack, ...savedTracks.value.filter((item) => item.id !== savedTrack.id)];
      upsertSavedHikingTrack(getSessionScope(), savedTrack);
      trackSyncState.value = isLocalTrackId(savedTrack.id) ? "local" : "synced";
      resetActiveTrackState();
      return savedTrack;
    }
    async function clearCurrentTrack() {
      hydrate();
      if (isTracking.value) {
        await stopTracking();
      }
      resetActiveTrackState();
    }
    async function clearSavedTrack(trackId) {
      hydrate();
      if (!activeToken.value || activeUserId.value === "guest") {
        savedTracks.value = savedTracks.value.filter((item) => item.id !== trackId);
        removeSavedHikingTrack(getSessionScope(), trackId);
        trackSyncState.value = pendingSyncCount.value ? "local" : savedTracks.value.length ? "saved" : "idle";
        persistSession();
        return;
      }
      if (!String(trackId || "").startsWith("local-")) {
        await deleteMyHikingTrack(trackId, activeToken.value);
      }
      savedTracks.value = savedTracks.value.filter((item) => item.id !== trackId);
      removeSavedHikingTrack(getSessionScope(), trackId);
      trackSyncState.value = savedTracks.value.some((item) => isLocalTrackId(item == null ? void 0 : item.id)) ? "local" : savedTracks.value.length ? "synced" : "idle";
      persistSession();
    }
    async function renameSavedTrack(trackId, nextTitle) {
      hydrate();
      const normalizedTrackId = String(trackId || "").trim();
      const normalizedTitle = String(nextTitle || "").trim();
      if (!normalizedTrackId) {
        throw new Error("轨迹不存在，无法修改名称");
      }
      if (!normalizedTitle) {
        throw new Error("轨迹名称不能为空");
      }
      const currentTrack = savedTracks.value.find((item) => String((item == null ? void 0 : item.id) || "") === normalizedTrackId);
      if (!currentTrack) {
        throw new Error("轨迹不存在，无法修改名称");
      }
      const applyRenamedTrack = (track, targetTrackId = normalizedTrackId) => {
        const normalized = normalizeSavedTrack({
          ...track,
          title: normalizedTitle
        });
        if (!normalized) {
          throw new Error("轨迹名称更新失败，请稍后再试");
        }
        savedTracks.value = savedTracks.value.map((item) => item.id === targetTrackId ? normalized : item);
        const nextLocalTracks = updateSavedHikingTrack(getSessionScope(), targetTrackId, normalized);
        savedTracks.value = mergeSavedTracks(savedTracks.value, nextLocalTracks);
        persistSavedTracks(getSessionScope());
        trackSyncState.value = savedTracks.value.some((item) => isLocalTrackId(item == null ? void 0 : item.id)) ? "local" : savedTracks.value.length ? activeToken.value && activeUserId.value !== "guest" ? "synced" : "saved" : "idle";
        persistSession();
        return normalized;
      };
      if (!activeToken.value || activeUserId.value === "guest" || isLocalTrackId(normalizedTrackId) || !hasHikingTrackApi()) {
        return applyRenamedTrack(currentTrack);
      }
      try {
        const updatedTrack = await updateMyHikingTrack(normalizedTrackId, { title: normalizedTitle }, activeToken.value);
        return applyRenamedTrack(updatedTrack || currentTrack);
      } catch (error) {
        const shouldFallbackToRecreate = Number((error == null ? void 0 : error.statusCode) || 0) === 404 || String((error == null ? void 0 : error.message) || "").includes("接口不存在") || String((error == null ? void 0 : error.message) || "").includes("徒步轨迹不存在");
        if (!shouldFallbackToRecreate) {
          throw error;
        }
        const recreatedTrack = await createMyHikingTrack({
          title: normalizedTitle,
          points: currentTrack.points,
          pointCount: currentTrack.pointCount,
          segmentCount: currentTrack.segmentCount,
          distanceKm: currentTrack.distanceKm,
          durationMs: currentTrack.durationMs,
          altitudeGain: currentTrack.altitudeGain,
          capturedAt: currentTrack.capturedAt,
          startPoint: currentTrack.startPoint,
          endPoint: currentTrack.endPoint
        }, activeToken.value);
        if (!recreatedTrack) {
          throw error;
        }
        if (!String(normalizedTrackId || "").startsWith("local-")) {
          await deleteMyHikingTrack(normalizedTrackId, activeToken.value);
        }
        savedTracks.value = savedTracks.value.map((item) => item.id === normalizedTrackId ? normalizeSavedTrack(recreatedTrack) : item);
        removeSavedHikingTrack(getSessionScope(), normalizedTrackId);
        upsertSavedHikingTrack(getSessionScope(), normalizeSavedTrack(recreatedTrack));
        return applyRenamedTrack(recreatedTrack, normalizedTrackId);
      }
    }
    function createSavedTrack(points, extras = {}) {
      const payload = createGuideTrackPayload(points, extras);
      if (!payload) {
        return null;
      }
      return {
        title: formatSavedTrackTitle(payload.capturedAt),
        ...payload
      };
    }
    function normalizeSavedTrack(track) {
      const normalized = normalizeGuideTrack(track);
      if (!normalized) {
        return null;
      }
      return {
        id: String(track.id || `track-${normalized.capturedAt}`),
        title: String(track.title || formatSavedTrackTitle(normalized.capturedAt)),
        ...normalized
      };
    }
    function mergeSavedTracks(primaryTracks = [], secondaryTracks = []) {
      const mergedMap = /* @__PURE__ */ new Map();
      [...primaryTracks, ...secondaryTracks].forEach((item) => {
        const normalized = normalizeSavedTrack(item);
        if (!normalized) {
          return;
        }
        const key = normalized.id || `track-${normalized.capturedAt}`;
        if (!mergedMap.has(key)) {
          mergedMap.set(key, normalized);
        }
      });
      return Array.from(mergedMap.values()).sort((left, right) => Number(right.capturedAt || 0) - Number(left.capturedAt || 0));
    }
    async function syncPendingLocalTracks(localTracks = [], remoteTracks = [], token = activeToken.value) {
      const remoteTrackSignatures = new Set(remoteTracks.map(buildTrackSignature).filter(Boolean));
      const syncedTracks = [];
      for (const item of localTracks) {
        const normalized = normalizeSavedTrack(item);
        if (!normalized) {
          continue;
        }
        const signature = buildTrackSignature(normalized);
        if (signature && remoteTrackSignatures.has(signature)) {
          continue;
        }
        if (!isLocalTrackId(normalized.id)) {
          syncedTracks.push(normalized);
          if (signature) {
            remoteTrackSignatures.add(signature);
          }
          continue;
        }
        try {
          const createdTrack = await createMyHikingTrack({
            title: normalized.title,
            points: normalized.points,
            pointCount: normalized.pointCount,
            segmentCount: normalized.segmentCount,
            distanceKm: normalized.distanceKm,
            durationMs: normalized.durationMs,
            altitudeGain: normalized.altitudeGain,
            capturedAt: normalized.capturedAt,
            startPoint: normalized.startPoint,
            endPoint: normalized.endPoint
          }, token);
          const uploadedTrack = normalizeSavedTrack(createdTrack);
          if (uploadedTrack) {
            syncedTracks.push(uploadedTrack);
            const uploadedSignature = buildTrackSignature(uploadedTrack);
            if (uploadedSignature) {
              remoteTrackSignatures.add(uploadedSignature);
            }
            continue;
          }
        } catch (error) {
        }
        syncedTracks.push(normalized);
      }
      return syncedTracks;
    }
    function buildTrackSignature(track) {
      var _a, _b, _c;
      const normalized = normalizeSavedTrack(track);
      if (!normalized) {
        return "";
      }
      const startPoint = normalized.startPoint || ((_a = normalized.points) == null ? void 0 : _a[0]);
      const endPoint = normalized.endPoint || ((_b = normalized.points) == null ? void 0 : _b[normalized.points.length - 1]);
      return [
        Number(normalized.capturedAt || 0),
        Number(normalized.pointCount || ((_c = normalized.points) == null ? void 0 : _c.length) || 0),
        Number(normalized.distanceKm || 0).toFixed(4),
        Number((startPoint == null ? void 0 : startPoint.latitude) || 0).toFixed(5),
        Number((startPoint == null ? void 0 : startPoint.longitude) || 0).toFixed(5),
        Number((endPoint == null ? void 0 : endPoint.latitude) || 0).toFixed(5),
        Number((endPoint == null ? void 0 : endPoint.longitude) || 0).toFixed(5)
      ].join("|");
    }
    function isLocalTrackId(trackId) {
      return String(trackId || "").startsWith("local-");
    }
    function normalizeTrackLocation(location2) {
      const normalized = normalizeLocation(location2);
      if (!normalized) {
        return null;
      }
      if (shouldConvertGcjToWgs84(normalized)) {
        const converted = gcj02ToWgs84(normalized.longitude, normalized.latitude);
        if (converted) {
          normalized.longitude = converted.longitude;
          normalized.latitude = converted.latitude;
          normalized.coordinateSystem = "wgs84";
        }
      }
      return normalized;
    }
    function shouldConvertGcjToWgs84(location2) {
      if (!isAppRuntime()) {
        return false;
      }
      const coordinateSystem = String(location2.coordinateSystem || "").toLowerCase();
      const source = String(location2.source || "").toLowerCase();
      return coordinateSystem.includes("gcj") || source.includes("onlocationchange") || source.includes("plus.geolocation");
    }
    function shouldSkipTrackPoint(nextPoint, lastPoint) {
      const accuracy = Number(nextPoint.accuracy || 0);
      if (accuracy > MAX_ACCEPTABLE_ACCURACY) {
        return true;
      }
      if (!lastPoint) {
        return false;
      }
      const distanceMeters = getDistanceKm(lastPoint, nextPoint) * 1e3;
      const elapsedSeconds = Math.max(1, (Number(nextPoint.timestamp || 0) - Number(lastPoint.timestamp || 0)) / 1e3);
      const inferredSpeed = distanceMeters / elapsedSeconds;
      if (accuracy <= 10) {
        return false;
      }
      if (distanceMeters < MIN_MOVEMENT_METERS && accuracy > 25) {
        return true;
      }
      if (distanceMeters > MAX_WALKING_JUMP_METERS && inferredSpeed > MAX_HIKING_SPEED_MPS && accuracy > 35) {
        return true;
      }
      return false;
    }
    function shouldReplaceCurrentLocation(previous, nextPoint) {
      const previousAccuracy = Number((previous == null ? void 0 : previous.accuracy) || 0);
      const nextAccuracy = Number((nextPoint == null ? void 0 : nextPoint.accuracy) || 0);
      if (!previousAccuracy) {
        return true;
      }
      return !nextAccuracy || nextAccuracy <= previousAccuracy;
    }
    function formatSavedTrackTitle(timestamp) {
      const date = new Date(Number(timestamp || Date.now()));
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      const hours = `${date.getHours()}`.padStart(2, "0");
      const minutes = `${date.getMinutes()}`.padStart(2, "0");
      return `${month}-${day} ${hours}:${minutes} 徒步轨迹`;
    }
    function isAppRuntime() {
      var _a;
      return typeof plus !== "undefined" && ((_a = plus.os) == null ? void 0 : _a.name) === "Android";
    }
    function persistSession() {
      saveHikingSession({
        isTracking: isTracking.value,
        lastLocation: currentLocation.value,
        points: trackPoints.value,
        trackingStartedAt: trackingStartedAt.value,
        trackingActiveFrom: trackingActiveFrom.value,
        accumulatedDurationMs: accumulatedDurationMs.value,
        currentSegmentIndex: currentSegmentIndex.value,
        updatedAt: Date.now()
      }, getSessionScope());
    }
    function resetActiveTrackState() {
      stopTrackingPoll();
      trackPoints.value = [];
      trackingStartedAt.value = 0;
      trackingActiveFrom.value = 0;
      accumulatedDurationMs.value = 0;
      currentSegmentIndex.value = 0;
      locationError.value = "";
      persistSession();
    }
    function getElapsedTrackingDuration() {
      const baseDuration = Math.max(0, Number(accumulatedDurationMs.value || 0));
      if (!isTracking.value || !trackingActiveFrom.value) {
        return baseDuration;
      }
      return baseDuration + Math.max(0, Date.now() - Number(trackingActiveFrom.value || 0));
    }
    function startTrackingPoll() {
      stopTrackingPoll();
      trackingPollTimer = setInterval(() => {
        if (!isTracking.value) {
          return;
        }
        refreshLocation({ appendWhenTracking: true }).catch((error) => {
          formatAppLog("warn", "at stores/useHikingStore.js:889", "[hiking-track] tracking poll refresh failed", error);
        });
      }, 4e3);
    }
    function stopTrackingPoll() {
      if (trackingPollTimer) {
        clearInterval(trackingPollTimer);
        trackingPollTimer = null;
      }
    }
    function resolveNextSegmentIndex(points = [], fallback = 0) {
      if (!Array.isArray(points) || !points.length) {
        return Math.max(0, Number(fallback || 0));
      }
      const maxSegment = points.reduce((result, item) => {
        const value = Number(item == null ? void 0 : item.segmentIndex);
        return Number.isFinite(value) ? Math.max(result, value) : result;
      }, 0);
      return maxSegment + 1;
    }
    return {
      isTracking,
      currentLocation,
      trackPoints,
      trackingStartedAt,
      hasTrackInProgress,
      trackDurationMs,
      savedTracks,
      savedTracksLoading,
      trackSyncText,
      trackSyncTone,
      locationError,
      hasMapLocation,
      mapCenter,
      mapPolyline,
      mapMarkers,
      hydrate,
      loadSavedTracks,
      refreshLocation,
      startTracking,
      stopTracking,
      finishTracking,
      clearCurrentTrack,
      clearSavedTrack,
      renameSavedTrack
    };
  });
  const _sfc_main$c = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const publishSubmitting = vue.ref(false);
      const publishError = vue.ref("");
      const autoFocusTitle = vue.ref(false);
      const locating = vue.ref(false);
      const locationFailed = vue.ref(false);
      const showLocationPicker = vue.ref(false);
      const locationOptionsLoading = vue.ref(false);
      const locationOptions = vue.ref([]);
      const publishForm = vue.reactive(createDefaultPublishForm());
      const hikingStore = useHikingStore();
      const { trackPoints, isTracking, savedTracks, savedTracksLoading } = storeToRefs(hikingStore);
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const authorAvatarUrl = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = currentUser.value) == null ? void 0 : _b.avatar) || "";
      });
      const authorInitial = vue.computed(() => {
        var _a;
        const nickname = String(((_a = currentUser.value) == null ? void 0 : _a.nickname) || "新疆旅行者").trim();
        return nickname ? nickname.slice(0, 1) : "新";
      });
      const derivedContentType = vue.computed(() => {
        if (publishForm.video) {
          return "视频";
        }
        if (publishForm.images.length) {
          return "图文";
        }
        return "文字";
      });
      const derivedSubCategory = vue.computed(() => inferSubCategory({
        title: publishForm.title,
        excerpt: publishForm.excerpt,
        tagText: publishForm.tagText,
        contentType: derivedContentType.value
      }));
      const destinationPickerOptions = vue.computed(() => [
        { id: "", label: "暂不关联景区", hint: "保留为普通攻略" },
        ...destinationList.map((item) => ({
          id: String(item.id),
          label: item.name,
          hint: `${item.location} · ${item.category}`
        }))
      ]);
      const selectedDestination = vue.computed(() => getDestinationById(publishForm.destinationId));
      const selectedDestinationLabel = vue.computed(() => {
        var _a;
        return ((_a = selectedDestination.value) == null ? void 0 : _a.name) || "选择要关联的景区";
      });
      const selectedDestinationHint = vue.computed(() => {
        if (selectedDestination.value) {
          return `${selectedDestination.value.location} · ${selectedDestination.value.category}`;
        }
        return "不选也能发布；选了以后景区详情页会优先精准展示";
      });
      const locationTagText = vue.computed(() => publishForm.locationTag || "新疆同城");
      const mediaSummary = vue.computed(() => {
        if (publishForm.video) {
          return "1 个视频";
        }
        if (publishForm.images.length) {
          return `${publishForm.images.length} 张图片`;
        }
        return "文字卡片";
      });
      const locationStatusText = vue.computed(() => {
        if (locating.value) {
          return "定位中";
        }
        if (locationFailed.value) {
          return "定位失败";
        }
        return publishForm.locationTag ? "已定位" : "待定位";
      });
      const locationStatusClass = vue.computed(() => ({
        active: !locating.value && !locationFailed.value,
        warn: locationFailed.value
      }));
      const normalizedTrackPoints = vue.computed(() => Array.isArray(trackPoints.value) ? trackPoints.value.filter(Boolean) : []);
      const liveTrack = vue.computed(() => {
        if (!normalizedTrackPoints.value.length) {
          return null;
        }
        return {
          id: "live-track",
          title: isTracking.value ? "当前记录中轨迹" : "未结束的当前轨迹",
          track: createGuideTrackPayload(normalizedTrackPoints.value),
          isLive: true
        };
      });
      const availableTracks = vue.computed(() => {
        var _a;
        const items = [];
        if ((_a = liveTrack.value) == null ? void 0 : _a.track) {
          items.push({
            id: liveTrack.value.id,
            title: liveTrack.value.title,
            summary: summarizeTrack(liveTrack.value.track, isTracking.value ? "记录中" : "未结束"),
            track: liveTrack.value.track
          });
        }
        const normalizedSavedTracks = Array.isArray(savedTracks.value) ? savedTracks.value : [];
        normalizedSavedTracks.forEach((item) => {
          var _a2;
          if (!((_a2 = item == null ? void 0 : item.points) == null ? void 0 : _a2.length)) {
            return;
          }
          items.push({
            id: item.id,
            title: item.title || "已保存轨迹",
            summary: summarizeTrack(item, "已保存"),
            track: item
          });
        });
        return items;
      });
      const attachableTrack = vue.computed(() => {
        var _a;
        const selected = availableTracks.value.find((item) => item.id === publishForm.selectedTrackId);
        return (selected == null ? void 0 : selected.track) || ((_a = availableTracks.value[0]) == null ? void 0 : _a.track) || null;
      });
      const hasAttachableTrack = vue.computed(() => {
        var _a, _b;
        return Boolean((_b = (_a = attachableTrack.value) == null ? void 0 : _a.points) == null ? void 0 : _b.length);
      });
      const trackSummaryText = vue.computed(() => {
        const track = attachableTrack.value;
        if (!track) {
          return "暂无可附带轨迹";
        }
        const selected = availableTracks.value.find((item) => item.id === publishForm.selectedTrackId);
        return (selected == null ? void 0 : selected.summary) || summarizeTrack(track, "已保存");
      });
      const trackEmptyText = vue.computed(() => {
        if (savedTracksLoading.value) {
          return "正在同步当前账号的徒步轨迹，请稍候。";
        }
        return "先去徒步模式记录并保存路线，返回这里就能选择附带。";
      });
      onLoad(() => {
        if (!currentUser.value) {
          uni.showModal({
            title: "先登录再发布",
            content: "发布功能会使用当前登录昵称回流到信息流，先去登录页完成账号登录。",
            showCancel: false,
            success: () => {
              uni.redirectTo({ url: "/pages/auth/index?mode=login" });
            }
          });
          return;
        }
        hikingStore.hydrate();
        hikingStore.loadSavedTracks().catch(() => {
        });
        syncTrackSelection();
        loadCurrentLocation();
        setTimeout(() => {
          autoFocusTitle.value = true;
        }, 50);
      });
      vue.watch(
        () => availableTracks.value.map((item) => item.id).join("|"),
        () => {
          syncTrackSelection();
        }
      );
      function createDefaultPublishForm() {
        return {
          title: "",
          excerpt: "",
          tagText: "",
          destinationId: "",
          locationTag: "",
          locationLatitude: null,
          locationLongitude: null,
          images: [],
          video: "",
          videoPoster: "",
          attachHikingTrack: false,
          selectedTrackId: ""
        };
      }
      function handleTrackSwitchChange(event) {
        var _a;
        publishForm.attachHikingTrack = Boolean((_a = event == null ? void 0 : event.detail) == null ? void 0 : _a.value);
        if (publishForm.attachHikingTrack && !publishForm.selectedTrackId) {
          syncTrackSelection();
        }
      }
      function selectTrackOption(trackId) {
        publishForm.selectedTrackId = String(trackId || "");
        publishForm.attachHikingTrack = true;
      }
      function syncTrackSelection() {
        var _a;
        const firstTrackId = ((_a = availableTracks.value[0]) == null ? void 0 : _a.id) || "";
        if (!availableTracks.value.some((item) => item.id === publishForm.selectedTrackId)) {
          publishForm.selectedTrackId = firstTrackId;
        }
        if (!firstTrackId) {
          publishForm.attachHikingTrack = false;
        }
      }
      function summarizeTrack(track, stateLabel) {
        var _a;
        const distanceKm = Number(track.distanceKm || sumTrackDistanceKm(track.points) || 0);
        const pointCount = Number(track.pointCount || ((_a = track.points) == null ? void 0 : _a.length) || 0);
        const durationText = formatTrackDuration(track.durationMs);
        return `${stateLabel} · ${distanceKm.toFixed(2)} km · ${durationText} · ${pointCount} 个轨迹点`;
      }
      async function loadCurrentLocation() {
        locating.value = true;
        locationFailed.value = false;
        try {
          const coords = await getCurrentLocation({
            providers: ["plus-geolocation", "gcj02", "system"],
            coordsType: "gcj02",
            gpsTimeout: 12e3,
            networkTimeout: 5e3
          });
          const regeo = await reverseGeocode(coords.longitude, coords.latitude);
          const address = (regeo == null ? void 0 : regeo.addressComponent) || {};
          const city = normalizeLocationPart2(address.city);
          const district = normalizeLocationPart2(address.district);
          const province = normalizeLocationPart2(address.province);
          publishForm.locationLongitude = coords.longitude;
          publishForm.locationLatitude = coords.latitude;
          publishForm.locationTag = formatLocationTag(city || province, district) || "新疆同城";
          await loadNearbyLocationOptions(coords);
        } catch (error) {
          publishForm.locationTag = "新疆同城";
          publishForm.locationLongitude = null;
          publishForm.locationLatitude = null;
          locationOptions.value = [];
          locationFailed.value = true;
          uni.showToast({
            title: (error == null ? void 0 : error.message) || "定位失败",
            icon: "none",
            duration: 2200
          });
        } finally {
          locating.value = false;
        }
      }
      function normalizeLocationPart2(value) {
        if (Array.isArray(value)) {
          return value[0] || "";
        }
        return String(value || "").trim();
      }
      function formatLocationTag(city, area) {
        return [city, area].filter(Boolean).join(" ");
      }
      async function loadNearbyLocationOptions(coords) {
        if (!(coords == null ? void 0 : coords.longitude) || !(coords == null ? void 0 : coords.latitude)) {
          locationOptions.value = [];
          return;
        }
        locationOptionsLoading.value = true;
        try {
          const options = await getNearbyLocationOptions(coords.longitude, coords.latitude);
          locationOptions.value = options;
          if (!publishForm.locationTag && options.length) {
            publishForm.locationTag = options[0].value;
          }
        } catch (error) {
          locationOptions.value = [];
        } finally {
          locationOptionsLoading.value = false;
        }
      }
      async function reloadCurrentLocation() {
        if (locating.value || publishSubmitting.value) {
          return;
        }
        await loadCurrentLocation();
      }
      async function openLocationPicker() {
        if (!publishForm.locationLongitude || !publishForm.locationLatitude) {
          await loadCurrentLocation();
        }
        if (!publishForm.locationLongitude || !publishForm.locationLatitude) {
          return;
        }
        showLocationPicker.value = true;
      }
      function closeLocationPicker() {
        showLocationPicker.value = false;
      }
      function selectLocationOption(option) {
        publishForm.locationTag = (option == null ? void 0 : option.value) || publishForm.locationTag;
        closeLocationPicker();
      }
      function handleDestinationChange(event) {
        var _a;
        const selectedIndex = Number(((_a = event == null ? void 0 : event.detail) == null ? void 0 : _a.value) || 0);
        const option = destinationPickerOptions.value[selectedIndex];
        publishForm.destinationId = (option == null ? void 0 : option.id) || "";
        if (publishForm.destinationId) {
          const destination = getDestinationById(publishForm.destinationId);
          if (destination) {
            publishForm.locationTag = destination.name;
          }
        }
      }
      function locationSourceText(source) {
        if (source === "poi")
          return "附近地点";
        if (source === "business")
          return "附近商圈";
        if (source === "aoi")
          return "附近区域";
        if (source === "district")
          return "当前城区";
        return "定位结果";
      }
      function inferSubCategory({ title = "", excerpt = "", tagText = "", contentType = "" } = {}) {
        const combinedText = [title, excerpt, tagText, contentType].join(" ").toLowerCase();
        const rules = [
          { category: "自驾", keywords: ["自驾", "包车", "租车", "公路", "驾驶", "停车", "里程", "roadtrip"] },
          { category: "美食", keywords: ["美食", "抓饭", "拌面", "烤肉", "夜市", "奶茶", "餐厅", "咖啡", "好吃"] },
          { category: "安全", keywords: ["安全", "避坑", "提醒", "注意", "证件", "防晒", "限速", "边防", "风险"] },
          { category: "徒步", keywords: ["徒步", "登山", "露营", " hike", "trail", "营地", "穿越", "步道"] },
          { category: "住宿", keywords: ["住宿", "民宿", "酒店", "客栈", "房间", "住哪", "入住", "青旅"] }
        ];
        const matchedRule = rules.find((rule) => rule.keywords.some((keyword) => combinedText.includes(keyword)));
        return (matchedRule == null ? void 0 : matchedRule.category) || "推荐";
      }
      function mapCategoryName(subCategory) {
        const categoryMap = {
          自驾: "自驾建议",
          美食: "吃喝推荐",
          安全: "安全提醒",
          徒步: "户外探险",
          住宿: "住宿建议"
        };
        return categoryMap[subCategory] || "旅行分享";
      }
      function goBack() {
        if (publishSubmitting.value) {
          return;
        }
        uni.navigateBack();
      }
      function removePublishImage(index) {
        if (index < 0 || index >= publishForm.images.length) {
          return;
        }
        publishForm.images.splice(index, 1);
      }
      function removePublishVideo() {
        publishForm.video = "";
        publishForm.videoPoster = "";
      }
      function pickMedia() {
        uni.showActionSheet({
          itemList: ["添加图片", "添加视频"],
          success: ({ tapIndex }) => {
            if (tapIndex === 0)
              pickPublishImages();
            else
              pickPublishVideo();
          }
        });
      }
      function pickPublishImages() {
        const remainCount = 9 - publishForm.images.length;
        if (remainCount <= 0) {
          return;
        }
        uni.chooseImage({
          count: remainCount,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const pickedPaths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [];
            publishForm.images = [.../* @__PURE__ */ new Set([...publishForm.images, ...pickedPaths])].slice(0, 9);
            if (publishForm.video) {
              removePublishVideo();
            }
          }
        });
      }
      function pickPublishVideo() {
        uni.chooseVideo({
          sourceType: ["album", "camera"],
          maxDuration: 60,
          compressed: true,
          success: (res) => {
            publishForm.video = res.tempFilePath || "";
            publishForm.videoPoster = res.thumbTempFilePath || "";
            if (publishForm.images.length) {
              publishForm.images = [];
            }
          }
        });
      }
      async function submitPublishedGuide() {
        if (publishSubmitting.value) {
          return;
        }
        const validationMessage = validatePublishedGuide();
        if (validationMessage) {
          publishError.value = validationMessage;
          return;
        }
        publishSubmitting.value = true;
        publishError.value = "";
        try {
          const highlights = publishForm.tagText.split(/[，,]/).map((item) => item.trim()).filter(Boolean).slice(0, 6);
          const token = getStoredAuthToken();
          const useRemoteApi = hasGuideApi() && Boolean(token);
          const savedImages = useRemoteApi ? await Promise.all(publishForm.images.map((item) => uploadGuideMedia(item, "image", token).then((res) => res.url || ""))) : await persistGuideImages(publishForm.images);
          const savedVideo = publishForm.video ? useRemoteApi ? (await uploadGuideMedia(publishForm.video, "video", token)).url || "" : await persistLocalFile(publishForm.video) : "";
          const savedVideoPoster = publishForm.videoPoster ? useRemoteApi ? (await uploadGuideMedia(publishForm.videoPoster, "image", token)).url || "" : await persistLocalFile(publishForm.videoPoster) : "";
          const contentType = savedVideo ? "视频" : savedImages.length ? "图文" : "文字";
          const subCategory = inferSubCategory({
            title: publishForm.title,
            excerpt: publishForm.excerpt,
            tagText: publishForm.tagText,
            contentType
          });
          const summaryText = publishForm.excerpt.trim() || (highlights.length ? `#${highlights.join(" #")}` : "来自新疆旅途中的一条真实笔记。");
          const attachedTrack = publishForm.attachHikingTrack ? attachableTrack.value : null;
          const guidePayload = {
            destinationId: publishForm.destinationId ? Number(publishForm.destinationId) : void 0,
            title: publishForm.title.trim(),
            excerpt: summaryText,
            summary: summaryText,
            summaryText,
            category: mapCategoryName(subCategory),
            subCategory,
            contentType,
            location: locationTagText.value,
            locationTag: locationTagText.value,
            image: savedImages[0] || savedVideoPoster || "",
            images: savedImages,
            video: savedVideo,
            videoPoster: savedVideoPoster,
            readTime: "2 分钟阅读",
            views: "0",
            likes: "0",
            highlights,
            tips: highlights.length ? highlights.map((item) => `标签：${item}`) : [],
            sections: summaryText ? [{ title: "笔记内容", paragraphs: [summaryText] }] : [],
            coverAspectRatio: savedVideo ? 1.45 : savedImages.length ? 1.34 : 0.84,
            primaryTab: "发现",
            cityTab: "同城",
            hikingTrack: attachedTrack
          };
          const createdGuide = useRemoteApi ? await createGuide(guidePayload, token) : addPublishedGuide(guidePayload, currentUser.value || {});
          uni.showToast({ title: "发布成功", icon: "none" });
          setTimeout(() => {
            uni.redirectTo({ url: `/pages/guide-detail/index?id=${encodeURIComponent((createdGuide == null ? void 0 : createdGuide.id) || "")}` });
          }, 200);
        } catch (error) {
          publishError.value = error.message || "发布失败，请稍后再试。";
        } finally {
          publishSubmitting.value = false;
        }
      }
      function validatePublishedGuide() {
        if (!publishForm.title.trim() || publishForm.title.trim().length < 4) {
          return "标题至少写 4 个字。";
        }
        if (!publishForm.excerpt.trim() && !publishForm.tagText.trim() && !publishForm.images.length && !publishForm.video) {
          return "至少补一句描述、几个标签，或者上传媒体内容。";
        }
        return "";
      }
      const __returned__ = { publishSubmitting, publishError, autoFocusTitle, locating, locationFailed, showLocationPicker, locationOptionsLoading, locationOptions, publishForm, hikingStore, trackPoints, isTracking, savedTracks, savedTracksLoading, systemInfo, statusBarHeight, statusBarStyle, currentUser, authorAvatarUrl, authorInitial, derivedContentType, derivedSubCategory, destinationPickerOptions, selectedDestination, selectedDestinationLabel, selectedDestinationHint, locationTagText, mediaSummary, locationStatusText, locationStatusClass, normalizedTrackPoints, liveTrack, availableTracks, attachableTrack, hasAttachableTrack, trackSummaryText, trackEmptyText, createDefaultPublishForm, handleTrackSwitchChange, selectTrackOption, syncTrackSelection, summarizeTrack, loadCurrentLocation, normalizeLocationPart: normalizeLocationPart2, formatLocationTag, loadNearbyLocationOptions, reloadCurrentLocation, openLocationPicker, closeLocationPicker, selectLocationOption, handleDestinationChange, locationSourceText, inferSubCategory, mapCategoryName, goBack, removePublishImage, removePublishVideo, pickMedia, pickPublishImages, pickPublishVideo, submitPublishedGuide, validatePublishedGuide, computed: vue.computed, reactive: vue.reactive, ref: vue.ref, watch: vue.watch, get storeToRefs() {
        return storeToRefs;
      }, get onLoad() {
        return onLoad;
      }, CachedImage, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get createGuideTrackPayload() {
        return createGuideTrackPayload;
      }, get formatTrackDuration() {
        return formatTrackDuration;
      }, get sumTrackDistanceKm() {
        return sumTrackDistanceKm;
      }, get addPublishedGuide() {
        return addPublishedGuide;
      }, get defaultCoverOptions() {
        return defaultCoverOptions;
      }, get persistGuideImages() {
        return persistGuideImages;
      }, get persistLocalFile() {
        return persistLocalFile;
      }, get destinationList() {
        return destinationList;
      }, get getDestinationById() {
        return getDestinationById;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      }, get getNearbyLocationOptions() {
        return getNearbyLocationOptions;
      }, get reverseGeocode() {
        return reverseGeocode;
      }, get createGuide() {
        return createGuide;
      }, get hasGuideApi() {
        return hasGuideApi;
      }, get uploadGuideMedia() {
        return uploadGuideMedia;
      }, get useHikingStore() {
        return useHikingStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "publish-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-space",
          style: vue.normalizeStyle($setup.statusBarStyle)
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "topbar" }, [
        vue.createElementVNode("view", {
          class: "topbar-btn",
          onClick: $setup.goBack
        }, "返回"),
        vue.createElementVNode("text", { class: "topbar-title" }, "发布笔记"),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["topbar-btn submit-btn", { disabled: $setup.publishSubmitting }]),
          disabled: $setup.publishSubmitting,
          onClick: $setup.submitPublishedGuide
        }, vue.toDisplayString($setup.publishSubmitting ? "发布中" : "发布"), 11, ["disabled"])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "page-body",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "composer-card" }, [
          vue.createElementVNode("view", { class: "composer-head" }, [
            $setup.authorAvatarUrl ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
              key: 0,
              src: $setup.authorAvatarUrl,
              "container-class": "composer-avatar",
              "image-class": "composer-avatar"
            }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: "composer-avatar composer-avatar-fallback"
              },
              vue.toDisplayString($setup.authorInitial),
              1
              /* TEXT */
            )),
            vue.createElementVNode("view", { class: "composer-user-copy" }, [
              vue.createElementVNode(
                "text",
                { class: "composer-name" },
                vue.toDisplayString(((_a = $setup.currentUser) == null ? void 0 : _a.nickname) || "新疆旅行者"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "composer-subline" }, "分享一条会被收藏的新疆笔记")
            ])
          ]),
          vue.createElementVNode("view", { class: "composer-stats-row" }, [
            vue.createElementVNode(
              "view",
              { class: "composer-stat-chip" },
              vue.toDisplayString($setup.derivedContentType),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "composer-stat-chip" },
              vue.toDisplayString($setup.derivedSubCategory),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "composer-stat-chip" },
              vue.toDisplayString($setup.locationTagText),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "composer-stat-chip" },
              vue.toDisplayString($setup.mediaSummary),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "标题"),
            vue.createElementVNode("text", { class: "section-tip" }, "一句话说清这条内容值不值得点开")
          ]),
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.publishForm.title = $event),
            class: "native-input",
            type: "text",
            maxlength: "36",
            placeholder: "比如：喀什古城一晚怎么逛最舒服",
            "placeholder-class": "placeholder-text",
            "confirm-type": "done",
            focus: $setup.autoFocusTitle,
            "always-embed": "",
            "cursor-spacing": "24"
          }, null, 8, ["focus"]), [
            [vue.vModelText, $setup.publishForm.title]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "简短描述"),
            vue.createElementVNode("text", { class: "section-tip" }, "不用写很长，1-2 句话就够")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.publishForm.excerpt = $event),
              class: "native-textarea",
              maxlength: "80",
              placeholder: "写一点氛围、路线提醒或你的真实体验。",
              "placeholder-class": "placeholder-text",
              "auto-height": "",
              fixed: "false",
              "cursor-spacing": "24",
              "always-embed": ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.publishForm.excerpt]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "标签"),
            vue.createElementVNode("text", { class: "section-tip" }, "用逗号分隔，后面会自动参与搜索")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.publishForm.tagText = $event),
              class: "native-input",
              type: "text",
              maxlength: "50",
              placeholder: "比如：夜市, 拍照, 喀什, 徒步",
              "placeholder-class": "placeholder-text",
              "confirm-type": "done",
              "always-embed": "",
              "cursor-spacing": "24"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.publishForm.tagText]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-card scenic-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "关联景区"),
            vue.createElementVNode("text", { class: "section-tip" }, "选中后会保存景区 ID，景区详情页能更精准显示这条攻略")
          ]),
          vue.createElementVNode("picker", {
            range: $setup.destinationPickerOptions,
            "range-key": "label",
            onChange: $setup.handleDestinationChange
          }, [
            vue.createElementVNode("view", { class: "scenic-picker-row" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "text",
                  { class: "scenic-picker-value" },
                  vue.toDisplayString($setup.selectedDestinationLabel),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "scenic-picker-hint muted-text" },
                  vue.toDisplayString($setup.selectedDestinationHint),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("text", { class: "scenic-picker-arrow" }, "›")
            ])
          ], 40, ["range"])
        ]),
        vue.createElementVNode("view", { class: "form-card media-card" }, [
          vue.createElementVNode("view", { class: "media-icon-row" }, [
            vue.createElementVNode("view", {
              class: "media-icon-btn",
              onClick: $setup.pickMedia
            }, [
              vue.createElementVNode("text", { class: "media-icon-symbol" }, "+")
            ])
          ]),
          $setup.publishForm.videoPoster ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "video-card"
          }, [
            vue.createVNode($setup["CachedImage"], {
              src: $setup.publishForm.videoPoster,
              "container-class": "video-poster",
              "image-class": "video-poster",
              "fallback-to-remote": false
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "video-overlay" }, "视频"),
            vue.createElementVNode("view", {
              class: "video-remove",
              onClick: $setup.removePublishVideo
            }, "×")
          ])) : vue.createCommentVNode("v-if", true),
          $setup.publishForm.images.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "image-grid"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.publishForm.images, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: `${item}-${index}`,
                  class: "image-item"
                }, [
                  vue.createVNode($setup["CachedImage"], {
                    src: item,
                    "container-class": "image-thumb",
                    "image-class": "image-thumb",
                    "fallback-to-remote": false
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "view",
                    { class: "image-badge" },
                    vue.toDisplayString(index === 0 ? "封面" : `图 ${index + 1}`),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", {
                    class: "image-remove",
                    onClick: ($event) => $setup.removePublishImage(index)
                  }, "×", 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "form-card location-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "发布定位"),
            vue.createElementVNode("text", { class: "section-tip" }, "可像微信一样选择附近区域再发布")
          ]),
          vue.createElementVNode("view", { class: "location-row" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["location-pill", $setup.locationStatusClass])
              },
              vue.toDisplayString($setup.locationStatusText),
              3
              /* TEXT, CLASS */
            ),
            vue.createElementVNode(
              "text",
              { class: "location-copy" },
              vue.toDisplayString($setup.locationTagText),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "location-actions" }, [
            vue.createElementVNode("view", {
              class: "location-action-btn",
              onClick: $setup.reloadCurrentLocation
            }, "重新定位"),
            vue.createElementVNode("view", {
              class: "location-action-btn strong",
              onClick: $setup.openLocationPicker
            }, "选择附近位置")
          ])
        ]),
        vue.createElementVNode("view", { class: "form-card track-card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "field-label no-gap" }, "徒步轨迹"),
            vue.createElementVNode("text", { class: "section-tip" }, "可选，把当前或已保存的徒步路线一起发出去")
          ]),
          $setup.hasAttachableTrack ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "track-body"
          }, [
            vue.createElementVNode("view", { class: "track-copy" }, [
              vue.createElementVNode("text", { class: "track-title" }, "附带徒步记录"),
              vue.createElementVNode(
                "text",
                { class: "track-desc" },
                vue.toDisplayString($setup.trackSummaryText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("switch", {
              checked: $setup.publishForm.attachHikingTrack,
              color: "#ff7c62",
              onChange: $setup.handleTrackSwitchChange
            }, null, 40, ["checked"])
          ])) : vue.createCommentVNode("v-if", true),
          $setup.availableTracks.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "track-option-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.availableTracks, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: vue.normalizeClass(["track-option", { active: $setup.publishForm.selectedTrackId === item.id }]),
                  onClick: ($event) => $setup.selectTrackOption(item.id)
                }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode(
                      "text",
                      { class: "track-option-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "track-option-meta" },
                      vue.toDisplayString(item.summary),
                      1
                      /* TEXT */
                    )
                  ]),
                  $setup.publishForm.selectedTrackId === item.id ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "track-option-check"
                  }, "已选")) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "track-empty"
          }, [
            vue.createElementVNode("text", { class: "track-empty-title" }, "还没有可附带的轨迹"),
            vue.createElementVNode(
              "text",
              { class: "track-empty-desc" },
              vue.toDisplayString($setup.trackEmptyText),
              1
              /* TEXT */
            )
          ]))
        ]),
        $setup.publishError ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "error-banner"
          },
          vue.toDisplayString($setup.publishError),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bottom-submit-wrap" }, [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["bottom-submit-btn", { disabled: $setup.publishSubmitting }]),
            disabled: $setup.publishSubmitting,
            onClick: $setup.submitPublishedGuide
          }, vue.toDisplayString($setup.publishSubmitting ? "发布中..." : "发布到发现页"), 11, ["disabled"])
        ]),
        vue.createElementVNode("view", { class: "page-bottom-space" })
      ]),
      $setup.showLocationPicker ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "location-picker-mask",
        onClick: $setup.closeLocationPicker
      }, [
        vue.createElementVNode("view", {
          class: "location-picker-panel",
          onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "location-picker-head" }, [
            vue.createElementVNode("view", null, [
              vue.createElementVNode("text", { class: "location-picker-title" }, "选择附近位置"),
              vue.createElementVNode("text", { class: "location-picker-subtitle" }, "发布时会带上你选中的附近区域")
            ]),
            vue.createElementVNode("view", {
              class: "location-picker-close",
              onClick: $setup.closeLocationPicker
            }, "×")
          ]),
          $setup.locationOptionsLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "location-picker-state"
          }, "正在获取附近位置...")) : !$setup.locationOptions.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "location-picker-state"
          }, "暂时没有可选位置，先重新定位试试。")) : (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 2,
            class: "location-option-list",
            "scroll-y": ""
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.locationOptions, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.value,
                  class: vue.normalizeClass(["location-option", { active: $setup.publishForm.locationTag === item.value }]),
                  onClick: ($event) => $setup.selectLocationOption(item)
                }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode(
                      "text",
                      { class: "location-option-label" },
                      vue.toDisplayString(item.label),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "location-option-meta" },
                      vue.toDisplayString($setup.locationSourceText(item.source)),
                      1
                      /* TEXT */
                    )
                  ]),
                  $setup.publishForm.locationTag === item.value ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "location-option-check"
                  }, "已选")) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesGuidePublishIndex = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-f222cc13"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guide-publish/index.vue"]]);
  const AI_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
  const AI_MODEL = "qwen3.6-plus";
  const AI_API_KEY = "sk-3fe7770e329745158297f54d09d2adcb";
  const AI_API_KEY_PLACEHOLDER = "请在本地保存百炼API Key";
  const AI_API_KEY_STORAGE = "meet-xinjiang-ai-api-key";
  const AI_MESSAGE_STORAGE = "meet-xinjiang-ai-messages";
  function hasBundledAiKey() {
    return Boolean(AI_API_KEY) && AI_API_KEY !== AI_API_KEY_PLACEHOLDER;
  }
  function getAiApiKey() {
    if (hasBundledAiKey()) {
      return AI_API_KEY;
    }
    const value = uni.getStorageSync(AI_API_KEY_STORAGE);
    return typeof value === "string" ? value.trim() : "";
  }
  function clearAiMessages() {
    uni.removeStorageSync(AI_MESSAGE_STORAGE);
  }
  const SYSTEM_PROMPT = `你是“丝路疆寻”App 内的 AI 旅游助手。你的主要职责是回答新疆旅行相关问题，并优先基于应用内已有景点、攻略和基础信息给出建议。

回答要求：
1. 优先围绕新疆旅游、目的地推荐、出行季节、玩法、预算、装备、安全与美食给建议。
2. 回答尽量简洁、实用、可执行，优先给清单或短段落。
3. 如果用户问题明显超出旅游场景，可以正常回答，但不要偏离“实用助手”风格。
4. 不要编造“已预订”“已联网查询到”之类不存在的事实；没有实时数据时明确说明是基于应用内资料给建议。
5. 如果用户问行程建议，优先给 2 到 5 天的简洁安排。`;
  const quickTips = [
    { title: "最佳季节", description: "5 月到 10 月更适合出行，天气舒适、景色层次也更丰富。" },
    { title: "语言沟通", description: "准备一些常用普通话表达，部分地区也能接触到维吾尔语。" },
    { title: "预算规划", description: "常规出行建议按每日 300 到 700 元预估住宿、餐饮与交通。" }
  ];
  const essentialInfo = [
    { label: "货币", value: "人民币（CNY）" },
    { label: "时区", value: "UTC+8，北京时间" },
    { label: "语言", value: "普通话、维吾尔语、哈萨克语等" },
    { label: "气候", value: "大陆性气候明显，夏季较热、昼夜温差较大" }
  ];
  const MAX_DESTINATION_CONTEXT_ITEMS = 24;
  function request(url, data) {
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method: "POST",
        timeout: 6e4,
        header: {
          Authorization: `Bearer ${getAiApiKey()}`,
          "Content-Type": "application/json"
        },
        data,
        success: (res) => {
          var _a, _b, _c;
          if (res.statusCode !== 200) {
            const message = ((_b = (_a = res.data) == null ? void 0 : _a.error) == null ? void 0 : _b.message) || ((_c = res.data) == null ? void 0 : _c.message) || "请求失败";
            const prefix = `HTTP ${res.statusCode}`;
            const fullMessage = message.startsWith(prefix) ? message : `${prefix}: ${message}`;
            reject(new Error(fullMessage));
            return;
          }
          resolve(res.data);
        },
        fail: reject
      });
    });
  }
  function buildDestinationSummary() {
    const featuredItems = destinationList.slice(0, MAX_DESTINATION_CONTEXT_ITEMS).map((item) => {
      const tips = item.tips.slice(0, 2).join("；");
      return `${item.name}（${item.location}，${item.category}）：${item.description}。建议：${item.suggestion}。提示：${tips}。`;
    }).join("\n");
    const remainingNames = destinationList.slice(MAX_DESTINATION_CONTEXT_ITEMS).map((item) => item.name).join("、");
    return remainingNames ? `${featuredItems}
其他可参考景区：${remainingNames}` : featuredItems;
  }
  function buildGuideSummary() {
    const tipText = quickTips.map((item) => `${item.title}：${item.description}`).join("\n");
    const infoText = essentialInfo.map((item) => `${item.label}：${item.value}`).join("\n");
    return `${tipText}
${infoText}`;
  }
  function buildTravelContext(extraContext = "") {
    const sections = [
      "应用内目的地资料：",
      buildDestinationSummary(),
      "应用内攻略与基础信息：",
      buildGuideSummary()
    ];
    if (extraContext) {
      sections.push(`补充上下文：${extraContext}`);
    }
    return sections.join("\n\n");
  }
  function normalizeMessages(messages = []) {
    return messages.filter((item) => (item == null ? void 0 : item.role) && (item == null ? void 0 : item.content)).slice(-8).map((item) => ({
      role: item.role,
      content: item.content
    }));
  }
  function getAssistantText(content) {
    if (typeof content === "string") {
      return content.trim();
    }
    if (Array.isArray(content)) {
      return content.map((item) => (item == null ? void 0 : item.text) || "").join("\n").trim();
    }
    return "";
  }
  function formatErrorMessage(error) {
    const message = (error == null ? void 0 : error.message) || "AI 服务调用失败";
    if (message.includes("401")) {
      return "API Key 无效或已失效，请更新本地保存的百炼 Key。";
    }
    if (message.includes("429")) {
      return "请求过于频繁或额度受限，请稍后再试。";
    }
    return message;
  }
  function isAssistantTruncated(data) {
    var _a, _b;
    return ((_b = (_a = data == null ? void 0 : data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.finish_reason) === "length";
  }
  function getTravelAssistantPresetQuestions() {
    return [
      "第一次去新疆怎么玩比较合适？",
      "喀纳斯适合安排几天？",
      "乌鲁木齐夜游推荐什么？",
      "沙漠穿越要准备哪些装备？"
    ];
  }
  async function chatWithTravelAssistant(messages, context = "") {
    var _a, _b, _c;
    const apiKey = getAiApiKey();
    if (!apiKey) {
      throw new Error("请先在本页保存百炼 API Key，再开始提问。");
    }
    const payload = {
      model: AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: buildTravelContext(context) },
        ...normalizeMessages(messages)
      ],
      enable_thinking: false,
      temperature: 0.6,
      max_tokens: 1800
    };
    try {
      const data = await request(`${AI_BASE_URL}/chat/completions`, payload);
      let text = getAssistantText((_c = (_b = (_a = data == null ? void 0 : data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content);
      if (!text) {
        throw new Error("模型没有返回有效内容。");
      }
      if (isAssistantTruncated(data)) {
        text = `${text}

> 内容较长，可继续追问“继续”获取后续建议。`;
      }
      return text;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }
  const assistantAvatar = "/static/ai/linglu-avatar.jpg";
  const _sfc_main$b = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const presetQuestions = getTravelAssistantPresetQuestions();
      const savedApiKey = vue.ref(getAiApiKey());
      const draft = vue.ref("");
      const awaitingReply = vue.ref(false);
      const revealingReply = vue.ref(false);
      const errorMessage = vue.ref("");
      const messages = vue.ref(loadMessages());
      const incomingContextTitle = vue.ref("");
      const incomingContextDesc = vue.ref("");
      const incomingContextSource = vue.ref("景区页");
      const incomingPrompt = vue.ref("");
      const incomingContext = vue.ref("");
      let responseRevealTimer = null;
      let scrollTimer = null;
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const userAvatar = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = currentUser.value) == null ? void 0 : _b.avatar) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160";
      });
      const hasApiKey = vue.computed(() => Boolean(savedApiKey.value));
      const sending = vue.computed(() => awaitingReply.value || revealingReply.value);
      const canSend = vue.computed(() => Boolean(draft.value.trim()) && !sending.value && hasApiKey.value);
      const hasStreamingAssistant = vue.computed(() => messages.value.some((item) => (item == null ? void 0 : item.role) === "assistant" && (item == null ? void 0 : item.isStreaming)));
      const dialogueStateText = vue.computed(() => {
        if (awaitingReply.value) {
          return "思考中";
        }
        if (revealingReply.value) {
          return "回复中";
        }
        return `${messages.value.length} 条记录`;
      });
      function getMessageBlocks(item) {
        const content = getRenderableMessageContent(item);
        if (!content) {
          return [];
        }
        return parseAssistantMarkdown(content);
      }
      function getRenderableMessageContent(item) {
        if (!item) {
          return "";
        }
        if (item.role === "assistant") {
          return item.displayContent ?? item.content ?? "";
        }
        return item.content || "";
      }
      function isAssistantStreaming(item) {
        return Boolean((item == null ? void 0 : item.role) === "assistant" && (item == null ? void 0 : item.isStreaming));
      }
      function parseAssistantMarkdown(content) {
        const lines = String(content).replace(/\r\n/g, "\n").split("\n");
        const blocks = [];
        let paragraphLines = [];
        let currentList = null;
        function flushParagraph() {
          if (!paragraphLines.length) {
            return;
          }
          blocks.push({
            type: "paragraph",
            segments: formatInlineMarkdown(paragraphLines.join("\n"))
          });
          paragraphLines = [];
        }
        function flushList() {
          if (!currentList) {
            return;
          }
          blocks.push(currentList);
          currentList = null;
        }
        lines.forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) {
            flushParagraph();
            flushList();
            return;
          }
          const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
          if (headingMatch) {
            flushParagraph();
            flushList();
            blocks.push({
              type: "heading",
              level: Math.min(headingMatch[1].length, 3),
              segments: formatInlineMarkdown(headingMatch[2])
            });
            return;
          }
          const noteMatch = trimmed.match(/^>\s+(.+)$/);
          if (noteMatch) {
            flushParagraph();
            flushList();
            blocks.push({
              type: "note",
              segments: formatInlineMarkdown(noteMatch[1])
            });
            return;
          }
          const unorderedMatch = trimmed.match(/^[-*+]\s+(.+)$/);
          const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
          if (unorderedMatch || orderedMatch) {
            const ordered = Boolean(orderedMatch);
            const text = (orderedMatch == null ? void 0 : orderedMatch[1]) || (unorderedMatch == null ? void 0 : unorderedMatch[1]) || "";
            flushParagraph();
            if (!currentList || currentList.ordered !== ordered) {
              flushList();
              currentList = {
                type: "list",
                ordered,
                items: []
              };
            }
            currentList.items.push({
              segments: formatInlineMarkdown(text)
            });
            return;
          }
          flushList();
          paragraphLines.push(trimmed);
        });
        flushParagraph();
        flushList();
        if (!blocks.length) {
          return [{ type: "paragraph", segments: formatInlineMarkdown(content) }];
        }
        return blocks;
      }
      function formatInlineMarkdown(text) {
        const segments = [];
        const source = String(text).replace(/`([^`]+)`/g, "$1");
        const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
        let lastIndex = 0;
        let match;
        while (match = pattern.exec(source)) {
          if (match.index > lastIndex) {
            segments.push({
              text: source.slice(lastIndex, match.index),
              strong: false
            });
          }
          segments.push({
            text: match[2] || match[3] || "",
            strong: true
          });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < source.length) {
          segments.push({
            text: source.slice(lastIndex),
            strong: false
          });
        }
        return segments.length ? segments : [{ text: source, strong: false }];
      }
      onLoad(async (options) => {
        incomingContextTitle.value = decodeParam(options == null ? void 0 : options.title);
        incomingContextDesc.value = decodeParam(options == null ? void 0 : options.desc);
        incomingContextSource.value = decodeParam(options == null ? void 0 : options.source) || "景区页";
        incomingPrompt.value = decodeParam(options == null ? void 0 : options.prompt);
        incomingContext.value = decodeParam(options == null ? void 0 : options.context);
        if (incomingPrompt.value && !draft.value) {
          draft.value = incomingPrompt.value;
        }
        if ((options == null ? void 0 : options.autoAsk) === "1" && incomingPrompt.value && hasApiKey.value) {
          await sendQuestion(incomingPrompt.value, incomingContext.value);
          draft.value = "";
        }
      });
      function decodeParam(value) {
        if (!value) {
          return "";
        }
        try {
          return decodeURIComponent(value);
        } catch (error) {
          return String(value);
        }
      }
      function loadMessages() {
        try {
          const stored = uni.getStorageSync(AI_MESSAGE_STORAGE);
          const parsed = JSON.parse(stored || "[]");
          return Array.isArray(parsed) ? parsed.map((item) => ({
            ...item,
            displayContent: (item == null ? void 0 : item.role) === "assistant" ? item.displayContent || item.content || "" : void 0
          })) : [];
        } catch (error) {
          return [];
        }
      }
      function persistMessages() {
        uni.setStorageSync(AI_MESSAGE_STORAGE, JSON.stringify(messages.value.filter((item) => (item == null ? void 0 : item.role) !== "assistant" || (item == null ? void 0 : item.content)).map((item) => {
          if ((item == null ? void 0 : item.role) === "assistant") {
            return {
              ...item,
              displayContent: void 0,
              isStreaming: false
            };
          }
          return item;
        })));
      }
      function createMessage(role, content) {
        return {
          id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role,
          content,
          createdAt: Date.now()
        };
      }
      function clearConversation() {
        stopResponseReveal();
        uni.showModal({
          title: "清空会话",
          content: "确认清空当前 AI 对话记录吗？清空后无法恢复。",
          confirmText: "确认清空",
          cancelText: "取消",
          success: ({ confirm }) => {
            if (!confirm) {
              return;
            }
            messages.value = [];
            clearAiMessages();
            errorMessage.value = "";
            uni.showToast({
              title: "会话已清空",
              icon: "none"
            });
          }
        });
      }
      async function sendQuestion(question, extraContext = "") {
        const content = question.trim();
        if (!content || sending.value) {
          return;
        }
        if (!hasApiKey.value) {
          errorMessage.value = "请先保存百炼 API Key，再开始提问。";
          return;
        }
        errorMessage.value = "";
        stopResponseReveal();
        const userMessage = createMessage("user", content);
        const assistantMessage = {
          ...createMessage("assistant", ""),
          displayContent: "",
          isStreaming: true
        };
        const nextMessages = [...messages.value, userMessage, assistantMessage];
        messages.value = nextMessages;
        persistMessages();
        awaitingReply.value = true;
        await scrollToConversationBottom();
        try {
          const answer = await chatWithTravelAssistant(nextMessages, extraContext);
          assistantMessage.content = answer;
          awaitingReply.value = false;
          await revealAssistantMessage(assistantMessage.id, answer);
        } catch (error) {
          messages.value = messages.value.filter((item) => item.id !== assistantMessage.id);
          persistMessages();
          errorMessage.value = error.message || "AI 响应失败，请稍后再试。";
          uni.showToast({
            title: errorMessage.value,
            icon: "none",
            duration: 2500
          });
        } finally {
          awaitingReply.value = false;
          revealingReply.value = false;
        }
      }
      async function revealAssistantMessage(messageId, fullText) {
        const text = String(fullText || "");
        const chunks = buildRevealChunks(text);
        let cursor = 0;
        let scrollTick = 0;
        revealingReply.value = true;
        return new Promise((resolve) => {
          const step = async () => {
            const target = messages.value.find((item) => item.id === messageId);
            if (!target) {
              stopResponseReveal();
              resolve();
              return;
            }
            target.displayContent += chunks[cursor] || "";
            messages.value = [...messages.value];
            scrollTick += 1;
            if (scrollTick === 1 || scrollTick % 2 === 0 || cursor >= chunks.length - 1) {
              await scrollToConversationBottom(120);
            }
            if (cursor >= chunks.length - 1) {
              target.displayContent = text;
              target.isStreaming = false;
              messages.value = [...messages.value];
              persistMessages();
              revealingReply.value = false;
              stopResponseReveal();
              resolve();
              return;
            }
            cursor += 1;
            responseRevealTimer = setTimeout(step, getRevealDelay(chunks[cursor]));
          };
          step();
        });
      }
      function buildRevealChunks(text) {
        var _a;
        const source = String(text || "");
        const lines = ((_a = source.match(/.*?(?:\n|$)/g)) == null ? void 0 : _a.filter(Boolean)) || [];
        const chunks = [];
        lines.forEach((line) => {
          const parts = line.match(/[^。！？!?\n]+[。！？!?]?|\n/g) || [line];
          parts.forEach((part) => {
            if (!part) {
              return;
            }
            if (part === "\n") {
              chunks.push(part);
              return;
            }
            if (part.length <= 24) {
              chunks.push(part);
              return;
            }
            for (let index = 0; index < part.length; index += 18) {
              chunks.push(part.slice(index, index + 18));
            }
          });
        });
        return chunks.length ? chunks : [source];
      }
      function getRevealDelay(chunk) {
        const text = String(chunk || "");
        if (/^[\n]+$/.test(text)) {
          return 90;
        }
        if (/[。！？!?]$/.test(text.trim())) {
          return 120;
        }
        if (text.length >= 16) {
          return 55;
        }
        return 35;
      }
      function stopResponseReveal() {
        if (responseRevealTimer) {
          clearTimeout(responseRevealTimer);
          responseRevealTimer = null;
        }
        if (scrollTimer) {
          clearTimeout(scrollTimer);
          scrollTimer = null;
        }
        revealingReply.value = false;
      }
      async function scrollToConversationBottom(duration = 280) {
        await vue.nextTick();
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
          uni.pageScrollTo({
            selector: "#ai-response-anchor",
            duration
          });
          scrollTimer = null;
        }, 80);
      }
      function sendDraft() {
        const content = draft.value.trim();
        if (!content || sending.value) {
          return;
        }
        if (!hasApiKey.value) {
          errorMessage.value = "请先保存百炼 API Key，再开始提问。";
          return;
        }
        draft.value = "";
        sendQuestion(content, incomingContext.value);
      }
      function sendPresetQuestion(question) {
        if (sending.value) {
          return;
        }
        draft.value = "";
        sendQuestion(question, incomingContext.value);
      }
      function fillIncomingPrompt() {
        if (!incomingPrompt.value) {
          return;
        }
        draft.value = incomingPrompt.value;
      }
      function sendIncomingPrompt() {
        if (!incomingPrompt.value || sending.value) {
          return;
        }
        draft.value = "";
        sendQuestion(incomingPrompt.value, incomingContext.value);
      }
      const __returned__ = { presetQuestions, savedApiKey, draft, awaitingReply, revealingReply, errorMessage, messages, incomingContextTitle, incomingContextDesc, incomingContextSource, incomingPrompt, incomingContext, get responseRevealTimer() {
        return responseRevealTimer;
      }, set responseRevealTimer(v) {
        responseRevealTimer = v;
      }, get scrollTimer() {
        return scrollTimer;
      }, set scrollTimer(v) {
        scrollTimer = v;
      }, assistantAvatar, currentUser, userAvatar, hasApiKey, sending, canSend, hasStreamingAssistant, dialogueStateText, getMessageBlocks, getRenderableMessageContent, isAssistantStreaming, parseAssistantMarkdown, formatInlineMarkdown, decodeParam, loadMessages, persistMessages, createMessage, clearConversation, sendQuestion, revealAssistantMessage, buildRevealChunks, getRevealDelay, stopResponseReveal, scrollToConversationBottom, sendDraft, sendPresetQuestion, fillIncomingPrompt, sendIncomingPrompt, computed: vue.computed, nextTick: vue.nextTick, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get AI_MESSAGE_STORAGE() {
        return AI_MESSAGE_STORAGE;
      }, get clearAiMessages() {
        return clearAiMessages;
      }, get getAiApiKey() {
        return getAiApiKey;
      }, get chatWithTravelAssistant() {
        return chatWithTravelAssistant;
      }, get getTravelAssistantPresetQuestions() {
        return getTravelAssistantPresetQuestions;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell assistant-page" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient assistant-banner" }, [
          vue.createElementVNode("view", { class: "hero-inner section" }, [
            vue.createElementVNode("view", { class: "hero-copy" }, [
              vue.createElementVNode("view", { class: "assistant-hero-row" }, [
                vue.createElementVNode("image", {
                  class: "assistant-avatar hero-avatar",
                  src: $setup.assistantAvatar,
                  mode: "aspectFill"
                }),
                vue.createElementVNode("view", { class: "assistant-hero-text" }, [
                  vue.createElementVNode("text", { class: "banner-title" }, "灵鹿"),
                  vue.createElementVNode("text", { class: "banner-subtitle" }, "像聊天软件一样和你的新疆旅行搭子随时对话")
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "hero-status" }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["status-dot", { ready: $setup.hasApiKey }])
                },
                null,
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "text",
                { class: "hero-status-text" },
                vue.toDisplayString($setup.hasApiKey ? "连接已就绪" : "内部配置未填写"),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        $setup.incomingContextTitle ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "section context-shell"
        }, [
          vue.createElementVNode("view", { class: "context-card card" }, [
            vue.createElementVNode("view", { class: "context-head" }, [
              vue.createElementVNode("text", { class: "section-title" }, "当前接入上下文"),
              vue.createElementVNode(
                "text",
                { class: "context-source muted-text" },
                vue.toDisplayString($setup.incomingContextSource),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode(
              "text",
              { class: "context-title" },
              vue.toDisplayString($setup.incomingContextTitle),
              1
              /* TEXT */
            ),
            $setup.incomingContextDesc ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "context-desc muted-text"
              },
              vue.toDisplayString($setup.incomingContextDesc),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "context-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-action",
                onClick: $setup.sendIncomingPrompt
              }, "让 AI 生成建议"),
              vue.createElementVNode("view", {
                class: "secondary-action",
                onClick: $setup.fillIncomingPrompt
              }, "填入输入框")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "section-title" }, "快捷问题"),
            vue.createElementVNode("text", {
              class: "link-text",
              onClick: $setup.clearConversation
            }, "清空会话")
          ]),
          vue.createElementVNode("view", { class: "shortcut-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.presetQuestions, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item,
                  class: "shortcut-pill",
                  onClick: ($event) => $setup.sendPresetQuestion(item)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "dialogue-head" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["dialogue-state", { active: $setup.sending }])
              },
              [
                vue.createElementVNode("text", { class: "dialogue-state-dot" }),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($setup.dialogueStateText),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            )
          ]),
          $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "error-banner"
          }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.errorMessage),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "dialogue-surface" }, [
            !$setup.messages.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-card"
            }, [
              vue.createElementVNode("view", { class: "message-row assistant intro-row" }, [
                vue.createElementVNode("image", {
                  class: "message-avatar assistant-avatar bubble-avatar",
                  src: $setup.assistantAvatar,
                  mode: "aspectFill"
                }),
                vue.createElementVNode("view", { class: "message-bubble assistant-bubble intro-bubble" }, [
                  vue.createElementVNode("text", { class: "message-role" }, "灵鹿"),
                  vue.createElementVNode("text", { class: "message-content intro-content" }, "HI！我是灵鹿，有关于西域旅游的问题都可以问我哦！")
                ])
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "message-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.messages, (item) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: item.id,
                      class: vue.normalizeClass(["message-row", { mine: item.role === "user", assistant: item.role === "assistant" }])
                    },
                    [
                      item.role === "assistant" ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 0,
                        class: "message-avatar assistant-avatar bubble-avatar",
                        src: $setup.assistantAvatar,
                        mode: "aspectFill"
                      })) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["message-bubble", item.role === "user" ? "user-bubble" : "assistant-bubble"])
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            { class: "message-role" },
                            vue.toDisplayString(item.role === "user" ? "我" : "灵鹿"),
                            1
                            /* TEXT */
                          ),
                          item.role === "user" ? (vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: 0,
                              class: "message-content user-content"
                            },
                            vue.toDisplayString(item.content),
                            1
                            /* TEXT */
                          )) : $setup.isAssistantStreaming(item) ? (vue.openBlock(), vue.createElementBlock("view", {
                            key: 1,
                            class: "assistant-streaming"
                          }, [
                            $setup.getRenderableMessageContent(item) ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 0,
                              class: "streaming-content"
                            }, [
                              vue.createElementVNode(
                                "text",
                                { class: "message-content assistant-content plain-content" },
                                vue.toDisplayString($setup.getRenderableMessageContent(item)),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("text", { class: "stream-cursor" }, "▍")
                            ])) : (vue.openBlock(), vue.createElementBlock("view", {
                              key: 1,
                              class: "streaming-waiting"
                            }, [
                              vue.createElementVNode("text", { class: "waiting-text" }, "灵鹿正在整理回答"),
                              vue.createElementVNode("view", { class: "waiting-dots" }, [
                                vue.createElementVNode("text", { class: "waiting-dot" }),
                                vue.createElementVNode("text", { class: "waiting-dot" }),
                                vue.createElementVNode("text", { class: "waiting-dot" })
                              ])
                            ]))
                          ])) : (vue.openBlock(), vue.createElementBlock("view", {
                            key: 2,
                            class: "assistant-markdown"
                          }, [
                            (vue.openBlock(true), vue.createElementBlock(
                              vue.Fragment,
                              null,
                              vue.renderList($setup.getMessageBlocks(item), (block, blockIndex) => {
                                return vue.openBlock(), vue.createElementBlock(
                                  vue.Fragment,
                                  {
                                    key: `${item.id}-${blockIndex}`
                                  },
                                  [
                                    block.type === "heading" ? (vue.openBlock(), vue.createElementBlock(
                                      "text",
                                      {
                                        key: 0,
                                        class: vue.normalizeClass(["markdown-heading", `level-${block.level}`])
                                      },
                                      [
                                        (vue.openBlock(true), vue.createElementBlock(
                                          vue.Fragment,
                                          null,
                                          vue.renderList(block.segments, (segment, segmentIndex) => {
                                            return vue.openBlock(), vue.createElementBlock(
                                              "text",
                                              {
                                                key: segmentIndex,
                                                class: vue.normalizeClass({ strong: segment.strong })
                                              },
                                              vue.toDisplayString(segment.text),
                                              3
                                              /* TEXT, CLASS */
                                            );
                                          }),
                                          128
                                          /* KEYED_FRAGMENT */
                                        ))
                                      ],
                                      2
                                      /* CLASS */
                                    )) : block.type === "list" ? (vue.openBlock(), vue.createElementBlock("view", {
                                      key: 1,
                                      class: "markdown-list"
                                    }, [
                                      (vue.openBlock(true), vue.createElementBlock(
                                        vue.Fragment,
                                        null,
                                        vue.renderList(block.items, (listItem, listIndex) => {
                                          return vue.openBlock(), vue.createElementBlock("view", {
                                            key: listIndex,
                                            class: "markdown-list-row"
                                          }, [
                                            vue.createElementVNode(
                                              "text",
                                              { class: "markdown-marker" },
                                              vue.toDisplayString(block.ordered ? `${listIndex + 1}.` : "•"),
                                              1
                                              /* TEXT */
                                            ),
                                            vue.createElementVNode("view", { class: "markdown-list-content" }, [
                                              (vue.openBlock(true), vue.createElementBlock(
                                                vue.Fragment,
                                                null,
                                                vue.renderList(listItem.segments, (segment, segmentIndex) => {
                                                  return vue.openBlock(), vue.createElementBlock(
                                                    "text",
                                                    {
                                                      key: segmentIndex,
                                                      class: vue.normalizeClass({ strong: segment.strong })
                                                    },
                                                    vue.toDisplayString(segment.text),
                                                    3
                                                    /* TEXT, CLASS */
                                                  );
                                                }),
                                                128
                                                /* KEYED_FRAGMENT */
                                              ))
                                            ])
                                          ]);
                                        }),
                                        128
                                        /* KEYED_FRAGMENT */
                                      ))
                                    ])) : block.type === "note" ? (vue.openBlock(), vue.createElementBlock("view", {
                                      key: 2,
                                      class: "markdown-note"
                                    }, [
                                      (vue.openBlock(true), vue.createElementBlock(
                                        vue.Fragment,
                                        null,
                                        vue.renderList(block.segments, (segment, segmentIndex) => {
                                          return vue.openBlock(), vue.createElementBlock(
                                            "text",
                                            {
                                              key: segmentIndex,
                                              class: vue.normalizeClass({ strong: segment.strong })
                                            },
                                            vue.toDisplayString(segment.text),
                                            3
                                            /* TEXT, CLASS */
                                          );
                                        }),
                                        128
                                        /* KEYED_FRAGMENT */
                                      ))
                                    ])) : (vue.openBlock(), vue.createElementBlock("text", {
                                      key: 3,
                                      class: "markdown-paragraph"
                                    }, [
                                      (vue.openBlock(true), vue.createElementBlock(
                                        vue.Fragment,
                                        null,
                                        vue.renderList(block.segments, (segment, segmentIndex) => {
                                          return vue.openBlock(), vue.createElementBlock(
                                            "text",
                                            {
                                              key: segmentIndex,
                                              class: vue.normalizeClass({ strong: segment.strong })
                                            },
                                            vue.toDisplayString(segment.text),
                                            3
                                            /* TEXT, CLASS */
                                          );
                                        }),
                                        128
                                        /* KEYED_FRAGMENT */
                                      ))
                                    ]))
                                  ],
                                  64
                                  /* STABLE_FRAGMENT */
                                );
                              }),
                              128
                              /* KEYED_FRAGMENT */
                            ))
                          ]))
                        ],
                        2
                        /* CLASS */
                      ),
                      item.role === "user" ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 1,
                        class: "message-avatar user-avatar bubble-avatar",
                        src: $setup.userAvatar,
                        mode: "aspectFill"
                      }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])),
            $setup.awaitingReply && !$setup.hasStreamingAssistant ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "typing-row"
            }, [
              vue.createElementVNode("image", {
                class: "message-avatar assistant-avatar bubble-avatar",
                src: $setup.assistantAvatar,
                mode: "aspectFill"
              }),
              vue.createElementVNode("view", { class: "typing-card" }, [
                vue.createElementVNode("text", { class: "typing-text" }, "灵鹿正在整理建议...")
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              id: "ai-response-anchor",
              class: "response-anchor"
            })
          ])
        ]),
        vue.createElementVNode("view", { class: "composer-space" }),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createElementVNode("view", { class: "composer-wrap" }, [
        vue.createElementVNode("view", { class: "composer-bar" }, [
          vue.createElementVNode("view", { class: "composer-input-shell" }, [
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.draft = $event),
                class: "composer-input",
                "auto-height": "",
                maxlength: "800",
                placeholder: "输入你想问灵鹿的问题，例如：新疆 7 天怎么安排？"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.draft]
            ]),
            vue.createElementVNode("view", { class: "composer-foot" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["composer-status-pill", { offline: !$setup.hasApiKey }])
                },
                [
                  vue.createElementVNode("text", { class: "composer-status-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "composer-hint" },
                    vue.toDisplayString($setup.hasApiKey ? "灵鹿在线" : "等待配置 Key"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["send-btn", { disabled: !$setup.canSend }]),
                  onClick: $setup.sendDraft
                },
                "发送",
                2
                /* CLASS */
              )
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesAiAssistantIndex = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-a1b142b0"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/ai-assistant/index.vue"]]);
  const _sfc_main$a = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentUser = vue.ref(null);
      const authToken = vue.ref("");
      const myGuides = vue.ref([]);
      const myGuidesLoading = vue.ref(false);
      const favoriteGuides = vue.ref([]);
      const favoriteGuidesLoading = vue.ref(false);
      const accountStats = vue.ref({
        guideCount: 0,
        favoriteCount: 0,
        visitedCount: 0,
        interactionCount: 0
      });
      const editModalVisible = vue.ref(false);
      const editNickname = vue.ref("");
      const isLoggedIn = vue.computed(() => Boolean(authToken.value && currentUser.value));
      const profileName = vue.computed(() => {
        var _a;
        return ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "新疆漫游者";
      });
      const profileEmail = vue.computed(() => {
        var _a;
        return ((_a = currentUser.value) == null ? void 0 : _a.email) || "登录后同步收藏与行程";
      });
      const avatarUrl = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = currentUser.value) == null ? void 0 : _b.avatar) || "";
      });
      const profileInitial = vue.computed(() => profileName.value.slice(0, 2));
      const profileStats = vue.computed(
        () => isLoggedIn.value ? [
          { value: String(accountStats.value.guideCount), label: "我的攻略" },
          { value: String(accountStats.value.favoriteCount), label: "云端收藏" },
          { value: String(accountStats.value.visitedCount), label: "已去过" },
          { value: String(accountStats.value.interactionCount), label: "互动数" }
        ] : [
          { value: "0", label: "云端收藏" },
          { value: "0", label: "同步行程" },
          { value: "0", label: "账号消息" }
        ]
      );
      onShow(() => {
        loadAuthState();
      });
      async function loadAuthState() {
        authToken.value = getStoredAuthToken();
        currentUser.value = getStoredAuthUser();
        if (isLoggedIn.value) {
          await refreshCurrentUser();
          loadMyStats();
          loadMyGuides();
          loadFavoriteGuides();
          return;
        }
        myGuides.value = [];
        favoriteGuides.value = [];
        accountStats.value = {
          guideCount: 0,
          favoriteCount: 0,
          visitedCount: 0,
          interactionCount: 0
        };
      }
      async function refreshCurrentUser() {
        if (!authToken.value) {
          return;
        }
        try {
          const res = await getMyProfile(authToken.value);
          const nextUser = (res == null ? void 0 : res.user) || null;
          if (!nextUser) {
            return;
          }
          saveAuthSession({ token: authToken.value, user: nextUser });
          currentUser.value = nextUser;
        } catch {
          currentUser.value = getStoredAuthUser();
        }
      }
      async function loadMyStats() {
        var _a, _b, _c, _d;
        try {
          const res = await getMyStats(authToken.value);
          accountStats.value = {
            guideCount: Number((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.guideCount) || 0,
            favoriteCount: Number((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.favoriteCount) || 0,
            visitedCount: Number((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.visitedCount) || 0,
            interactionCount: Number((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.interactionCount) || 0
          };
        } catch {
          accountStats.value = {
            guideCount: myGuides.value.length,
            favoriteCount: favoriteGuides.value.length,
            visitedCount: 0,
            interactionCount: myGuides.value.length + favoriteGuides.value.length
          };
        }
      }
      async function loadMyGuides() {
        myGuidesLoading.value = true;
        try {
          const res = await getMyGuides(authToken.value);
          myGuides.value = res.list || [];
          accountStats.value = {
            ...accountStats.value,
            guideCount: myGuides.value.length,
            interactionCount: myGuides.value.length + accountStats.value.favoriteCount
          };
        } catch {
          myGuides.value = [];
          accountStats.value = {
            ...accountStats.value,
            guideCount: 0,
            interactionCount: accountStats.value.favoriteCount
          };
        } finally {
          myGuidesLoading.value = false;
        }
      }
      async function loadFavoriteGuides() {
        favoriteGuidesLoading.value = true;
        try {
          const res = await getMyFavoriteGuides(authToken.value);
          favoriteGuides.value = res.list || [];
          accountStats.value = {
            ...accountStats.value,
            favoriteCount: favoriteGuides.value.length,
            interactionCount: accountStats.value.guideCount + favoriteGuides.value.length
          };
        } catch {
          favoriteGuides.value = [];
          accountStats.value = {
            ...accountStats.value,
            favoriteCount: 0,
            interactionCount: accountStats.value.guideCount
          };
        } finally {
          favoriteGuidesLoading.value = false;
        }
      }
      function chooseAvatar() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async ({ tempFilePaths }) => {
            try {
              uni.showLoading({ title: "上传中..." });
              const res = await uploadAvatar(authToken.value, tempFilePaths[0]);
              const fullUrl = normalizeApiAssetUrl(res.avatar_url);
              const updated = { ...currentUser.value, avatar_url: fullUrl };
              saveAuthSession({ token: authToken.value, user: updated });
              currentUser.value = updated;
              uni.showToast({ title: "头像已更新", icon: "success" });
            } catch (e) {
              uni.showToast({ title: e.message || "上传失败", icon: "none" });
            } finally {
              uni.hideLoading();
            }
          }
        });
      }
      function openEditModal() {
        var _a;
        editNickname.value = ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "";
        editModalVisible.value = true;
      }
      async function saveProfile() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const nickname = editNickname.value.trim();
        formatAppLog("log", "at pages/account/index.vue:302", "[account-profile] save start", {
          nickname,
          currentNickname: ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "",
          hasToken: Boolean(authToken.value)
        });
        if (!nickname) {
          editModalVisible.value = false;
          return;
        }
        const payload = { nickname };
        if (nickname === ((_b = currentUser.value) == null ? void 0 : _b.nickname)) {
          editModalVisible.value = false;
          return;
        }
        try {
          const res = await updateUserProfile(authToken.value, payload);
          formatAppLog("log", "at pages/account/index.vue:313", "[account-profile] save success", res);
          const merged = {
            ...currentUser.value,
            ...res.user,
            avatar_url: ((_c = res.user) == null ? void 0 : _c.avatar_url) || ((_d = currentUser.value) == null ? void 0 : _d.avatar_url) || ((_e = currentUser.value) == null ? void 0 : _e.avatar) || "",
            avatar: ((_f = res.user) == null ? void 0 : _f.avatar) || ((_g = res.user) == null ? void 0 : _g.avatar_url) || ((_h = currentUser.value) == null ? void 0 : _h.avatar) || ((_i = currentUser.value) == null ? void 0 : _i.avatar_url) || ""
          };
          saveAuthSession({ token: authToken.value, user: merged });
          currentUser.value = merged;
          editModalVisible.value = false;
          uni.showToast({ title: "资料已更新", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/account/index.vue:325", "[account-profile] save fail", e);
          uni.showToast({ title: e.message || "更新失败", icon: "none" });
        }
      }
      function goGuide(slug) {
        uni.navigateTo({ url: `/pages/guide-detail/index?id=${slug}` });
      }
      function goAuth(mode = "login") {
        uni.navigateTo({ url: `/pages/auth/index?mode=${mode}` });
      }
      function goSettings() {
        uni.navigateTo({ url: "/pages/settings/index" });
      }
      const __returned__ = { currentUser, authToken, myGuides, myGuidesLoading, favoriteGuides, favoriteGuidesLoading, accountStats, editModalVisible, editNickname, isLoggedIn, profileName, profileEmail, avatarUrl, profileInitial, profileStats, loadAuthState, refreshCurrentUser, loadMyStats, loadMyGuides, loadFavoriteGuides, chooseAvatar, openEditModal, saveProfile, goGuide, goAuth, goSettings, computed: vue.computed, ref: vue.ref, get onShow() {
        return onShow;
      }, AppTabBar, CachedImage, get clearAuthSession() {
        return clearAuthSession;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get saveAuthSession() {
        return saveAuthSession;
      }, get getMyFavoriteGuides() {
        return getMyFavoriteGuides;
      }, get getMyGuides() {
        return getMyGuides;
      }, get getMyProfile() {
        return getMyProfile;
      }, get getMyStats() {
        return getMyStats;
      }, get updateUserProfile() {
        return updateUserProfile;
      }, get uploadAvatar() {
        return uploadAvatar;
      }, get normalizeApiAssetUrl() {
        return normalizeApiAssetUrl;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient profile-banner section" }, [
          $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "settings-btn",
            onClick: $setup.goSettings
          }, [
            vue.createElementVNode("text", { class: "settings-icon" }, "⚙")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "profile-row" }, [
            vue.createElementVNode("view", {
              class: "avatar-wrap",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.isLoggedIn && $setup.chooseAvatar())
            }, [
              $setup.avatarUrl ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                key: 0,
                src: $setup.avatarUrl,
                "container-class": "avatar-img",
                "image-class": "avatar-img"
              }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  class: "avatar"
                },
                vue.toDisplayString($setup.profileInitial),
                1
                /* TEXT */
              )),
              $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "avatar-edit-badge"
              }, "编辑")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "profile-meta" }, [
              vue.createElementVNode("view", { class: "profile-name-row" }, [
                vue.createElementVNode(
                  "text",
                  { class: "profile-name" },
                  vue.toDisplayString($setup.profileName),
                  1
                  /* TEXT */
                ),
                $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "name-edit-btn",
                  onClick: $setup.openEditModal
                }, [
                  vue.createElementVNode("text", { class: "name-edit-icon" }, "✎")
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode(
                "text",
                { class: "profile-email" },
                vue.toDisplayString($setup.profileEmail),
                1
                /* TEXT */
              )
            ])
          ]),
          !$setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "guest-actions"
          }, [
            vue.createElementVNode("view", {
              class: "hero-action primary",
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.goAuth("login"))
            }, "去登录"),
            vue.createElementVNode("view", {
              class: "hero-action secondary",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.goAuth("register"))
            }, "去注册")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "section stats-shell" }, [
          vue.createElementVNode("view", { class: "card stats-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.profileStats, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.label,
                  class: "stat-item"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "stat-value" },
                    vue.toDisplayString(item.value),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "stat-label" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "section section-block"
        }, [
          vue.createElementVNode("text", { class: "section-title" }, "我的攻略"),
          $setup.myGuidesLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "card guide-empty"
          }, [
            vue.createElementVNode("text", { class: "muted-text" }, "加载中...")
          ])) : $setup.myGuides.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "card guide-empty"
          }, [
            vue.createElementVNode("text", { class: "muted-text" }, "还没有发布过攻略")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "guide-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.myGuides, (g) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: g.id,
                  class: "card guide-item",
                  onClick: ($event) => $setup.goGuide(g.id)
                }, [
                  g.image ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                    key: 0,
                    src: g.image,
                    "container-class": "guide-thumb",
                    "image-class": "guide-thumb"
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "guide-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "guide-title" },
                      vue.toDisplayString(g.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "guide-meta muted-text" },
                      vue.toDisplayString(g.category) + " · " + vue.toDisplayString(g.publishDate),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])) : vue.createCommentVNode("v-if", true),
        $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "section section-block"
        }, [
          vue.createElementVNode("text", { class: "section-title" }, "我的收藏"),
          $setup.favoriteGuidesLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "card guide-empty"
          }, [
            vue.createElementVNode("text", { class: "muted-text" }, "加载中...")
          ])) : $setup.favoriteGuides.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "card guide-empty"
          }, [
            vue.createElementVNode("text", { class: "muted-text" }, "还没有收藏任何攻略")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "guide-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.favoriteGuides, (g) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: g.id,
                  class: "card guide-item",
                  onClick: ($event) => $setup.goGuide(g.id)
                }, [
                  g.image ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                    key: 0,
                    src: g.image,
                    "container-class": "guide-thumb",
                    "image-class": "guide-thumb"
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "guide-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "guide-title" },
                      vue.toDisplayString(g.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "guide-meta muted-text" },
                      vue.toDisplayString(g.nickname || g.author) + " · " + vue.toDisplayString(g.publishDate),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "section section-block"
        }, [
          vue.createElementVNode("text", { class: "section-title" }, "登录后可用"),
          vue.createElementVNode("view", { class: "card guest-card" }, [
            vue.createElementVNode("text", { class: "guest-title" }, "同步你的新疆旅行档案"),
            vue.createElementVNode("text", { class: "guest-desc muted-text" }, "登录后可查看发布的攻略、行程和云端数据。"),
            vue.createElementVNode("view", { class: "guest-inline-actions" }, [
              vue.createElementVNode("view", {
                class: "inline-btn",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.goAuth("login"))
              }, "登录账号"),
              vue.createElementVNode("view", {
                class: "inline-btn ghost",
                onClick: _cache[4] || (_cache[4] = ($event) => $setup.goAuth("register"))
              }, "注册新账号")
            ])
          ])
        ])),
        vue.createElementVNode("view", { class: "section app-info" }, [
          vue.createElementVNode("text", { class: "muted-text" }, "丝路疆寻 v1.0.0"),
          vue.createElementVNode("text", { class: "muted-text" }, "© 2026 丝路疆寻，保留所有权利")
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      $setup.editModalVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $setup.editModalVisible = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-box" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "修改资料"),
          vue.createElementVNode("view", { class: "modal-field" }, [
            vue.createElementVNode("text", { class: "modal-label" }, "昵称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.editNickname = $event),
                placeholder: "请输入昵称",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.editNickname]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-actions" }, [
            vue.createElementVNode("view", {
              class: "modal-btn ghost",
              onClick: _cache[6] || (_cache[6] = ($event) => $setup.editModalVisible = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn primary",
              onClick: $setup.saveProfile
            }, "保存")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/account/index" })
    ]);
  }
  const PagesAccountIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-3c1b446f"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/account/index.vue"]]);
  const _sfc_main$9 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const mode = vue.ref("login");
      const submitting = vue.ref(false);
      const errorMessage = vue.ref("");
      const form = vue.reactive({
        nickname: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      onLoad((options = {}) => {
        if (options.mode === "register") {
          mode.value = "register";
        }
      });
      async function submitAuth() {
        if (submitting.value) {
          return;
        }
        const validationMessage = validateForm();
        if (validationMessage) {
          errorMessage.value = validationMessage;
          return;
        }
        submitting.value = true;
        errorMessage.value = "";
        try {
          const payload = {
            email: form.email,
            password: form.password
          };
          if (mode.value === "register") {
            payload.nickname = form.nickname;
          }
          const response = mode.value === "login" ? await loginWithPassword(payload) : await registerWithPassword(payload);
          const token = (response == null ? void 0 : response.token) || "";
          const user = (response == null ? void 0 : response.user) || {
            nickname: form.nickname || "新疆新用户",
            email: form.email
          };
          saveAuthSession({ token, user });
          uni.showToast({
            title: mode.value === "login" ? "登录成功" : "注册成功",
            icon: "none"
          });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              uni.navigateBack({ delta: 1 });
              return;
            }
            uni.redirectTo({
              url: "/pages/account/index"
            });
          }, 500);
        } catch (error) {
          errorMessage.value = error.message || "提交失败，请稍后再试。";
        } finally {
          submitting.value = false;
        }
      }
      function validateForm() {
        if (mode.value === "register" && !form.nickname) {
          return "请输入昵称。";
        }
        if (!form.email) {
          return "请输入邮箱。";
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
          return "请输入正确的邮箱格式。";
        }
        if (!form.password || form.password.length < 6) {
          return "密码至少 6 位。";
        }
        if (mode.value === "register" && form.password !== form.confirmPassword) {
          return "两次输入的密码不一致。";
        }
        return "";
      }
      const __returned__ = { mode, submitting, errorMessage, form, submitAuth, validateForm, reactive: vue.reactive, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get loginWithPassword() {
        return loginWithPassword;
      }, get registerWithPassword() {
        return registerWithPassword;
      }, get saveAuthSession() {
        return saveAuthSession;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell auth-page" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient auth-banner section" }, [
          vue.createElementVNode("text", { class: "auth-kicker" }, "Account Center"),
          vue.createElementVNode("text", { class: "auth-title" }, "登录 / 注册")
        ]),
        vue.createElementVNode("view", { class: "section auth-panel-shell" }, [
          vue.createElementVNode("view", { class: "card auth-card" }, [
            vue.createElementVNode("view", { class: "mode-switch" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["mode-pill", { active: $setup.mode === "login" }]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.mode = "login")
                },
                "登录",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["mode-pill", { active: $setup.mode === "register" }]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.mode = "register")
                },
                "注册",
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "field-list" }, [
              $setup.mode === "register" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "field-wrap"
              }, [
                vue.createElementVNode("text", { class: "field-label" }, "昵称"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.nickname = $event),
                    class: "field-input",
                    placeholder: "输入昵称"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [
                    vue.vModelText,
                    $setup.form.nickname,
                    void 0,
                    { trim: true }
                  ]
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "field-wrap" }, [
                vue.createElementVNode("text", { class: "field-label" }, "邮箱"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.email = $event),
                    class: "field-input",
                    type: "text",
                    placeholder: "输入邮箱"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [
                    vue.vModelText,
                    $setup.form.email,
                    void 0,
                    { trim: true }
                  ]
                ])
              ]),
              vue.createElementVNode("view", { class: "field-wrap" }, [
                vue.createElementVNode("text", { class: "field-label" }, "密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.form.password = $event),
                    password: "",
                    class: "field-input",
                    placeholder: "输入密码"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [
                    vue.vModelText,
                    $setup.form.password,
                    void 0,
                    { trim: true }
                  ]
                ])
              ]),
              $setup.mode === "register" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "field-wrap"
              }, [
                vue.createElementVNode("text", { class: "field-label" }, "确认密码"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.form.confirmPassword = $event),
                    password: "",
                    class: "field-input",
                    placeholder: "再次输入密码"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [
                    vue.vModelText,
                    $setup.form.confirmPassword,
                    void 0,
                    { trim: true }
                  ]
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "error-banner"
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.errorMessage),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["submit-btn", { disabled: $setup.submitting }]),
                onClick: $setup.submitAuth
              },
              vue.toDisplayString($setup.submitting ? "提交中..." : $setup.mode === "login" ? "立即登录" : "创建账号"),
              3
              /* TEXT, CLASS */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ])
    ]);
  }
  const PagesAuthIndex = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-3f748249"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/auth/index.vue"]]);
  const OFFLINE_MAP_STORAGE_KEY = "meet-xinjiang-offline-maps";
  function getOfflineMapStore() {
    const raw = uni.getStorageSync(OFFLINE_MAP_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }
  function saveOfflineMapStore(store) {
    uni.setStorageSync(OFFLINE_MAP_STORAGE_KEY, JSON.stringify(store || {}));
  }
  function getOfflineMapRecord(destinationId) {
    const store = getOfflineMapStore();
    return store[String(destinationId)] || null;
  }
  function saveOfflineMapRecord(destinationId, record) {
    const store = getOfflineMapStore();
    store[String(destinationId)] = record;
    saveOfflineMapStore(store);
  }
  function removeOfflineMapRecord(destinationId) {
    const store = getOfflineMapStore();
    delete store[String(destinationId)];
    saveOfflineMapStore(store);
  }
  async function downloadOfflineMap({ destinationId, scenicName, mapUrl, version, metadata }) {
    if (!destinationId || !mapUrl) {
      throw new Error("离线地图资源不存在。");
    }
    const normalizedUrl = String(mapUrl || "").trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      const record2 = {
        destinationId: String(destinationId),
        scenicName: scenicName || "景区离线地图",
        savedFilePath: normalizedUrl,
        sourceUrl: normalizedUrl,
        version: version || "v1",
        downloadedAt: Date.now(),
        metadata: metadata || null,
        resourceType: "bundled"
      };
      saveOfflineMapRecord(destinationId, record2);
      return record2;
    }
    const downloadRes = await uni.downloadFile({
      url: normalizedUrl
    });
    if (downloadRes.statusCode !== 200 || !downloadRes.tempFilePath) {
      throw new Error("离线地图下载失败，请稍后重试。");
    }
    const saveRes = await uni.saveFile({
      tempFilePath: downloadRes.tempFilePath
    });
    if (!saveRes.savedFilePath) {
      throw new Error("离线地图保存失败，请检查设备存储空间。");
    }
    const record = {
      destinationId: String(destinationId),
      scenicName: scenicName || "景区离线地图",
      savedFilePath: saveRes.savedFilePath,
      sourceUrl: normalizedUrl,
      version: version || "v1",
      downloadedAt: Date.now(),
      metadata: metadata || null,
      resourceType: "downloaded"
    };
    saveOfflineMapRecord(destinationId, record);
    return record;
  }
  async function deleteOfflineMap(destinationId) {
    const record = getOfflineMapRecord(destinationId);
    if ((record == null ? void 0 : record.savedFilePath) && record.resourceType !== "bundled") {
      try {
        await uni.removeSavedFile({
          filePath: record.savedFilePath
        });
      } catch (error) {
      }
    }
    removeOfflineMapRecord(destinationId);
  }
  const _sfc_main$8 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const routeModeOptions = [
        { label: "驾车", value: "driving" },
        { label: "步行", value: "walking" },
        { label: "打车", value: "taxi" }
      ];
      const currentId = vue.ref("");
      const destination = vue.computed(() => getDestinationById(currentId.value));
      const destinationCulture = vue.computed(() => getDestinationCulture(currentId.value) || {
        overview: "",
        history: "",
        highlights: ""
      });
      const destinationTravelMeta = vue.computed(() => getDestinationTravelMeta(currentId.value) || {
        season: "",
        stay: "",
        audience: ""
      });
      const destinationVisitMeta = vue.computed(() => getDestinationVisitMeta(currentId.value) || {
        ticket: "",
        openHours: ""
      });
      const destinationSafetyMap = vue.computed(() => getDestinationSafetyMap(currentId.value) || {
        title: "景区导览攻略图",
        zoom: 14,
        coverage: "主入口与核心游线",
        emergencyLevel: "中",
        terrainRisk: "",
        weatherRisk: "",
        signalRisk: "",
        safeRoute: [],
        servicePoints: [],
        emergencyContacts: [],
        highlights: [],
        note: ""
      });
      const locationReady = vue.ref(false);
      const locationStatusText = vue.ref("未定位");
      const routeMode = vue.ref("driving");
      const routeData = vue.ref(null);
      const liveWeatherData = vue.ref(null);
      const weatherError = vue.ref("");
      const offlineMapRecord = vue.ref(null);
      const offlineMapBusy = vue.ref(false);
      const relatedGuides = vue.ref([]);
      const relatedGuidesLoading = vue.ref(false);
      const relatedGuidesError = vue.ref("");
      const introExpanded = vue.ref(false);
      const tipsExpanded = vue.ref(false);
      const mediaExpanded = vue.ref(false);
      const showAllRelatedGuides = vue.ref(false);
      const guideExpanded = vue.ref(false);
      const guideImageCandidateIndex = vue.ref(0);
      const guideImageUnavailable = vue.ref(false);
      const relatedGuidesVisible = vue.computed(() => relatedGuidesLoading.value || relatedGuides.value.length > 0 || Boolean(relatedGuidesError.value));
      const hasExtendedCulture = vue.computed(() => {
        var _a, _b;
        return Boolean(((_a = destinationCulture.value) == null ? void 0 : _a.history) || ((_b = destinationCulture.value) == null ? void 0 : _b.highlights));
      });
      const liveWeather = vue.computed(() => {
        var _a;
        if (liveWeatherData.value) {
          return {
            temperature: `${liveWeatherData.value.temperature}°C`,
            condition: liveWeatherData.value.weather || "实时天气",
            humidity: `${liveWeatherData.value.humidity || "--"}%`,
            wind: `${liveWeatherData.value.winddirection || ""}${liveWeatherData.value.windpower || ""}级`
          };
        }
        return ((_a = destination.value) == null ? void 0 : _a.weather) || {
          temperature: "--",
          condition: "暂无天气",
          humidity: "--",
          wind: "--"
        };
      });
      const hasRealWeather = vue.computed(() => Boolean(liveWeatherData.value));
      const weatherSourceText = vue.computed(() => {
        if (liveWeatherData.value) {
          return "高德实时天气";
        }
        return hasAmapKey() ? "天气接口失败，已降级为预设天气" : "待填写高德 Key 后自动切换为实时天气";
      });
      const scenicLocationText = vue.computed(() => {
        if (!destination.value) {
          return "暂无景区信息";
        }
        const coords = destination.value.coordinates;
        if (!coords) {
          return destination.value.location;
        }
        return `${destination.value.location} · ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      });
      const routeDurationText = vue.computed(() => {
        var _a;
        return formatDuration((_a = routeData.value) == null ? void 0 : _a.duration);
      });
      const routeDistanceText = vue.computed(() => {
        var _a;
        return formatDistance((_a = routeData.value) == null ? void 0 : _a.distance);
      });
      const taxiCostText = vue.computed(() => {
        var _a;
        if (routeMode.value !== "taxi") {
          return "";
        }
        if ((_a = routeData.value) == null ? void 0 : _a.taxiCost) {
          return `约 ${routeData.value.taxiCost} 元`;
        }
        return hasAmapKey() ? "定位后自动估算" : "待填写高德 Key 后可估算";
      });
      const mapImageUrl = vue.computed(() => {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return "";
        }
        const markers = [
          { longitude: coords.longitude, latitude: coords.latitude, label: "景" }
        ];
        return getStaticMapUrl({
          longitude: coords.longitude,
          latitude: coords.latitude,
          markers
        });
      });
      const safetyGuidePreviewUrl = vue.computed(() => {
        var _a;
        return String(((_a = destinationSafetyMap.value) == null ? void 0 : _a.guideMapImage) || "").trim();
      });
      const guidePreviewCandidates = vue.computed(() => {
        var _a;
        const base = String(((_a = destinationSafetyMap.value) == null ? void 0 : _a.guideMapImage) || "").trim();
        if (!base) {
          return [];
        }
        const candidates = [base];
        if (/\.jpg$/i.test(base)) {
          candidates.push(`${base}.jpg`);
          candidates.push(base.replace(/\.jpg$/i, ".png"));
          candidates.push(base.replace(/\.jpg$/i, ".jpeg"));
        } else if (/\.png$/i.test(base)) {
          candidates.push(`${base}.png`);
          candidates.push(base.replace(/\.png$/i, ".jpg"));
          candidates.push(base.replace(/\.png$/i, ".jpeg"));
        } else if (/\.jpeg$/i.test(base)) {
          candidates.push(`${base}.jpeg`);
          candidates.push(base.replace(/\.jpeg$/i, ".jpg"));
          candidates.push(base.replace(/\.jpeg$/i, ".png"));
        }
        return Array.from(new Set(candidates));
      });
      const displayGuideImageUrl = vue.computed(() => {
        var _a;
        if (guideImageUnavailable.value) {
          return "";
        }
        if (hasOfflineMap.value && ((_a = offlineMapRecord.value) == null ? void 0 : _a.savedFilePath)) {
          return toDisplayPath(offlineMapRecord.value.savedFilePath);
        }
        const previewUrl = guidePreviewCandidates.value[guideImageCandidateIndex.value] || "";
        return previewUrl ? toDisplayPath(previewUrl) : "";
      });
      const offlineMapVersion = vue.computed(() => `guide-${currentId.value || "default"}-v3`);
      const offlineMapAvailable = vue.computed(() => Boolean(safetyGuidePreviewUrl.value));
      const hasOfflineMap = vue.computed(() => {
        var _a;
        return Boolean((_a = offlineMapRecord.value) == null ? void 0 : _a.savedFilePath);
      });
      const hasOfflineMapUpdate = vue.computed(() => {
        var _a, _b;
        if (!hasOfflineMap.value || !offlineMapAvailable.value) {
          return false;
        }
        return ((_a = offlineMapRecord.value) == null ? void 0 : _a.sourceUrl) !== safetyGuidePreviewUrl.value || ((_b = offlineMapRecord.value) == null ? void 0 : _b.version) !== offlineMapVersion.value;
      });
      const offlineMapStatusText = vue.computed(() => {
        if (offlineMapBusy.value) {
          return "保存中";
        }
        if (hasOfflineMapUpdate.value) {
          return "可更新";
        }
        if (hasOfflineMap.value) {
          return "已保存";
        }
        return offlineMapAvailable.value ? "未保存" : "暂未提供";
      });
      const offlineMapSupportText = vue.computed(() => {
        return offlineMapAvailable.value ? "支持保存景区导览图到本地" : "当前景区暂未提供离线导览图";
      });
      const offlineMapLocalText = vue.computed(() => {
        var _a;
        if (!hasOfflineMap.value) {
          return "本地暂无离线文件";
        }
        const timeText = formatDateTime((_a = offlineMapRecord.value) == null ? void 0 : _a.downloadedAt);
        return timeText ? `已保存，处理于 ${timeText}` : "已保存到本地";
      });
      const offlineMapSupportShort = vue.computed(() => offlineMapAvailable.value ? "支持离线" : "暂无离线");
      const offlineMapLocalStatusShort = vue.computed(() => {
        if (hasOfflineMap.value) {
          return hasOfflineMapUpdate.value ? "已保存，可更新" : "已保存";
        }
        return offlineMapAvailable.value ? "未保存" : "暂未提供";
      });
      const offlineMapButtonText = vue.computed(() => {
        if (offlineMapBusy.value) {
          return "保存中...";
        }
        if (hasOfflineMapUpdate.value) {
          return "更新离线导览图";
        }
        if (hasOfflineMap.value) {
          return "重新保存离线导览图";
        }
        return "保存离线导览图";
      });
      const visibleRelatedGuides = vue.computed(() => {
        if (showAllRelatedGuides.value) {
          return relatedGuides.value;
        }
        return relatedGuides.value.slice(0, 2);
      });
      const visibleDestinationTips = vue.computed(() => {
        var _a;
        const list = Array.isArray((_a = destination.value) == null ? void 0 : _a.tips) ? destination.value.tips : [];
        if (tipsExpanded.value) {
          return list;
        }
        return list.slice(0, 3);
      });
      const safetyTips = vue.computed(() => {
        if (!destination.value) {
          return [];
        }
        const tips = [
          {
            title: "弱网先备份",
            desc: `出发前先保存 ${destination.value.name} 的离线导览图，弱网时直接看整张景区图，不依赖错误点位。`
          },
          {
            title: "地形风险",
            desc: destinationSafetyMap.value.terrainRisk
          },
          {
            title: "天气提醒",
            desc: destinationSafetyMap.value.weatherRisk
          },
          {
            title: "信号提示",
            desc: destinationSafetyMap.value.signalRisk
          }
        ];
        tips.push({
          title: "应急联络",
          desc: `建议优先联系 ${destinationSafetyMap.value.emergencyContacts.join("、")}。`
        });
        return tips;
      });
      const visibleSafetyTips = vue.computed(() => {
        if (guideExpanded.value) {
          return safetyTips.value;
        }
        return safetyTips.value.slice(0, 2);
      });
      onLoad(async (options) => {
        currentId.value = (options == null ? void 0 : options.id) || "";
        guideImageCandidateIndex.value = 0;
        guideImageUnavailable.value = false;
        syncOfflineMapState();
        await Promise.all([
          refreshLocationAndWeather(),
          loadRelatedGuides()
        ]);
      });
      onShow(() => {
        guideImageCandidateIndex.value = 0;
        guideImageUnavailable.value = false;
        syncOfflineMapState();
        loadRelatedGuides();
      });
      async function loadRelatedGuides() {
        if (!destination.value) {
          relatedGuides.value = [];
          relatedGuidesError.value = "";
          return;
        }
        relatedGuidesLoading.value = true;
        relatedGuidesError.value = "";
        try {
          relatedGuides.value = await getRelatedGuidesForDestination(destination.value, 3);
        } catch (error) {
          relatedGuides.value = [];
          relatedGuidesError.value = (error == null ? void 0 : error.message) || "暂时无法加载相关攻略，请稍后重试。";
        } finally {
          relatedGuidesLoading.value = false;
        }
      }
      async function refreshLocationAndWeather() {
        var _a;
        if (!destination.value) {
          return;
        }
        weatherError.value = "";
        locationStatusText.value = hasAmapKey() ? "定位中" : "待 Key";
        routeData.value = null;
        liveWeatherData.value = null;
        if (!hasAmapKey()) {
          locationReady.value = false;
          return;
        }
        const scenicCoords = destination.value.coordinates;
        try {
          const scenicRegeo = scenicCoords ? await reverseGeocode(scenicCoords.longitude, scenicCoords.latitude) : null;
          const scenicAdcode = (_a = scenicRegeo == null ? void 0 : scenicRegeo.addressComponent) == null ? void 0 : _a.adcode;
          const weather = scenicAdcode ? await getLiveWeather(scenicAdcode) : null;
          if (weather) {
            liveWeatherData.value = weather;
          }
        } catch (error) {
          weatherError.value = "实时天气获取失败，当前显示预设天气。";
        }
        try {
          const location2 = await getCurrentLocation();
          const route = await loadRoute(location2, scenicCoords, routeMode.value);
          if (location2) {
            locationReady.value = true;
            locationStatusText.value = "已定位";
          }
          if (route) {
            routeData.value = route;
          }
        } catch (error) {
          locationReady.value = false;
          locationStatusText.value = "定位失败";
        }
      }
      async function changeRouteMode(mode) {
        if (routeMode.value === mode) {
          return;
        }
        routeMode.value = mode;
        await refreshLocationAndWeather();
      }
      async function loadRoute(origin, destinationCoords, mode) {
        if (mode === "walking") {
          return getWalkingRoute(origin, destinationCoords);
        }
        return getDrivingRoute(origin, destinationCoords);
      }
      function formatDuration(duration) {
        if (duration) {
          const totalMinutes = Math.round(Number(duration) / 60);
          if (totalMinutes < 60) {
            return `约 ${totalMinutes} 分钟`;
          }
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return minutes ? `约 ${hours} 小时 ${minutes} 分钟` : `约 ${hours} 小时`;
        }
        if (!hasAmapKey()) {
          return "待填写高德 Key 后可估算";
        }
        if (locationStatusText.value === "定位失败") {
          return "定位失败，暂时无法估算";
        }
        return "定位后自动估算";
      }
      function formatDistance(distance) {
        if (distance) {
          const distanceNum = Number(distance);
          if (distanceNum < 1e3) {
            return `约 ${Math.round(distanceNum)} 米`;
          }
          return `约 ${(distanceNum / 1e3).toFixed(1)} 公里`;
        }
        if (!hasAmapKey()) {
          return "待填写高德 Key 后可估算";
        }
        if (locationStatusText.value === "定位失败") {
          return "定位失败，暂时无法估算";
        }
        return "定位后自动估算";
      }
      function goBack() {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack();
          return;
        }
        uni.reLaunch({ url: "/pages/home/index" });
      }
      function openRelatedGuide(id) {
        if (!id) {
          return;
        }
        uni.navigateTo({
          url: `/pages/guide-detail/index?id=${encodeURIComponent(id)}`
        });
      }
      function syncOfflineMapState() {
        if (!currentId.value) {
          offlineMapRecord.value = null;
          return;
        }
        offlineMapRecord.value = getOfflineMapRecord(currentId.value);
      }
      function toDisplayPath(filePath) {
        const raw = String(filePath || "").trim();
        if (!raw) {
          return "";
        }
        if (/^(https?:|file:|content:|blob:|data:)/i.test(raw)) {
          return raw;
        }
        if (raw.startsWith("/static/") || raw.startsWith("static/")) {
          return raw.startsWith("/") ? raw : `/${raw}`;
        }
        if (typeof plus !== "undefined" && plus.io && typeof plus.io.convertLocalFileSystemURL === "function") {
          const absolutePath = plus.io.convertLocalFileSystemURL(raw);
          if (absolutePath) {
            return absolutePath.startsWith("file://") ? absolutePath : `file://${absolutePath}`;
          }
        }
        return raw;
      }
      function previewGuideImage() {
        if (!displayGuideImageUrl.value) {
          return;
        }
        uni.previewImage({
          current: displayGuideImageUrl.value,
          urls: [displayGuideImageUrl.value]
        });
      }
      function handleGuideImageError() {
        var _a;
        if (hasOfflineMap.value && ((_a = offlineMapRecord.value) == null ? void 0 : _a.savedFilePath)) {
          guideImageUnavailable.value = true;
          return;
        }
        if (guidePreviewCandidates.value.length && guideImageCandidateIndex.value < guidePreviewCandidates.value.length - 1) {
          guideImageCandidateIndex.value += 1;
          return;
        }
        guideImageUnavailable.value = true;
      }
      function handleGuideImageLoad() {
        guideImageUnavailable.value = false;
      }
      async function handleOfflineMapDownload() {
        if (offlineMapBusy.value || !destination.value || !offlineMapAvailable.value) {
          return;
        }
        offlineMapBusy.value = true;
        try {
          await downloadOfflineMap({
            destinationId: currentId.value,
            scenicName: destination.value.name,
            mapUrl: safetyGuidePreviewUrl.value,
            version: offlineMapVersion.value,
            metadata: destinationSafetyMap.value
          });
          syncOfflineMapState();
          uni.showToast({
            title: "离线导览图已保存",
            icon: "none"
          });
        } catch (error) {
          uni.showModal({
            title: "保存失败",
            content: error.message || "离线导览图保存失败，请稍后再试。",
            showCancel: false
          });
        } finally {
          offlineMapBusy.value = false;
        }
      }
      function openOfflineMap() {
        if (!hasOfflineMap.value) {
          return;
        }
        uni.navigateTo({
          url: `/pages/safety-map/index?id=${encodeURIComponent(currentId.value)}&offline=1`
        });
      }
      function openSafetyMapPage() {
        if (!destination.value) {
          return;
        }
        uni.navigateTo({
          url: `/pages/safety-map/index?id=${encodeURIComponent(currentId.value)}`
        });
      }
      function deleteOfflineMapWithConfirm() {
        if (!hasOfflineMap.value) {
          return;
        }
        uni.showModal({
          title: "删除离线导览图",
          content: "确认删除当前景区已保存的离线导览图吗？删除后需要重新保存。",
          success: async ({ confirm }) => {
            if (!confirm) {
              return;
            }
            await deleteOfflineMap(currentId.value);
            syncOfflineMapState();
            uni.showToast({
              title: "已删除离线导览图",
              icon: "none"
            });
          }
        });
      }
      function openDouyinSearch() {
        if (!destination.value) {
          return;
        }
        const keyword = destination.value.liveKeyword;
        const url = getDouyinSearchUrl(destination.value.liveKeyword);
        const appUrls = getDouyinAppSearchUrls(keyword);
        if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
          const [preferredAppUrl] = appUrls;
          if (preferredAppUrl) {
            plus.runtime.openURL(preferredAppUrl, () => {
              plus.runtime.openURL(url, () => {
                fallbackToCopyKeyword(keyword);
              });
            });
            return;
          }
          plus.runtime.openURL(url, () => {
            fallbackToCopyKeyword(keyword);
          });
          return;
        }
        if (typeof window !== "undefined" && window.open) {
          window.open(url, "_blank");
          return;
        }
        fallbackToCopyKeyword(keyword);
      }
      function fallbackToCopyKeyword(keyword) {
        uni.setClipboardData({
          data: keyword,
          success: () => {
            uni.showModal({
              title: "已准备跳转",
              content: "已优先尝试唤起抖音 App 搜索；如果当前设备未成功打开抖音，已帮你复制搜索词，可手动粘贴搜索。",
              showCancel: false
            });
          }
        });
      }
      function copyKeyword() {
        if (!destination.value) {
          return;
        }
        uni.setClipboardData({
          data: destination.value.liveKeyword,
          success: () => {
            uni.showToast({ title: "已复制搜索词", icon: "none" });
          }
        });
      }
      async function openScenicLocation() {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return;
        }
        const navigationName = destination.value.navigationName || destination.value.name;
        const navigationAddress = destination.value.navigationAddress || destination.value.location;
        let targetPoint = {
          longitude: Number(coords.longitude),
          latitude: Number(coords.latitude),
          name: navigationName,
          address: navigationAddress
        };
        try {
          const resolvedPoint = await resolveNavigationPoint({
            name: navigationName,
            address: navigationAddress,
            region: destination.value.location,
            longitude: coords.longitude,
            latitude: coords.latitude
          });
          if (resolvedPoint) {
            targetPoint = {
              longitude: resolvedPoint.longitude,
              latitude: resolvedPoint.latitude,
              name: resolvedPoint.name || navigationName,
              address: resolvedPoint.address || navigationAddress
            };
          }
        } catch (error) {
          formatAppLog("warn", "at pages/destination-detail/index.vue:1056", "[destination-detail] resolve navigation point failed", error);
        }
        const amapUrl = `amapuri://navi?sourceApplication=${encodeURIComponent("丝路疆寻")}&lat=${targetPoint.latitude}&lon=${targetPoint.longitude}&dev=0&style=2&poiname=${encodeURIComponent(targetPoint.name)}`;
        if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
          plus.runtime.openURL(amapUrl, () => {
            uni.openLocation({
              longitude: targetPoint.longitude,
              latitude: targetPoint.latitude,
              name: targetPoint.name,
              address: targetPoint.address
            });
          });
          return;
        }
        uni.openLocation({
          longitude: targetPoint.longitude,
          latitude: targetPoint.latitude,
          name: targetPoint.name,
          address: targetPoint.address
        });
      }
      function openAiAssistantForScenic() {
        if (!destination.value) {
          return;
        }
        openAiAssistant({
          prompt: `我正在看${destination.value.name}，请结合这个景区的特点，给我一份半天到一天的游玩建议。`,
          autoAsk: true
        });
      }
      function openAiAssistantForRoute() {
        if (!destination.value) {
          return;
        }
        openAiAssistant({
          prompt: `如果我准备去${destination.value.name}，周边还能怎么安排更顺路？请给我一个适合当天或前后半天串联的建议。`,
          autoAsk: false
        });
      }
      function openAiAssistant({ prompt, autoAsk }) {
        if (!destination.value) {
          return;
        }
        const params = buildAiAssistantParams(destination.value, prompt, autoAsk);
        uni.navigateTo({ url: `/pages/ai-assistant/index?${params}` });
      }
      function buildAiAssistantParams(item, prompt, autoAsk) {
        const context = [
          `景区名称：${item.name}`,
          `所在地区：${item.location}`,
          `景区分类：${item.category}`,
          `景区介绍：${item.description}`,
          `游玩提示：${item.tips.join("；")}`,
          `路线建议：${item.suggestion}`
        ].join("\n");
        return [
          ["title", item.name],
          ["desc", item.description],
          ["source", "景区详情"],
          ["prompt", prompt],
          ["context", context],
          ["autoAsk", autoAsk ? "1" : "0"]
        ].map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
      }
      function formatDateTime(timestamp) {
        if (!timestamp) {
          return "";
        }
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) {
          return "";
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      const __returned__ = { routeModeOptions, currentId, destination, destinationCulture, destinationTravelMeta, destinationVisitMeta, destinationSafetyMap, locationReady, locationStatusText, routeMode, routeData, liveWeatherData, weatherError, offlineMapRecord, offlineMapBusy, relatedGuides, relatedGuidesLoading, relatedGuidesError, introExpanded, tipsExpanded, mediaExpanded, showAllRelatedGuides, guideExpanded, guideImageCandidateIndex, guideImageUnavailable, relatedGuidesVisible, hasExtendedCulture, liveWeather, hasRealWeather, weatherSourceText, scenicLocationText, routeDurationText, routeDistanceText, taxiCostText, mapImageUrl, safetyGuidePreviewUrl, guidePreviewCandidates, displayGuideImageUrl, offlineMapVersion, offlineMapAvailable, hasOfflineMap, hasOfflineMapUpdate, offlineMapStatusText, offlineMapSupportText, offlineMapLocalText, offlineMapSupportShort, offlineMapLocalStatusShort, offlineMapButtonText, visibleRelatedGuides, visibleDestinationTips, safetyTips, visibleSafetyTips, loadRelatedGuides, refreshLocationAndWeather, changeRouteMode, loadRoute, formatDuration, formatDistance, goBack, openRelatedGuide, syncOfflineMapState, toDisplayPath, previewGuideImage, handleGuideImageError, handleGuideImageLoad, handleOfflineMapDownload, openOfflineMap, openSafetyMapPage, deleteOfflineMapWithConfirm, openDouyinSearch, fallbackToCopyKeyword, copyKeyword, openScenicLocation, openAiAssistantForScenic, openAiAssistantForRoute, openAiAssistant, buildAiAssistantParams, formatDateTime, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, CachedImage, get getDestinationById() {
        return getDestinationById;
      }, get getDestinationCulture() {
        return getDestinationCulture;
      }, get getDestinationSafetyMap() {
        return getDestinationSafetyMap;
      }, get getDestinationTravelMeta() {
        return getDestinationTravelMeta;
      }, get getDestinationVisitMeta() {
        return getDestinationVisitMeta;
      }, get getDouyinAppSearchUrls() {
        return getDouyinAppSearchUrls;
      }, get getDouyinSearchUrl() {
        return getDouyinSearchUrl;
      }, get deleteOfflineMap() {
        return deleteOfflineMap;
      }, get downloadOfflineMap() {
        return downloadOfflineMap;
      }, get getOfflineMapRecord() {
        return getOfflineMapRecord;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      }, get getDrivingRoute() {
        return getDrivingRoute;
      }, get getLiveWeather() {
        return getLiveWeather;
      }, get getStaticMapUrl() {
        return getStaticMapUrl;
      }, get getWalkingRoute() {
        return getWalkingRoute;
      }, get resolveNavigationPoint() {
        return resolveNavigationPoint;
      }, get reverseGeocode() {
        return reverseGeocode;
      }, get getRelatedGuidesForDestination() {
        return getRelatedGuidesForDestination;
      }, get hasAmapKey() {
        return hasAmapKey;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      $setup.destination ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "page-scroll"
      }, [
        vue.createElementVNode("view", { class: "hero-card" }, [
          vue.createVNode($setup["CachedImage"], {
            src: $setup.destination.image,
            "image-class": "cover-image"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "hero-mask" }),
          vue.createElementVNode("view", { class: "detail-topbar" }, [
            vue.createElementVNode("view", {
              class: "back-btn",
              onClick: $setup.goBack
            }, [
              vue.createElementVNode("text", null, "返回")
            ])
          ]),
          vue.createElementVNode("view", { class: "hero-info" }, [
            vue.createElementVNode(
              "view",
              { class: "category-chip" },
              vue.toDisplayString($setup.destination.category),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "hero-title" },
              vue.toDisplayString($setup.destination.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "hero-location" },
              vue.toDisplayString($setup.destination.location),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "hero-desc" },
              vue.toDisplayString($setup.destination.description),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head-row" }, [
            vue.createElementVNode("text", { class: "section-title" }, "景区介绍"),
            $setup.hasExtendedCulture ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "section-toggle-chip",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.introExpanded = !$setup.introExpanded)
              },
              vue.toDisplayString($setup.introExpanded ? "收起" : "展开更多"),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "story-card card" }, [
            vue.createElementVNode("view", { class: "travel-meta-grid" }, [
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "推荐季节"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationTravelMeta.season),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "建议停留"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationTravelMeta.stay),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item full-width" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "适合人群"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationTravelMeta.audience),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "visit-meta-grid" }, [
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "门票参考"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationVisitMeta.ticket),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "开放时间"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationVisitMeta.openHours),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "story-row" }, [
              vue.createElementVNode("text", { class: "story-label" }, "景区概览"),
              vue.createElementVNode(
                "text",
                { class: "story-text" },
                vue.toDisplayString($setup.destinationCulture.overview),
                1
                /* TEXT */
              )
            ]),
            $setup.introExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "story-row"
            }, [
              vue.createElementVNode("text", { class: "story-label" }, "历史由来"),
              vue.createElementVNode(
                "text",
                { class: "story-text" },
                vue.toDisplayString($setup.destinationCulture.history),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $setup.introExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "story-row last-row"
            }, [
              vue.createElementVNode("text", { class: "story-label" }, "值得了解"),
              vue.createElementVNode(
                "text",
                { class: "story-text" },
                vue.toDisplayString($setup.destinationCulture.highlights),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        $setup.relatedGuidesVisible ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "section section-block"
        }, [
          vue.createElementVNode("view", { class: "section-head-row" }, [
            vue.createElementVNode("text", { class: "section-title" }, "相关攻略"),
            $setup.relatedGuides.length > 2 ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "section-toggle-chip",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.showAllRelatedGuides = !$setup.showAllRelatedGuides)
              },
              vue.toDisplayString($setup.showAllRelatedGuides ? "收起" : `展开全部 ${$setup.relatedGuides.length} 条`),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "related-guides-card card" }, [
            vue.createElementVNode("view", { class: "related-guides-head" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("text", { class: "map-title" }, "来自攻略指南的相关内容"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "进入景区详情后，这里会自动匹配所有用户发布的相关攻略，方便你直接继续看别人的实地经验。")
              ]),
              $setup.relatedGuidesLoading ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "offline-status"
              }, "加载中")) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.relatedGuides.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "related-guides-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.visibleRelatedGuides, (guide) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: guide.id,
                    class: "related-guide-item card-lite",
                    onClick: ($event) => $setup.openRelatedGuide(guide.id)
                  }, [
                    vue.createElementVNode("view", { class: "related-guide-cover" }, [
                      guide.image ? (vue.openBlock(), vue.createBlock($setup["CachedImage"], {
                        key: 0,
                        src: guide.image,
                        "image-class": "cover-image"
                      }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "related-guide-cover-fallback"
                      }, [
                        vue.createElementVNode("text", null, "攻略")
                      ]))
                    ]),
                    vue.createElementVNode("view", { class: "related-guide-body" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "related-guide-title" },
                        vue.toDisplayString(guide.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "related-guide-meta muted-text" },
                        vue.toDisplayString(guide.nickname || guide.author) + " · " + vue.toDisplayString(guide.locationTag || guide.location || "新疆同城"),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "related-guide-summary muted-text" },
                        vue.toDisplayString(guide.excerpt || guide.summaryText || "这条攻略还没有补充摘要，点进去看完整内容。"),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "related-guide-foot" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "related-guide-stat" },
                          vue.toDisplayString(guide.contentType || "图文"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "related-guide-stat" },
                          vue.toDisplayString(guide.publishDate || ""),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $setup.relatedGuides.length > 2 ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "list-toggle-inline",
                  onClick: _cache[2] || (_cache[2] = ($event) => $setup.showAllRelatedGuides = !$setup.showAllRelatedGuides)
                },
                vue.toDisplayString($setup.showAllRelatedGuides ? "收起相关攻略" : "查看更多相关攻略"),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])) : $setup.relatedGuidesError ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "map-fallback"
            }, [
              vue.createElementVNode("text", { class: "map-fallback-title" }, "相关攻略加载失败"),
              vue.createElementVNode(
                "text",
                { class: "map-fallback-desc muted-text" },
                vue.toDisplayString($setup.relatedGuidesError),
                1
                /* TEXT */
              )
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "map-fallback"
            }, [
              vue.createElementVNode("text", { class: "map-fallback-title" }, "暂时没有相关攻略"),
              vue.createElementVNode("text", { class: "map-fallback-desc muted-text" }, "等用户发布包含这个景区名称或相关地点标签的攻略后，这里会自动显示。")
            ]))
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "路线与天气"),
          vue.createElementVNode("view", { class: "map-card card" }, [
            vue.createElementVNode("view", { class: "map-head" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("text", { class: "map-title" }, "景区位置、路线与天气"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "把导航距离、出发方式和当地天气合并到一块，出发前先看这一屏就够了。")
              ]),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["map-status", { ready: $setup.locationReady }])
                },
                vue.toDisplayString($setup.locationStatusText),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "travel-overview-grid" }, [
              vue.createElementVNode("view", { class: "travel-overview-card card-lite" }, [
                vue.createElementVNode("text", { class: "travel-overview-label" }, "当前天气"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-overview-value weather-emphasis" },
                  vue.toDisplayString($setup.liveWeather.temperature),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "travel-overview-sub muted-text" },
                  vue.toDisplayString($setup.liveWeather.condition),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-overview-card card-lite" }, [
                vue.createElementVNode("text", { class: "travel-overview-label" }, "空气湿度"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-overview-value" },
                  vue.toDisplayString($setup.liveWeather.humidity),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "travel-overview-sub muted-text" },
                  "风力 " + vue.toDisplayString($setup.liveWeather.wind),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "location-meta" }, [
              vue.createElementVNode("text", { class: "meta-label" }, "景区位置"),
              vue.createElementVNode(
                "text",
                { class: "meta-value" },
                vue.toDisplayString($setup.scenicLocationText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "location-meta scenic-meta" }, [
              vue.createElementVNode("text", { class: "meta-label" }, "路线方式"),
              vue.createElementVNode("view", { class: "route-mode-group" }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.routeModeOptions, (item) => {
                    return vue.createElementVNode("view", {
                      key: item.value,
                      class: vue.normalizeClass(["route-mode-chip", { active: $setup.routeMode === item.value }]),
                      onClick: ($event) => $setup.changeRouteMode(item.value)
                    }, vue.toDisplayString(item.label), 11, ["onClick"]);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "route-summary card-lite scenic-meta" }, [
              vue.createElementVNode("view", { class: "route-summary-item" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "预计时间"),
                vue.createElementVNode(
                  "text",
                  { class: "route-highlight" },
                  vue.toDisplayString($setup.routeDurationText),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "route-summary-item" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "预计距离"),
                vue.createElementVNode(
                  "text",
                  { class: "route-highlight" },
                  vue.toDisplayString($setup.routeDistanceText),
                  1
                  /* TEXT */
                )
              ]),
              $setup.routeMode === "taxi" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "route-summary-item route-summary-wide"
              }, [
                vue.createElementVNode("text", { class: "meta-label" }, "打车预估"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.taxiCostText),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.mapImageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "map-preview"
            }, [
              vue.createVNode($setup["CachedImage"], {
                src: $setup.mapImageUrl,
                "image-class": "cover-image"
              }, null, 8, ["src"])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "map-fallback"
            }, [
              vue.createElementVNode("text", { class: "map-fallback-title" }, "等待高德地图 Key"),
              vue.createElementVNode("text", { class: "map-fallback-desc muted-text" }, "填入高德 Web 服务 Key 后，这里会显示景区静态地图并支持驾车时间估算。")
            ])),
            vue.createElementVNode("view", { class: "map-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-btn",
                onClick: $setup.openScenicLocation
              }, "地图导航"),
              vue.createElementVNode("view", {
                class: "secondary-btn",
                onClick: $setup.refreshLocationAndWeather
              }, "刷新路线")
            ]),
            $setup.weatherError ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 2,
                class: "weather-note travel-weather-note"
              },
              vue.toDisplayString($setup.weatherError),
              1
              /* TEXT */
            )) : !$setup.hasRealWeather ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 3,
              class: "weather-note travel-weather-note"
            }, "当前显示的是本地预设天气，填入高德 Key 后会自动切换为实时天气。")) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head-row" }, [
            vue.createElementVNode("text", { class: "section-title" }, "导览攻略"),
            vue.createElementVNode(
              "view",
              {
                class: "section-toggle-chip guide-chip",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.guideExpanded = !$setup.guideExpanded)
              },
              vue.toDisplayString($setup.guideExpanded ? "收起" : "展开"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "safety-card card" }, [
            vue.createElementVNode("view", { class: "safety-head" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("text", { class: "map-title" }, "景区导览攻略图"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "详情页直接看导览图，点图可放大，完整信息放到展开区和导览页里。")
              ]),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["offline-status", { ready: $setup.hasOfflineMap }])
                },
                vue.toDisplayString($setup.offlineMapStatusText),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "offline-meta-grid" }, [
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "覆盖范围"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationSafetyMap.coverage),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "攻略强度"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationSafetyMap.emergencyLevel),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "本地状态"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.offlineMapLocalStatusShort),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "离线资源"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.offlineMapSupportShort),
                  1
                  /* TEXT */
                )
              ])
            ]),
            $setup.displayGuideImageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "safety-map-preview",
              onClick: $setup.previewGuideImage
            }, [
              vue.createVNode($setup["CachedImage"], {
                src: $setup.displayGuideImageUrl,
                "image-class": "cover-image guide-preview-image",
                mode: "aspectFit",
                "fallback-to-remote": false,
                onError: $setup.handleGuideImageError,
                onLoad: $setup.handleGuideImageLoad
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "safety-map-badge" }, "点击放大查看导览图")
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "map-fallback"
            }, [
              vue.createElementVNode("text", { class: "map-fallback-title" }, "暂无景区导览图"),
              vue.createElementVNode("text", { class: "map-fallback-desc muted-text" }, "请把对应景区导览图放进 `static/guide-maps`，页面会自动尝试同名不同后缀并优先读取本地离线图。")
            ])),
            $setup.guideExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "safety-legend card-lite"
            }, [
              vue.createElementVNode("text", { class: "safety-item-title" }, "导览重点"),
              vue.createElementVNode(
                "text",
                { class: "safety-item-desc muted-text" },
                vue.toDisplayString($setup.destinationSafetyMap.highlights.join("；")),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $setup.guideExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 3,
              class: "offline-meta-grid compact-grid guide-detail-grid"
            }, [
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "离线资源"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.offlineMapSupportText),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "travel-meta-item" }, [
                vue.createElementVNode("text", { class: "travel-meta-label" }, "本地状态"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.offlineMapLocalText),
                  1
                  /* TEXT */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "safety-list compact-safety-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.visibleSafetyTips, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.title,
                    class: "safety-item card-lite compact-safety-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "safety-item-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "safety-item-desc muted-text" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            $setup.safetyTips.length > 2 ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 4,
                class: "list-toggle-inline",
                onClick: _cache[4] || (_cache[4] = ($event) => $setup.guideExpanded = !$setup.guideExpanded)
              },
              vue.toDisplayString($setup.guideExpanded ? "收起导览提醒" : `查看更多导览提醒 ${$setup.safetyTips.length} 条`),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "map-actions guide-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-btn",
                onClick: $setup.openSafetyMapPage
              }, "完整导览页"),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["primary-btn", { disabled: $setup.offlineMapBusy || !$setup.offlineMapAvailable }]),
                  onClick: $setup.handleOfflineMapDownload
                },
                vue.toDisplayString($setup.offlineMapButtonText),
                3
                /* TEXT, CLASS */
              ),
              $setup.guideExpanded ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: vue.normalizeClass(["secondary-btn", { disabled: !$setup.hasOfflineMap }]),
                  onClick: $setup.openOfflineMap
                },
                "打开离线图",
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true),
              $setup.guideExpanded ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  class: vue.normalizeClass(["secondary-btn", { disabled: !$setup.hasOfflineMap }]),
                  onClick: $setup.deleteOfflineMapWithConfirm
                },
                "删除离线图",
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head-row" }, [
            vue.createElementVNode("text", { class: "section-title" }, "游玩建议"),
            vue.createElementVNode(
              "view",
              {
                class: "section-toggle-chip",
                onClick: _cache[5] || (_cache[5] = ($event) => $setup.tipsExpanded = !$setup.tipsExpanded)
              },
              vue.toDisplayString($setup.tipsExpanded ? "收起" : "展开"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "tips-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.visibleDestinationTips, (tip) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: tip,
                  class: "tip-card card"
                }, [
                  vue.createElementVNode("view", { class: "tip-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "tip-text" },
                    vue.toDisplayString(tip),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $setup.destination.tips.length > 3 ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "list-toggle-inline",
              onClick: _cache[6] || (_cache[6] = ($event) => $setup.tipsExpanded = !$setup.tipsExpanded)
            },
            vue.toDisplayString($setup.tipsExpanded ? "收起建议" : `查看更多建议 ${$setup.destination.tips.length} 条`),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "suggestion-box" }, [
            vue.createElementVNode("text", { class: "suggestion-title" }, "路线建议"),
            vue.createElementVNode(
              "text",
              { class: "suggestion-text" },
              vue.toDisplayString($setup.destination.suggestion),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "ai-card card" }, [
            vue.createElementVNode("view", { class: "ai-copy" }, [
              vue.createElementVNode("text", { class: "suggestion-title" }, "AI 行程助手"),
              vue.createElementVNode("text", { class: "ai-desc muted-text" }, "把当前景区信息直接交给 AI，快速生成半日到一日玩法，或顺手问附近怎么串联更省心。")
            ]),
            vue.createElementVNode("view", { class: "ai-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-btn",
                onClick: $setup.openAiAssistantForScenic
              }, "让 AI 生成当前景区玩法"),
              vue.createElementVNode("view", {
                class: "secondary-btn",
                onClick: $setup.openAiAssistantForRoute
              }, "问 AI 怎么安排这附近")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head-row" }, [
            vue.createElementVNode("text", { class: "section-title" }, "抖音直播参考"),
            vue.createElementVNode(
              "view",
              {
                class: "section-toggle-chip",
                onClick: _cache[7] || (_cache[7] = ($event) => $setup.mediaExpanded = !$setup.mediaExpanded)
              },
              vue.toDisplayString($setup.mediaExpanded ? "收起" : "展开"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "live-card card" }, [
            vue.createElementVNode("view", {
              class: "live-preview-compact",
              onClick: _cache[8] || (_cache[8] = ($event) => $setup.mediaExpanded = !$setup.mediaExpanded)
            }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "text",
                  { class: "live-title" },
                  vue.toDisplayString($setup.destination.liveTitle),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "live-hint muted-text" },
                  vue.toDisplayString($setup.destination.liveHint),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "view",
                { class: "section-toggle-chip compact-chip" },
                vue.toDisplayString($setup.mediaExpanded ? "隐藏" : "查看"),
                1
                /* TEXT */
              )
            ]),
            $setup.mediaExpanded ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "live-expanded-content"
            }, [
              vue.createElementVNode("view", { class: "live-preview" }, [
                vue.createVNode($setup["CachedImage"], {
                  src: $setup.destination.image,
                  "image-class": "cover-image"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "live-badge" }, [
                  vue.createElementVNode("view", { class: "live-dot" }),
                  vue.createElementVNode("text", null, "DY")
                ])
              ]),
              vue.createElementVNode("view", { class: "live-body" }, [
                vue.createElementVNode(
                  "text",
                  { class: "live-keyword" },
                  "搜索词：" + vue.toDisplayString($setup.destination.liveKeyword),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "live-actions one-col" }, [
                  vue.createElementVNode("view", {
                    class: "primary-btn",
                    onClick: $setup.openDouyinSearch
                  }, "跳转抖音搜索"),
                  vue.createElementVNode("view", {
                    class: "secondary-btn",
                    onClick: $setup.copyKeyword
                  }, "复制搜索词")
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-shell section"
      }, [
        vue.createElementVNode("text", { class: "section-title" }, "景区不存在"),
        vue.createElementVNode("view", {
          class: "primary-btn narrow-btn",
          onClick: $setup.goBack
        }, "返回上一页")
      ]))
    ]);
  }
  const PagesDestinationDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-b4993f48"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/destination-detail/index.vue"]]);
  const _sfc_main$7 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentId = vue.ref("");
      const offlineMode = vue.ref(false);
      const offlineRecord = vue.ref(null);
      const activeMode = vue.ref("interactive");
      const mapScale = vue.ref(14);
      const guideImageCandidateIndex = vue.ref(0);
      const guideImageUnavailable = vue.ref(false);
      const destination = vue.computed(() => getDestinationById(currentId.value));
      const onlineSafetyMap = vue.computed(() => getDestinationSafetyMap(currentId.value) || {
        title: "景区导览攻略图",
        zoom: 14,
        coverage: "",
        emergencyLevel: "中",
        terrainRisk: "",
        weatherRisk: "",
        signalRisk: "",
        safeRoute: [],
        servicePoints: [],
        emergencyContacts: [],
        note: "",
        guideMapSourceName: "",
        guideMapSourceUrl: "",
        guideMapImage: ""
      });
      const safetyMap = vue.computed(() => {
        var _a;
        if (offlineMode.value && ((_a = offlineRecord.value) == null ? void 0 : _a.metadata)) {
          return offlineRecord.value.metadata;
        }
        return onlineSafetyMap.value;
      });
      const guidePageTitle = vue.computed(() => {
        return destination.value ? `${destination.value.name}导览攻略图` : "景区导览攻略图";
      });
      const guideModeTag = vue.computed(() => {
        if (offlineMode.value) {
          return "离线可看";
        }
        return activeMode.value === "interactive" ? "地图模式" : "导览模式";
      });
      const guideHighlightsText = vue.computed(() => {
        const list = Array.isArray(safetyMap.value.highlights) ? safetyMap.value.highlights.filter(Boolean) : [];
        if (list.length) {
          return list.join("；");
        }
        return "当前页面以景区导览图和游览顺序建议为主，适合出发前快速做路线规划。";
      });
      const mapCenter = vue.computed(() => {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return null;
        }
        return {
          longitude: Number(coords.longitude),
          latitude: Number(coords.latitude)
        };
      });
      const guidePreviewCandidates = vue.computed(() => {
        const base = String(safetyMap.value.guideMapImage || "").trim();
        if (!base) {
          return [];
        }
        const candidates = [base];
        if (/\.jpg$/i.test(base)) {
          candidates.push(`${base}.jpg`);
          candidates.push(base.replace(/\.jpg$/i, ".png"));
          candidates.push(base.replace(/\.jpg$/i, ".jpeg"));
        } else if (/\.png$/i.test(base)) {
          candidates.push(`${base}.png`);
          candidates.push(base.replace(/\.png$/i, ".jpg"));
          candidates.push(base.replace(/\.png$/i, ".jpeg"));
        } else if (/\.jpeg$/i.test(base)) {
          candidates.push(`${base}.jpeg`);
          candidates.push(base.replace(/\.jpeg$/i, ".jpg"));
          candidates.push(base.replace(/\.jpeg$/i, ".png"));
        }
        return Array.from(new Set(candidates));
      });
      const guidePreviewUrl = vue.computed(() => {
        return guidePreviewCandidates.value[guideImageCandidateIndex.value] || "";
      });
      function toDisplayPath(filePath) {
        const raw = String(filePath || "").trim();
        if (!raw) {
          return "";
        }
        if (/^(https?:|file:|content:|blob:|data:)/i.test(raw)) {
          return raw;
        }
        if (raw.startsWith("/static/") || raw.startsWith("static/")) {
          return raw.startsWith("/") ? raw : `/${raw}`;
        }
        if (typeof plus !== "undefined" && plus.io && typeof plus.io.convertLocalFileSystemURL === "function") {
          const absolutePath = plus.io.convertLocalFileSystemURL(raw);
          if (absolutePath) {
            return absolutePath.startsWith("file://") ? absolutePath : `file://${absolutePath}`;
          }
        }
        return raw;
      }
      const displayGuideImageUrl = vue.computed(() => {
        var _a;
        if (guideImageUnavailable.value) {
          return "";
        }
        if (offlineMode.value && ((_a = offlineRecord.value) == null ? void 0 : _a.savedFilePath)) {
          return toDisplayPath(offlineRecord.value.savedFilePath);
        }
        if (guidePreviewUrl.value) {
          return toDisplayPath(guidePreviewUrl.value);
        }
        return "";
      });
      const modeDescription = vue.computed(() => {
        if (offlineMode.value) {
          return "离线模式只展示已保存的景区导览攻略图，适合在景区内直接对照整张图查看。";
        }
        if (activeMode.value === "interactive") {
          return "当前是地图浏览视图，方便先看景区大致方位和缩放范围。";
        }
        return "当前显示的是景区导览攻略大图，优先读取你手动放入的本地图片。";
      });
      const guideSummaryText = vue.computed(() => {
        if (offlineMode.value) {
          return "这是你已经保存到本地的离线导览攻略图，弱网或无网时也能直接对照游览。";
        }
        if (safetyMap.value.guideMapSourceName) {
          return `当前导览图优先采用 ${safetyMap.value.guideMapSourceName}，并结合景区现有攻略信息整理成更适合出发前查看的导览页。`;
        }
        return "当前导览图以景区总览为主，点击图片可以继续放大查看细节。";
      });
      onLoad((options = {}) => {
        var _a;
        currentId.value = options.id || "";
        offlineMode.value = options.offline === "1";
        offlineRecord.value = getOfflineMapRecord(currentId.value);
        mapScale.value = Number(((_a = safetyMap.value) == null ? void 0 : _a.zoom) || 14);
        activeMode.value = offlineMode.value ? "guide" : "interactive";
        guideImageCandidateIndex.value = 0;
        guideImageUnavailable.value = false;
      });
      function zoomIn() {
        mapScale.value = Math.min(20, Number(mapScale.value || 14) + 1);
      }
      function zoomOut() {
        mapScale.value = Math.max(5, Number(mapScale.value || 14) - 1);
      }
      function previewGuideImage() {
        if (!displayGuideImageUrl.value) {
          return;
        }
        uni.previewImage({
          current: displayGuideImageUrl.value,
          urls: [displayGuideImageUrl.value]
        });
      }
      function handleGuideImageError() {
        if (guidePreviewCandidates.value.length && guideImageCandidateIndex.value < guidePreviewCandidates.value.length - 1) {
          guideImageCandidateIndex.value += 1;
          return;
        }
        guideImageUnavailable.value = true;
      }
      function handleGuideImageLoad() {
        guideImageUnavailable.value = false;
        guideImageCandidateIndex.value = Math.max(0, guideImageCandidateIndex.value);
      }
      function openExternalMap() {
        const coords = mapCenter.value;
        if (!coords || !destination.value) {
          return;
        }
        const amapUrl = `amapuri://route/plan/?dlat=${coords.latitude}&dlon=${coords.longitude}&dname=${encodeURIComponent(destination.value.name)}&dev=0&t=0`;
        if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
          plus.runtime.openURL(amapUrl, () => {
            uni.openLocation({
              longitude: coords.longitude,
              latitude: coords.latitude,
              name: destination.value.name,
              address: destination.value.location
            });
          });
          return;
        }
        uni.openLocation({
          longitude: coords.longitude,
          latitude: coords.latitude,
          name: destination.value.name,
          address: destination.value.location
        });
      }
      function openGuideSource() {
        if (!safetyMap.value.guideMapSourceUrl) {
          return;
        }
        const url = safetyMap.value.guideMapSourceUrl;
        if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
          plus.runtime.openURL(url);
          return;
        }
        if (typeof window !== "undefined" && window.open) {
          window.open(url, "_blank");
        }
      }
      const __returned__ = { currentId, offlineMode, offlineRecord, activeMode, mapScale, guideImageCandidateIndex, guideImageUnavailable, destination, onlineSafetyMap, safetyMap, guidePageTitle, guideModeTag, guideHighlightsText, mapCenter, guidePreviewCandidates, guidePreviewUrl, toDisplayPath, displayGuideImageUrl, modeDescription, guideSummaryText, zoomIn, zoomOut, previewGuideImage, handleGuideImageError, handleGuideImageLoad, openExternalMap, openGuideSource, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, CachedImage, get getDestinationById() {
        return getDestinationById;
      }, get getDestinationSafetyMap() {
        return getDestinationSafetyMap;
      }, get getOfflineMapRecord() {
        return getOfflineMapRecord;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell safety-page" }, [
      $setup.destination ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "page-scroll"
      }, [
        vue.createElementVNode("view", { class: "hero-gradient safety-hero section" }, [
          vue.createElementVNode("text", { class: "safety-kicker" }, "Scenic Guide Map"),
          vue.createElementVNode(
            "text",
            { class: "safety-title" },
            vue.toDisplayString($setup.guidePageTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "safety-subtitle" }, "当前页面已改为景区导览攻略图，优先展示导览大图，并补充游览顺序、补给点和出行提醒。")
        ]),
        vue.createElementVNode("view", { class: "section safety-shell" }, [
          vue.createElementVNode("view", { class: "card map-card-large" }, [
            vue.createElementVNode("view", { class: "map-headline" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "text",
                  { class: "map-title" },
                  vue.toDisplayString($setup.offlineMode ? "离线导览攻略图" : "景区导览攻略图"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "map-desc muted-text" },
                  vue.toDisplayString($setup.modeDescription),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "view",
                { class: "map-level" },
                vue.toDisplayString($setup.guideModeTag),
                1
                /* TEXT */
              )
            ]),
            !$setup.offlineMode ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "mode-switch"
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["mode-chip", { active: $setup.activeMode === "interactive" }]),
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.activeMode = "interactive")
                },
                " 交互地图 ",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["mode-chip", { active: $setup.activeMode === "guide" }]),
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.activeMode = "guide")
                },
                " 导览大图 ",
                2
                /* CLASS */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $setup.activeMode === "interactive" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "interactive-shell"
            }, [
              $setup.mapCenter ? (vue.openBlock(), vue.createElementBlock("map", {
                key: 0,
                class: "interactive-map",
                longitude: $setup.mapCenter.longitude,
                latitude: $setup.mapCenter.latitude,
                scale: $setup.mapScale,
                "enable-scroll": true,
                "enable-zoom": true,
                "enable-rotate": true,
                "enable-overlooking": false
              }, null, 8, ["longitude", "latitude", "scale"])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "map-empty-state"
              }, [
                vue.createElementVNode("text", { class: "map-empty-title" }, "暂无可用地图中心点"),
                vue.createElementVNode("text", { class: "map-empty-copy muted-text" }, "当前景区没有有效坐标，暂时无法生成交互地图。")
              ])),
              vue.createElementVNode("view", { class: "map-floating-tools" }, [
                vue.createElementVNode("view", {
                  class: "floating-btn",
                  onClick: $setup.zoomIn
                }, "+"),
                vue.createElementVNode("view", {
                  class: "floating-btn",
                  onClick: $setup.zoomOut
                }, "-")
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "guide-shell"
            }, [
              $setup.displayGuideImageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "guide-preview",
                onClick: $setup.previewGuideImage
              }, [
                vue.createVNode($setup["CachedImage"], {
                  src: $setup.displayGuideImageUrl,
                  "image-class": "guide-image",
                  mode: "aspectFit",
                  "fallback-to-remote": false,
                  onError: $setup.handleGuideImageError,
                  onLoad: $setup.handleGuideImageLoad
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "guide-badge" }, "点击放大查看")
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "map-empty-state guide-empty-state"
              }, [
                vue.createElementVNode("text", { class: "map-empty-title" }, "暂无导览大图"),
                vue.createElementVNode("text", { class: "map-empty-copy muted-text" }, "请先把对应景区导览图放进 static/guide-maps，当前页面不会再回退为错误的自动地图。")
              ])),
              vue.createElementVNode("view", { class: "guide-meta card-lite" }, [
                vue.createElementVNode("text", { class: "smart-map-title" }, "导览图说明"),
                vue.createElementVNode(
                  "text",
                  { class: "smart-map-copy muted-text" },
                  vue.toDisplayString($setup.guideSummaryText),
                  1
                  /* TEXT */
                )
              ])
            ])),
            vue.createElementVNode("view", { class: "map-actions compact-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-action",
                onClick: $setup.openExternalMap
              }, "打开系统地图"),
              !$setup.offlineMode ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "secondary-action",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.activeMode = $setup.activeMode === "interactive" ? "guide" : "interactive")
              }, "切换查看方式")) : vue.createCommentVNode("v-if", true),
              $setup.displayGuideImageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "secondary-action",
                onClick: $setup.previewGuideImage
              }, "放大导览图")) : vue.createCommentVNode("v-if", true),
              $setup.safetyMap.guideMapSourceUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "secondary-action",
                onClick: $setup.openGuideSource
              }, "地图来源")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "meta-grid" }, [
              vue.createElementVNode("view", { class: "meta-card" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "地形提醒"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.safetyMap.terrainRisk),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "meta-card" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "天气提醒"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.safetyMap.weatherRisk),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "meta-card full-width" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "通信提示"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.safetyMap.signalRisk),
                  1
                  /* TEXT */
                )
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "推荐游览顺序"),
          vue.createElementVNode("view", { class: "route-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.safetyMap.safeRoute, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item,
                  class: "card route-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "route-index" },
                    vue.toDisplayString(index + 1),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "route-text" },
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "补给点与服务点"),
          vue.createElementVNode("view", { class: "service-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.safetyMap.servicePoints, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item,
                  class: "card service-item"
                }, [
                  vue.createElementVNode("view", { class: "service-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "route-text" },
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "攻略补充说明"),
          vue.createElementVNode("view", { class: "contact-card card" }, [
            vue.createElementVNode(
              "text",
              { class: "contact-copy" },
              vue.toDisplayString($setup.guideHighlightsText),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "contact-note muted-text" },
              vue.toDisplayString($setup.safetyMap.note),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-shell section"
      }, [
        vue.createElementVNode("text", { class: "section-title" }, "未找到景区导览攻略图")
      ]))
    ]);
  }
  const PagesSafetyMapIndex = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-26a8a6b6"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/safety-map/index.vue"]]);
  const _sfc_main$6 = {
    __name: "HikingHeaderPanel",
    props: {
      gpsStatusText: {
        type: String,
        default: "GPS 连接中"
      },
      coordinateText: {
        type: String,
        default: "等待定位"
      },
      altitudeText: {
        type: String,
        default: "--"
      },
      distanceText: {
        type: String,
        default: "--"
      },
      accuracyText: {
        type: String,
        default: "--"
      },
      isOffline: {
        type: Boolean,
        default: false
      },
      modeText: {
        type: String,
        default: ""
      },
      sunsetCountdownText: {
        type: String,
        default: ""
      },
      sunsetTimeText: {
        type: String,
        default: ""
      },
      sunsetRiskLevel: {
        type: String,
        default: "safe"
      },
      guardStatusText: {
        type: String,
        default: ""
      },
      guardStatusLevel: {
        type: String,
        default: "safe"
      },
      compassText: {
        type: String,
        default: "方向校准中"
      },
      syncStatusText: {
        type: String,
        default: ""
      },
      syncStatusTone: {
        type: String,
        default: "neutral"
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "header-panel" }, [
      $props.sunsetCountdownText ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["sunset-banner", `risk-${$props.sunsetRiskLevel}`])
        },
        [
          vue.createElementVNode("text", { class: "sunset-title" }, "日落时间"),
          vue.createElementVNode(
            "text",
            { class: "sunset-countdown" },
            vue.toDisplayString($props.sunsetCountdownText),
            1
            /* TEXT */
          ),
          $props.sunsetTimeText ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "sunset-meta"
            },
            vue.toDisplayString($props.sunsetTimeText),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "info-row" }, [
        vue.createElementVNode("view", { class: "gps-status" }, [
          vue.createElementVNode(
            "text",
            {
              class: vue.normalizeClass(["dot", { offline: $props.isOffline }])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.gpsStatusText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "meta-group" }, [
          $props.modeText ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "mode-badge"
            },
            vue.toDisplayString($props.modeText),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            { class: "coordinates" },
            vue.toDisplayString($props.coordinateText),
            1
            /* TEXT */
          )
        ])
      ]),
      $props.guardStatusText ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: vue.normalizeClass(["guard-banner", `guard-${$props.guardStatusLevel}`])
        },
        [
          vue.createElementVNode("text", { class: "guard-title" }, "守护模式"),
          vue.createElementVNode(
            "text",
            { class: "guard-text" },
            vue.toDisplayString($props.guardStatusText),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      $props.syncStatusText ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 2,
          class: vue.normalizeClass(["sync-banner", `sync-${$props.syncStatusTone}`])
        },
        [
          vue.createElementVNode("text", { class: "sync-title" }, "轨迹同步"),
          vue.createElementVNode(
            "text",
            { class: "sync-text" },
            vue.toDisplayString($props.syncStatusText),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "stats-grid" }, [
        vue.createElementVNode("view", { class: "stat-card" }, [
          vue.createElementVNode("view", { class: "label" }, "海拔 (m)"),
          vue.createElementVNode(
            "view",
            { class: "value" },
            vue.toDisplayString($props.altitudeText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "stat-card" }, [
          vue.createElementVNode("view", { class: "label" }, "里程 (km)"),
          vue.createElementVNode(
            "view",
            { class: "value" },
            vue.toDisplayString($props.distanceText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "stat-card" }, [
          vue.createElementVNode("view", { class: "label" }, "精度误差 (m)"),
          vue.createElementVNode("view", { class: "value highlight" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.accuracyText),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "status-indicator" })
          ])
        ]),
        vue.createElementVNode("view", { class: "stat-card" }, [
          vue.createElementVNode("view", { class: "label" }, "手机朝向"),
          vue.createElementVNode(
            "view",
            { class: "value compass-value" },
            vue.toDisplayString($props.compassText),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const HikingHeaderPanel = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-4c485381"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingHeaderPanel.vue"]]);
  const MAX_INIT_RETRIES = 12;
  const _sfc_main$5 = {
    __name: "AppAmapWebview",
    props: {
      mapCenter: {
        type: Object,
        default: null
      },
      mapScale: {
        type: Number,
        default: 16
      },
      mapPolyline: {
        type: Array,
        default: () => []
      },
      mapMarkers: {
        type: Array,
        default: () => []
      },
      mapModeKey: {
        type: String,
        default: "normal"
      },
      overlayActive: {
        type: Boolean,
        default: false
      }
    },
    emits: ["refresh", "recenter"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      const props = __props;
      const hostRef = vue.ref(null);
      const instance = vue.getCurrentInstance();
      let childWebview = null;
      let childWebviewId = `hiking-amap-${Date.now()}`;
      const refreshBridgeName = `__HIKING_APP_MAP_REFRESH_${Date.now()}__`;
      const recenterBridgeName = `__HIKING_APP_MAP_RECENTER_${Date.now()}__`;
      const refreshEventName = `hiking-map-refresh-${Date.now()}`;
      const recenterEventName = `hiking-map-recenter-${Date.now()}`;
      let hostWebviewId = "";
      let syncTimer = null;
      let stateSyncTimer = null;
      let initRetryTimer = null;
      let initRetryCount = 0;
      let hasSyncedAfterLoad = false;
      let lastSyncedSnapshot = null;
      const handleRefreshBridge = () => {
        emit("refresh");
      };
      const handleRecenterBridge = () => {
        emit("recenter");
      };
      vue.onMounted(() => {
        globalThis[refreshBridgeName] = handleRefreshBridge;
        globalThis[recenterBridgeName] = handleRecenterBridge;
        if (typeof uni !== "undefined" && typeof uni.$on === "function") {
          uni.$on(refreshEventName, handleRefreshBridge);
          uni.$on(recenterEventName, handleRecenterBridge);
        }
        if (typeof window !== "undefined") {
          window[refreshBridgeName] = handleRefreshBridge;
          window[recenterBridgeName] = handleRecenterBridge;
        }
        initChildWebview().catch(() => {
        });
      });
      vue.watch(() => props.mapCenter, () => {
        scheduleStateSync();
      }, { deep: true });
      vue.watch(() => props.mapScale, () => {
        scheduleStateSync();
      });
      vue.watch(() => props.mapPolyline, () => {
        scheduleStateSync();
      }, { deep: true });
      vue.watch(() => props.mapMarkers, () => {
        scheduleStateSync();
      }, { deep: true });
      vue.watch(() => props.mapModeKey, () => {
        scheduleStateSync();
      });
      vue.watch(() => props.overlayActive, (value) => {
        syncChildVisibility(value);
      });
      vue.onBeforeUnmount(() => {
        if (typeof uni !== "undefined" && typeof uni.$off === "function") {
          uni.$off(refreshEventName, handleRefreshBridge);
          uni.$off(recenterEventName, handleRecenterBridge);
        }
        if (syncTimer) {
          clearTimeout(syncTimer);
          syncTimer = null;
        }
        if (stateSyncTimer) {
          clearTimeout(stateSyncTimer);
          stateSyncTimer = null;
        }
        if (initRetryTimer) {
          clearTimeout(initRetryTimer);
          initRetryTimer = null;
        }
        if (childWebview) {
          try {
            childWebview.close("none");
          } catch (error) {
          }
          childWebview = null;
        }
        try {
          delete globalThis[refreshBridgeName];
        } catch (error) {
          globalThis[refreshBridgeName] = void 0;
        }
        try {
          delete globalThis[recenterBridgeName];
        } catch (error) {
          globalThis[recenterBridgeName] = void 0;
        }
        if (typeof window !== "undefined") {
          try {
            delete window[refreshBridgeName];
          } catch (error) {
            window[refreshBridgeName] = void 0;
          }
          try {
            delete window[recenterBridgeName];
          } catch (error) {
            window[recenterBridgeName] = void 0;
          }
        }
      });
      async function initChildWebview() {
        if (typeof plus === "undefined" || !plus.webview) {
          return;
        }
        await vue.nextTick();
        const rect = await getRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) {
          scheduleInitRetry();
          return;
        }
        initRetryCount = 0;
        hasSyncedAfterLoad = false;
        lastSyncedSnapshot = null;
        const current = resolveHostWebview();
        if (!current) {
          throw new Error("host webview unavailable");
        }
        hostWebviewId = String(current.id || "");
        const url = resolveLocalMapUrl();
        childWebview = plus.webview.create(url, childWebviewId, {
          position: "absolute",
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          background: "transparent",
          bounce: "none",
          scalable: false,
          cachemode: "noCache"
        });
        childWebview.addEventListener("loaded", () => {
          hasSyncedAfterLoad = true;
          updateBounds().finally(() => {
            syncMapState({ forceFull: true });
          });
        });
        childWebview.addEventListener("rendered", () => {
          if (!hasSyncedAfterLoad) {
            hasSyncedAfterLoad = true;
            updateBounds().finally(() => {
              syncMapState({ forceFull: true });
            });
          }
        });
        current.append(childWebview);
        syncChildVisibility(props.overlayActive);
        syncTimer = setTimeout(() => {
          updateBounds().finally(() => {
            syncMapState({ forceFull: true });
          });
        }, 600);
      }
      function resolveLocalMapUrl() {
        const query = [];
        if (hasAmapKey()) {
          query.push(`key=${encodeURIComponent(AMAP_WEB_KEY)}`);
        }
        if (hasAmapSecurityCode()) {
          query.push(`securityJsCode=${encodeURIComponent(AMAP_SECURITY_JS_CODE)}`);
        }
        if (hostWebviewId) {
          query.push(`hostWebviewId=${encodeURIComponent(hostWebviewId)}`);
        }
        query.push(`refreshBridge=${encodeURIComponent(refreshBridgeName)}`);
        query.push(`recenterBridge=${encodeURIComponent(recenterBridgeName)}`);
        query.push(`refreshEvent=${encodeURIComponent(refreshEventName)}`);
        query.push(`recenterEvent=${encodeURIComponent(recenterEventName)}`);
        query.push(`mode=${encodeURIComponent(String(props.mapModeKey || "normal"))}`);
        const suffix = query.length ? `?${query.join("&")}` : "";
        return `_www/static/hiking-amap.html${suffix}`;
      }
      function scheduleInitRetry(rect) {
        if (childWebview) {
          return;
        }
        if (initRetryCount >= MAX_INIT_RETRIES) {
          return;
        }
        initRetryCount += 1;
        const delay = initRetryCount <= 3 ? 180 : 300;
        if (initRetryTimer) {
          clearTimeout(initRetryTimer);
        }
        initRetryTimer = setTimeout(() => {
          initRetryTimer = null;
          initChildWebview().catch(() => {
          });
        }, delay);
      }
      function resolveHostWebview() {
        if (typeof plus === "undefined" || !plus.webview) {
          return null;
        }
        const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
        const page = Array.isArray(pages) && pages.length ? pages[pages.length - 1] : null;
        const pageWebview = page && typeof page.$getAppWebview === "function" ? page.$getAppWebview() : null;
        if (pageWebview) {
          return pageWebview;
        }
        return plus.webview.currentWebview() || null;
      }
      function syncChildVisibility(hidden) {
        if (!childWebview) {
          return;
        }
        try {
          if (hidden) {
            childWebview.hide("none");
            return;
          }
          childWebview.show("none");
        } catch (error) {
        }
      }
      async function updateBounds() {
        if (!childWebview) {
          return;
        }
        const rect = await getRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) {
          return;
        }
        childWebview.setStyle({
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        });
      }
      function getRect() {
        return new Promise((resolve) => {
          const query = uni.createSelectorQuery();
          query.in(getCurrentInstanceProxy());
          query.select(".app-amap-host").boundingClientRect((rect) => {
            resolve(rect || null);
          }).exec();
        });
      }
      function getCurrentInstanceProxy() {
        return (instance == null ? void 0 : instance.proxy) || null;
      }
      function syncMapState(options = {}) {
        syncMapStateInternal({ forceFull: Boolean(options.forceFull) });
      }
      function scheduleStateSync() {
        if (stateSyncTimer) {
          clearTimeout(stateSyncTimer);
        }
        stateSyncTimer = setTimeout(() => {
          stateSyncTimer = null;
          syncMapStateInternal({ forceFull: false });
        }, 16);
      }
      function syncMapStateInternal(options = {}) {
        var _a, _b;
        if (!childWebview) {
          if (!initRetryTimer && initRetryCount < MAX_INIT_RETRIES) {
            scheduleInitRetry();
          }
          return;
        }
        const state = {
          longitude: Number(((_a = props.mapCenter) == null ? void 0 : _a.longitude) || 0),
          latitude: Number(((_b = props.mapCenter) == null ? void 0 : _b.latitude) || 0),
          zoom: Math.max(8, Math.min(18, Math.round(Number(props.mapScale || 16)))),
          mode: String(props.mapModeKey || "normal"),
          markers: extractMarkerPoints(props.mapMarkers),
          track: extractTrackSegments(props.mapPolyline)
        };
        formatAppLog("log", "at pages/hiking/components/AppAmapWebview.vue:344", "[hiking-map-sync] sync state", {
          zoom: state.zoom,
          mode: state.mode,
          markerCount: state.markers.length,
          segmentCount: state.track.length,
          pointCount: state.track.reduce((total, segment) => total + segment.length, 0),
          longitude: state.longitude,
          latitude: state.latitude
        });
        const nextSnapshot = buildSnapshot(state);
        if (options.forceFull || !lastSyncedSnapshot) {
          runChildCommand("initMapState", state);
          lastSyncedSnapshot = nextSnapshot;
          return;
        }
        const previous = lastSyncedSnapshot;
        const trackSignatureChanged = previous.trackSignature !== nextSnapshot.trackSignature;
        const modeChanged = state.mode !== previous.mode;
        const zoomChanged = state.zoom !== previous.zoom;
        if (modeChanged) {
          runChildCommand("initMapState", state);
          lastSyncedSnapshot = nextSnapshot;
          return;
        }
        if (trackSignatureChanged) {
          runChildCommand("replaceTrack", state.track);
        }
        if (zoomChanged || shouldUpdateViewport(previous, state)) {
          runChildCommand("updateViewport", {
            longitude: state.longitude,
            latitude: state.latitude,
            zoom: state.zoom,
            mode: state.mode,
            markers: state.markers
          });
        }
        lastSyncedSnapshot = nextSnapshot;
      }
      function buildSnapshot(state) {
        const lastTrackSegment = Array.isArray(state.track[state.track.length - 1]) ? state.track[state.track.length - 1] : [];
        const lastTrackPoint = lastTrackSegment[lastTrackSegment.length - 1] || null;
        const firstMarker = state.markers[0] || null;
        const trackPointCount = state.track.reduce((total, segment) => total + (Array.isArray(segment) ? segment.length : 0), 0);
        return {
          longitude: state.longitude,
          latitude: state.latitude,
          zoom: state.zoom,
          mode: state.mode,
          trackLength: state.track.length,
          trackPointCount,
          lastTrackLongitude: Number((lastTrackPoint == null ? void 0 : lastTrackPoint.longitude) || 0),
          lastTrackLatitude: Number((lastTrackPoint == null ? void 0 : lastTrackPoint.latitude) || 0),
          trackSignature: JSON.stringify(state.track),
          markerSignature: JSON.stringify(firstMarker || null)
        };
      }
      function shouldUpdateViewport(previous, state) {
        if (Math.abs(previous.longitude - state.longitude) > 1e-6) {
          return true;
        }
        if (Math.abs(previous.latitude - state.latitude) > 1e-6) {
          return true;
        }
        return previous.markerSignature !== JSON.stringify(state.markers[0] || null);
      }
      function runChildCommand(name, payload) {
        if (!childWebview) {
          return;
        }
        try {
          childWebview.evalJS(`window.${name} && window.${name}(${JSON.stringify(payload)})`);
        } catch (error) {
        }
      }
      function extractTrackSegments(polyline) {
        if (!Array.isArray(polyline)) {
          return [];
        }
        return polyline.map((line) => {
          const points = Array.isArray(line == null ? void 0 : line.points) ? line.points : [];
          return points.map((item) => ({
            longitude: Number(item.longitude),
            latitude: Number(item.latitude)
          })).filter((item) => Number.isFinite(item.longitude) && Number.isFinite(item.latitude));
        }).filter((segment) => segment.length);
      }
      function extractMarkerPoints(markers) {
        return Array.isArray(markers) ? markers.map((item) => {
          var _a, _b;
          return {
            longitude: Number(item.longitude),
            latitude: Number(item.latitude),
            label: ((_a = item == null ? void 0 : item.callout) == null ? void 0 : _a.content) || "",
            avatarUrl: String((item == null ? void 0 : item.avatarUrl) || ""),
            avatarInitial: String((item == null ? void 0 : item.avatarInitial) || "游").slice(0, 1) || "游",
            statusText: String((item == null ? void 0 : item.statusText) || ((_b = item == null ? void 0 : item.callout) == null ? void 0 : _b.content) || "当前位置")
          };
        }).filter((item) => Number.isFinite(item.longitude) && Number.isFinite(item.latitude)) : [];
      }
      const __returned__ = { emit, props, hostRef, instance, get childWebview() {
        return childWebview;
      }, set childWebview(v) {
        childWebview = v;
      }, get childWebviewId() {
        return childWebviewId;
      }, set childWebviewId(v) {
        childWebviewId = v;
      }, refreshBridgeName, recenterBridgeName, refreshEventName, recenterEventName, get hostWebviewId() {
        return hostWebviewId;
      }, set hostWebviewId(v) {
        hostWebviewId = v;
      }, get syncTimer() {
        return syncTimer;
      }, set syncTimer(v) {
        syncTimer = v;
      }, get stateSyncTimer() {
        return stateSyncTimer;
      }, set stateSyncTimer(v) {
        stateSyncTimer = v;
      }, get initRetryTimer() {
        return initRetryTimer;
      }, set initRetryTimer(v) {
        initRetryTimer = v;
      }, get initRetryCount() {
        return initRetryCount;
      }, set initRetryCount(v) {
        initRetryCount = v;
      }, get hasSyncedAfterLoad() {
        return hasSyncedAfterLoad;
      }, set hasSyncedAfterLoad(v) {
        hasSyncedAfterLoad = v;
      }, get lastSyncedSnapshot() {
        return lastSyncedSnapshot;
      }, set lastSyncedSnapshot(v) {
        lastSyncedSnapshot = v;
      }, MAX_INIT_RETRIES, handleRefreshBridge, handleRecenterBridge, initChildWebview, resolveLocalMapUrl, scheduleInitRetry, resolveHostWebview, syncChildVisibility, updateBounds, getRect, getCurrentInstanceProxy, syncMapState, scheduleStateSync, syncMapStateInternal, buildSnapshot, shouldUpdateViewport, runChildCommand, extractTrackSegments, extractMarkerPoints, getCurrentInstance: vue.getCurrentInstance, nextTick: vue.nextTick, onBeforeUnmount: vue.onBeforeUnmount, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch, get AMAP_SECURITY_JS_CODE() {
        return AMAP_SECURITY_JS_CODE;
      }, get AMAP_WEB_KEY() {
        return AMAP_WEB_KEY;
      }, get hasAmapKey() {
        return hasAmapKey;
      }, get hasAmapSecurityCode() {
        return hasAmapSecurityCode;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        ref: "hostRef",
        class: "app-amap-host"
      },
      [
        vue.createElementVNode("view", { class: "app-amap-backdrop" })
      ],
      512
      /* NEED_PATCH */
    );
  }
  const AppAmapWebview = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-99faac00"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/AppAmapWebview.vue"]]);
  const _sfc_main$4 = {
    __name: "HikingMapStage",
    props: {
      mapScale: {
        type: Number,
        default: 15
      },
      mapModeKey: {
        type: String,
        default: "normal"
      },
      isOffline: {
        type: Boolean,
        default: false
      },
      offlineHint: {
        type: String,
        default: ""
      },
      overlayActive: {
        type: Boolean,
        default: false
      },
      offlinePackId: {
        type: String,
        default: ""
      }
    },
    emits: ["refresh", "recenter", "toggle-track", "zoom-in", "zoom-out"],
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const hikingStore = useHikingStore();
      const {
        isTracking: storeIsTracking,
        hasMapLocation: storeHasMapLocation,
        mapCenter: storeMapCenter,
        mapPolyline: storeMapPolyline,
        mapMarkers: storeMapMarkers
      } = storeToRefs(hikingStore);
      const amapMapCenter = vue.computed(() => convertPointToAmap(storeMapCenter.value));
      const amapMapPolyline = vue.computed(() => convertPolylineToAmap(storeMapPolyline.value));
      const amapMapMarkers = vue.computed(() => convertMarkersToAmap(storeMapMarkers.value));
      const onlineMapModeKey = vue.computed(() => "normal");
      const h5MapReady = vue.computed(() => storeHasMapLocation.value && hasAmapKey());
      const offlinePackRecord = vue.computed(() => getOfflineTilePack(props.offlinePackId));
      const offlinePackSummary = vue.computed(() => getOfflineTilePackSummary(props.offlinePackId));
      const offlinePackReady = vue.computed(() => offlinePackSummary.value.ready);
      const offlineMapModeKey = vue.computed(() => {
        var _a;
        const packMode = String(((_a = offlinePackRecord.value) == null ? void 0 : _a.mode) || "").toLowerCase();
        if (packMode === "imagery") {
          return "satellite";
        }
        if (packMode === "terrain") {
          return "terrain";
        }
        if (packMode === "vector") {
          return "normal";
        }
        return props.mapModeKey;
      });
      const appOnlineMapReady = vue.computed(() => {
        return storeHasMapLocation.value && !props.isOffline && hasAmapKey() && hasAppMapSupport();
      });
      const appOfflineMapReady = vue.computed(() => {
        if (!storeHasMapLocation.value || !hasOfflineMapSupport()) {
          return false;
        }
        if (!props.isOffline) {
          return true;
        }
        return offlinePackReady.value;
      });
      const showMapPlaceholder = vue.computed(() => !storeHasMapLocation.value || !hasRenderableMap());
      const showOnlineRefresh = vue.computed(() => h5MapReady.value);
      const mapPlaceholderTitle = vue.computed(() => {
        if (!storeHasMapLocation.value) {
          return "等待定位中";
        }
        if (props.isOffline && !offlinePackReady.value) {
          return "离线底图未准备";
        }
        return "地图暂不可用";
      });
      const mapPlaceholderDesc = vue.computed(() => {
        if (!storeHasMapLocation.value) {
          return "已接入原生 GPS 定位与徒步地图桥接，获取到位置后会显示真实地图与轨迹。";
        }
        if (props.isOffline && !offlinePackReady.value) {
          return props.offlineHint || "当前已经断网，但还没有下载离线底图，所以无法显示地图。请联网后先下载离线底图。";
        }
        return props.offlineHint || "当前地图暂时不可用，请稍后重试。";
      });
      function hasAppMapSupport() {
        return typeof plus !== "undefined" && Boolean(plus.webview);
      }
      function hasOfflineMapSupport() {
        return true;
      }
      function hasRenderableMap() {
        return appOnlineMapReady.value || appOfflineMapReady.value;
      }
      function convertPointToAmap(point) {
        const latitude = Number(point == null ? void 0 : point.latitude);
        const longitude = Number(point == null ? void 0 : point.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }
        const converted = wgs84ToGcj02(longitude, latitude);
        if (!converted) {
          return null;
        }
        return {
          ...point,
          longitude: converted.longitude,
          latitude: converted.latitude
        };
      }
      function convertPolylineToAmap(lines) {
        if (!Array.isArray(lines)) {
          return [];
        }
        return lines.map((line) => ({
          ...line,
          points: Array.isArray(line == null ? void 0 : line.points) ? line.points.map((point) => convertPointToAmap(point)).filter(Boolean) : []
        })).filter((line) => line.points.length);
      }
      function convertMarkersToAmap(markers) {
        if (!Array.isArray(markers)) {
          return [];
        }
        return markers.map((marker) => {
          const converted = convertPointToAmap(marker);
          return converted ? {
            ...marker,
            longitude: converted.longitude,
            latitude: converted.latitude
          } : null;
        }).filter(Boolean);
      }
      const __returned__ = { props, hikingStore, storeIsTracking, storeHasMapLocation, storeMapCenter, storeMapPolyline, storeMapMarkers, amapMapCenter, amapMapPolyline, amapMapMarkers, onlineMapModeKey, h5MapReady, offlinePackRecord, offlinePackSummary, offlinePackReady, offlineMapModeKey, appOnlineMapReady, appOfflineMapReady, showMapPlaceholder, showOnlineRefresh, mapPlaceholderTitle, mapPlaceholderDesc, hasAppMapSupport, hasOfflineMapSupport, hasRenderableMap, convertPointToAmap, convertPolylineToAmap, convertMarkersToAmap, computed: vue.computed, AppAmapWebview, HikingTileMapCompat, get storeToRefs() {
        return storeToRefs;
      }, get wgs84ToGcj02() {
        return wgs84ToGcj02;
      }, get getOfflineTilePack() {
        return getOfflineTilePack;
      }, get getOfflineTilePackSummary() {
        return getOfflineTilePackSummary;
      }, get hasAmapKey() {
        return hasAmapKey;
      }, get useHikingStore() {
        return useHikingStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "map-container" }, [
      $setup.appOnlineMapReady ? (vue.openBlock(), vue.createBlock($setup["AppAmapWebview"], {
        key: 0,
        class: "live-map",
        "map-center": $setup.amapMapCenter,
        "map-scale": $props.mapScale,
        "map-polyline": $setup.amapMapPolyline,
        "map-markers": $setup.amapMapMarkers,
        "map-mode-key": $setup.onlineMapModeKey,
        "overlay-active": $props.overlayActive,
        onRefresh: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("refresh")),
        onRecenter: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("recenter"))
      }, null, 8, ["map-center", "map-scale", "map-polyline", "map-markers", "map-mode-key", "overlay-active"])) : $setup.appOfflineMapReady ? (vue.openBlock(), vue.createBlock($setup["HikingTileMapCompat"], {
        key: 1,
        class: "live-map",
        "map-center": $setup.storeMapCenter,
        "map-scale": $props.mapScale,
        "map-polyline": $setup.storeMapPolyline,
        "map-markers": $setup.storeMapMarkers,
        "map-mode-key": $setup.offlineMapModeKey,
        "offline-pack-id": $props.offlinePackId
      }, null, 8, ["map-center", "map-scale", "map-polyline", "map-markers", "map-mode-key", "offline-pack-id"])) : vue.createCommentVNode("v-if", true),
      $setup.showMapPlaceholder ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "map-placeholder"
      }, [
        vue.createElementVNode("view", { class: "map-fallback-copy" }, [
          vue.createElementVNode(
            "text",
            { class: "fallback-title" },
            vue.toDisplayString($setup.mapPlaceholderTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "fallback-desc" },
            vue.toDisplayString($setup.mapPlaceholderDesc),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "zoom-group" }, [
        vue.createElementVNode("view", {
          class: "zoom-btn",
          onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("zoom-in"))
        }, [
          vue.createElementVNode("text", { class: "zoom-symbol" }, "+")
        ]),
        vue.createElementVNode("view", {
          class: "zoom-btn",
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("zoom-out"))
        }, [
          vue.createElementVNode("text", { class: "zoom-symbol" }, "-")
        ])
      ]),
      $setup.showOnlineRefresh ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "online-refresh-btn",
        onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("refresh"))
      }, [
        vue.createElementVNode("text", { class: "online-refresh-icon" }, "刷"),
        vue.createElementVNode("text", { class: "online-refresh-text" }, "刷新位置")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "map-tools" }, [
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("refresh"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, "刷"),
          vue.createElementVNode("text", { class: "text" }, "定位刷新")
        ]),
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("recenter"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, "回"),
          vue.createElementVNode("text", { class: "text" }, "回到当前")
        ]),
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("toggle-track"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, "记"),
          vue.createElementVNode(
            "text",
            { class: "text" },
            vue.toDisplayString($setup.storeIsTracking ? "停止记录" : "开始记录"),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const HikingMapStage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-bc42e741"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingMapStage.vue"]]);
  const SHORT_ON_MS = 250;
  const LONG_ON_MS = 750;
  const OFF_MS = 250;
  const LETTER_GAP_MS = 750;
  const CYCLE_GAP_MS = 2e3;
  const _sfc_main$3 = {
    __name: "HikingBottomControls",
    props: {
      isTracking: {
        type: Boolean,
        default: false
      },
      hasTrackSession: {
        type: Boolean,
        default: false
      },
      hasTrackPoints: {
        type: Boolean,
        default: false
      },
      isGuardMode: {
        type: Boolean,
        default: false
      },
      emergencyContactName: {
        type: String,
        default: "紧急联系人"
      },
      emergencyContactPhones: {
        type: Array,
        default: () => []
      },
      offlinePackActionText: {
        type: String,
        default: "下载离线底图"
      },
      offlinePackBusy: {
        type: Boolean,
        default: false
      }
    },
    emits: ["toggle-track", "toggle-guard", "sos-message", "finish-track", "clear-track", "sos-visibility-change", "offline-pack-action"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isSosFlashing = vue.ref(false);
      const isSosMenuOpen = vue.ref(false);
      const emergencySubtitle = vue.computed(() => {
        const phones = props.emergencyContactPhones.join(" / ");
        return phones ? `${props.emergencyContactName} · ${phones}` : props.emergencyContactName;
      });
      const primaryTrackActionText = vue.computed(() => {
        if (props.isTracking) {
          return "暂停";
        }
        return props.hasTrackSession ? "继续" : "开始";
      });
      const primaryTrackHintText = vue.computed(() => {
        if (props.isTracking) {
          return "点按暂停，长按结束保存";
        }
        return props.hasTrackSession ? "点按继续记录" : "点按开始记录";
      });
      let sosLoopToken = 0;
      function toggleSosMenu() {
        openNativeSosSheet();
        return;
      }
      function closeSosMenu() {
        isSosMenuOpen.value = false;
        emit("sos-visibility-change", false);
      }
      async function handleFlashlightAction() {
        await toggleSosFlash();
        closeSosMenu();
      }
      function handleSmsAction() {
        emit("sos-message");
        closeSosMenu();
      }
      function openNativeSosSheet() {
        if (typeof plus === "undefined" || !plus.nativeUI || typeof plus.nativeUI.actionSheet !== "function") {
          isSosMenuOpen.value = !isSosMenuOpen.value;
          emit("sos-visibility-change", isSosMenuOpen.value);
          return;
        }
        plus.nativeUI.actionSheet({
          title: "紧急呼救",
          cancel: "取消",
          buttons: [
            { title: isSosFlashing.value ? "停止手电筒求救" : "手电筒求救" },
            { title: "紧急短信" }
          ]
        }, async (event) => {
          const index = Number((event == null ? void 0 : event.index) || 0);
          if (index === 1) {
            await handleFlashlightAction();
            return;
          }
          if (index === 2) {
            handleSmsAction();
          }
        });
      }
      function handleClearTrack() {
        if (!props.hasTrackPoints && !props.isTracking) {
          return;
        }
        emit("clear-track");
      }
      function handleFinishLongPress() {
        if (!props.hasTrackSession) {
          return;
        }
        emit("finish-track");
      }
      async function toggleSosFlash() {
        if (isSosFlashing.value) {
          await stopSosFlash();
          return;
        }
        const ready = await prepareTorch();
        if (!ready) {
          return;
        }
        isSosFlashing.value = true;
        const token = ++sosLoopToken;
        runSosLoop(token);
      }
      async function runSosLoop(token) {
        try {
          while (isSosFlashing.value && token === sosLoopToken) {
            await playLetter([SHORT_ON_MS, SHORT_ON_MS, SHORT_ON_MS], token);
            await sleepIfActive(LETTER_GAP_MS, token);
            await playLetter([LONG_ON_MS, LONG_ON_MS, LONG_ON_MS], token);
            await sleepIfActive(LETTER_GAP_MS, token);
            await playLetter([SHORT_ON_MS, SHORT_ON_MS, SHORT_ON_MS], token);
            await sleepIfActive(CYCLE_GAP_MS, token);
          }
        } catch (error) {
          if ((error == null ? void 0 : error.message) !== "SOS stopped") {
            formatAppLog("warn", "at pages/hiking/components/HikingBottomControls.vue:242", "[hiking-sos]", (error == null ? void 0 : error.message) || error);
          }
        } finally {
          if (token === sosLoopToken) {
            isSosFlashing.value = false;
          }
          setTorchEnabled(false);
        }
      }
      async function playLetter(pattern, token) {
        for (let index = 0; index < pattern.length; index += 1) {
          await flashPulse(pattern[index], token);
        }
      }
      async function flashPulse(onDuration, token) {
        ensureActive(token);
        setTorchEnabled(true);
        await sleepIfActive(onDuration, token);
        setTorchEnabled(false);
        await sleepIfActive(OFF_MS, token);
      }
      async function stopSosFlash() {
        sosLoopToken += 1;
        isSosFlashing.value = false;
        setTorchEnabled(false);
      }
      async function prepareTorch() {
        var _a;
        if (typeof plus === "undefined" || !plus.android) {
          return false;
        }
        if (((_a = plus.os) == null ? void 0 : _a.name) !== "Android") {
          uni.showToast({
            title: "当前仅支持 Android 手电筒 SOS",
            icon: "none"
          });
          return false;
        }
        try {
          const cameraManager = getCameraManager();
          const cameraId = getPrimaryCameraId(cameraManager);
          if (!cameraManager || !cameraId) {
            uni.showToast({
              title: "未找到可用闪光灯",
              icon: "none"
            });
            return false;
          }
          return true;
        } catch (error) {
          formatAppLog("warn", "at pages/hiking/components/HikingBottomControls.vue:297", "[hiking-sos] prepare torch failed", (error == null ? void 0 : error.message) || error);
          uni.showToast({
            title: "手电筒不可用，请检查权限或摄像头占用",
            icon: "none",
            duration: 2500
          });
          return false;
        }
        return false;
      }
      function ensureActive(token) {
        if (!isSosFlashing.value || token !== sosLoopToken) {
          throw new Error("SOS stopped");
        }
      }
      async function sleepIfActive(duration, token) {
        ensureActive(token);
        await sleep(duration);
        ensureActive(token);
      }
      function sleep(duration) {
        return new Promise((resolve) => {
          setTimeout(resolve, duration);
        });
      }
      function setTorchEnabled(enabled) {
        var _a;
        if (typeof plus === "undefined" || !plus.android || ((_a = plus.os) == null ? void 0 : _a.name) !== "Android") {
          return;
        }
        try {
          const cameraManager = getCameraManager();
          const cameraId = getPrimaryCameraId(cameraManager);
          if (!cameraManager || !cameraId) {
            return;
          }
          cameraManager.setTorchMode(cameraId, Boolean(enabled));
        } catch (error) {
          formatAppLog("warn", "at pages/hiking/components/HikingBottomControls.vue:342", "[hiking-sos] set torch failed", (error == null ? void 0 : error.message) || error);
        }
      }
      function getCameraManager() {
        const main = plus.android.runtimeMainActivity();
        const Context = plus.android.importClass("android.content.Context");
        const cameraManager = main.getSystemService(Context.CAMERA_SERVICE);
        if (cameraManager) {
          plus.android.importClass(cameraManager);
        }
        return cameraManager || null;
      }
      function getPrimaryCameraId(cameraManager) {
        if (!cameraManager) {
          return "";
        }
        const cameraIds = cameraManager.getCameraIdList();
        const primaryId = cameraIds && cameraIds.length ? cameraIds[0] : "";
        return primaryId ? String(primaryId) : "";
      }
      vue.onBeforeUnmount(() => {
        closeSosMenu();
        stopSosFlash();
      });
      const __returned__ = { props, emit, SHORT_ON_MS, LONG_ON_MS, OFF_MS, LETTER_GAP_MS, CYCLE_GAP_MS, isSosFlashing, isSosMenuOpen, emergencySubtitle, primaryTrackActionText, primaryTrackHintText, get sosLoopToken() {
        return sosLoopToken;
      }, set sosLoopToken(v) {
        sosLoopToken = v;
      }, toggleSosMenu, closeSosMenu, handleFlashlightAction, handleSmsAction, openNativeSosSheet, handleClearTrack, handleFinishLongPress, toggleSosFlash, runSosLoop, playLetter, flashPulse, stopSosFlash, prepareTorch, ensureActive, sleepIfActive, sleep, setTorchEnabled, getCameraManager, getPrimaryCameraId, computed: vue.computed, onBeforeUnmount: vue.onBeforeUnmount, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bottom-controls" }, [
      $setup.isSosMenuOpen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "sos-popover-mask",
        onClick: $setup.closeSosMenu
      })) : vue.createCommentVNode("v-if", true),
      $setup.isSosMenuOpen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "sos-popover"
      }, [
        vue.createElementVNode("view", { class: "sos-popover-header" }, [
          vue.createElementVNode("text", { class: "sos-popover-title" }, "紧急呼救"),
          vue.createElementVNode(
            "text",
            { class: "sos-popover-subtitle" },
            vue.toDisplayString($setup.emergencySubtitle),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "sos-action-row" }, [
          vue.createElementVNode("view", {
            class: "sos-action-card",
            onClick: $setup.handleFlashlightAction
          }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["sos-action-icon flashlight", { active: $setup.isSosFlashing }])
              },
              [
                vue.createElementVNode("text", { class: "icon-text" }, "灯")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode("text", { class: "sos-action-title" }, "手电筒求救"),
            vue.createElementVNode(
              "text",
              { class: "sos-action-desc" },
              vue.toDisplayString($setup.isSosFlashing ? "点击停止 SOS 闪烁" : "按 SOS 摩斯密码循环闪烁"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "sos-action-card",
            onClick: $setup.handleSmsAction
          }, [
            vue.createElementVNode("view", { class: "sos-action-icon message" }, [
              vue.createElementVNode("text", { class: "icon-text" }, "信")
            ]),
            vue.createElementVNode("text", { class: "sos-action-title" }, "紧急短信"),
            vue.createElementVNode("text", { class: "sos-action-desc" }, "发送坐标、海拔与定位信息")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "handle-bar" }),
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("view", { class: "side-action" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["btn-circle sos", { "is-flashing": $setup.isSosFlashing, active: $setup.isSosMenuOpen }]),
              onClick: $setup.toggleSosMenu
            },
            [
              vue.createElementVNode("text", { class: "btn-text" }, "SOS")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("text", { class: "label" }, "SOS")
        ]),
        vue.createElementVNode("view", { class: "main-action" }, [
          vue.createElementVNode(
            "view",
            {
              class: "btn-circle start",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("toggle-track")),
              onLongpress: $setup.handleFinishLongPress
            },
            [
              vue.createElementVNode(
                "text",
                { class: "btn-text" },
                vue.toDisplayString($setup.primaryTrackActionText),
                1
                /* TEXT */
              )
            ],
            32
            /* NEED_HYDRATION */
          ),
          vue.createElementVNode(
            "text",
            { class: "main-action-tip" },
            vue.toDisplayString($setup.primaryTrackHintText),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "side-action" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["btn-circle shield", { active: $props.isGuardMode }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("toggle-guard"))
            },
            [
              vue.createElementVNode("text", { class: "icon" }, "护")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("text", { class: "label" }, "守护模式")
        ])
      ]),
      vue.createElementVNode("view", { class: "secondary-actions" }, [
        vue.createElementVNode("view", { class: "secondary-actions-row" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["secondary-btn", { disabled: !$props.hasTrackPoints && !$props.isTracking }]),
              onClick: $setup.handleClearTrack
            },
            " 清空当前轨迹 ",
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["secondary-btn", { disabled: $props.offlinePackBusy }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.emit("offline-pack-action"))
            },
            vue.toDisplayString($props.offlinePackActionText),
            3
            /* TEXT, CLASS */
          )
        ])
      ])
    ]);
  }
  const HikingBottomControls = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-b1d0f949"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingBottomControls.vue"]]);
  const DEFAULT_DISTANCE_LIMIT_METERS = 40;
  const DEFAULT_STATIONARY_MINUTES = 25;
  const SUNSET_STATIONARY_MINUTES = 15;
  const MAX_STALE_MINUTES = 8;
  function evaluateStationaryRisk(options = {}) {
    const {
      isGuardMode = false,
      isTracking = false,
      trackPoints = [],
      currentLocation = null,
      now: now2 = Date.now(),
      minutesToSunset = Infinity,
      cooldownUntil = 0,
      lastConfirmedAt = 0
    } = options;
    if (!isGuardMode || !isTracking) {
      return buildIdleResult();
    }
    const normalizedCurrent = normalizeLocation(currentLocation);
    if (!normalizedCurrent) {
      return buildIdleResult();
    }
    const currentTime = Number(now2) || Date.now();
    if (currentTime < Number(cooldownUntil || 0)) {
      return buildIdleResult({ thresholdMinutes: getStationaryThresholdMinutes(minutesToSunset) });
    }
    const thresholdMinutes = getStationaryThresholdMinutes(minutesToSunset);
    const staleMinutes = (currentTime - Number(normalizedCurrent.timestamp || 0)) / 6e4;
    if (!Number.isFinite(staleMinutes) || staleMinutes > MAX_STALE_MINUTES) {
      return buildIdleResult({ thresholdMinutes });
    }
    const points = collectRecentPoints(trackPoints, normalizedCurrent, currentTime, thresholdMinutes);
    if (points.length < 2) {
      return buildIdleResult({ thresholdMinutes });
    }
    const firstTimestamp = Number(points[0].timestamp || 0);
    const observedMinutes = Math.floor((currentTime - firstTimestamp) / 6e4);
    if (observedMinutes < thresholdMinutes) {
      return buildIdleResult({ thresholdMinutes, observedMinutes });
    }
    const lastConfirmed = Number(lastConfirmedAt || 0);
    if (lastConfirmed && currentTime - lastConfirmed < thresholdMinutes * 6e4) {
      return buildIdleResult({ thresholdMinutes, observedMinutes });
    }
    const distanceMeters = Math.round(sumDistanceMeters(points));
    const isActive = distanceMeters < DEFAULT_DISTANCE_LIMIT_METERS;
    return {
      active: isActive,
      observedMinutes,
      thresholdMinutes,
      distanceMeters,
      level: isActive ? thresholdMinutes <= SUNSET_STATIONARY_MINUTES ? "danger" : "warning" : "safe"
    };
  }
  function formatStationaryStatus(risk) {
    if (!(risk == null ? void 0 : risk.active)) {
      return "守护中";
    }
    return `已停留 ${risk.observedMinutes} 分钟`;
  }
  function collectRecentPoints(trackPoints, currentLocation, currentTime, thresholdMinutes) {
    const cutoff = currentTime - thresholdMinutes * 6e4;
    const combined = [...Array.isArray(trackPoints) ? trackPoints : [], currentLocation].map(normalizeLocation).filter(Boolean).filter((item) => Number(item.timestamp || 0) >= cutoff).sort((left, right) => Number(left.timestamp || 0) - Number(right.timestamp || 0));
    const unique = [];
    const seen = /* @__PURE__ */ new Set();
    combined.forEach((item) => {
      const key = `${item.timestamp}-${item.latitude.toFixed(6)}-${item.longitude.toFixed(6)}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      unique.push(item);
    });
    return unique;
  }
  function sumDistanceMeters(points) {
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      total += getDistanceKm(points[index - 1], points[index]) * 1e3;
    }
    return total;
  }
  function getStationaryThresholdMinutes(minutesToSunset) {
    const value = Number(minutesToSunset);
    if (Number.isFinite(value) && value <= 120) {
      return SUNSET_STATIONARY_MINUTES;
    }
    return DEFAULT_STATIONARY_MINUTES;
  }
  function buildIdleResult(extra = {}) {
    return {
      active: false,
      observedMinutes: 0,
      thresholdMinutes: DEFAULT_STATIONARY_MINUTES,
      distanceMeters: 0,
      level: "safe",
      ...extra
    };
  }
  const hikingModeMock = {
    route: {
      title: "乌孙古道轻装徒步",
      status: "进行中",
      offlineReady: true,
      gpsReady: true,
      locationName: "冰川观景垭口南侧 400m",
      duration: "05:18:42",
      distance: "12.8",
      pace: "24′52″",
      ascent: "986",
      calories: "742",
      steps: "18,420",
      heartRate: "118",
      batteryMode: "省电追踪",
      compass: "东北 48°",
      altitude: "3248",
      accuracy: "±4m",
      speed: "1.9 km/h",
      coords: {
        latitude: 43.825419,
        longitude: 86.947216
      },
      mapBounds: {
        north: 43.8272,
        south: 43.8172,
        east: 86.9495,
        west: 86.9318
      },
      offlineMapId: "hiking-demo-route",
      polyline: [
        {
          points: [
            { latitude: 43.8178, longitude: 86.9326 },
            { latitude: 43.8191, longitude: 86.9358 },
            { latitude: 43.8215, longitude: 86.9397 },
            { latitude: 43.8228, longitude: 86.9424 },
            { latitude: 43.8243, longitude: 86.9456 },
            { latitude: 43.825419, longitude: 86.947216 }
          ],
          color: "#FFFFFF",
          width: 6,
          dottedLine: false,
          arrowLine: true,
          borderColor: "#444444",
          borderWidth: 2
        },
        {
          points: [
            { latitude: 43.825419, longitude: 86.947216 },
            { latitude: 43.8237, longitude: 86.9447 },
            { latitude: 43.8216, longitude: 86.9408 }
          ],
          color: "#555555",
          width: 5,
          dottedLine: true,
          arrowLine: true
        }
      ]
    },
    emergency: {
      primaryName: "李晨",
      primaryPhone: "13800002468",
      backupPhone: "09917654321",
      smsText: "我正在徒步中，可能遇到危险，请根据我发送的坐标、海拔和最近轨迹点尽快联系我。"
    },
    offlinePack: {
      title: "乌孙古道离线路线包 v3",
      status: "已下载",
      size: "128MB",
      updatedAt: "今天 06:40",
      coverage: "起点营地 - 垭口 - 河谷备选营地",
      gpsNote: "无网络时继续使用手机 GPS 定位，并在离线底图上显示当前位置与返程轨迹。"
    },
    aiAssessment: {
      camp: {
        title: "推荐露营",
        name: "云杉背风台地",
        desc: "地势平整、背风、远离碎石带，距补水点约 180 米，适合短暂停留。"
      },
      risk: {
        title: "危险停留区",
        name: "碎石坡南侧沟槽",
        desc: "午后滚石和积水汇流风险高，不建议扎营或长时间停留。"
      }
    }
  };
  const ZENITH_DEGREES = 90.833;
  function getSunsetInfo(location2, now2 = /* @__PURE__ */ new Date()) {
    const latitude = Number(location2 == null ? void 0 : location2.latitude);
    const longitude = Number(location2 == null ? void 0 : location2.longitude);
    const currentDate = now2 instanceof Date ? now2 : new Date(now2);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Number.isNaN(currentDate.getTime())) {
      return null;
    }
    const dayOfYear = getDayOfYear(currentDate);
    const timezoneOffsetMinutes = -currentDate.getTimezoneOffset();
    const gamma = 2 * Math.PI / 365 * (dayOfYear - 1);
    const equationOfTime = 229.18 * (75e-6 + 1868e-6 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
    const solarDeclination = 6918e-6 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 6758e-6 * Math.cos(2 * gamma) + 907e-6 * Math.sin(2 * gamma) - 2697e-6 * Math.cos(3 * gamma) + 148e-5 * Math.sin(3 * gamma);
    const latitudeRad = latitude * Math.PI / 180;
    const zenithRad = ZENITH_DEGREES * Math.PI / 180;
    const hourAngleCos = Math.cos(zenithRad) / (Math.cos(latitudeRad) * Math.cos(solarDeclination)) - Math.tan(latitudeRad) * Math.tan(solarDeclination);
    if (hourAngleCos < -1 || hourAngleCos > 1) {
      return null;
    }
    const hourAngle = Math.acos(hourAngleCos);
    const solarNoonMinutes = 720 - 4 * longitude - equationOfTime + timezoneOffsetMinutes;
    const sunsetMinutes = solarNoonMinutes + hourAngle * 180 / Math.PI * 4;
    const sunsetAt = new Date(currentDate);
    sunsetAt.setHours(0, 0, 0, 0);
    sunsetAt.setMinutes(Math.round(sunsetMinutes));
    const minutesToSunset = Math.round((sunsetAt.getTime() - currentDate.getTime()) / 6e4);
    return {
      sunsetAt,
      minutesToSunset,
      countdownText: formatSunsetCountdown(minutesToSunset),
      localDateKey: formatLocalDateKey(currentDate)
    };
  }
  function formatSunsetTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  function formatSunsetCountdown(minutesToSunset) {
    const minutes = Math.round(Number(minutesToSunset));
    if (!Number.isFinite(minutes)) {
      return "";
    }
    if (minutes < 0) {
      const passedMinutes = Math.abs(minutes);
      const hours2 = Math.floor(passedMinutes / 60);
      const remainMinutes2 = passedMinutes % 60;
      if (hours2 > 0) {
        return `已过日落 ${hours2}小时${remainMinutes2}分`;
      }
      return `已过日落 ${remainMinutes2}分`;
    }
    const hours = Math.floor(minutes / 60);
    const remainMinutes = minutes % 60;
    if (hours > 0) {
      return `距日落还有 ${hours}小时${remainMinutes}分`;
    }
    return `距日落还有 ${remainMinutes}分`;
  }
  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / 864e5);
  }
  function formatLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const listeners = /* @__PURE__ */ new Set();
  let isListening = false;
  let compassBound = false;
  let lastHeading = null;
  let stopFallbackWatch = null;
  function startCompass() {
    if (isListening) {
      return Promise.resolve();
    }
    bindCompassListener();
    return startUniCompass().then((started) => {
      if (started) {
        isListening = true;
        return true;
      }
      const fallbackStarted = startPlusCompassFallback();
      isListening = fallbackStarted;
      return fallbackStarted;
    });
  }
  function stopCompass() {
    if (!isListening) {
      return Promise.resolve();
    }
    isListening = false;
    if (typeof stopFallbackWatch === "function") {
      stopFallbackWatch();
      stopFallbackWatch = null;
    }
    return new Promise((resolve) => {
      if (typeof uni.stopCompass !== "function") {
        resolve();
        return;
      }
      uni.stopCompass({ complete: resolve });
    });
  }
  function subscribeCompass(callback) {
    if (typeof callback !== "function") {
      return () => {
      };
    }
    listeners.add(callback);
    if (Number.isFinite(lastHeading)) {
      callback({ heading: lastHeading, text: formatCompassHeading(lastHeading), source: "sensor" });
    }
    return () => {
      listeners.delete(callback);
    };
  }
  function formatCompassHeading(value) {
    const heading = normalizeHeading(value);
    if (!Number.isFinite(heading)) {
      return "方向校准中";
    }
    const segments = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
    const index = Math.round(heading / 45) % segments.length;
    return `${segments[index]} ${Math.round(heading)}°`;
  }
  function bindCompassListener() {
    if (compassBound || typeof uni.onCompassChange !== "function") {
      return;
    }
    uni.onCompassChange((event) => {
      emitHeading(normalizeHeading(event == null ? void 0 : event.direction), "sensor");
    });
    compassBound = true;
  }
  function startUniCompass() {
    return new Promise((resolve) => {
      if (typeof uni.startCompass !== "function") {
        resolve(false);
        return;
      }
      uni.startCompass({
        success: () => resolve(true),
        fail: () => resolve(false)
      });
    });
  }
  function startPlusCompassFallback() {
    if (typeof plus === "undefined" || !plus.orientation || typeof plus.orientation.watchOrientation !== "function") {
      return false;
    }
    try {
      const watchId = plus.orientation.watchOrientation((event) => {
        const nextHeading = normalizeHeading(
          (event == null ? void 0 : event.magneticHeading) ?? (event == null ? void 0 : event.trueHeading) ?? (event == null ? void 0 : event.heading) ?? (event == null ? void 0 : event.direction) ?? (event == null ? void 0 : event.alpha)
        );
        emitHeading(nextHeading, "plus.orientation");
      }, () => {
      }, {
        frequency: 200
      });
      stopFallbackWatch = () => {
        try {
          plus.orientation.clearWatch(watchId);
        } catch (error) {
        }
      };
      return true;
    } catch (error) {
      stopFallbackWatch = null;
      return false;
    }
    return false;
  }
  function emitHeading(nextHeading, source) {
    if (!Number.isFinite(nextHeading)) {
      return;
    }
    if (Number.isFinite(lastHeading) && getHeadingDelta(lastHeading, nextHeading) < 2) {
      return;
    }
    lastHeading = nextHeading;
    const payload = {
      heading: nextHeading,
      text: formatCompassHeading(nextHeading),
      source
    };
    listeners.forEach((listener) => listener(payload));
  }
  function normalizeHeading(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return NaN;
    }
    const normalized = (numeric % 360 + 360) % 360;
    return normalized;
  }
  function getHeadingDelta(previous, next) {
    const direct = Math.abs(next - previous);
    return Math.min(direct, 360 - direct);
  }
  const MIN_MAP_SCALE = 12;
  const MAX_MAP_SCALE = 18;
  const RECENTER_MAP_SCALE = 16;
  const _sfc_main$2 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const MAP_MODES = [
        { key: "normal", label: "高德标准图" }
      ];
      const hikingStore = useHikingStore();
      const {
        isTracking,
        hasTrackInProgress,
        currentLocation,
        trackPoints,
        locationError,
        trackSyncText,
        trackSyncTone
      } = storeToRefs(hikingStore);
      const isGuardMode = vue.ref(false);
      const isSosMenuOpen = vue.ref(false);
      const mapScale = vue.ref(15);
      const currentMapMode = vue.ref(MAP_MODES[0].key);
      const networkOnline = vue.ref(true);
      const nowTick = vue.ref(Date.now());
      const lastGuardPromptAt = vue.ref(0);
      const guardCooldownUntil = vue.ref(0);
      const lastGuardSafeAt = vue.ref(0);
      const lastSunsetWarningLevel = vue.ref(0);
      const lastSunsetWarningDate = vue.ref("");
      let sunsetTimer = null;
      let removeCompassListener = null;
      let hasPromptedLocationSettings = false;
      const offlinePackId = DEFAULT_HIKING_TILE_PACK_ID;
      const compassHeading = vue.ref(NaN);
      const offlinePackRecord = vue.ref(getOfflineTilePack(offlinePackId));
      const offlinePackBusy = vue.ref(false);
      const offlinePackProgress = vue.ref(0);
      const coordinateText = vue.computed(() => {
        if (!currentLocation.value) {
          return locationError.value || "等待定位";
        }
        return `${formatCoordinate(currentLocation.value.latitude, "lat")}, ${formatCoordinate(currentLocation.value.longitude, "lng")}`;
      });
      const gpsStatusText = vue.computed(() => {
        if (isOffline.value && currentLocation.value) {
          return isTracking.value ? "离线 GPS 记录中" : "离线 GPS 可用";
        }
        if (currentLocation.value) {
          const provider = String(currentLocation.value.provider || "").toLowerCase();
          if (provider === "gps") {
            return isTracking.value ? "GPS 记录中" : "GPS 已连接";
          }
          if (provider === "network") {
            return isTracking.value ? "网络定位记录中" : "网络定位已连接";
          }
          return isTracking.value ? "定位记录中" : "定位已连接";
        }
        return locationError.value || "GPS 连接中";
      });
      const altitudeText = vue.computed(() => {
        var _a;
        return formatMetric((_a = currentLocation.value) == null ? void 0 : _a.altitude, 0);
      });
      const accuracyText = vue.computed(() => {
        var _a;
        return formatMetric((_a = currentLocation.value) == null ? void 0 : _a.accuracy, 0);
      });
      const isOffline = vue.computed(() => !networkOnline.value);
      const distanceText = vue.computed(() => sumTrackDistanceKm(trackPoints.value).toFixed(2));
      const compassText = vue.computed(() => {
        var _a;
        if (Number.isFinite(compassHeading.value)) {
          return formatCompassHeading(compassHeading.value);
        }
        const bearing = Number(((_a = currentLocation.value) == null ? void 0 : _a.bearing) || 0);
        return bearing > 0 ? `${formatCompassHeading(bearing)} · 行进方向` : "方向校准中";
      });
      const mapModeLabel = vue.computed(() => {
        var _a;
        return ((_a = MAP_MODES.find((item) => item.key === currentMapMode.value)) == null ? void 0 : _a.label) || "标准地图";
      });
      const headerModeText = vue.computed(() => `${isOffline.value ? "离线" : "在线"} · ${mapModeLabel.value}`);
      const sunsetInfo = vue.computed(() => getSunsetInfo(currentLocation.value, new Date(nowTick.value)));
      const sunsetCountdownText = vue.computed(() => {
        var _a;
        return ((_a = sunsetInfo.value) == null ? void 0 : _a.countdownText) || "";
      });
      const sunsetTimeText = vue.computed(() => {
        var _a;
        return formatSunsetTime((_a = sunsetInfo.value) == null ? void 0 : _a.sunsetAt);
      });
      const sunsetRiskLevel = vue.computed(() => {
        var _a;
        const minutes = Number((_a = sunsetInfo.value) == null ? void 0 : _a.minutesToSunset);
        if (!Number.isFinite(minutes)) {
          return "safe";
        }
        if (minutes <= 0) {
          return "passed";
        }
        if (minutes <= 60) {
          return "danger";
        }
        if (minutes <= 120) {
          return "warning";
        }
        return "safe";
      });
      const stationaryRisk = vue.computed(() => {
        var _a;
        return evaluateStationaryRisk({
          isGuardMode: isGuardMode.value,
          isTracking: isTracking.value,
          trackPoints: trackPoints.value,
          currentLocation: currentLocation.value,
          now: nowTick.value,
          minutesToSunset: (_a = sunsetInfo.value) == null ? void 0 : _a.minutesToSunset,
          cooldownUntil: guardCooldownUntil.value,
          lastConfirmedAt: lastGuardSafeAt.value
        });
      });
      const guardStatusText = vue.computed(() => {
        if (!isGuardMode.value) {
          return "";
        }
        if (stationaryRisk.value.active) {
          return `${formatStationaryStatus(stationaryRisk.value)}，请确认状态`;
        }
        return "守护中";
      });
      const guardStatusLevel = vue.computed(() => {
        if (!isGuardMode.value) {
          return "safe";
        }
        if (stationaryRisk.value.level === "danger") {
          return "danger";
        }
        if (stationaryRisk.value.level === "warning") {
          return "warning";
        }
        return "safe";
      });
      const emergencyContactName = vue.computed(() => {
        var _a;
        return ((_a = hikingModeMock.emergency) == null ? void 0 : _a.primaryName) || "紧急联系人";
      });
      const emergencyContactPhones = vue.computed(() => {
        const emergency = hikingModeMock.emergency || {};
        return [emergency.primaryPhone, emergency.backupPhone].filter(Boolean);
      });
      const offlineHint = vue.computed(() => {
        var _a;
        const packReady = ((_a = offlinePackRecord.value) == null ? void 0 : _a.status) === "ready";
        if (isOffline.value) {
          return packReady ? "当前优先读取已下载的离线瓦片包，断网后仍可继续查看路线与当前位置。" : "离线时仍可继续使用 GPS 定位，但未下载离线瓦片包时底图可能无法显示。";
        }
        return packReady ? "当前使用高德标准地图；断网后可自动切换到本地离线瓦片包。" : "当前使用高德标准地图显示徒步位置与轨迹。";
      });
      const offlinePackActionText = vue.computed(() => {
        if (offlinePackBusy.value) {
          const progress = Math.round(Number(offlinePackProgress.value || 0));
          return progress > 0 ? `下载离线底图 ${progress}%` : "准备离线底图...";
        }
        const pack = offlinePackRecord.value;
        return (pack == null ? void 0 : pack.status) === "ready" ? "管理离线底图" : "下载离线底图";
      });
      function resolveOfflineDownloadMode() {
        if (currentMapMode.value === "terrain") {
          return "terrain";
        }
        if (currentMapMode.value === "normal") {
          return "vector";
        }
        return "imagery";
      }
      onLoad(async () => {
        hikingStore.hydrate();
        hikingStore.loadSavedTracks().catch(() => {
        });
        syncOfflinePackState();
        bindCompassState();
        bindNetworkState();
        startSunsetTimer();
        if (!currentLocation.value) {
          await refreshLocation();
        }
      });
      vue.watch(
        () => {
          var _a, _b;
          return [((_a = sunsetInfo.value) == null ? void 0 : _a.localDateKey) || "", ((_b = sunsetInfo.value) == null ? void 0 : _b.minutesToSunset) ?? null];
        },
        ([dateKey, minutes]) => {
          if (!dateKey) {
            lastSunsetWarningLevel.value = 0;
            lastSunsetWarningDate.value = "";
            return;
          }
          if (dateKey !== lastSunsetWarningDate.value) {
            lastSunsetWarningDate.value = dateKey;
            lastSunsetWarningLevel.value = 0;
          }
          const nextLevel = getSunsetWarningLevel(minutes);
          if (!nextLevel || nextLevel <= lastSunsetWarningLevel.value) {
            return;
          }
          lastSunsetWarningLevel.value = nextLevel;
          showSunsetWarning(nextLevel, minutes);
        },
        { immediate: true }
      );
      vue.watch(
        () => [stationaryRisk.value.active, stationaryRisk.value.observedMinutes, isGuardMode.value],
        ([active, observedMinutes, guardEnabled]) => {
          if (!guardEnabled || !active) {
            return;
          }
          const currentTime = nowTick.value;
          if (currentTime - Number(lastGuardPromptAt.value || 0) < 10 * 6e4) {
            return;
          }
          lastGuardPromptAt.value = currentTime;
          uni.showModal({
            title: "守护提醒",
            content: `你已连续停留约 ${observedMinutes} 分钟。若只是休息，请点“我安全”；若感觉不适或迷路，请尽快使用 SOS 求助。`,
            confirmText: "我安全",
            cancelText: "稍后提醒",
            success: ({ confirm }) => {
              if (confirm) {
                acknowledgeGuardSafe(20);
                uni.showToast({
                  title: "已继续守护",
                  icon: "none"
                });
                return;
              }
              guardCooldownUntil.value = Date.now() + 10 * 6e4;
            },
            fail: () => {
              guardCooldownUntil.value = Date.now() + 10 * 6e4;
            }
          });
        }
      );
      onUnload(() => {
        cleanup();
      });
      vue.onBeforeUnmount(() => {
        cleanup();
      });
      function bindNetworkState() {
        if (typeof uni.getNetworkType === "function") {
          uni.getNetworkType({
            success: ({ networkType }) => {
              networkOnline.value = networkType !== "none";
            }
          });
        }
        if (typeof uni.onNetworkStatusChange === "function") {
          uni.onNetworkStatusChange(({ isConnected }) => {
            networkOnline.value = Boolean(isConnected);
          });
        }
      }
      async function refreshLocation() {
        try {
          await hikingStore.refreshLocation({
            preferGpsWhenOffline: isOffline.value,
            appendWhenTracking: isTracking.value
          });
        } catch (error) {
          locationError.value = (error == null ? void 0 : error.message) || "定位失败";
          maybePromptLocationSettings(locationError.value);
        }
      }
      async function handleStart() {
        try {
          if (isTracking.value) {
            await hikingStore.stopTracking();
            uni.showToast({
              title: "已暂停记录",
              icon: "none"
            });
          } else {
            const resumeTrack = hasTrackInProgress.value;
            await hikingStore.startTracking();
            await refreshLocation();
            uni.showToast({
              title: resumeTrack ? "继续记录" : "开始记录",
              icon: "none"
            });
          }
        } catch (error) {
          uni.showToast({
            title: (error == null ? void 0 : error.message) || "追踪切换失败",
            icon: "none",
            duration: 2500
          });
        }
      }
      async function handleFinishTrack() {
        if (!hasTrackInProgress.value || trackPoints.value.length < 2) {
          uni.showToast({
            title: "至少记录两个有效点后再结束",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "结束并保存轨迹",
          content: isTracking.value ? "结束后会停止本次记录，并把分段轨迹保存到发布页可选列表。" : "会把当前暂停中的分段轨迹保存到发布页可选列表。",
          confirmText: "结束保存",
          cancelText: "继续记录",
          success: async ({ confirm }) => {
            var _a;
            if (!confirm) {
              return;
            }
            try {
              const savedTrack = await hikingStore.finishTracking();
              const pointCount = Number((savedTrack == null ? void 0 : savedTrack.pointCount) || ((_a = savedTrack == null ? void 0 : savedTrack.points) == null ? void 0 : _a.length) || 0);
              uni.showToast({
                title: pointCount ? `已保存 ${pointCount} 个点` : "轨迹已保存",
                icon: "none",
                duration: 2200
              });
            } catch (error) {
              uni.showToast({
                title: (error == null ? void 0 : error.message) || "结束保存失败",
                icon: "none",
                duration: 2500
              });
            }
          }
        });
      }
      function handleClearTrack() {
        if (!trackPoints.value.length && !isTracking.value) {
          uni.showToast({
            title: "当前没有可清空的轨迹",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "清空当前轨迹",
          content: isTracking.value ? "清空后会停止本次记录，未保存的轨迹里程将被清除。" : "会清除当前未保存的轨迹和里程显示，已保存轨迹不受影响。",
          confirmText: "清空",
          cancelText: "取消",
          success: async ({ confirm }) => {
            if (!confirm) {
              return;
            }
            try {
              await hikingStore.clearCurrentTrack();
              uni.showToast({
                title: "当前轨迹已清空",
                icon: "none"
              });
            } catch (error) {
              uni.showToast({
                title: (error == null ? void 0 : error.message) || "清空失败",
                icon: "none",
                duration: 2500
              });
            }
          }
        });
      }
      async function recenterMap() {
        mapScale.value = RECENTER_MAP_SCALE;
        await refreshLocation();
        uni.showToast({
          title: "已回到当前位置",
          icon: "none"
        });
      }
      function zoomInMap() {
        const nextScale = clampMapScale(mapScale.value + 1);
        if (nextScale === mapScale.value) {
          uni.showToast({
            title: "已经放到最大了",
            icon: "none"
          });
          return;
        }
        mapScale.value = nextScale;
      }
      function zoomOutMap() {
        const nextScale = clampMapScale(mapScale.value - 1);
        if (nextScale === mapScale.value) {
          uni.showToast({
            title: "已经缩到最小了",
            icon: "none"
          });
          return;
        }
        mapScale.value = nextScale;
      }
      function clampMapScale(value) {
        const scale = Number(value) || RECENTER_MAP_SCALE;
        return Math.max(MIN_MAP_SCALE, Math.min(MAX_MAP_SCALE, Math.round(scale)));
      }
      function handleEmergencySms() {
        var _a;
        const phones = emergencyContactPhones.value;
        if (!phones.length) {
          uni.showToast({
            title: "未配置紧急联系人",
            icon: "none"
          });
          return;
        }
        if (!currentLocation.value) {
          uni.showToast({
            title: "请先等待定位成功",
            icon: "none"
          });
          return;
        }
        const body = buildEmergencySmsBody(currentLocation.value);
        try {
          if (typeof plus === "undefined" || !plus.android || ((_a = plus.os) == null ? void 0 : _a.name) !== "Android") {
            throw new Error("仅支持 Android 紧急短信");
          }
          const main = plus.android.runtimeMainActivity();
          const Intent = plus.android.importClass("android.content.Intent");
          const Uri = plus.android.importClass("android.net.Uri");
          const intent = new Intent(Intent.ACTION_SENDTO);
          intent.setData(Uri.parse(`smsto:${phones.join(";")}`));
          intent.putExtra("sms_body", body);
          main.startActivity(intent);
          uni.showToast({
            title: "已打开短信发送界面",
            icon: "none"
          });
          return;
        } catch (error) {
          uni.showModal({
            title: "无法直接打开短信",
            content: body,
            confirmText: "知道了",
            showCancel: false
          });
          return;
        }
        uni.showModal({
          title: "紧急短信内容",
          content: body,
          confirmText: "知道了",
          showCancel: false
        });
      }
      function handleSosVisibilityChange(value) {
        isSosMenuOpen.value = Boolean(value);
      }
      function toggleGuard() {
        isGuardMode.value = !isGuardMode.value;
        if (isGuardMode.value) {
          acknowledgeGuardSafe(5);
        }
        uni.showToast({
          title: isGuardMode.value ? "守护模式已开启" : "守护模式已关闭",
          icon: "none"
        });
      }
      function cleanup() {
        if (sunsetTimer) {
          clearInterval(sunsetTimer);
          sunsetTimer = null;
        }
        if (removeCompassListener) {
          removeCompassListener();
          removeCompassListener = null;
        }
        stopCompass().catch(() => {
        });
      }
      function bindCompassState() {
        if (!removeCompassListener) {
          removeCompassListener = subscribeCompass((payload) => {
            compassHeading.value = Number(payload == null ? void 0 : payload.heading);
          });
        }
        startCompass().catch(() => {
        });
      }
      function syncOfflinePackState() {
        var _a;
        offlinePackRecord.value = getOfflineTilePack(offlinePackId);
        if (!offlinePackBusy.value) {
          offlinePackProgress.value = Number(((_a = offlinePackRecord.value) == null ? void 0 : _a.progress) || 0);
        }
      }
      async function handleOfflinePackAction() {
        var _a;
        if (offlinePackBusy.value) {
          return;
        }
        syncOfflinePackState();
        if (((_a = offlinePackRecord.value) == null ? void 0 : _a.status) === "ready") {
          openOfflinePackManager();
          return;
        }
        await startOfflinePackDownload();
      }
      function openOfflinePackManager() {
        const pack = offlinePackRecord.value;
        const sizeText = Number(pack == null ? void 0 : pack.sizeBytes) > 0 ? `，约 ${formatPackSize(pack.sizeBytes)}` : "";
        uni.showActionSheet({
          itemList: [`重新下载离线底图${sizeText}`, "删除离线底图"],
          success: async ({ tapIndex }) => {
            if (tapIndex === 0) {
              await startOfflinePackDownload(true);
            }
            if (tapIndex === 1) {
              await confirmDeleteOfflinePack();
            }
          }
        });
      }
      async function startOfflinePackDownload(force = false) {
        var _a;
        if (!currentLocation.value && !trackPoints.value.length) {
          uni.showToast({ title: "请先等待定位成功", icon: "none" });
          return;
        }
        offlinePackBusy.value = true;
        offlinePackProgress.value = 0;
        try {
          if (force && ((_a = offlinePackRecord.value) == null ? void 0 : _a.status) === "ready") {
            await deleteOfflineTilePack(offlinePackId);
          }
          const plan = buildHikingTilePackPlan({
            packId: offlinePackId,
            name: "徒步当前区域离线底图",
            points: trackPoints.value,
            center: currentLocation.value,
            minZoom: 12,
            maxZoom: 16,
            mode: resolveOfflineDownloadMode(),
            paddingKm: 2.2
          });
          await downloadOfflineTilePack(plan, {
            concurrency: 4,
            onProgress: ({ progress }) => {
              offlinePackProgress.value = progress;
            }
          });
          syncOfflinePackState();
          uni.showToast({ title: "离线底图已下载", icon: "none" });
        } catch (error) {
          syncOfflinePackState();
          uni.showModal({
            title: "下载失败",
            content: (error == null ? void 0 : error.message) || "离线底图下载失败，请稍后重试。",
            showCancel: false
          });
        } finally {
          offlinePackBusy.value = false;
        }
      }
      function confirmDeleteOfflinePack() {
        uni.showModal({
          title: "删除离线底图",
          content: "确认删除当前徒步区域离线底图吗？删除后断网将无法显示本地瓦片。",
          success: async ({ confirm }) => {
            if (!confirm) {
              return;
            }
            try {
              await deleteOfflineTilePack(offlinePackId);
              syncOfflinePackState();
              uni.showToast({ title: "已删除离线底图", icon: "none" });
            } catch (error) {
              uni.showToast({
                title: (error == null ? void 0 : error.message) || "删除失败",
                icon: "none",
                duration: 2500
              });
            }
          }
        });
      }
      function formatPackSize(bytes) {
        const size = Number(bytes || 0);
        if (size >= 1024 * 1024) {
          return `${(size / (1024 * 1024)).toFixed(1)}MB`;
        }
        if (size >= 1024) {
          return `${Math.round(size / 1024)}KB`;
        }
        return `${size}B`;
      }
      function startSunsetTimer() {
        nowTick.value = Date.now();
        if (sunsetTimer) {
          clearInterval(sunsetTimer);
        }
        sunsetTimer = setInterval(() => {
          nowTick.value = Date.now();
        }, 6e4);
      }
      function acknowledgeGuardSafe(cooldownMinutes = 20) {
        const currentTime = Date.now();
        lastGuardSafeAt.value = currentTime;
        guardCooldownUntil.value = currentTime + cooldownMinutes * 6e4;
      }
      function maybePromptLocationSettings(message) {
        if (hasPromptedLocationSettings || !/定位权限未开启/.test(String(message || ""))) {
          return;
        }
        hasPromptedLocationSettings = true;
        uni.showModal({
          title: "需要定位权限",
          content: "徒步页面需要定位权限才能记录轨迹。是否现在前往系统设置开启？",
          confirmText: "去开启",
          cancelText: "稍后",
          success: ({ confirm }) => {
            if (confirm && !openAppPermissionSettings()) {
              uni.showToast({
                title: "请在系统设置中手动开启定位权限",
                icon: "none",
                duration: 2500
              });
            }
          }
        });
      }
      function getSunsetWarningLevel(minutes) {
        const value = Number(minutes);
        if (!Number.isFinite(value)) {
          return 0;
        }
        if (value <= 0) {
          return 3;
        }
        if (value <= 60) {
          return 2;
        }
        if (value <= 120) {
          return 1;
        }
        return 0;
      }
      function showSunsetWarning(level, minutes) {
        if (!currentLocation.value) {
          return;
        }
        const countdown = sunsetCountdownText.value || "日落临近";
        if (level === 1) {
          uni.showModal({
            title: "日落提醒",
            content: `${countdown}。天黑后风险会明显上升，请尽快评估是否原路下撤，避免继续深入。`,
            confirmText: "知道了",
            showCancel: false
          });
          return;
        }
        if (level === 2) {
          uni.showModal({
            title: "尽快下撤",
            content: `${countdown}。现在已接近日落，建议立即停止继续深入，优先下撤或寻找安全停留点。`,
            confirmText: "收到",
            showCancel: false
          });
          return;
        }
        if (level === 3 && Number(minutes) > -30) {
          uni.showModal({
            title: "已过日落",
            content: `${countdown}。请立即结束继续行进，优先确保视线、保暖和安全停留条件。`,
            confirmText: "知道了",
            showCancel: false
          });
        }
      }
      function buildEmergencySmsBody(location2) {
        var _a;
        const latitude = Number(location2 == null ? void 0 : location2.latitude);
        const longitude = Number(location2 == null ? void 0 : location2.longitude);
        const altitude = Number(location2 == null ? void 0 : location2.altitude);
        const accuracy = Number(location2 == null ? void 0 : location2.accuracy);
        const provider = (location2 == null ? void 0 : location2.provider) || "unknown";
        const coordText = `${formatCoordinate(latitude, "lat")}, ${formatCoordinate(longitude, "lng")}`;
        const altitudeValue = Number.isFinite(altitude) && altitude > 0 ? `${Math.round(altitude)}m` : "未知";
        const accuracyValue = Number.isFinite(accuracy) && accuracy > 0 ? `${Math.round(accuracy)}m` : "未知";
        const emergencyText = ((_a = hikingModeMock.emergency) == null ? void 0 : _a.smsText) || "我正在徒步中，可能遇到危险，请尽快联系我。";
        return [
          "【丝路疆寻 徒步 SOS】",
          emergencyText,
          `坐标：${coordText}`,
          `海拔：${altitudeValue}`,
          `精度：${accuracyValue}`,
          `定位来源：${provider}`,
          `高德链接：https://uri.amap.com/marker?position=${longitude},${latitude}&name=SOS位置`
        ].join("\n");
      }
      const __returned__ = { MAP_MODES, MIN_MAP_SCALE, MAX_MAP_SCALE, RECENTER_MAP_SCALE, hikingStore, isTracking, hasTrackInProgress, currentLocation, trackPoints, locationError, trackSyncText, trackSyncTone, isGuardMode, isSosMenuOpen, mapScale, currentMapMode, networkOnline, nowTick, lastGuardPromptAt, guardCooldownUntil, lastGuardSafeAt, lastSunsetWarningLevel, lastSunsetWarningDate, get sunsetTimer() {
        return sunsetTimer;
      }, set sunsetTimer(v) {
        sunsetTimer = v;
      }, get removeCompassListener() {
        return removeCompassListener;
      }, set removeCompassListener(v) {
        removeCompassListener = v;
      }, get hasPromptedLocationSettings() {
        return hasPromptedLocationSettings;
      }, set hasPromptedLocationSettings(v) {
        hasPromptedLocationSettings = v;
      }, offlinePackId, compassHeading, offlinePackRecord, offlinePackBusy, offlinePackProgress, coordinateText, gpsStatusText, altitudeText, accuracyText, isOffline, distanceText, compassText, mapModeLabel, headerModeText, sunsetInfo, sunsetCountdownText, sunsetTimeText, sunsetRiskLevel, stationaryRisk, guardStatusText, guardStatusLevel, emergencyContactName, emergencyContactPhones, offlineHint, offlinePackActionText, resolveOfflineDownloadMode, bindNetworkState, refreshLocation, handleStart, handleFinishTrack, handleClearTrack, recenterMap, zoomInMap, zoomOutMap, clampMapScale, handleEmergencySms, handleSosVisibilityChange, toggleGuard, cleanup, bindCompassState, syncOfflinePackState, handleOfflinePackAction, openOfflinePackManager, startOfflinePackDownload, confirmDeleteOfflinePack, formatPackSize, startSunsetTimer, acknowledgeGuardSafe, maybePromptLocationSettings, getSunsetWarningLevel, showSunsetWarning, buildEmergencySmsBody, computed: vue.computed, onBeforeUnmount: vue.onBeforeUnmount, ref: vue.ref, watch: vue.watch, get onLoad() {
        return onLoad;
      }, get onUnload() {
        return onUnload;
      }, get storeToRefs() {
        return storeToRefs;
      }, HikingHeaderPanel, HikingMapStage, HikingBottomControls, get evaluateStationaryRisk() {
        return evaluateStationaryRisk;
      }, get formatStationaryStatus() {
        return formatStationaryStatus;
      }, get hikingModeMock() {
        return hikingModeMock;
      }, get formatSunsetTime() {
        return formatSunsetTime;
      }, get getSunsetInfo() {
        return getSunsetInfo;
      }, get buildHikingTilePackPlan() {
        return buildHikingTilePackPlan;
      }, get DEFAULT_HIKING_TILE_PACK_ID() {
        return DEFAULT_HIKING_TILE_PACK_ID;
      }, get deleteOfflineTilePack() {
        return deleteOfflineTilePack;
      }, get downloadOfflineTilePack() {
        return downloadOfflineTilePack;
      }, get getOfflineTilePack() {
        return getOfflineTilePack;
      }, get formatCoordinate() {
        return formatCoordinate;
      }, get formatMetric() {
        return formatMetric;
      }, get sumTrackDistanceKm() {
        return sumTrackDistanceKm;
      }, get openAppPermissionSettings() {
        return openAppPermissionSettings;
      }, get formatCompassHeading() {
        return formatCompassHeading;
      }, get startCompass() {
        return startCompass;
      }, get stopCompass() {
        return stopCompass;
      }, get subscribeCompass() {
        return subscribeCompass;
      }, get useHikingStore() {
        return useHikingStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "status-bar" }),
      vue.createVNode($setup["HikingHeaderPanel"], {
        "gps-status-text": $setup.gpsStatusText,
        "coordinate-text": $setup.coordinateText,
        "altitude-text": $setup.altitudeText,
        "distance-text": $setup.distanceText,
        "accuracy-text": $setup.accuracyText,
        "compass-text": $setup.compassText,
        "is-offline": $setup.isOffline,
        "mode-text": $setup.headerModeText,
        "sunset-countdown-text": $setup.sunsetCountdownText,
        "sunset-time-text": $setup.sunsetTimeText,
        "sunset-risk-level": $setup.sunsetRiskLevel,
        "guard-status-text": $setup.guardStatusText,
        "guard-status-level": $setup.guardStatusLevel,
        "sync-status-text": $setup.trackSyncText,
        "sync-status-tone": $setup.trackSyncTone
      }, null, 8, ["gps-status-text", "coordinate-text", "altitude-text", "distance-text", "accuracy-text", "compass-text", "is-offline", "mode-text", "sunset-countdown-text", "sunset-time-text", "sunset-risk-level", "guard-status-text", "guard-status-level", "sync-status-text", "sync-status-tone"]),
      vue.createVNode($setup["HikingMapStage"], {
        "map-scale": $setup.mapScale,
        "map-mode-key": $setup.currentMapMode,
        "is-offline": $setup.isOffline,
        "offline-hint": $setup.offlineHint,
        "overlay-active": $setup.isSosMenuOpen,
        "offline-pack-id": $setup.offlinePackId,
        onRefresh: $setup.refreshLocation,
        onRecenter: $setup.recenterMap,
        onToggleTrack: $setup.handleStart,
        onZoomIn: $setup.zoomInMap,
        onZoomOut: $setup.zoomOutMap
      }, null, 8, ["map-scale", "map-mode-key", "is-offline", "offline-hint", "overlay-active", "offline-pack-id"]),
      vue.createVNode($setup["HikingBottomControls"], {
        "is-tracking": $setup.isTracking,
        "has-track-session": $setup.hasTrackInProgress,
        "has-track-points": Boolean($setup.trackPoints.length),
        "is-guard-mode": $setup.isGuardMode,
        "emergency-contact-name": $setup.emergencyContactName,
        "emergency-contact-phones": $setup.emergencyContactPhones,
        "offline-pack-action-text": $setup.offlinePackActionText,
        "offline-pack-busy": $setup.offlinePackBusy,
        onSosMessage: $setup.handleEmergencySms,
        onSosVisibilityChange: $setup.handleSosVisibilityChange,
        onToggleTrack: $setup.handleStart,
        onFinishTrack: $setup.handleFinishTrack,
        onClearTrack: $setup.handleClearTrack,
        onToggleGuard: $setup.toggleGuard,
        onOfflinePackAction: $setup.handleOfflinePackAction
      }, null, 8, ["is-tracking", "has-track-session", "has-track-points", "is-guard-mode", "emergency-contact-name", "emergency-contact-phones", "offline-pack-action-text", "offline-pack-busy"])
    ]);
  }
  const PagesHikingIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-1a159d43"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/index.vue"]]);
  const _sfc_main$1 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentUser = vue.ref(null);
      const authToken = vue.ref("");
      const editModalVisible = vue.ref(false);
      const editNickname = vue.ref("");
      const isLoggedIn = vue.computed(() => Boolean(authToken.value && currentUser.value));
      const profileName = vue.computed(() => {
        var _a;
        return ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "新疆漫游者";
      });
      const menuItems = [
        { short: "行", label: "旅行足迹" },
        { short: "消", label: "消息通知" },
        { short: "语", label: "语言设置", value: "简体中文" },
        { short: "设", label: "通用设置" }
      ];
      onShow(() => {
        loadAuthState();
      });
      async function loadAuthState() {
        authToken.value = getStoredAuthToken();
        currentUser.value = getStoredAuthUser();
        if (!authToken.value) {
          return;
        }
        try {
          const res = await getMyProfile(authToken.value);
          const nextUser = (res == null ? void 0 : res.user) || null;
          if (!nextUser) {
            return;
          }
          saveAuthSession({ token: authToken.value, user: nextUser });
          currentUser.value = nextUser;
        } catch {
          currentUser.value = getStoredAuthUser();
        }
      }
      function goBack() {
        uni.navigateBack();
      }
      function openEditModal() {
        var _a;
        editNickname.value = ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "";
        editModalVisible.value = true;
      }
      async function saveProfile() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        const nickname = editNickname.value.trim();
        formatAppLog("log", "at pages/settings/index.vue:132", "[settings-profile] save start", {
          nickname,
          currentNickname: ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "",
          hasToken: Boolean(authToken.value)
        });
        if (!nickname || nickname === ((_b = currentUser.value) == null ? void 0 : _b.nickname)) {
          editModalVisible.value = false;
          return;
        }
        try {
          const res = await updateUserProfile(authToken.value, { nickname });
          formatAppLog("log", "at pages/settings/index.vue:143", "[settings-profile] save success", res);
          const merged = {
            ...currentUser.value,
            ...res.user,
            avatar_url: ((_c = res.user) == null ? void 0 : _c.avatar_url) || ((_d = currentUser.value) == null ? void 0 : _d.avatar_url) || ((_e = currentUser.value) == null ? void 0 : _e.avatar) || "",
            avatar: ((_f = res.user) == null ? void 0 : _f.avatar) || ((_g = res.user) == null ? void 0 : _g.avatar_url) || ((_h = currentUser.value) == null ? void 0 : _h.avatar) || ((_i = currentUser.value) == null ? void 0 : _i.avatar_url) || ""
          };
          saveAuthSession({ token: authToken.value, user: merged });
          currentUser.value = merged;
          editModalVisible.value = false;
          uni.showToast({ title: "昵称已更新", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/settings/index.vue:155", "[settings-profile] save fail", e);
          uni.showToast({ title: e.message || "更新失败", icon: "none" });
        }
      }
      function handleLogout() {
        uni.showModal({
          title: "退出登录",
          content: "确认退出当前账号吗？",
          success: ({ confirm }) => {
            if (!confirm)
              return;
            clearAuthSession();
            uni.showToast({ title: "已退出登录", icon: "none" });
            uni.navigateBack();
          }
        });
      }
      const __returned__ = { currentUser, authToken, editModalVisible, editNickname, isLoggedIn, profileName, menuItems, loadAuthState, goBack, openEditModal, saveProfile, handleLogout, computed: vue.computed, ref: vue.ref, get onShow() {
        return onShow;
      }, get clearAuthSession() {
        return clearAuthSession;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get saveAuthSession() {
        return saveAuthSession;
      }, get getMyProfile() {
        return getMyProfile;
      }, get updateUserProfile() {
        return updateUserProfile;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("view", {
            class: "nav-back",
            onClick: $setup.goBack
          }, [
            vue.createElementVNode("text", { class: "nav-back-icon" }, "‹")
          ]),
          vue.createElementVNode("text", { class: "nav-title" }, "设置"),
          vue.createElementVNode("view", { class: "nav-placeholder" })
        ]),
        $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "section section-block"
        }, [
          vue.createElementVNode("text", { class: "section-title" }, "账号信息"),
          vue.createElementVNode("view", { class: "card menu-card" }, [
            vue.createElementVNode("view", { class: "menu-wrap" }, [
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: $setup.openEditModal
              }, [
                vue.createElementVNode("view", { class: "menu-left" }, [
                  vue.createElementVNode("view", { class: "menu-icon" }, "昵"),
                  vue.createElementVNode("text", { class: "menu-label" }, "修改昵称")
                ]),
                vue.createElementVNode("view", { class: "menu-right" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "menu-value muted-text" },
                    vue.toDisplayString($setup.profileName),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                ])
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "账户设置"),
          vue.createElementVNode("view", { class: "card menu-card" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.menuItems, (item, index) => {
                return vue.createElementVNode("view", {
                  key: item.label,
                  class: "menu-wrap"
                }, [
                  vue.createElementVNode("view", {
                    class: "menu-item",
                    onClick: ($event) => item.action && item.action()
                  }, [
                    vue.createElementVNode("view", { class: "menu-left" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "menu-icon" },
                        vue.toDisplayString(item.short),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "menu-label" },
                        vue.toDisplayString(item.label),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "menu-right" }, [
                      item.value ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          class: "menu-value muted-text"
                        },
                        vue.toDisplayString(item.value),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                    ])
                  ], 8, ["onClick"]),
                  index < $setup.menuItems.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "menu-divider"
                  })) : vue.createCommentVNode("v-if", true)
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        $setup.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "section section-block"
        }, [
          vue.createElementVNode("view", {
            class: "logout-button",
            onClick: $setup.handleLogout
          }, "退出登录")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      $setup.editModalVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => $setup.editModalVisible = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-box" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "修改昵称"),
          vue.createElementVNode("view", { class: "modal-field" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.editNickname = $event),
                placeholder: "请输入昵称",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.editNickname]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-actions" }, [
            vue.createElementVNode("view", {
              class: "modal-btn ghost",
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.editModalVisible = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn primary",
              onClick: $setup.saveProfile
            }, "保存")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesSettingsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-a11b3e9a"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/settings/index.vue"]]);
  __definePage("pages/home/index", PagesHomeIndex);
  __definePage("pages/destinations/index", PagesDestinationsIndex);
  __definePage("pages/guides/index", PagesGuidesIndex);
  __definePage("pages/guide-detail/index", PagesGuideDetailIndex);
  __definePage("pages/track-preview/index", PagesTrackPreviewIndex);
  __definePage("pages/guide-publish/index", PagesGuidePublishIndex);
  __definePage("pages/ai-assistant/index", PagesAiAssistantIndex);
  __definePage("pages/account/index", PagesAccountIndex);
  __definePage("pages/auth/index", PagesAuthIndex);
  __definePage("pages/destination-detail/index", PagesDestinationDetailIndex);
  __definePage("pages/safety-map/index", PagesSafetyMapIndex);
  __definePage("pages/hiking/index", PagesHikingIndex);
  __definePage("pages/settings/index", PagesSettingsIndex);
  const _sfc_main = {
    onLaunch() {
      formatAppLog("log", "at App.vue:6", "Meet Xinjiang app launched");
    },
    onHide() {
      clearAiMessages();
    },
    onUnload() {
      clearAiMessages();
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/AI编程/遇见新疆_uniapp/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    const pinia = createPinia();
    app.use(pinia);
    return {
      app,
      pinia
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
