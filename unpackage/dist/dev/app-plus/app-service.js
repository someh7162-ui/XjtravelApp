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
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$i = {
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
        { path: "/pages/home/index", label: "首页", short: "H" },
        { path: "/pages/destinations/index", label: "目的地", short: "D" },
        { path: "/pages/guides/index", label: "攻略指南", short: "G" },
        { path: "/pages/ai-assistant/index", label: "AI助手", short: "AI" },
        { path: "/pages/account/index", label: "我的", short: "A" }
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
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
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
                "view",
                { class: "tab-icon" },
                vue.toDisplayString(item.short),
                1
                /* TEXT */
              ),
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
  const AppTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-8715b27c"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/AppTabBar.vue"]]);
  const _sfc_main$h = {
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
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const loading = vue.ref(true);
      const currentSrc = vue.ref("");
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
          currentSrc.value = url;
          loading.value = false;
          return;
        }
        const key = storageKey(url);
        const cachedPath = uni.getStorageSync(key);
        if (cachedPath) {
          currentSrc.value = cachedPath;
          loading.value = false;
          return;
        }
        currentSrc.value = url;
        const platform = uni.getSystemInfoSync().platform;
        if (platform === "devtools" || platform === "web") {
          loading.value = false;
          return;
        }
        try {
          const downloadRes = await uni.downloadFile({ url });
          if (downloadRes.statusCode !== 200 || !downloadRes.tempFilePath) {
            loading.value = false;
            return;
          }
          const saveRes = await uni.saveFile({ tempFilePath: downloadRes.tempFilePath });
          if (saveRes.savedFilePath) {
            uni.setStorageSync(key, saveRes.savedFilePath);
            currentSrc.value = saveRes.savedFilePath;
          }
        } catch (error) {
          currentSrc.value = url;
        } finally {
          loading.value = false;
        }
      }
      function handleLoad() {
        loading.value = false;
      }
      function handleError() {
        loading.value = false;
        currentSrc.value = props.src;
      }
      vue.watch(
        () => props.src,
        (value) => {
          resolveImage(value);
        },
        { immediate: true }
      );
      const __returned__ = { props, loading, currentSrc, storageKey, resolveImage, handleLoad, handleError, ref: vue.ref, watch: vue.watch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
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
  const CachedImage = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-7d2a8804"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/CachedImage.vue"]]);
  function createScenicSpot({
    id,
    name,
    location,
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
      location,
      region: normalizeRegion(region),
      category,
      rating,
      coordinates: { longitude, latitude },
      description,
      image,
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
      location: "新疆阜康",
      region: "乌鲁木齐周边",
      category: "湖泊雪山",
      rating: "4.8",
      longitude: 88.1548,
      latitude: 43.8803,
      description: "高山湖泊与雪岭森林相映成景，是新疆最经典的入门景区之一。",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/%E5%A4%A9%E5%B1%B1%E5%A4%A9%E6%B1%A02_-_panoramio.jpg/1280px-%E5%A4%A9%E5%B1%B1%E5%A4%A9%E6%B1%A02_-_panoramio.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Kanas_Lake%2C_China%2C_LandSat_image.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Satellite_Image_of_Lake_Sayram.png",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Lake_Bulungkol_Karakoram_Highway_Kyrgyz_Xinjiang_China_%E6%96%B0%E7%96%86_%E5%90%89%E7%88%BE%E5%90%89%E6%96%AF_%E5%96%80%E5%96%87%E6%98%86%E4%BB%91%E5%85%AC%E8%B7%AF_%E7%99%BD%E6%B2%99%E6%B9%96_-_panoramio_%281%29.jpg",
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
      location: "新疆伊犁新源",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 83.0565,
      latitude: 43.4711,
      description: "空中草原层次起伏，适合看牧场、花海与雪岭线条。",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Nalati_Grassland_2.jpg",
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
      location: "新疆伊犁特克斯",
      region: "伊犁",
      category: "草原森林",
      rating: "4.8",
      longitude: 82.6947,
      latitude: 43.2089,
      description: "人体草原、峡谷草甸与远山起伏交织，观景层次非常丰富。",
      image: "https://bkimg.cdn.bcebos.com/pic/359b033b5bb5c9ea057e7162d539b6003bf3b3a5?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Xinjiang_Bayinbuluke_China_%283715440219%29.jpg",
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
      location: "新疆阿勒泰布尔津",
      region: "阿勒泰",
      category: "草原森林",
      rating: "4.9",
      longitude: 86.9962,
      latitude: 48.5485,
      description: "木屋村落、白桦林与晨雾构成了北疆最受欢迎的童话式风景。",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/%E6%96%B0%E7%96%86-%E7%A6%BE%E6%9C%A8.%E9%BB%84%E6%98%8F_-_panoramio.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/East_gate_of_the_Ancient_City_of_Kashi_%2820230923104429%29.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Jiaohe_City%28Yarkhoto%29%2CTurpan%2CXinjiang_HY2.jpg",
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
      image: "https://bkimg.cdn.bcebos.com/pic/6f470395b5254f637af4806f?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      location: "新疆阿克苏库车",
      region: "阿克苏",
      category: "古城人文",
      rating: "4.4",
      longitude: 82.9631,
      latitude: 41.7174,
      description: "兼具历史府邸与民族风情展示，适合了解库车老城文化。",
      image: "https://bkimg.cdn.bcebos.com/pic/962bd40735fae6cd7b894727fee9182442a7d933a178?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/%E4%B8%AD%E5%9B%BD%E6%96%B0%E7%96%86%E9%84%AF%E5%96%84%E5%8E%BF%E5%BA%93%E6%9C%A8%E5%A1%94%E6%A0%BC%E6%B2%99%E6%BC%A0_China_Xinjiang%2C_Piqan_County_Desert_Chi_-_panoramio.jpg",
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
      image: "https://bkimg.cdn.bcebos.com/pic/267f9e2f070828385ce621b2b699a9014d08f1a9",
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
      image: "https://bkimg.cdn.bcebos.com/pic/5fdf8db1cb1349540923a1895d198558d109b2dedc9d?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1623336343731-1582577b8250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYWtsYW1ha2FuJTIwZGVzZXJ0JTIwc2FuZCUyMGR1bmVzfGVufDF8fHx8MTc3NjI0NjMzMnww&ixlib=rb-4.1.0&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/3b6833f59a17901bbd31090c?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/359b033b5bb5c9eafd2e54f9d839b6003bf3b3cf?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/2/26/%E6%96%B0%E7%96%86-%E5%8F%AF%E5%8F%AF%E6%89%98%E6%B5%B7-%E7%BE%8E%E4%B8%BD%E7%9A%84%E9%A3%8E%E6%99%AF_-_panoramio.jpg",
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
      image: "https://bkimg.cdn.bcebos.com/pic/d31b0ef41bd5ad6eddc4a50848932edbb6fd53669682?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/77c6a7efce1b9d16fdfadc18f185a38f8c5494eece0d?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "城市夜游",
      rating: "4.5",
      longitude: 87.6168,
      latitude: 43.7776,
      description: "香料、织物和手工艺品汇聚，是体验城市烟火气的热门地标。",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/29/%E6%96%B0%E7%96%86%E4%B9%8C%E9%B2%81%E6%9C%A8%E9%BD%90%E5%9B%BD%E9%99%85%E5%A4%A7%E5%B7%B4%E6%89%8E.jpg",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Turpan_grape_valley.jpg",
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
      image: "https://bkimg.cdn.bcebos.com/pic/838ba61ea8d3fd1f4134984abb19321f95cad1c8f13e?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/b812c8fcc3cec3fda160fc3dd688d43f8794271f?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/37d12f2eb9389b50e85e06a78f35e5dde6116ea6?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/f703738da9773912b31bc4b983559118367adbb4449c?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/b3119313b07eca8065384dee9c7b80dda144ad342538?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      location: "新疆吐鲁番",
      region: "吐鲁番",
      category: "沙漠峡谷",
      rating: "4.4",
      longitude: 89.4922,
      latitude: 42.9127,
      description: "红色山体与炽热感十足的地貌画面，是吐鲁番最具辨识度的地标之一。",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/71/%E7%81%AB%E7%84%B0%E5%B1%B1%E4%B8%AD%E6%99%AF.jpg",
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
      image: "https://bkimg.cdn.bcebos.com/pic/d01373f082025aaf18956ec1f4edab64034f1a10?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/d439b6003af33a87e95094d7650607385343faf21ff1?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/caef76094b36acaf51264a5b72d98d1000e99c57?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/78310a55b319ebc4b7452225007dd8fc1e178a82b84e?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "古城人文",
      rating: "4.8",
      longitude: 87.5923,
      latitude: 43.8262,
      description: "系统展示新疆历史、民族与丝路文明，是入疆后很适合第一站了解背景的地方。",
      image: "https://bkimg.cdn.bcebos.com/pic/86d6277f9e2f070891da472fee24b899a801f2c6?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      location: "新疆乌鲁木齐",
      region: "乌鲁木齐",
      category: "城市夜游",
      rating: "4.4",
      longitude: 87.6162,
      latitude: 43.8031,
      description: "城市高点视野开阔，适合看乌鲁木齐日落和夜景轮廓。",
      image: "https://bkimg.cdn.bcebos.com/pic/08f790529822720ef082e22775cb0a46f31fab9b?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/6d81800a19d8bc3eee230c9c8d8ba61ea8d345b8?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/d1160924ab18972bd407bc8fd8966c899e510fb39c79?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/622762d0f703918fa0ece42e7876319759ee3c6d6e89?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/dc54564e9258d109b3ded90a9601dbbf6c81800ae748?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/574e9258d109b3de9c82ea619ee47b81800a19d8e63d?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://bkimg.cdn.bcebos.com/pic/29381f30e924b8998593a8f862061d950b7bf647?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/caef76094b36acaf51264a5b72d98d1000e99c57?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
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
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://bkimg.cdn.bcebos.com/pic/caef76094b36acaf51264a5b72d98d1000e99c57?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
      weather: { condition: "晴", temperature: "19°C", humidity: "48%", wind: "2级微风" },
      tips: ["清晨适合观鸟", "适合带孩子认识湿地生态", "安排半日较合适"],
      suggestion: "适合昌吉方向的自然轻游。",
      liveTitle: "玛纳斯湿地直播",
      liveHint: "可先看天气和水面状况。",
      liveKeyword: "玛纳斯湿地 直播"
    }),
    createScenicSpot({
      id: 63,
      name: "平定准噶尔勒铭格登山碑",
      location: "新疆昌吉奇台",
      region: "昌吉",
      category: "古城人文",
      rating: "4.3",
      longitude: 89.5932,
      latitude: 44.0226,
      description: "清代平定准噶尔的重要纪功碑之一，位置相对小众，适合对新疆边疆史和碑刻遗存感兴趣的游客。",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      weather: { condition: "晴", temperature: "18°C", humidity: "36%", wind: "2级微风" },
      tips: ["更适合顺路探访，建议提前确认现场可达性", "适合结合奇台或昌吉历史线路一起看", "对碑刻和清代边疆史感兴趣会更有收获"],
      suggestion: "适合小众历史点打卡和新疆地方史深度游。",
      liveTitle: "格登山碑周边实况",
      liveHint: "该点更偏历史遗存，建议出发前确认天气与路况。",
      liveKeyword: "格登山碑 奇台"
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
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      weather: { condition: "晴", temperature: "27°C", humidity: "22%", wind: "2级微风" },
      tips: ["适合与库车或阿克苏市区人文点一起安排", "更适合历史向游客", "停留时间不用太长但适合细看"],
      suggestion: "适合南疆城市历史脉络补充型打卡。",
      liveTitle: "阿克苏文庙周边实况",
      liveHint: "出发前建议确认开放情况。",
      liveKeyword: "阿克苏文庙"
    })
  ];
  const scenicCategories = ["全部", ...new Set(destinationList.map((item) => item.category))];
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
  const scenicRegions = ["全部", ...regionOrder.filter((item) => destinationList.some((spot) => spot.region === item))];
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
      overview: "平定准噶尔勒铭格登山碑是新疆较少被大众游客注意到的清代碑刻遗存，属于更偏学术感和历史感的小众人文点。",
      history: "格登山碑与清代平定准噶尔战争后的纪功体系相关，是理解乾隆时期新疆统一进程、边疆治理叙事和官方纪念方式的重要实物线索。它的价值不在景观规模，而在其所承载的历史事件与政治象征意义。",
      highlights: "如果你对新疆“为何被纳入统一国家叙事”这段历史感兴趣，这类碑刻比普通打卡景点更有信息量。"
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
      highlights: ["建议把车停在官方停车区后乘摆渡进入", "环湖步道是最适合家庭游客的安全主线"]
    },
    2: {
      coverage: "喀纳斯换乘中心、湖滨观景段、返程车站一线",
      emergencyLevel: "高",
      emergencyContacts: ["景区换乘中心服务台", "景区医疗救助点", "布尔津当地急救 120"],
      highlights: ["景区纵深大，先确认返程车时间", "山区天气变化快，优先保存核心观景路线"]
    },
    9: {
      coverage: "古城东门、主街区、游客中心、夜游出口一线",
      emergencyLevel: "中",
      emergencyContacts: ["古城游客中心", "古城警务站", "喀什当地急救 120"],
      highlights: ["先记住东门或西门这类大地标", "夜游时建议把集合点设在主街宽阔区域"]
    },
    22: {
      coverage: "帕米尔主观景点、公路停靠区、游客补给点一线",
      emergencyLevel: "高",
      emergencyContacts: ["沿线游客服务站", "塔县县城医院", "塔县急救 120"],
      highlights: ["高原地区务必控制节奏", "离开县城前先备好离线图和补给"]
    }
  };
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
  const AMAP_WEB_KEY = "b16ee0a6a8f641e974a51521ca00b6f0";
  function hasAmapKey() {
    return Boolean(AMAP_WEB_KEY) && !AMAP_WEB_KEY.includes("请在这里填入");
  }
  function request$4(url, data = {}) {
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
  function getStaticMapUrl({ longitude, latitude, markers = [], zoom = 11, size = "750*360" }) {
    if (!hasAmapKey() || longitude === void 0 || latitude === void 0) {
      return "";
    }
    const markerText = markers.map((item) => `${item.size || "mid"},0xC44536,${item.label || ""}:${item.longitude},${item.latitude}`).join("|");
    return `https://restapi.amap.com/v3/staticmap?key=${encodeURIComponent(AMAP_WEB_KEY)}&size=${encodeURIComponent(size)}&scale=2&zoom=${zoom}&center=${longitude},${latitude}&markers=${encodeURIComponent(markerText)}`;
  }
  async function reverseGeocode(longitude, latitude, extensions = "base") {
    if (!hasAmapKey()) {
      return null;
    }
    const data = await request$4("https://restapi.amap.com/v3/geocode/regeo", {
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
    const data = await request$4("https://restapi.amap.com/v3/weather/weatherInfo", {
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
    const data = await request$4("https://restapi.amap.com/v3/direction/driving", {
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
    const data = await request$4("https://restapi.amap.com/v3/direction/walking", {
      key: AMAP_WEB_KEY,
      origin: `${origin.longitude},${origin.latitude}`,
      destination: `${destination.longitude},${destination.latitude}`
    });
    if (data.status !== "1" || !((_b = (_a = data.route) == null ? void 0 : _a.paths) == null ? void 0 : _b.length)) {
      throw new Error(data.info || "步行路线获取失败");
    }
    return data.route.paths[0];
  }
  async function getCurrentLocation() {
    const attempts = [
      { label: "uni-gcj02", run: () => requestUniLocation("gcj02") },
      { label: "uni-wgs84", run: () => requestUniLocation("wgs84") },
      { label: "plus-geolocation", run: () => requestPlusLocation() }
    ];
    let lastError = null;
    const errors = [];
    for (const attempt of attempts) {
      try {
        const location = await attempt.run();
        if (location) {
          formatAppLog("log", "at services/amap.js:186", `[hiking-location] success via ${attempt.label}`, location);
          return location;
        }
      } catch (error) {
        lastError = error;
        const message = (error == null ? void 0 : error.message) || String(error);
        errors.push(`${attempt.label}: ${message}`);
        formatAppLog("warn", "at services/amap.js:193", `[hiking-location] failed via ${attempt.label}`, error);
      }
    }
    const detail = errors.length ? `；${errors.join(" | ")}` : "";
    throw new Error(((lastError == null ? void 0 : lastError.message) || "定位失败，请检查系统定位服务是否开启") + detail);
  }
  function requestUniLocation(type = "gcj02") {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type,
        isHighAccuracy: true,
        highAccuracyExpireTime: 12e3,
        geocode: false,
        success: resolve,
        fail: reject
      });
    });
  }
  function requestPlusLocation() {
    return new Promise((resolve, reject) => {
      if (typeof plus === "undefined" || !plus.geolocation || typeof plus.geolocation.getCurrentPosition !== "function") {
        reject(new Error("当前环境不支持 plus 定位"));
        return;
      }
      plus.geolocation.getCurrentPosition(
        (position) => {
          const coords = (position == null ? void 0 : position.coords) || {};
          resolve({
            latitude: Number(coords.latitude),
            longitude: Number(coords.longitude),
            altitude: Number(coords.altitude || 0),
            accuracy: Number(coords.accuracy || 0),
            speed: Number(coords.speed || 0),
            timestamp: Number(position.timestamp || Date.now()),
            provider: "plus-geolocation"
          });
        },
        (error) => {
          reject(new Error((error == null ? void 0 : error.message) || "plus 定位失败"));
        },
        {
          enableHighAccuracy: true,
          timeout: 12e3,
          maximumAge: 0,
          provider: "system",
          coordsType: "gcj02"
        }
      );
    });
  }
  const _sfc_main$g = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const stats = [
        { value: `${destinationList.length}`, label: "景区总数" },
        { value: `${scenicCategories.length - 1}`, label: "景区分类" },
        { value: `${scenicRegions.length - 1}`, label: "覆盖地区" }
      ];
      const currentCoords = vue.ref(null);
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
      const nicheDestinationIds = [63, 64, 65, 66, 67];
      const nicheDestinations = vue.computed(() => destinationList.filter((item) => nicheDestinationIds.includes(item.id)));
      const activities = [
        { short: "丝", title: "丝路人文漫游", desc: "适合第一次探索新疆的人文路线" },
        { short: "沙", title: "沙漠越野探险", desc: "更偏向穿越和公路风景体验" },
        { short: "徒", title: "徒步模式", desc: "定位、离线地图、SOS 与露营风险提示", action: "hiking" }
      ];
      onLoad(async () => {
        try {
          const location = await getCurrentLocation();
          currentCoords.value = {
            longitude: location.longitude,
            latitude: location.latitude
          };
        } catch (error) {
          currentCoords.value = null;
        }
      });
      function goToDestinations() {
        uni.reLaunch({ url: "/pages/destinations/index" });
      }
      function openDetail(id) {
        uni.navigateTo({ url: `/pages/destination-detail/index?id=${id}` });
      }
      function openAiPlanner() {
        const featuredNames = featuredDestinations.value.map((item) => item.name).join("、");
        const context = [
          `首页推荐景区数：${destinationList.length}`,
          `景区分类数：${scenicCategories.length - 1}`,
          `覆盖地区数：${scenicRegions.length - 1}`,
          `当前推荐景区：${featuredNames || "天山天池、喀纳斯景区、赛里木湖"}`
        ].join("\n");
        navigateToAiAssistant({
          title: "首页行程规划",
          desc: "结合首页推荐景区，快速生成第一次来新疆的旅行路线。",
          source: "首页",
          prompt: "我是第一次来新疆，请根据热门景区帮我规划 5 天行程。",
          context,
          autoAsk: true
        });
      }
      function openHikingMode() {
        uni.navigateTo({ url: "/pages/hiking/index" });
      }
      function handleActivityTap(item) {
        if (item.action === "hiking") {
          openHikingMode();
          return;
        }
        uni.showToast({
          title: `${item.title} 敬请期待`,
          icon: "none"
        });
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
      const __returned__ = { stats, currentCoords, featuredDestinations, featuredSectionTitle, nicheDestinationIds, nicheDestinations, activities, goToDestinations, openDetail, openAiPlanner, openHikingMode, handleActivityTap, openAiForDestination, navigateToAiAssistant, getDistanceKm: getDistanceKm2, formatDistance, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, AppTabBar, CachedImage, get destinationList() {
        return destinationList;
      }, get scenicCategories() {
        return scenicCategories;
      }, get scenicRegions() {
        return scenicRegions;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero hero-gradient" }, [
          vue.createElementVNode("view", { class: "hero-overlay" }),
          vue.createElementVNode("view", { class: "hero-content" }, [
            vue.createElementVNode("text", { class: "hero-title" }, "遇见新疆"),
            vue.createElementVNode("text", { class: "hero-subtitle" }, "沿着丝路风景，开启一段辽阔而热烈的旅程"),
            vue.createElementVNode("view", { class: "hero-badge" }, [
              vue.createElementVNode("text", { class: "hero-badge-dot" }),
              vue.createElementVNode(
                "text",
                { class: "hero-badge-text" },
                vue.toDisplayString($setup.destinationList.length) + " 个精选景区",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "hero-action-row" }, [
              vue.createElementVNode("view", {
                class: "hero-ai-btn",
                onClick: $setup.openAiPlanner
              }, "问 AI 规划新疆行程"),
              vue.createElementVNode("view", {
                class: "hero-hiking-btn",
                onClick: $setup.openHikingMode
              }, "进入徒步模式")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section stats-panel" }, [
          vue.createElementVNode("view", { class: "stats-grid card" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.stats, (item) => {
                return vue.createElementVNode("view", {
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
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode(
              "text",
              { class: "section-title" },
              vue.toDisplayString($setup.featuredSectionTitle),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "link-text",
              onClick: $setup.goToDestinations
            }, "查看全部")
          ]),
          vue.createElementVNode("view", { class: "card-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.featuredDestinations, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "card destination-card",
                  onClick: ($event) => $setup.openDetail(item.id)
                }, [
                  vue.createElementVNode("view", { class: "image-wrap" }, [
                    vue.createVNode($setup["CachedImage"], {
                      src: item.image,
                      "image-class": "cover-image"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "rating-badge" }, [
                      vue.createElementVNode("text", { class: "rating-star" }, "*"),
                      vue.createElementVNode(
                        "text",
                        { class: "rating-text" },
                        vue.toDisplayString(item.rating),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "enter-badge" }, "查看详情")
                  ]),
                  vue.createElementVNode("view", { class: "destination-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "destination-title" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "destination-meta muted-text" }, [
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
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "destination-desc muted-text" },
                      vue.toDisplayString(item.description),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", {
                      class: "card-ai-link",
                      onClick: vue.withModifiers(($event) => $setup.openAiForDestination(item), ["stop"])
                    }, "问 AI 怎么玩", 8, ["onClick"])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "section-title" }, "小众推荐"),
            vue.createElementVNode("text", { class: "muted-text niche-note" }, "适合想避开常规热门点的人")
          ]),
          vue.createElementVNode("view", { class: "niche-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.nicheDestinations, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "niche-card card",
                  onClick: ($event) => $setup.openDetail(item.id)
                }, [
                  vue.createElementVNode("view", { class: "niche-head" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "niche-title" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "niche-badge" },
                      vue.toDisplayString(item.category),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "destination-meta muted-text" },
                    vue.toDisplayString(item.location),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "niche-desc muted-text" },
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
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block last-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "热门玩法"),
          vue.createElementVNode("view", { class: "activity-grid" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.activities, (item) => {
                return vue.createElementVNode("view", {
                  key: item.title,
                  class: "activity-card",
                  onClick: ($event) => $setup.handleActivityTap(item)
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "activity-icon" },
                    vue.toDisplayString(item.short),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "activity-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "activity-desc" },
                    vue.toDisplayString(item.desc),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/home/index" })
    ]);
  }
  const PagesHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-4978fed5"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/home/index.vue"]]);
  const API_BASE_URL = "https://111.20.31.227:34144/api";
  function hasApiBaseUrl() {
    return Boolean(API_BASE_URL.trim());
  }
  function request$3(url, data = {}) {
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
      const data = await request$3(`${API_BASE_URL}/destinations`, params);
      return Array.isArray(data == null ? void 0 : data.list) ? data.list : destinationList;
    } catch (error) {
      return destinationList;
    }
  }
  const defaultVisibleCount = 5;
  const _sfc_main$f = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchQuery = vue.ref("");
      const currentCategory = vue.ref("全部");
      const currentRegion = vue.ref("全部");
      const categoriesExpanded = vue.ref(false);
      const regionsExpanded = vue.ref(false);
      const destinations = vue.ref(getLocalDestinationList());
      const categories = vue.computed(() => getDestinationCategories(destinations.value));
      const regions = vue.computed(() => getDestinationRegions(destinations.value));
      const visibleCategories = vue.computed(() => {
        const list = categories.value;
        if (categoriesExpanded.value || list.length <= defaultVisibleCount) {
          return list;
        }
        const compact = list.slice(0, defaultVisibleCount);
        if (compact.includes(currentCategory.value)) {
          return compact;
        }
        return [list[0], currentCategory.value, ...list.slice(1, defaultVisibleCount - 1)];
      });
      const visibleRegions = vue.computed(() => {
        const list = regions.value;
        if (regionsExpanded.value || list.length <= defaultVisibleCount) {
          return list;
        }
        const compact = list.slice(0, defaultVisibleCount);
        if (compact.includes(currentRegion.value)) {
          return compact;
        }
        return [list[0], currentRegion.value, ...list.slice(1, defaultVisibleCount - 1)];
      });
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
      function toggleCategories() {
        categoriesExpanded.value = !categoriesExpanded.value;
      }
      function toggleRegions() {
        regionsExpanded.value = !regionsExpanded.value;
      }
      const __returned__ = { searchQuery, currentCategory, currentRegion, categoriesExpanded, regionsExpanded, defaultVisibleCount, destinations, categories, regions, visibleCategories, visibleRegions, filteredDestinations, openDetail, toggleCategories, toggleRegions, computed: vue.computed, ref: vue.ref, get onShow() {
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
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient top-banner section" }, [
          vue.createElementVNode("text", { class: "banner-title" }, "探索新疆景区"),
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
        ]),
        vue.createElementVNode("view", { class: "section category-panel card" }, [
          vue.createElementVNode("view", { class: "category-panel-head" }, [
            vue.createElementVNode("text", { class: "category-panel-title" }, "景区分类"),
            $setup.categories.length > $setup.defaultVisibleCount ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "category-toggle",
                onClick: $setup.toggleCategories
              },
              vue.toDisplayString($setup.categoriesExpanded ? "收起分类" : `展开全部 ${$setup.categories.length - 1} 类`),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "category-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.visibleCategories, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item,
                  class: vue.normalizeClass(["category-pill", { active: $setup.currentCategory === item }]),
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
        vue.createElementVNode("view", { class: "section category-panel card" }, [
          vue.createElementVNode("view", { class: "category-panel-head" }, [
            vue.createElementVNode("text", { class: "category-panel-title" }, "所在地区"),
            $setup.regions.length > $setup.defaultVisibleCount ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "category-toggle",
                onClick: $setup.toggleRegions
              },
              vue.toDisplayString($setup.regionsExpanded ? "收起地区" : `展开全部 ${$setup.regions.length - 1} 个地州`),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "category-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.visibleRegions, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item,
                  class: vue.normalizeClass(["category-pill region-pill", { active: $setup.currentRegion === item }]),
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
        vue.createElementVNode("view", { class: "section result-meta" }, [
          vue.createElementVNode(
            "text",
            { class: "muted-text" },
            "共找到 " + vue.toDisplayString($setup.filteredDestinations.length) + " 个景区",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "section card-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.filteredDestinations, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "card destination-card",
                onClick: ($event) => $setup.openDetail(item.id)
              }, [
                vue.createElementVNode("view", { class: "image-wrap" }, [
                  vue.createVNode($setup["CachedImage"], {
                    src: item.image,
                    "image-class": "cover-image"
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "view",
                    { class: "tag-pill" },
                    vue.toDisplayString(item.category),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "rating-badge" }, [
                    vue.createElementVNode("text", { class: "rating-star" }, "*"),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.rating),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "enter-badge" }, "查看详情")
                ]),
                vue.createElementVNode("view", { class: "card-body" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "card-title" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "location muted-text" },
                    vue.toDisplayString(item.location),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "card-desc muted-text" },
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
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/destinations/index" })
    ]);
  }
  const PagesDestinationsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-9dd01296"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/destinations/index.vue"]]);
  const AUTH_API_BASE_URL = API_BASE_URL;
  const AUTH_TOKEN_STORAGE = "meet-xinjiang-auth-token";
  const AUTH_USER_STORAGE = "meet-xinjiang-auth-user";
  function hasAuthApiBaseUrl() {
    return Boolean(AUTH_API_BASE_URL.trim());
  }
  function getStoredAuthToken() {
    const token = uni.getStorageSync(AUTH_TOKEN_STORAGE);
    return typeof token === "string" ? token : "";
  }
  function getStoredAuthUser() {
    try {
      const raw = uni.getStorageSync(AUTH_USER_STORAGE);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }
  function saveAuthSession({ token, user }) {
    uni.setStorageSync(AUTH_TOKEN_STORAGE, token || "");
    uni.setStorageSync(AUTH_USER_STORAGE, JSON.stringify(user || null));
  }
  function clearAuthSession() {
    uni.removeStorageSync(AUTH_TOKEN_STORAGE);
    uni.removeStorageSync(AUTH_USER_STORAGE);
  }
  const guideList = [
    {
      id: "first-time-xinjiang",
      title: "第一次来新疆，7 天怎么安排更顺路",
      category: "行程规划",
      readTime: "6 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "2.3k",
      likes: "318",
      location: "北疆经典线",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Nalati_Grassland_2.jpg",
      excerpt: "适合第一次来新疆的用户，从乌鲁木齐出发，串联赛里木湖、伊犁草原和独库沿线。",
      highlights: ["路线顺", "适合第一次来", "风景密度高"],
      sections: [
        {
          title: "推荐节奏",
          paragraphs: [
            "如果你是第一次来新疆，建议不要一上来就铺太大范围。7 天时间更适合集中体验北疆经典风景线，减少每天换城市的疲惫感。",
            "常见走法是乌鲁木齐进出，沿赛里木湖、霍城、伊宁、那拉提、独库公路北段或巴音布鲁克做一个顺时针闭环。"
          ]
        },
        {
          title: "行程拆分",
          paragraphs: [
            "第 1 天落地乌鲁木齐，适应节奏，晚上可以去大巴扎或新疆博物馆。",
            "第 2 到 3 天重点走赛里木湖、果子沟、霍城一线，第 4 到 5 天进入伊犁草原景区，第 6 到 7 天根据通车情况安排独库沿线或返回乌鲁木齐。"
          ]
        },
        {
          title: "适合人群",
          paragraphs: [
            "适合第一次来新疆、想看代表性风景、又不想每天都在赶路的游客。",
            "如果你更偏爱人文、老城和集市，可以把第一次行程改成南疆线。"
          ]
        }
      ],
      tips: ["旺季住宿至少提前 5 到 10 天预订", "独库公路通车时间要提前确认", "每天车程控制在 4 到 6 小时体验更好"]
    },
    {
      id: "self-drive-checklist",
      title: "新疆自驾前，这份准备清单先收好",
      category: "自驾建议",
      readTime: "5 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "1.8k",
      likes: "246",
      location: "全疆通用",
      image: "https://bkimg.cdn.bcebos.com/pic/78310a55b319ebc4b7452225007dd8fc1e178a82b84e?x-bce-process=image/resize,m_lfit,w_536,limit_1/quality,Q_70",
      excerpt: "新疆路程长、景点分散，自驾前确认证件、车辆状态、导航和补给，比临时做决定更重要。",
      highlights: ["证件准备", "路线确认", "补给提醒"],
      sections: [
        {
          title: "出发前检查",
          paragraphs: [
            "建议提前确认驾驶证、身份证、租车订单或保险资料，手机里同时准备离线地图和酒店订单截图。",
            "车辆方面优先检查轮胎、刹车、玻璃水、备胎和手机充电接口，长线自驾不要忽略这些基础项。"
          ]
        },
        {
          title: "路线判断",
          paragraphs: [
            "新疆不是每一段都适合临时起意，特别是独库公路、山口、沙漠边缘路线和牧区道路。建议提前确认天气、施工和通行情况。",
            "如果单日车程超过 600 公里，建议中间插入休息城市，否则体验会明显下降。"
          ]
        },
        {
          title: "补给重点",
          paragraphs: [
            "矿泉水、轻食、防晒、纸巾和应急药品最好固定放在车内一个收纳袋里。",
            "进入长距离路段前，尽量在县城或服务区把油量和饮水都补满。"
          ]
        }
      ],
      tips: ["山路和长下坡不要连续疲劳驾驶", "尊重限速与检查站规定", "别把导航预计时长当成真实到达时长"]
    },
    {
      id: "food-guide",
      title: "新疆吃什么不容易踩雷",
      category: "吃喝推荐",
      readTime: "7 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "3.1k",
      likes: "402",
      location: "城市与古城",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/East_gate_of_the_Ancient_City_of_Kashi_%2820230923104429%29.jpg",
      excerpt: "抓饭、拌面、烤包子、馕和酸奶都值得尝，但点单方式和就餐时段也会影响体验。",
      highlights: ["高频美食", "点单建议", "夜市提醒"],
      sections: [
        {
          title: "第一次可以先吃什么",
          paragraphs: [
            "第一次来新疆，比较稳妥的入门组合是抓饭、烤肉、拌面、烤包子和酸奶。既能快速感受地方风味，也不容易因为口味太重而不适应。",
            "如果你在喀什或库车，可以把古城散步和夜市安排在同一晚，体验会更完整。"
          ]
        },
        {
          title: "点单建议",
          paragraphs: [
            "新疆很多餐厅分量偏大，2 个人点 3 道主食型菜已经足够，建议先少点再加。",
            "烤肉、抓饭、馕坑肉这类热菜尽量趁热吃，口感差异很明显。"
          ]
        },
        {
          title: "小提醒",
          paragraphs: [
            "景区内餐饮更适合应急补给，想认真吃一顿通常还是回到市区或县城更稳。",
            "如果肠胃比较敏感，饮品和冰品不要一次性尝太多种。"
          ]
        }
      ],
      tips: ["夜市更适合边走边吃，不用一次点太多", "热门老店高峰期要排队", "早餐可以多试试奶茶、包子、馕"]
    },
    {
      id: "desert-safety",
      title: "去沙漠玩之前，一定先看这 6 条提醒",
      category: "安全提醒",
      readTime: "5 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "1.5k",
      likes: "228",
      location: "吐鲁番/南疆",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/%E4%B8%AD%E5%9B%BD%E6%96%B0%E7%96%86%E9%84%AF%E5%96%84%E5%8E%BF%E5%BA%93%E6%9C%A8%E5%A1%94%E6%A0%BC%E6%B2%99%E6%BC%A0_China_Xinjiang%2C_Piqan_County_Desert_Chi_-_panoramio.jpg",
      excerpt: "不论是库木塔格还是沙漠公路边体验项目，补水、防晒、结伴和服从景区安排都是底线。",
      highlights: ["防晒", "补水", "别单独深入"],
      sections: [
        {
          title: "为什么沙漠更需要准备",
          paragraphs: [
            "沙漠环境看起来开阔，但高温、风沙和缺少遮挡会让体感消耗远快于普通景区。",
            "特别是正午时段，拍照 20 分钟和暴晒 20 分钟，感受完全不是一回事。"
          ]
        },
        {
          title: "最重要的 3 件事",
          paragraphs: [
            "第一是补水，第二是防晒，第三是不要脱离既定路线。无论是徒步、越野还是娱乐项目，都要把这三点放在最前面。",
            "如果带老人和孩子，尽量把沙漠活动安排在日落前后。"
          ]
        },
        {
          title: "拍照和游玩建议",
          paragraphs: [
            "拍照衣服可以选择纯色或亮色，但鞋子更重要，最好穿能防沙、包裹脚背的款式。",
            "如果遇到大风天，优先缩短停留时间，不要硬撑。"
          ]
        }
      ],
      tips: ["至少准备 1 到 2 瓶饮水", "不要轻易离开观景和活动区域", "风沙大时优先保护眼睛和电子设备"]
    },
    {
      id: "tianshan-hiking",
      title: "天山徒步装备，不想漏东西就照着带",
      category: "户外探险",
      readTime: "6 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "1.2k",
      likes: "173",
      location: "天山/草原线",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/87/%E5%A4%A9%E5%B1%B1%E5%A4%A9%E6%B1%A02_-_panoramio.jpg",
      excerpt: "高山景区看起来温柔，实际天气和地形变化很快，鞋服、保暖层和应急物品不能省。",
      highlights: ["保暖层", "徒步鞋", "轻量应急"],
      sections: [
        {
          title: "基础装备",
          paragraphs: [
            "鞋子优先级最高，徒步鞋或抓地更好的运动鞋比拍照鞋更重要。",
            "衣物建议按排汗层、保暖层、外层防风来准备，这样更适合新疆昼夜温差大的情况。"
          ]
        },
        {
          title: "随身物品",
          paragraphs: [
            "水、能量棒、防晒、充电宝、纸巾和简单药品建议都放进一个轻量双肩包。",
            "如果行程里包含骑马或长距离观景车，衣物耐脏和防风也会比好看更重要。"
          ]
        },
        {
          title: "不建议省掉的项目",
          paragraphs: [
            "帽子、墨镜和外套不要因为天气预报晴朗就省掉。",
            "山里天气说变就变，提前带上比临时后悔更划算。"
          ]
        }
      ],
      tips: ["不要穿新鞋上长线", "高海拔别忽视保暖", "雨具和一次性雨披可以备一个"]
    },
    {
      id: "stay-where",
      title: "新疆住宿怎么选，住景区还是住县城",
      category: "住宿建议",
      readTime: "5 分钟阅读",
      author: "遇见新疆编辑部",
      publishDate: "2026-04-15",
      views: "1.6k",
      likes: "201",
      location: "全疆通用",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/%E6%96%B0%E7%96%86-%E7%A6%BE%E6%9C%A8.%E9%BB%84%E6%98%8F_-_panoramio.jpg",
      excerpt: "如果你更看重晨雾、日出和景区氛围，就住景区；如果更看重舒适度和性价比，住县城会更稳。",
      highlights: ["景区住宿", "县城住宿", "预订时机"],
      sections: [
        {
          title: "住景区的优点",
          paragraphs: [
            "像禾木、喀纳斯、那拉提这类地方，住进去的最大优势是早晚时段更自由，能避开一部分日间人流。",
            "如果你想拍晨雾、日出或者夜空，景区住宿通常更值。"
          ]
        },
        {
          title: "住县城的优点",
          paragraphs: [
            "县城通常选择更多，洗漱、餐饮、停车和补给也更方便，适合自驾用户和带老人孩子的家庭。",
            "缺点是第二天需要更早出发，才能赶在合适时段进入景区。"
          ]
        },
        {
          title: "预订建议",
          paragraphs: [
            "旺季先锁定核心节点住宿，再反推整体路线，会比先排路线再找房更稳。",
            "如果是 7 到 8 月、十一或暑期亲子时段，尽量提前预订可取消房型。"
          ]
        }
      ],
      tips: ["核心景区旺季房量紧张", "自驾尽量关注停车条件", "景区住宿更适合拍早晚景色"]
    }
  ];
  const guideAuthors = [
    {
      nickname: "北境慢游局",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    },
    {
      nickname: "公路旅人阿远",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    },
    {
      nickname: "喀什夜色札记",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    },
    {
      nickname: "边地安全官",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    },
    {
      nickname: "天山装备社",
      avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    },
    {
      nickname: "住哪儿研究所",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=160"
    }
  ];
  const guideFeedMeta = {
    "first-time-xinjiang": {
      primaryTab: "发现",
      cityTab: "同城",
      subCategory: "推荐",
      contentType: "图文",
      likesCount: 318,
      saveCount: 126,
      commentCount: 42,
      coverAspectRatio: 1.28,
      badgeCount: 3,
      locationTag: "乌鲁木齐出发"
    },
    "self-drive-checklist": {
      primaryTab: "发现",
      cityTab: "同城",
      subCategory: "自驾",
      contentType: "视频",
      likesCount: 246,
      saveCount: 108,
      commentCount: 30,
      coverAspectRatio: 1.55,
      badgeCount: 8,
      locationTag: "独库热议"
    },
    "food-guide": {
      primaryTab: "发现",
      cityTab: "同城",
      subCategory: "美食",
      contentType: "图文",
      likesCount: 402,
      saveCount: 176,
      commentCount: 58,
      coverAspectRatio: 1.38,
      badgeCount: 12,
      locationTag: "喀什夜市"
    },
    "desert-safety": {
      primaryTab: "发现",
      cityTab: "同城",
      subCategory: "安全",
      contentType: "视频",
      likesCount: 228,
      saveCount: 96,
      commentCount: 27,
      coverAspectRatio: 1.62,
      badgeCount: 5,
      locationTag: "吐鲁番提醒"
    },
    "tianshan-hiking": {
      primaryTab: "关注",
      cityTab: "同城",
      subCategory: "徒步",
      contentType: "图文",
      likesCount: 173,
      saveCount: 89,
      commentCount: 21,
      coverAspectRatio: 1.48,
      badgeCount: 2,
      locationTag: "天山装备"
    },
    "stay-where": {
      primaryTab: "发现",
      cityTab: "同城",
      subCategory: "住宿",
      contentType: "图文",
      likesCount: 201,
      saveCount: 92,
      commentCount: 18,
      coverAspectRatio: 1.7,
      badgeCount: 6,
      locationTag: "旺季订房"
    }
  };
  function enrichGuide(item, index) {
    const author = guideAuthors[index % guideAuthors.length];
    const feedMeta = guideFeedMeta[item.id] || {};
    return {
      ...item,
      nickname: author.nickname,
      authorAvatar: author.avatar,
      primaryTab: feedMeta.primaryTab || "发现",
      cityTab: feedMeta.cityTab || "同城",
      subCategory: feedMeta.subCategory || "推荐",
      contentType: feedMeta.contentType || "图文",
      likesCount: feedMeta.likesCount || Number.parseInt(item.likes, 10) || 0,
      saveCount: feedMeta.saveCount || 0,
      commentCount: feedMeta.commentCount || 0,
      coverAspectRatio: feedMeta.coverAspectRatio || 1.45,
      badgeCount: feedMeta.badgeCount || 0,
      locationTag: feedMeta.locationTag || item.location
    };
  }
  function getGuideList() {
    return guideList.map((item, index) => enrichGuide(item, index));
  }
  function getGuideById(id) {
    const index = guideList.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    return enrichGuide(guideList[index], index);
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
    return {
      id: item.id,
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
  function buildUrl(path, params = {}) {
    const query = Object.entries(params).filter(([, value]) => value !== void 0 && value !== null && value !== "").map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    return query ? `${GUIDE_API_BASE}${path}?${query}` : `${GUIDE_API_BASE}${path}`;
  }
  function request$2(method, path, data, token = getStoredAuthToken()) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: buildUrl(path, method === "GET" ? data : void 0),
        method,
        timeout: 2e4,
        header: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        data: method === "GET" ? void 0 : data,
        success: (res) => {
          var _a;
          if (res.statusCode < 200 || res.statusCode >= 300) {
            const error = new Error(((_a = res.data) == null ? void 0 : _a.message) || `HTTP ${res.statusCode}`);
            error.statusCode = res.statusCode;
            reject(error);
            return;
          }
          resolve(res.data || {});
        },
        fail: () => {
          reject(new Error("无法连接攻略服务，请检查服务器地址或网络。"));
        }
      });
    });
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
      const data = await request$2("POST", "/guides", payload, token);
      return (data == null ? void 0 : data.data) || null;
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
      return [...publishedGuides, ...getGuideList()];
    }
    const data = await request$2("GET", "/guides", params);
    return Array.isArray(data == null ? void 0 : data.list) ? data.list : [];
  }
  async function getGuideDetail(id) {
    if (!hasGuideApi()) {
      return getPublishedGuideById(id) || getGuideById(id);
    }
    const data = await request$2("GET", `/guides/${encodeURIComponent(id)}`);
    return (data == null ? void 0 : data.data) || null;
  }
  async function getGuideComments(slug) {
    if (!hasGuideApi())
      return [];
    const data = await request$2("GET", `/guides/${encodeURIComponent(slug)}/comments`);
    return (data == null ? void 0 : data.list) || [];
  }
  async function postGuideComment(slug, content, token) {
    const data = await request$2("POST", `/guides/${encodeURIComponent(slug)}/comments`, { content }, token);
    return (data == null ? void 0 : data.comment) || null;
  }
  async function deleteGuideComment(slug, commentId, token) {
    const data = await request$2("DELETE", `/guides/${encodeURIComponent(slug)}/comments/${encodeURIComponent(commentId)}`, void 0, token);
    return Boolean(data == null ? void 0 : data.ok);
  }
  async function likeGuide(slug, token) {
    const data = await request$2("POST", `/guides/${encodeURIComponent(slug)}/like`, void 0, token);
    return data || null;
  }
  async function unlikeGuide(slug, token) {
    const data = await request$2("DELETE", `/guides/${encodeURIComponent(slug)}/like`, void 0, token);
    return data || null;
  }
  async function saveGuide(slug, token) {
    const data = await request$2("POST", `/guides/${encodeURIComponent(slug)}/save`, void 0, token);
    return data || null;
  }
  async function unsaveGuide(slug, token) {
    const data = await request$2("DELETE", `/guides/${encodeURIComponent(slug)}/save`, void 0, token);
    return data || null;
  }
  const _sfc_main$e = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const primaryTabs = ["关注", "发现", "同城"];
      const allSubTabs = ["推荐", "自驾", "美食", "安全", "徒步", "住宿"];
      const visibleSubTabs = allSubTabs.slice(0, 5);
      const activePrimaryTab = vue.ref("发现");
      const activeSubTab = vue.ref("推荐");
      const guides = vue.ref([]);
      const showCategoryPanel = vue.ref(false);
      const loading = vue.ref(false);
      const errorMessage = vue.ref("");
      const detectedCity = vue.ref("");
      const cityLoading = vue.ref(false);
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const isLoggedIn = vue.computed(() => Boolean(getStoredAuthToken() && currentUser.value));
      const filteredGuides = vue.computed(() => {
        return guides.value.filter((item) => {
          const primaryMatched = activePrimaryTab.value === "同城" ? isSameCityGuide(item) : true;
          if (!primaryMatched) {
            return false;
          }
          if (activeSubTab.value === "推荐") {
            return true;
          }
          return item.subCategory === activeSubTab.value;
        });
      });
      const feedBadgeCount = vue.computed(() => {
        return guides.value.reduce((total, item) => total + (item.badgeCount || 0), 0);
      });
      const feedSummary = vue.computed(() => {
        const total = filteredGuides.value.length;
        if (activePrimaryTab.value === "关注" && !isLoggedIn.value) {
          return "登录后即可查看已关注作者的最新攻略，并让推荐流优先展示他们的更新。";
        }
        if (loading.value) {
          return "正在同步后台攻略流和推荐排序。";
        }
        if (activePrimaryTab.value === "同城" && cityLoading.value) {
          return "正在定位你所在的城市，同城内容会按当前位置筛选。";
        }
        if (errorMessage.value) {
          return "连接攻略服务失败，重新加载后会继续请求真实内容流。";
        }
        if (!total) {
          return activePrimaryTab.value === "关注" ? "你关注的作者暂时还没有发布符合当前分类的攻略。" : "当前分类还没有可展示的真实攻略内容。";
        }
        if (activePrimaryTab.value === "关注") {
          return `当前展示 ${total} 条关注作者攻略，按发布时间和作者关系优先展示。`;
        }
        if (activePrimaryTab.value === "同城") {
          return detectedCity.value ? `当前展示 ${total} 条 ${detectedCity.value} 同城攻略。` : `当前展示 ${total} 条同城攻略，定位成功后会自动收敛到你所在城市。`;
        }
        return `当前展示 ${total} 条真实攻略，推荐排序会优先考虑你已关注作者的新内容。`;
      });
      const emptyTitle = vue.computed(() => {
        if (activePrimaryTab.value === "关注" && !isLoggedIn.value) {
          return "登录后查看关注流";
        }
        if (activePrimaryTab.value === "关注") {
          return "关注流还没有内容";
        }
        if (activePrimaryTab.value === "同城") {
          return detectedCity.value ? `${detectedCity.value} 暂时还没有内容` : "定位后查看同城流";
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
          return detectedCity.value ? `暂时还没有来自 ${detectedCity.value} 的攻略，稍后再刷新看看。` : "允许定位后，这里会自动显示你当前城市的攻略，比如人在乌鲁木齐就看乌鲁木齐。";
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
        showCategoryPanel.value = !showCategoryPanel.value;
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
          const location = await getCurrentLocation();
          const regeo = await reverseGeocode(location.longitude, location.latitude);
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
      const __returned__ = { primaryTabs, allSubTabs, visibleSubTabs, activePrimaryTab, activeSubTab, guides, showCategoryPanel, loading, errorMessage, detectedCity, cityLoading, systemInfo, statusBarHeight, statusBarStyle, currentUser, isLoggedIn, filteredGuides, feedBadgeCount, feedSummary, emptyTitle, emptyDescription, waterfallColumns, leftColumn, rightColumn, setPrimaryTab, setSubTab, toggleCategoryPanel, selectCategory, coverStyle, estimateFeedCardHeight, hasVisualCover, noteSummary, formatCount, openGuide, publishGuide, loadGuides, ensureDetectedCity, normalizeCityName, isSameCityGuide, computed: vue.computed, ref: vue.ref, watch: vue.watch, get onShow() {
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
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
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
            vue.createElementVNode("view", { class: "hero-action left-action" }, "≡"),
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
              vue.createElementVNode("view", { class: "hero-action" }, "⌕"),
              vue.createElementVNode("view", { class: "hero-action" }, "◎")
            ])
          ]),
          vue.createElementVNode("view", { class: "section hero-copy" }, [
            vue.createElementVNode("text", { class: "hero-title" }, "新疆发现页"),
            vue.createElementVNode("text", { class: "hero-subtitle" }, "真实攻略流已接入后台，发现页会优先推荐你关注作者发布的新内容。")
          ])
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
        vue.createElementVNode("view", { class: "section trend-strip" }, [
          vue.createElementVNode("view", { class: "trend-card" }, [
            vue.createElementVNode("view", { class: "trend-main" }, [
              vue.createElementVNode("text", { class: "trend-label" }, "热议"),
              vue.createElementVNode(
                "text",
                { class: "trend-value" },
                vue.toDisplayString($setup.activeSubTab),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode(
              "text",
              { class: "trend-copy" },
              vue.toDisplayString($setup.feedSummary),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "trend-card accent-card" }, [
            vue.createElementVNode("text", { class: "trend-small" }, "同城速递"),
            vue.createElementVNode("text", { class: "trend-copy" }, "乌鲁木齐、伊宁、喀什等同城内容会保留独立筛选，推荐结果基于真实数据刷新。")
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
                        vue.createElementVNode("image", {
                          class: "author-avatar",
                          src: item.authorAvatar,
                          mode: "aspectFill"
                        }, null, 8, ["src"]),
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
                        vue.createElementVNode("image", {
                          class: "author-avatar",
                          src: item.authorAvatar,
                          mode: "aspectFill"
                        }, null, 8, ["src"]),
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
          onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
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
  const PagesGuidesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-4aabec35"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guides/index.vue"]]);
  function request$1(path, data) {
    return new Promise((resolve, reject) => {
      if (!hasAuthApiBaseUrl()) {
        reject(new Error("认证服务地址未配置，请先在 config/auth.js 中填写 AUTH_API_BASE_URL。"));
        return;
      }
      uni.request({
        url: `${AUTH_API_BASE_URL}${path}`,
        method: "POST",
        timeout: 15e3,
        header: {
          "Content-Type": "application/json"
        },
        data,
        success: (res) => {
          var _a;
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || `请求失败(${res.statusCode})`));
            return;
          }
          resolve(res.data || {});
        },
        fail: () => {
          reject(new Error("无法连接认证服务，请检查服务器地址或网络。"));
        }
      });
    });
  }
  async function loginWithPassword(payload) {
    return request$1("/auth/login", payload);
  }
  async function registerWithPassword(payload) {
    return request$1("/auth/register", payload);
  }
  function authRequest(path, method, token, data) {
    return new Promise((resolve, reject) => {
      if (!hasAuthApiBaseUrl()) {
        reject(new Error("认证服务地址未配置"));
        return;
      }
      uni.request({
        url: `${AUTH_API_BASE_URL}${path}`,
        method,
        timeout: 15e3,
        header: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        data: method === "GET" ? void 0 : data,
        success: (res) => {
          var _a;
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || `请求失败(${res.statusCode})`));
            return;
          }
          resolve(res.data || {});
        },
        fail: () => reject(new Error("无法连接服务器"))
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
          resolve(data);
        },
        fail: () => reject(new Error("上传失败，请检查网络"))
      });
    });
  }
  function updateUserProfile(token, payload) {
    return authRequest("/users/me", "PATCH", token, payload);
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
  const _sfc_main$d = {
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
      const showFollowButton = vue.computed(() => {
        var _a;
        return Boolean((_a = guide.value) == null ? void 0 : _a.authorId);
      });
      const commentInputAvatar = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = guide.value) == null ? void 0 : _b.authorAvatar) || "";
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
      const __returned__ = { guide, activeImageIndex, followLoading, detailLoading, isLiked, isSaved, likeCount, saveCount, likeSubmitting, saveSubmitting, comments, commentInput, commentSubmitting, commentInputFocused, commentsLoading, commentError, commentDeletingId, systemInfo, statusBarHeight, statusBarStyle, guideImages, hasVideo, currentUser, isOwnAuthor, showFollowButton, commentInputAvatar, commentSubmitDisabled, commentSummary, followButtonText, detailTags, searchHint, toggleLike, toggleSave, focusComment, handleCommentBlur, loadComments, reloadComments, submitComment, promptLoginForComment, removeComment, goBack, handleSwiperChange, previewImage, handleFollowTap, formatCount, formatPublishMeta, formatCommentTime, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, CachedImage, get clearAuthSession() {
        return clearAuthSession;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get followUser() {
        return followUser;
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
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
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
            vue.createElementVNode("image", {
              class: "author-avatar",
              src: $setup.guide.authorAvatar,
              mode: "aspectFill"
            }, null, 8, ["src"]),
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
          ])) : vue.createCommentVNode("v-if", true),
          !$setup.hasVideo && !$setup.guideImages.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 4,
            class: "text-hero-card section"
          }, [
            vue.createElementVNode(
              "text",
              { class: "text-hero-kicker" },
              vue.toDisplayString($setup.guide.locationTag || "新疆同城"),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "text-hero-copy" },
              vue.toDisplayString($setup.guide.summaryText || $setup.guide.excerpt || "这是一条没有配图的文字笔记，适合直接查看内容和标签。"),
              1
              /* TEXT */
            )
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
          $setup.detailTags.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
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
          vue.createElementVNode("image", {
            class: "comment-avatar",
            src: $setup.commentInputAvatar,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "fake-input" }, "留下你的想法吧")
        ]),
        $setup.commentsLoading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "comment-state section"
        }, [
          vue.createElementVNode("text", { class: "comment-state-text" }, "评论加载中...")
        ])) : $setup.commentError ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
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
          key: 2,
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
                vue.createElementVNode("image", {
                  class: "comment-avatar",
                  src: c.avatarUrl || $setup.guide.authorAvatar,
                  mode: "aspectFill"
                }, null, 8, ["src"]),
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
          key: 3,
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
  const PagesGuideDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-202be074"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guide-detail/index.vue"]]);
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
      const systemInfo = typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : {};
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const statusBarStyle = vue.computed(() => ({ height: `${statusBarHeight}px` }));
      const currentUser = vue.computed(() => getStoredAuthUser() || null);
      const authorAvatar = vue.computed(() => {
        var _a, _b;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || ((_b = currentUser.value) == null ? void 0 : _b.avatar) || defaultCoverOptions[1];
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
        loadCurrentLocation();
        setTimeout(() => {
          autoFocusTitle.value = true;
        }, 50);
      });
      function createDefaultPublishForm() {
        return {
          title: "",
          excerpt: "",
          tagText: "",
          locationTag: "",
          locationLatitude: null,
          locationLongitude: null,
          images: [],
          video: "",
          videoPoster: ""
        };
      }
      async function loadCurrentLocation() {
        locating.value = true;
        locationFailed.value = false;
        try {
          const coords = await getCurrentLocation();
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
        showLocationPicker.value = true;
      }
      function closeLocationPicker() {
        showLocationPicker.value = false;
      }
      function selectLocationOption(option) {
        publishForm.locationTag = (option == null ? void 0 : option.value) || publishForm.locationTag;
        closeLocationPicker();
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
          const guidePayload = {
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
            cityTab: "同城"
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
      const __returned__ = { publishSubmitting, publishError, autoFocusTitle, locating, locationFailed, showLocationPicker, locationOptionsLoading, locationOptions, publishForm, systemInfo, statusBarHeight, statusBarStyle, currentUser, authorAvatar, derivedContentType, derivedSubCategory, locationTagText, mediaSummary, locationStatusText, locationStatusClass, createDefaultPublishForm, loadCurrentLocation, normalizeLocationPart: normalizeLocationPart2, formatLocationTag, loadNearbyLocationOptions, reloadCurrentLocation, openLocationPicker, closeLocationPicker, selectLocationOption, locationSourceText, inferSubCategory, mapCategoryName, goBack, removePublishImage, removePublishVideo, pickMedia, pickPublishImages, pickPublishVideo, submitPublishedGuide, validatePublishedGuide, computed: vue.computed, reactive: vue.reactive, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get addPublishedGuide() {
        return addPublishedGuide;
      }, get defaultCoverOptions() {
        return defaultCoverOptions;
      }, get persistGuideImages() {
        return persistGuideImages;
      }, get persistLocalFile() {
        return persistLocalFile;
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
            vue.createElementVNode("image", {
              class: "composer-avatar",
              src: $setup.authorAvatar,
              mode: "aspectFill"
            }, null, 8, ["src"]),
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
            vue.createElementVNode("image", {
              class: "video-poster",
              src: $setup.publishForm.videoPoster,
              mode: "aspectFill"
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
                  vue.createElementVNode("image", {
                    class: "image-thumb",
                    src: item,
                    mode: "aspectFill"
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
  const AI_API_KEY = "";
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
  function saveAiApiKey(value) {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed) {
      uni.removeStorageSync(AI_API_KEY_STORAGE);
      return "";
    }
    uni.setStorageSync(AI_API_KEY_STORAGE, trimmed);
    return trimmed;
  }
  function clearAiMessages() {
    uni.removeStorageSync(AI_MESSAGE_STORAGE);
  }
  const SYSTEM_PROMPT = `你是“遇见新疆”App 内的 AI 旅游助手。你的主要职责是回答新疆旅行相关问题，并优先基于应用内已有景点、攻略和基础信息给出建议。

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
  const MAX_GUIDE_CONTEXT_ITEMS = 8;
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
    const guideText = getGuideList().slice(0, MAX_GUIDE_CONTEXT_ITEMS).map((item) => `${item.title}（${item.category}）：${item.excerpt}`).join("\n");
    const tipText = quickTips.map((item) => `${item.title}：${item.description}`).join("\n");
    const infoText = essentialInfo.map((item) => `${item.label}：${item.value}`).join("\n");
    return `${guideText}
${tipText}
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
  async function testTravelAssistantConnection() {
    var _a, _b, _c;
    const apiKey = getAiApiKey();
    if (!apiKey) {
      throw new Error("请先在本页保存百炼 API Key，再开始测试。");
    }
    const start = Date.now();
    const payload = {
      model: AI_MODEL,
      messages: [
        {
          role: "user",
          content: "你好，请只回复“连接成功”。"
        }
      ],
      enable_thinking: false,
      temperature: 0.1,
      max_tokens: 32
    };
    try {
      const data = await request(`${AI_BASE_URL}/chat/completions`, payload);
      const text = getAssistantText((_c = (_b = (_a = data == null ? void 0 : data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content);
      if (!text) {
        throw new Error("模型没有返回有效内容。");
      }
      return {
        text,
        elapsedMs: Date.now() - start,
        model: (data == null ? void 0 : data.model) || AI_MODEL,
        id: (data == null ? void 0 : data.id) || ""
      };
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
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
  const _sfc_main$b = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const presetQuestions = getTravelAssistantPresetQuestions();
      const savedApiKey = vue.ref(getAiApiKey());
      const apiKeyInput = vue.ref(savedApiKey.value);
      const draft = vue.ref("");
      const sending = vue.ref(false);
      const testing = vue.ref(false);
      const errorMessage = vue.ref("");
      const testResult = vue.ref(null);
      const messages = vue.ref(loadMessages());
      const incomingContextTitle = vue.ref("");
      const incomingContextDesc = vue.ref("");
      const incomingContextSource = vue.ref("景区页");
      const incomingPrompt = vue.ref("");
      const incomingContext = vue.ref("");
      const hasApiKey = vue.computed(() => Boolean(savedApiKey.value));
      const canSend = vue.computed(() => Boolean(draft.value.trim()) && !sending.value && hasApiKey.value);
      function getMessageBlocks(item) {
        if (!(item == null ? void 0 : item.content)) {
          return [];
        }
        return parseAssistantMarkdown(item.content);
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
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          return [];
        }
      }
      function persistMessages() {
        uni.setStorageSync(AI_MESSAGE_STORAGE, JSON.stringify(messages.value));
      }
      function createMessage(role, content) {
        return {
          id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role,
          content,
          createdAt: Date.now()
        };
      }
      function saveApiKeyToStorage() {
        const value = saveAiApiKey(apiKeyInput.value);
        savedApiKey.value = value;
        apiKeyInput.value = value;
        errorMessage.value = "";
        testResult.value = null;
        uni.showToast({
          title: value ? "已保存到本机" : "已清除本地 Key",
          icon: "none"
        });
      }
      async function runConnectionTest() {
        if (testing.value) {
          return;
        }
        if (!hasApiKey.value) {
          errorMessage.value = "请先保存百炼 API Key，再开始测试。";
          testResult.value = null;
          return;
        }
        testing.value = true;
        errorMessage.value = "";
        testResult.value = null;
        try {
          const result = await testTravelAssistantConnection();
          testResult.value = {
            ok: true,
            message: `模型返回：${result.text}`,
            meta: `模型：${result.model} ｜ 耗时：${result.elapsedMs}ms`
          };
        } catch (error) {
          testResult.value = {
            ok: false,
            message: error.message || "连接测试失败",
            meta: "请先确认 Key 是否完整、当前网络是否可访问百炼接口。"
          };
        } finally {
          testing.value = false;
        }
      }
      function clearConversation() {
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
        const userMessage = createMessage("user", content);
        const nextMessages = [...messages.value, userMessage];
        messages.value = nextMessages;
        persistMessages();
        sending.value = true;
        await scrollToConversationBottom();
        try {
          const answer = await chatWithTravelAssistant(nextMessages, extraContext);
          messages.value = [...nextMessages, createMessage("assistant", answer)];
          persistMessages();
          await scrollToConversationBottom();
        } catch (error) {
          messages.value = nextMessages;
          persistMessages();
          errorMessage.value = error.message || "AI 响应失败，请稍后再试。";
          uni.showToast({
            title: errorMessage.value,
            icon: "none",
            duration: 2500
          });
        } finally {
          sending.value = false;
        }
      }
      async function scrollToConversationBottom() {
        await vue.nextTick();
        setTimeout(() => {
          uni.pageScrollTo({
            selector: "#ai-response-anchor",
            duration: 280
          });
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
      const __returned__ = { presetQuestions, savedApiKey, apiKeyInput, draft, sending, testing, errorMessage, testResult, messages, incomingContextTitle, incomingContextDesc, incomingContextSource, incomingPrompt, incomingContext, hasApiKey, canSend, getMessageBlocks, parseAssistantMarkdown, formatInlineMarkdown, decodeParam, loadMessages, persistMessages, createMessage, saveApiKeyToStorage, runConnectionTest, clearConversation, sendQuestion, scrollToConversationBottom, sendDraft, sendPresetQuestion, fillIncomingPrompt, sendIncomingPrompt, computed: vue.computed, nextTick: vue.nextTick, ref: vue.ref, get onLoad() {
        return onLoad;
      }, AppTabBar, get AI_MESSAGE_STORAGE() {
        return AI_MESSAGE_STORAGE;
      }, get clearAiMessages() {
        return clearAiMessages;
      }, get getAiApiKey() {
        return getAiApiKey;
      }, get saveAiApiKey() {
        return saveAiApiKey;
      }, get chatWithTravelAssistant() {
        return chatWithTravelAssistant;
      }, get getTravelAssistantPresetQuestions() {
        return getTravelAssistantPresetQuestions;
      }, get testTravelAssistantConnection() {
        return testTravelAssistantConnection;
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
            vue.createElementVNode("view", { class: "private-tools" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.apiKeyInput = $event),
                  password: "",
                  class: "mini-key-input"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.apiKeyInput]
              ]),
              vue.createElementVNode("view", {
                class: "mini-action",
                onClick: $setup.saveApiKeyToStorage
              }, "存"),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["mini-action dark", { disabled: $setup.testing }]),
                  onClick: $setup.runConnectionTest
                },
                vue.toDisplayString($setup.testing ? "..." : "测"),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "hero-copy" }, [
              vue.createElementVNode("text", { class: "hero-kicker" }, "Meet Xinjiang AI"),
              vue.createElementVNode("text", { class: "banner-title" }, "AI 旅游助手"),
              vue.createElementVNode("text", { class: "banner-subtitle" }, "面向新疆旅行场景的问答与行程建议")
            ]),
            vue.createElementVNode("view", { class: "hero-meta" }, [
              vue.createElementVNode("view", { class: "meta-item" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "定位"),
                vue.createElementVNode("text", { class: "meta-value" }, "目的地推荐")
              ]),
              vue.createElementVNode("view", { class: "meta-divider" }),
              vue.createElementVNode("view", { class: "meta-item" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "能力"),
                vue.createElementVNode("text", { class: "meta-value" }, "行程规划")
              ]),
              vue.createElementVNode("view", { class: "meta-divider" }),
              vue.createElementVNode("view", { class: "meta-item" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "风格"),
                vue.createElementVNode("text", { class: "meta-value" }, "简洁实用")
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
        vue.createElementVNode("view", { class: "section capability-shell" }, [
          vue.createElementVNode("view", { class: "capability-grid" }, [
            vue.createElementVNode("view", { class: "capability-item" }, [
              vue.createElementVNode("text", { class: "capability-name" }, "行程规划"),
              vue.createElementVNode("text", { class: "capability-desc" }, "按天数给出新疆旅行安排")
            ]),
            vue.createElementVNode("view", { class: "capability-item" }, [
              vue.createElementVNode("text", { class: "capability-name" }, "目的地选择"),
              vue.createElementVNode("text", { class: "capability-desc" }, "结合景点资料给路线建议")
            ]),
            vue.createElementVNode("view", { class: "capability-item" }, [
              vue.createElementVNode("text", { class: "capability-name" }, "出行提醒"),
              vue.createElementVNode("text", { class: "capability-desc" }, "装备、预算与季节建议")
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
        $setup.testResult ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "section test-shell"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["test-card", { failed: !$setup.testResult.ok }])
            },
            [
              vue.createElementVNode(
                "text",
                { class: "test-title" },
                vue.toDisplayString($setup.testResult.ok ? "连接测试成功" : "连接测试失败"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "test-desc" },
                vue.toDisplayString($setup.testResult.message),
                1
                /* TEXT */
              ),
              $setup.testResult.meta ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "test-meta muted-text"
                },
                vue.toDisplayString($setup.testResult.meta),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
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
            vue.createElementVNode("view", null, [
              vue.createElementVNode("text", { class: "section-title" }, "智能顾问工作台"),
              vue.createElementVNode("text", { class: "dialogue-note muted-text" }, "结构化输出新疆旅行建议")
            ]),
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
                  vue.toDisplayString($setup.sending ? "生成中" : `${$setup.messages.length} 条记录`),
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
              vue.createElementVNode("text", { class: "empty-title" }, "从一个具体问题开始"),
              vue.createElementVNode("text", { class: "empty-desc muted-text" }, " 例如新疆第一次去怎么玩、喀纳斯安排几天、乌鲁木齐夜游吃什么。 ")
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
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["message-bubble", { "assistant-bubble": item.role === "assistant" }])
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            { class: "message-role" },
                            vue.toDisplayString(item.role === "user" ? "用户" : "AI助手"),
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
                          )) : (vue.openBlock(), vue.createElementBlock("view", {
                            key: 1,
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
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])),
            $setup.sending ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "typing-row"
            }, [
              vue.createElementVNode("view", { class: "typing-card" }, [
                vue.createElementVNode("text", { class: "typing-text" }, "AI 正在整理建议...")
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
        vue.createElementVNode("view", { class: "composer card" }, [
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.draft = $event),
              class: "composer-input",
              "auto-height": "",
              maxlength: "800",
              placeholder: "输入你的旅行问题，例如：新疆 7 天怎么安排？"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.draft]
          ]),
          vue.createElementVNode("view", { class: "composer-foot" }, [
            vue.createElementVNode(
              "text",
              { class: "muted-text composer-hint" },
              vue.toDisplayString($setup.hasApiKey ? "已连接 AI 旅游助手" : "请先填写内部 Key"),
              1
              /* TEXT */
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
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/ai-assistant/index" })
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
        var _a;
        return ((_a = currentUser.value) == null ? void 0 : _a.avatar_url) || "";
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
      function loadAuthState() {
        authToken.value = getStoredAuthToken();
        currentUser.value = getStoredAuthUser();
        if (isLoggedIn.value) {
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
              const fullUrl = res.avatar_url.startsWith("http") ? res.avatar_url : `https://111.20.31.227:34144${res.avatar_url}`;
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
        var _a;
        const nickname = editNickname.value.trim();
        if (!nickname) {
          editModalVisible.value = false;
          return;
        }
        const payload = { nickname };
        if (nickname === ((_a = currentUser.value) == null ? void 0 : _a.nickname)) {
          editModalVisible.value = false;
          return;
        }
        try {
          const res = await updateUserProfile(authToken.value, payload);
          saveAuthSession({ token: authToken.value, user: res.user });
          currentUser.value = res.user;
          editModalVisible.value = false;
          uni.showToast({ title: "资料已更新", icon: "success" });
        } catch (e) {
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
      const __returned__ = { currentUser, authToken, myGuides, myGuidesLoading, favoriteGuides, favoriteGuidesLoading, accountStats, editModalVisible, editNickname, isLoggedIn, profileName, profileEmail, avatarUrl, profileInitial, profileStats, loadAuthState, loadMyStats, loadMyGuides, loadFavoriteGuides, chooseAvatar, openEditModal, saveProfile, goGuide, goAuth, goSettings, computed: vue.computed, ref: vue.ref, get onShow() {
        return onShow;
      }, AppTabBar, get clearAuthSession() {
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
      }, get getMyStats() {
        return getMyStats;
      }, get updateUserProfile() {
        return updateUserProfile;
      }, get uploadAvatar() {
        return uploadAvatar;
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
              $setup.avatarUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: $setup.avatarUrl,
                class: "avatar-img",
                mode: "aspectFill"
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
                  g.image ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: g.image,
                    class: "guide-thumb",
                    mode: "aspectFill"
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
                  g.image ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: g.image,
                    class: "guide-thumb",
                    mode: "aspectFill"
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
          vue.createElementVNode("text", { class: "muted-text" }, "遇见新疆 v1.0.0"),
          vue.createElementVNode("text", { class: "muted-text" }, "© 2026 遇见新疆，保留所有权利")
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
          vue.createElementVNode("text", { class: "auth-title" }, "登录 / 注册"),
          vue.createElementVNode("text", { class: "auth-subtitle" }, "先把账号体系接好，后续只需要填服务器地址和 PostgreSQL 配置就能连起来。")
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
            ),
            vue.createElementVNode("text", { class: "auth-note muted-text" }, "接口已预留，后续把认证服务地址填到 `config/auth.js` 即可联调。")
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "当前预留接口"),
          vue.createElementVNode("view", { class: "card reserve-card" }, [
            vue.createElementVNode("view", { class: "reserve-row" }, [
              vue.createElementVNode("text", { class: "reserve-tag" }, "POST"),
              vue.createElementVNode("text", { class: "reserve-path" }, "/auth/register")
            ]),
            vue.createElementVNode("text", { class: "reserve-desc muted-text" }, "注册账号，建议返回 `token`、`user`。"),
            vue.createElementVNode("view", { class: "reserve-row second" }, [
              vue.createElementVNode("text", { class: "reserve-tag" }, "POST"),
              vue.createElementVNode("text", { class: "reserve-path" }, "/auth/login")
            ]),
            vue.createElementVNode("text", { class: "reserve-desc muted-text" }, "邮箱 + 密码登录，建议返回 `token`、`user`。")
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
    const downloadRes = await uni.downloadFile({
      url: mapUrl
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
      sourceUrl: mapUrl,
      version: version || "v1",
      downloadedAt: Date.now(),
      metadata: metadata || null
    };
    saveOfflineMapRecord(destinationId, record);
    return record;
  }
  async function deleteOfflineMap(destinationId) {
    const record = getOfflineMapRecord(destinationId);
    if (record == null ? void 0 : record.savedFilePath) {
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
        title: "景区安全图",
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
      const safetyMapImageUrl = vue.computed(() => {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return "";
        }
        return getStaticMapUrl({
          longitude: coords.longitude,
          latitude: coords.latitude,
          zoom: destinationSafetyMap.value.zoom,
          size: "900*540",
          markers: [
            { longitude: coords.longitude, latitude: coords.latitude, label: "景", size: "large" }
          ]
        });
      });
      const offlineMapVersion = vue.computed(() => `map-${currentId.value || "default"}-v2`);
      const offlineMapAvailable = vue.computed(() => Boolean(safetyMapImageUrl.value));
      const hasOfflineMap = vue.computed(() => {
        var _a;
        return Boolean((_a = offlineMapRecord.value) == null ? void 0 : _a.savedFilePath);
      });
      const hasOfflineMapUpdate = vue.computed(() => {
        var _a, _b;
        if (!hasOfflineMap.value || !offlineMapAvailable.value) {
          return false;
        }
        return ((_a = offlineMapRecord.value) == null ? void 0 : _a.sourceUrl) !== safetyMapImageUrl.value || ((_b = offlineMapRecord.value) == null ? void 0 : _b.version) !== offlineMapVersion.value;
      });
      const offlineMapStatusText = vue.computed(() => {
        if (offlineMapBusy.value) {
          return "下载中";
        }
        if (hasOfflineMapUpdate.value) {
          return "可更新";
        }
        if (hasOfflineMap.value) {
          return "已下载";
        }
        return offlineMapAvailable.value ? "未下载" : "暂未提供";
      });
      const offlineMapSupportText = vue.computed(() => {
        return offlineMapAvailable.value ? "支持下载景区级离线安全图" : "当前景区暂未生成离线地图资源";
      });
      const offlineMapLocalText = vue.computed(() => {
        var _a;
        if (!hasOfflineMap.value) {
          return "本地暂无离线文件";
        }
        const timeText = formatDateTime((_a = offlineMapRecord.value) == null ? void 0 : _a.downloadedAt);
        return timeText ? `已保存，下载于 ${timeText}` : "已保存到本地";
      });
      const offlineMapButtonText = vue.computed(() => {
        if (offlineMapBusy.value) {
          return "下载中...";
        }
        if (hasOfflineMapUpdate.value) {
          return "更新离线地图";
        }
        if (hasOfflineMap.value) {
          return "重新下载离线地图";
        }
        return "下载离线地图";
      });
      const safetyTips = vue.computed(() => {
        if (!destination.value) {
          return [];
        }
        const tips = [
          {
            title: "弱网先备份",
            desc: `出发前先下载 ${destination.value.name} 景区级离线安全图，优先保存主入口、返程口和游客中心位置。`
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
      onLoad(async (options) => {
        currentId.value = (options == null ? void 0 : options.id) || "";
        syncOfflineMapState();
        await refreshLocationAndWeather();
      });
      onShow(() => {
        syncOfflineMapState();
      });
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
          const location = await getCurrentLocation();
          const route = await loadRoute(location, scenicCoords, routeMode.value);
          if (location) {
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
      function syncOfflineMapState() {
        if (!currentId.value) {
          offlineMapRecord.value = null;
          return;
        }
        offlineMapRecord.value = getOfflineMapRecord(currentId.value);
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
            mapUrl: safetyMapImageUrl.value,
            version: offlineMapVersion.value,
            metadata: destinationSafetyMap.value
          });
          syncOfflineMapState();
          uni.showToast({
            title: "离线地图已保存",
            icon: "none"
          });
        } catch (error) {
          uni.showModal({
            title: "下载失败",
            content: error.message || "离线地图下载失败，请稍后再试。",
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
          title: "删除离线地图",
          content: "确认删除当前景区已下载的离线地图吗？删除后需要重新下载。",
          success: async ({ confirm }) => {
            if (!confirm) {
              return;
            }
            await deleteOfflineMap(currentId.value);
            syncOfflineMapState();
            uni.showToast({
              title: "已删除离线地图",
              icon: "none"
            });
          }
        });
      }
      function openDouyinSearch() {
        if (!destination.value) {
          return;
        }
        const url = getDouyinSearchUrl(destination.value.liveKeyword);
        if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
          plus.runtime.openURL(url);
          return;
        }
        if (typeof window !== "undefined" && window.open) {
          window.open(url, "_blank");
          return;
        }
        uni.setClipboardData({
          data: destination.value.liveKeyword,
          success: () => {
            uni.showModal({
              title: "已准备跳转",
              content: "已复制抖音搜索词。当前端若不支持直接打开抖音，请手动粘贴搜索。",
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
      function openScenicLocation() {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
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
      const __returned__ = { routeModeOptions, currentId, destination, destinationCulture, destinationTravelMeta, destinationVisitMeta, destinationSafetyMap, locationReady, locationStatusText, routeMode, routeData, liveWeatherData, weatherError, offlineMapRecord, offlineMapBusy, liveWeather, hasRealWeather, weatherSourceText, scenicLocationText, routeDurationText, routeDistanceText, taxiCostText, mapImageUrl, safetyMapImageUrl, offlineMapVersion, offlineMapAvailable, hasOfflineMap, hasOfflineMapUpdate, offlineMapStatusText, offlineMapSupportText, offlineMapLocalText, offlineMapButtonText, safetyTips, refreshLocationAndWeather, changeRouteMode, loadRoute, formatDuration, formatDistance, goBack, syncOfflineMapState, handleOfflineMapDownload, openOfflineMap, openSafetyMapPage, deleteOfflineMapWithConfirm, openDouyinSearch, copyKeyword, openScenicLocation, openAiAssistantForScenic, openAiAssistantForRoute, openAiAssistant, buildAiAssistantParams, formatDateTime, computed: vue.computed, ref: vue.ref, get onLoad() {
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
      }, get reverseGeocode() {
        return reverseGeocode;
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
          vue.createElementVNode("text", { class: "section-title" }, "景区介绍"),
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
            vue.createElementVNode("view", { class: "story-row" }, [
              vue.createElementVNode("text", { class: "story-label" }, "历史由来"),
              vue.createElementVNode(
                "text",
                { class: "story-text" },
                vue.toDisplayString($setup.destinationCulture.history),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "story-row last-row" }, [
              vue.createElementVNode("text", { class: "story-label" }, "值得了解"),
              vue.createElementVNode(
                "text",
                { class: "story-text" },
                vue.toDisplayString($setup.destinationCulture.highlights),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "地图与定位"),
          vue.createElementVNode("view", { class: "map-card card" }, [
            vue.createElementVNode("view", { class: "map-head" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("text", { class: "map-title" }, "景区位置与导航"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "展示景区地图位置，并可估算当前出发的时间和距离")
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
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "安全保障"),
          vue.createElementVNode("view", { class: "safety-card card" }, [
            vue.createElementVNode("view", { class: "safety-head" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("text", { class: "map-title" }, "离线地图与应急提醒"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "进入山区、峡谷或高原前，建议先把景区离线地图下载到本地，弱网时也能快速查看位置参考。")
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
                vue.createElementVNode("text", { class: "travel-meta-label" }, "安全等级"),
                vue.createElementVNode(
                  "text",
                  { class: "travel-meta-value" },
                  vue.toDisplayString($setup.destinationSafetyMap.emergencyLevel),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "safety-map-preview" }, [
              vue.createVNode($setup["CachedImage"], {
                src: $setup.safetyMapImageUrl,
                "image-class": "cover-image"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "safety-map-badge" }, "景区核心安全参考图")
            ]),
            vue.createElementVNode("view", { class: "offline-meta-grid compact-grid" }, [
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
            ]),
            vue.createElementVNode("view", { class: "safety-legend card-lite" }, [
              vue.createElementVNode("text", { class: "safety-item-title" }, "安全图重点"),
              vue.createElementVNode(
                "text",
                { class: "safety-item-desc muted-text" },
                vue.toDisplayString($setup.destinationSafetyMap.highlights.join("；")),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "safety-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.safetyTips, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.title,
                    class: "safety-item card-lite"
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
            vue.createElementVNode("view", { class: "map-actions safety-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-btn",
                onClick: $setup.openSafetyMapPage
              }, "查看完整安全图"),
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
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["secondary-btn", { disabled: !$setup.hasOfflineMap }]),
                  onClick: $setup.openOfflineMap
                },
                "打开离线安全图",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["secondary-btn", { disabled: !$setup.hasOfflineMap }]),
                  onClick: $setup.deleteOfflineMapWithConfirm
                },
                "删除离线地图",
                2
                /* CLASS */
              )
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "当地天气"),
          vue.createElementVNode("view", { class: "weather-card card" }, [
            vue.createElementVNode("view", { class: "weather-main" }, [
              vue.createElementVNode(
                "text",
                { class: "weather-temp" },
                vue.toDisplayString($setup.liveWeather.temperature),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "weather-texts" }, [
                vue.createElementVNode(
                  "text",
                  { class: "weather-condition" },
                  vue.toDisplayString($setup.liveWeather.condition),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "muted-text" },
                  vue.toDisplayString($setup.weatherSourceText),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "weather-grid" }, [
              vue.createElementVNode("view", { class: "weather-item" }, [
                vue.createElementVNode("text", { class: "weather-label" }, "湿度"),
                vue.createElementVNode(
                  "text",
                  { class: "weather-value" },
                  vue.toDisplayString($setup.liveWeather.humidity),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "weather-item" }, [
                vue.createElementVNode("text", { class: "weather-label" }, "风力"),
                vue.createElementVNode(
                  "text",
                  { class: "weather-value" },
                  vue.toDisplayString($setup.liveWeather.wind),
                  1
                  /* TEXT */
                )
              ])
            ]),
            $setup.weatherError ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "weather-note"
              },
              vue.toDisplayString($setup.weatherError),
              1
              /* TEXT */
            )) : !$setup.hasRealWeather ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 1,
              class: "weather-note"
            }, "当前显示的是本地预设天气，填入高德 Key 后会自动切换为实时天气。")) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "游玩建议"),
          vue.createElementVNode("view", { class: "tips-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.destination.tips, (tip) => {
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
          vue.createElementVNode("text", { class: "section-title" }, "抖音直播参考"),
          vue.createElementVNode("view", { class: "live-card card" }, [
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
              ),
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
      const destination = vue.computed(() => getDestinationById(currentId.value));
      const onlineSafetyMap = vue.computed(() => getDestinationSafetyMap(currentId.value) || {
        title: "景区安全图",
        zoom: 14,
        coverage: "",
        emergencyLevel: "中",
        terrainRisk: "",
        weatherRisk: "",
        signalRisk: "",
        safeRoute: [],
        servicePoints: [],
        emergencyContacts: [],
        note: ""
      });
      const safetyMap = vue.computed(() => {
        var _a;
        if (offlineMode.value && ((_a = offlineRecord.value) == null ? void 0 : _a.metadata)) {
          return offlineRecord.value.metadata;
        }
        return onlineSafetyMap.value;
      });
      const onlineMapUrl = vue.computed(() => {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return "";
        }
        return getStaticMapUrl({
          longitude: coords.longitude,
          latitude: coords.latitude,
          zoom: safetyMap.value.zoom,
          size: "1080*720",
          markers: [
            { longitude: coords.longitude, latitude: coords.latitude, label: "景", size: "large" }
          ]
        });
      });
      const displayMapUrl = vue.computed(() => {
        var _a;
        if (offlineMode.value && ((_a = offlineRecord.value) == null ? void 0 : _a.savedFilePath)) {
          return offlineRecord.value.savedFilePath;
        }
        return onlineMapUrl.value;
      });
      onLoad((options = {}) => {
        currentId.value = options.id || "";
        offlineMode.value = options.offline === "1";
        offlineRecord.value = getOfflineMapRecord(currentId.value);
      });
      const __returned__ = { currentId, offlineMode, offlineRecord, destination, onlineSafetyMap, safetyMap, onlineMapUrl, displayMapUrl, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, CachedImage, get getDestinationById() {
        return getDestinationById;
      }, get getDestinationSafetyMap() {
        return getDestinationSafetyMap;
      }, get getOfflineMapRecord() {
        return getOfflineMapRecord;
      }, get getStaticMapUrl() {
        return getStaticMapUrl;
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
          vue.createElementVNode("text", { class: "safety-kicker" }, "Scenic Safety Map"),
          vue.createElementVNode(
            "text",
            { class: "safety-title" },
            vue.toDisplayString($setup.safetyMap.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "safety-subtitle" },
            "覆盖 " + vue.toDisplayString($setup.safetyMap.coverage) + "，适合在进入景区前先确认主入口、返程线和应急联系信息。",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "section safety-shell" }, [
          vue.createElementVNode("view", { class: "card map-card-large" }, [
            vue.createElementVNode("view", { class: "map-headline" }, [
              vue.createElementVNode("view", null, [
                vue.createElementVNode(
                  "text",
                  { class: "map-title" },
                  vue.toDisplayString($setup.offlineMode ? "离线安全图" : "景区核心安全图"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "map-desc muted-text" },
                  vue.toDisplayString($setup.offlineMode ? "当前优先展示本地已保存版本。" : "当前展示的是景区级安全参考图，建议离线保存后再进山入谷。"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "view",
                { class: "map-level" },
                vue.toDisplayString($setup.safetyMap.emergencyLevel),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "map-preview-large" }, [
              vue.createVNode($setup["CachedImage"], {
                src: $setup.displayMapUrl,
                "image-class": "cover-image"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "map-badge" },
                vue.toDisplayString($setup.offlineMode ? "OFFLINE" : "ONLINE"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "meta-grid" }, [
              vue.createElementVNode("view", { class: "meta-card" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "地形风险"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.safetyMap.terrainRisk),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "meta-card" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "天气风险"),
                vue.createElementVNode(
                  "text",
                  { class: "meta-value" },
                  vue.toDisplayString($setup.safetyMap.weatherRisk),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "meta-card full-width" }, [
                vue.createElementVNode("text", { class: "meta-label" }, "信号提示"),
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
          vue.createElementVNode("text", { class: "section-title" }, "推荐安全路线"),
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
          vue.createElementVNode("text", { class: "section-title" }, "服务点与集合点"),
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
          vue.createElementVNode("text", { class: "section-title" }, "应急联系"),
          vue.createElementVNode("view", { class: "contact-card card" }, [
            vue.createElementVNode(
              "text",
              { class: "contact-copy" },
              vue.toDisplayString($setup.safetyMap.emergencyContacts.join(" / ")),
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
        vue.createElementVNode("text", { class: "section-title" }, "未找到景区安全图")
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
      debugText: {
        type: String,
        default: ""
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
        ])
      ]),
      $props.debugText ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "debug-panel"
      }, [
        vue.createElementVNode("text", { class: "debug-title" }, "定位调试"),
        vue.createElementVNode(
          "text",
          { class: "debug-text" },
          vue.toDisplayString($props.debugText),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const HikingHeaderPanel = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-4c485381"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingHeaderPanel.vue"]]);
  const TIANDITU_PROVIDER = "tianditu";
  const TIANDITU_KEY = "4344d443d2d5974ce960da012322cbab";
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
  const AMAP_JS_URL = "https://webapi.amap.com/maps";
  let amapSdkPromise = null;
  function buildAmapScriptUrl() {
    const params = new URLSearchParams({
      v: "2.0",
      key: AMAP_WEB_KEY
    });
    return `${AMAP_JS_URL}?${params.toString()}`;
  }
  function replaceTileTemplate(urlTemplate, x, y, z) {
    return String(urlTemplate || "").replace("{x}", String(x)).replace("{y}", String(y)).replace("{z}", String(z));
  }
  async function loadAmapWebSdk() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return null;
    }
    if (!hasAmapKey()) {
      throw new Error("缺少高德 Web Key，无法加载 AMap JS API");
    }
    if (window.AMap) {
      return window.AMap;
    }
    if (!amapSdkPromise) {
      amapSdkPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-amap-web-sdk="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve(window.AMap));
          existing.addEventListener("error", () => reject(new Error("AMap JS API 加载失败")));
          return;
        }
        const script = document.createElement("script");
        script.src = buildAmapScriptUrl();
        script.async = true;
        script.defer = true;
        script.dataset.amapWebSdk = "1";
        script.onload = () => resolve(window.AMap);
        script.onerror = () => reject(new Error("AMap JS API 加载失败"));
        document.head.appendChild(script);
      });
    }
    return amapSdkPromise;
  }
  function createAmapTiandituLayers(AMap, mode = "terrain") {
    const config = getTiandituLayerConfig(mode);
    if (!AMap || !config.ready || !config.tileUrl) {
      return [];
    }
    const layers = [
      new AMap.TileLayer({
        zIndex: 120,
        opacity: mode === "terrain" ? 0.92 : 1,
        getTileUrl(x, y, z) {
          return replaceTileTemplate(config.tileUrl, x, y, z);
        }
      })
    ];
    if (config.annotationUrl) {
      layers.push(new AMap.TileLayer({
        zIndex: 121,
        opacity: 1,
        getTileUrl(x, y, z) {
          return replaceTileTemplate(config.annotationUrl, x, y, z);
        }
      }));
    }
    return layers;
  }
  function createAmapPoint(longitude, latitude, AMap) {
    if (!AMap) {
      return null;
    }
    const lng = Number(longitude);
    const lat = Number(latitude);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return null;
    }
    return new AMap.LngLat(lng, lat);
  }
  const _sfc_main$5 = {
    __name: "H5AmapTiandituMap",
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
        default: "terrain"
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const containerRef = vue.ref(null);
      let AMapRef = null;
      let map = null;
      let tiandituLayers = [];
      let markerOverlays = [];
      let polylineOverlays = [];
      function clearOverlays(list = []) {
        list.forEach((item) => {
          if (item && typeof item.setMap === "function") {
            item.setMap(null);
          }
        });
        list.length = 0;
      }
      function syncCenter() {
        if (!map || !props.mapCenter || !AMapRef) {
          return;
        }
        const point = createAmapPoint(props.mapCenter.longitude, props.mapCenter.latitude, AMapRef);
        if (point) {
          map.setCenter(point);
        }
      }
      function syncZoom() {
        if (map && Number.isFinite(Number(props.mapScale))) {
          map.setZoom(Number(props.mapScale));
        }
      }
      function syncMarkers() {
        if (!map || !AMapRef) {
          return;
        }
        clearOverlays(markerOverlays);
        props.mapMarkers.forEach((item) => {
          var _a;
          const point = createAmapPoint(item.longitude, item.latitude, AMapRef);
          if (!point) {
            return;
          }
          const marker = new AMapRef.Marker({
            position: point,
            anchor: "center",
            label: ((_a = item.callout) == null ? void 0 : _a.content) ? {
              content: item.callout.content,
              direction: "top"
            } : void 0
          });
          marker.setMap(map);
          markerOverlays.push(marker);
        });
      }
      function syncPolyline() {
        if (!map || !AMapRef) {
          return;
        }
        clearOverlays(polylineOverlays);
        props.mapPolyline.forEach((line) => {
          const path = Array.isArray(line.points) ? line.points.map((item) => createAmapPoint(item.longitude, item.latitude, AMapRef)).filter(Boolean) : [];
          if (!path.length) {
            return;
          }
          const polyline = new AMapRef.Polyline({
            path,
            strokeColor: line.color || "#FF7A00",
            strokeWeight: Number(line.width || 5),
            borderWeight: Number(line.borderWidth || 1),
            outlineColor: line.borderColor || "#C14F00",
            lineJoin: "round",
            lineCap: "round"
          });
          polyline.setMap(map);
          polylineOverlays.push(polyline);
        });
      }
      function syncTiandituLayers() {
        if (!map || !AMapRef) {
          return;
        }
        if (tiandituLayers.length) {
          tiandituLayers.forEach((layer) => {
            if (layer && typeof layer.setMap === "function") {
              layer.setMap(null);
            }
          });
          tiandituLayers = [];
        }
        tiandituLayers = createAmapTiandituLayers(AMapRef, props.mapModeKey);
        tiandituLayers.forEach((layer) => layer.setMap(map));
      }
      async function initMap() {
        if (typeof window === "undefined" || typeof document === "undefined") {
          return;
        }
        await vue.nextTick();
        if (!containerRef.value || map) {
          return;
        }
        AMapRef = await loadAmapWebSdk();
        if (!AMapRef) {
          return;
        }
        const point = props.mapCenter ? createAmapPoint(props.mapCenter.longitude, props.mapCenter.latitude, AMapRef) : null;
        map = new AMapRef.Map(containerRef.value, {
          zoom: Number(props.mapScale || 15),
          center: point || void 0,
          viewMode: "2D",
          mapStyle: "amap://styles/normal",
          resizeEnable: true
        });
        syncTiandituLayers();
        syncMarkers();
        syncPolyline();
      }
      vue.onMounted(() => {
        initMap().catch(() => {
        });
      });
      vue.watch(() => props.mapCenter, () => {
        syncCenter();
      }, { deep: true });
      vue.watch(() => props.mapScale, () => {
        syncZoom();
      });
      vue.watch(() => props.mapModeKey, () => {
        syncTiandituLayers();
      });
      vue.watch(() => props.mapMarkers, () => {
        syncMarkers();
      }, { deep: true });
      vue.watch(() => props.mapPolyline, () => {
        syncPolyline();
      }, { deep: true });
      vue.onBeforeUnmount(() => {
        clearOverlays(markerOverlays);
        clearOverlays(polylineOverlays);
        if (map) {
          if (tiandituLayers.length) {
            tiandituLayers.forEach((layer) => {
              if (layer && typeof layer.setMap === "function") {
                layer.setMap(null);
              }
            });
            tiandituLayers = [];
          }
          map.destroy();
          map = null;
        }
      });
      const __returned__ = { props, containerRef, get AMapRef() {
        return AMapRef;
      }, set AMapRef(v) {
        AMapRef = v;
      }, get map() {
        return map;
      }, set map(v) {
        map = v;
      }, get tiandituLayers() {
        return tiandituLayers;
      }, set tiandituLayers(v) {
        tiandituLayers = v;
      }, get markerOverlays() {
        return markerOverlays;
      }, set markerOverlays(v) {
        markerOverlays = v;
      }, get polylineOverlays() {
        return polylineOverlays;
      }, set polylineOverlays(v) {
        polylineOverlays = v;
      }, clearOverlays, syncCenter, syncZoom, syncMarkers, syncPolyline, syncTiandituLayers, initMap, nextTick: vue.nextTick, onBeforeUnmount: vue.onBeforeUnmount, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch, get createAmapPoint() {
        return createAmapPoint;
      }, get createAmapTiandituLayers() {
        return createAmapTiandituLayers;
      }, get loadAmapWebSdk() {
        return loadAmapWebSdk;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        ref: "containerRef",
        class: "h5-map-host"
      },
      null,
      512
      /* NEED_PATCH */
    );
  }
  const H5AmapTiandituMap = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-7e5713d2"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/H5AmapTiandituMap.vue"]]);
  const _sfc_main$4 = {
    __name: "HikingMapStage",
    props: {
      hasMapLocation: {
        type: Boolean,
        default: false
      },
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
      isTracking: {
        type: Boolean,
        default: false
      },
      mapModeLabel: {
        type: String,
        default: "标准地图"
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
      }
    },
    emits: ["refresh", "recenter", "toggle-track", "cycle-map-mode"],
    setup(__props, { expose: __expose }) {
      __expose();
      const isWebMapRuntime = typeof window !== "undefined" && typeof document !== "undefined" && hasAmapKey();
      const __returned__ = { isWebMapRuntime, H5AmapTiandituMap, get hasAmapKey() {
        return hasAmapKey;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "map-container" }, [
      $setup.isWebMapRuntime && $props.hasMapLocation ? (vue.openBlock(), vue.createBlock($setup["H5AmapTiandituMap"], {
        key: 0,
        class: "live-map",
        "map-center": $props.mapCenter,
        "map-scale": $props.mapScale,
        "map-polyline": $props.mapPolyline,
        "map-markers": $props.mapMarkers,
        "map-mode-key": $props.mapModeKey
      }, null, 8, ["map-center", "map-scale", "map-polyline", "map-markers", "map-mode-key"])) : $props.hasMapLocation ? (vue.openBlock(), vue.createElementBlock("map", {
        key: 1,
        class: "live-map",
        latitude: $props.mapCenter.latitude,
        longitude: $props.mapCenter.longitude,
        scale: $props.mapScale,
        "show-location": true,
        "enable-rotate": true,
        "enable-traffic": false,
        polyline: $props.mapPolyline,
        markers: $props.mapMarkers
      }, null, 8, ["latitude", "longitude", "scale", "polyline", "markers"])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "map-placeholder"
      }, [
        vue.createElementVNode("view", { class: "map-fallback-copy" }, [
          vue.createElementVNode("text", { class: "fallback-title" }, "等待定位中"),
          vue.createElementVNode("text", { class: "fallback-desc" }, "已接入原生 GPS 定位与徒步地图桥接，获取到位置后会显示真实地图与轨迹。")
        ])
      ])),
      vue.createElementVNode("view", { class: "map-overlay" }),
      vue.createElementVNode("view", {
        class: "map-mode-switch",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cycle-map-mode"))
      }, [
        vue.createElementVNode("text", { class: "map-mode-label" }, "切换地图"),
        vue.createElementVNode(
          "text",
          { class: "map-mode-value" },
          vue.toDisplayString($props.mapModeLabel),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "map-tools" }, [
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("refresh"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, ""),
          vue.createElementVNode("text", { class: "text" }, "定位刷新")
        ]),
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("recenter"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, ""),
          vue.createElementVNode("text", { class: "text" }, "回到当前")
        ]),
        vue.createElementVNode("view", {
          class: "tool-btn",
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("toggle-track"))
        }, [
          vue.createElementVNode("text", { class: "icon" }, ""),
          vue.createElementVNode(
            "text",
            { class: "text" },
            vue.toDisplayString($props.isTracking ? "停止记录" : "开始记录"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["offline-banner", { visible: $props.isOffline }])
        },
        [
          vue.createElementVNode(
            "text",
            { class: "offline-title" },
            vue.toDisplayString($props.isOffline ? "离线 GPS 模式" : "在线地图模式"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "offline-desc" },
            vue.toDisplayString($props.offlineHint),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const HikingMapStage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-bc42e741"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingMapStage.vue"]]);
  const _sfc_main$3 = {
    __name: "HikingBottomControls",
    props: {
      isTracking: {
        type: Boolean,
        default: false
      },
      isGuardMode: {
        type: Boolean,
        default: false
      }
    },
    emits: ["sos", "toggle-track", "toggle-guard"],
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bottom-controls" }, [
      vue.createElementVNode("view", { class: "handle-bar" }),
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("view", { class: "side-action" }, [
          vue.createElementVNode("view", {
            class: "btn-circle sos",
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("sos"))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "SOS")
          ]),
          vue.createElementVNode("text", { class: "label" }, "SOS")
        ]),
        vue.createElementVNode("view", { class: "main-action" }, [
          vue.createElementVNode("view", {
            class: "btn-circle start",
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("toggle-track"))
          }, [
            vue.createElementVNode(
              "text",
              { class: "btn-text" },
              vue.toDisplayString($props.isTracking ? "暂停" : "开始"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "side-action" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["btn-circle shield", { active: $props.isGuardMode }]),
              onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("toggle-guard"))
            },
            [
              vue.createElementVNode("text", { class: "icon" }, "")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("text", { class: "label" }, "守护模式")
        ])
      ])
    ]);
  }
  const HikingBottomControls = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-b1d0f949"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/hiking/components/HikingBottomControls.vue"]]);
  const HIKING_SESSION_KEY = "meet-xinjiang-hiking-session";
  function readSession() {
    const raw = uni.getStorageSync(HIKING_SESSION_KEY);
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
  function writeSession(session) {
    uni.setStorageSync(HIKING_SESSION_KEY, JSON.stringify(session || {}));
  }
  function getHikingSession() {
    return readSession();
  }
  function updateHikingSessionLocation(location) {
    const session = readSession() || { points: [] };
    const points = Array.isArray(session.points) ? session.points.slice(-119) : [];
    points.push({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      altitude: Number(location.altitude || 0),
      speed: Number(location.speed || 0),
      accuracy: Number(location.accuracy || 0),
      timestamp: Date.now()
    });
    const nextSession = {
      ...session,
      lastLocation: {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        altitude: Number(location.altitude || 0),
        speed: Number(location.speed || 0),
        accuracy: Number(location.accuracy || 0),
        timestamp: Date.now()
      },
      points,
      updatedAt: Date.now()
    };
    writeSession(nextSession);
    return nextSession;
  }
  function normalizeLocation(location) {
    if (!location) {
      return null;
    }
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return {
      latitude,
      longitude,
      altitude: Number(location.altitude || 0),
      accuracy: Number(location.accuracy || 0),
      speed: Number(location.speed || 0),
      bearing: Number(location.bearing || location.heading || 0),
      timestamp: Number(location.timestamp || Date.now())
    };
  }
  function formatCoordinate(value, type) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return "--";
    }
    const suffix = type === "lat" ? numeric >= 0 ? "N" : "S" : numeric >= 0 ? "E" : "W";
    return `${Math.abs(numeric).toFixed(5)}deg${suffix}`;
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
      total += getDistanceKm(points[index - 1], points[index]);
    }
    return total;
  }
  function buildTrackPolyline(points = []) {
    if (!Array.isArray(points) || !points.length) {
      return [];
    }
    return [
      {
        points: points.map(normalizeLocation).filter(Boolean).map((item) => ({ latitude: item.latitude, longitude: item.longitude })),
        color: "#FF7A00",
        width: 5,
        borderColor: "#C14F00",
        borderWidth: 1
      }
    ];
  }
  function buildCurrentMarker(location, isTracking = false) {
    const normalized = normalizeLocation(location);
    if (!normalized) {
      return [];
    }
    return [
      {
        id: 1,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        width: 30,
        height: 30,
        callout: {
          content: isTracking ? "记录中" : "当前位置",
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
  const DEFAULT_PLUGIN_NAME = "MeetXinjiangHikingMap";
  const DEFAULT_MAP_PROVIDER = "tianditu";
  const STANDARD_EVENTS = ["onLocationChange", "onTrackUpdate", "onGpsWeak", "onDeviationAlert", "onNativeError", "onOfflineMapReady"];
  function normalizeMapPayload(payload = {}) {
    return {
      provider: payload.provider || DEFAULT_MAP_PROVIDER,
      ...payload
    };
  }
  function resolvePlugin(pluginName = DEFAULT_PLUGIN_NAME) {
    {
      return null;
    }
  }
  async function invoke(plugin, method, payload) {
    if (!plugin || typeof plugin[method] !== "function") {
      return null;
    }
    const result = plugin[method](payload || {});
    if (result && typeof result.then === "function") {
      return result;
    }
    return result;
  }
  function unwrapResult(result) {
    if (!result) {
      return null;
    }
    if (typeof result.success === "boolean") {
      if (!result.success) {
        throw new Error(result.message || result.code || "原生插件调用失败");
      }
      return result.data ?? null;
    }
    return result;
  }
  function bindPluginEvent(plugin, eventName, handler) {
    if (!plugin || typeof handler !== "function") {
      return () => {
      };
    }
    if (typeof plugin.on === "function") {
      plugin.on(eventName, handler);
      return () => {
        if (typeof plugin.off === "function") {
          plugin.off(eventName, handler);
        }
      };
    }
    const addMethod = `add${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}Listener`;
    const removeMethod = `remove${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}Listener`;
    if (typeof plugin[addMethod] === "function") {
      plugin[addMethod](handler);
      return () => {
        if (typeof plugin[removeMethod] === "function") {
          plugin[removeMethod](handler);
        }
      };
    }
    return () => {
    };
  }
  function createHikingNativeBridge(options = {}) {
    const pluginName = options.pluginName || DEFAULT_PLUGIN_NAME;
    const plugin = resolvePlugin(pluginName);
    const unsubs = [];
    return {
      pluginName,
      isNativeAvailable() {
        return Boolean(plugin);
      },
      async initMap(payload = {}) {
        return unwrapResult(await invoke(plugin, "initMap", normalizeMapPayload(payload)));
      },
      async destroyMap() {
        while (unsubs.length) {
          const off = unsubs.pop();
          if (typeof off === "function") {
            off();
          }
        }
        return unwrapResult(await invoke(plugin, "destroyMap"));
      },
      async refreshLocation(payload = {}) {
        const nativeLocation = unwrapResult(await invoke(plugin, "getCurrentLocation", payload));
        if (nativeLocation) {
          return nativeLocation;
        }
        return getCurrentLocation();
      },
      async moveToCurrentLocation() {
        return unwrapResult(await invoke(plugin, "moveToCurrentLocation"));
      },
      async setMapMode(mode, payload = {}) {
        return unwrapResult(await invoke(plugin, "setMapMode", normalizeMapPayload({ ...payload, mode })));
      },
      async startTrack(payload = {}) {
        return unwrapResult(await invoke(plugin, "startTrack", normalizeMapPayload(payload)));
      },
      async stopTrack() {
        return unwrapResult(await invoke(plugin, "stopTrack"));
      },
      async clearTrack() {
        return unwrapResult(await invoke(plugin, "clearTrack"));
      },
      async getTrackSummary() {
        return unwrapResult(await invoke(plugin, "getTrackSummary"));
      },
      async getTrackPoints(payload = {}) {
        return unwrapResult(await invoke(plugin, "getTrackPoints", payload));
      },
      async getOfflineMapStatus() {
        return unwrapResult(await invoke(plugin, "getOfflineMapStatus"));
      },
      async preloadOfflineTerrain(payload = {}) {
        return unwrapResult(await invoke(plugin, "preloadOfflineTerrain", normalizeMapPayload(payload)));
      },
      on(eventName, handler) {
        const off = bindPluginEvent(plugin, eventName, handler);
        unsubs.push(off);
        return off;
      },
      subscribeStandardEvents(handlers = {}) {
        const localUnsubs = STANDARD_EVENTS.filter((eventName) => typeof handlers[eventName] === "function").map((eventName) => {
          const off = bindPluginEvent(plugin, eventName, handlers[eventName]);
          unsubs.push(off);
          return off;
        });
        return () => {
          localUnsubs.forEach((off) => {
            if (typeof off === "function") {
              off();
            }
          });
        };
      }
    };
  }
  const TRACKING_INTERVAL = 8e3;
  const _sfc_main$2 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const MAP_MODES = [
        { key: "normal", label: "标准地图" },
        { key: "satellite", label: "卫星视图" },
        { key: "terrain", label: "等高线地形" }
      ];
      const bridge = createHikingNativeBridge();
      const isTracking = vue.ref(false);
      const isGuardMode = vue.ref(false);
      const mapScale = vue.ref(15);
      const currentLocation = vue.ref(null);
      const trackPoints = vue.ref([]);
      const locationError = vue.ref("");
      const currentMapMode = vue.ref(MAP_MODES[0].key);
      const networkOnline = vue.ref(true);
      const nativeTrackSummary = vue.ref(null);
      const offlineMapStatus = vue.ref(null);
      const debugLogs = vue.ref([]);
      let pollTimer = null;
      let stopStandardEvents = null;
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
        if (bridge.isNativeAvailable()) {
          return isTracking.value ? "原生徒步地图记录中" : "原生徒步地图已就绪";
        }
        if (currentLocation.value) {
          return isTracking.value ? "GPS 记录中" : "GPS 已连接";
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
      const distanceText = vue.computed(() => {
        var _a;
        const nativeDistance = Number((_a = nativeTrackSummary.value) == null ? void 0 : _a.distanceKm);
        if (Number.isFinite(nativeDistance) && nativeDistance >= 0) {
          return nativeDistance.toFixed(2);
        }
        return sumTrackDistanceKm(trackPoints.value).toFixed(2);
      });
      const mapPolyline = vue.computed(() => buildTrackPolyline(trackPoints.value));
      const mapMarkers = vue.computed(() => buildCurrentMarker(currentLocation.value, isTracking.value));
      const mapModeLabel = vue.computed(() => {
        var _a;
        return ((_a = MAP_MODES.find((item) => item.key === currentMapMode.value)) == null ? void 0 : _a.label) || "标准地图";
      });
      const headerModeText = vue.computed(() => `${isOffline.value ? "离线" : "在线"} · ${mapModeLabel.value}`);
      const debugText = vue.computed(() => debugLogs.value.join(" | "));
      const offlineHint = vue.computed(() => {
        var _a;
        const terrainReady = Boolean((_a = offlineMapStatus.value) == null ? void 0 : _a.terrainPackReady);
        if (isOffline.value) {
          return currentMapMode.value === "terrain" ? terrainReady ? "无网络时继续使用 GPS 定位与离线等高线地形包，轨迹会保存在本地。" : "当前为离线 GPS 模式，但还没有离线等高线包，需尽快预下载。" : "无网络时继续使用 GPS 定位，建议切换到等高线地形模式并提前下载离线包。";
        }
        return currentMapMode.value === "terrain" ? terrainReady ? "当前为徒步增强模式，优先显示等高线/地形信息与风险叠加层。" : "当前为徒步增强模式，建议先下载离线等高线地形包。" : "当前在线地图可正常加载，弱网前建议提前缓存离线地形包。";
      });
      onLoad(async () => {
        hydrateSession();
        bindNetworkState();
        bindNativeEvents();
        await bridge.initMap({ mode: currentMapMode.value, provider: DEFAULT_MAP_PROVIDER });
        await refreshLocation();
        await refreshTrackSummary();
        await refreshOfflineMapStatus();
      });
      onUnload(() => {
        cleanup();
      });
      vue.onBeforeUnmount(() => {
        cleanup();
      });
      function hydrateSession() {
        const session = getHikingSession();
        if (!session) {
          return;
        }
        currentLocation.value = normalizeLocation(session.lastLocation);
        trackPoints.value = Array.isArray(session.points) ? session.points.map(normalizeLocation).filter(Boolean) : [];
      }
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
      function bindNativeEvents() {
        stopStandardEvents = bridge.subscribeStandardEvents({
          onLocationChange(payload) {
            appendDebugLog(`原生事件定位: ${formatLocationDebug(payload)}`);
            const location = normalizeLocation(payload);
            if (location) {
              currentLocation.value = location;
              locationError.value = "";
              if (isTracking.value) {
                persistTrackPoint(location);
              }
            }
          },
          onTrackUpdate(payload) {
            nativeTrackSummary.value = payload || null;
          },
          onNativeError(payload) {
            if (payload == null ? void 0 : payload.message) {
              locationError.value = payload.message;
              appendDebugLog(`原生异常: ${payload.message}`);
            }
          }
        });
      }
      async function refreshLocation() {
        try {
          appendDebugLog(`开始定位: offline=${isOffline.value ? "1" : "0"}, native=${bridge.isNativeAvailable() ? "1" : "0"}`);
          const rawLocation = await bridge.refreshLocation({
            highAccuracy: true,
            allowGpsOffline: true,
            preferGpsWhenOffline: isOffline.value
          });
          appendDebugLog(`定位返回: ${formatLocationDebug(rawLocation)}`);
          const location = normalizeLocation(rawLocation);
          if (!location) {
            throw new Error("定位结果无效");
          }
          currentLocation.value = location;
          locationError.value = "";
          if (isTracking.value) {
            persistTrackPoint(location);
          }
          await refreshTrackSummary();
        } catch (error) {
          locationError.value = (error == null ? void 0 : error.message) || "定位失败";
          appendDebugLog(`定位失败: ${locationError.value}`);
        }
      }
      function persistTrackPoint(location) {
        const session = updateHikingSessionLocation(location);
        trackPoints.value = Array.isArray(session == null ? void 0 : session.points) ? session.points.map(normalizeLocation).filter(Boolean) : trackPoints.value;
      }
      function startTrackingPoll() {
        stopTrackingPoll();
        pollTimer = setInterval(() => {
          refreshLocation();
        }, TRACKING_INTERVAL);
      }
      function stopTrackingPoll() {
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      }
      async function handleStart() {
        isTracking.value = !isTracking.value;
        if (isTracking.value) {
          await bridge.startTrack({
            intervalMs: TRACKING_INTERVAL,
            distanceFilterMeters: 3,
            highAccuracy: true,
            allowGpsOffline: true,
            persistOffline: true,
            provider: DEFAULT_MAP_PROVIDER
          });
          await refreshLocation();
          startTrackingPoll();
        } else {
          stopTrackingPoll();
          await bridge.stopTrack();
        }
        uni.showToast({
          title: isTracking.value ? "开始追踪" : "暂停追踪",
          icon: "none"
        });
      }
      async function recenterMap() {
        mapScale.value = 16;
        await bridge.moveToCurrentLocation();
        if (!currentLocation.value) {
          await refreshLocation();
          return;
        }
        uni.showToast({
          title: "已回到当前位置",
          icon: "none"
        });
      }
      async function cycleMapMode() {
        const currentIndex = MAP_MODES.findIndex((item) => item.key === currentMapMode.value);
        const nextMode = MAP_MODES[(currentIndex + 1) % MAP_MODES.length];
        currentMapMode.value = nextMode.key;
        await bridge.setMapMode(nextMode.key, { provider: DEFAULT_MAP_PROVIDER });
        uni.showToast({
          title: nextMode.label,
          icon: "none"
        });
      }
      async function refreshTrackSummary() {
        try {
          nativeTrackSummary.value = await bridge.getTrackSummary();
        } catch (error) {
          nativeTrackSummary.value = null;
        }
      }
      async function refreshOfflineMapStatus() {
        try {
          offlineMapStatus.value = await bridge.getOfflineMapStatus();
        } catch (error) {
          offlineMapStatus.value = null;
        }
      }
      function handleSOS() {
        uni.showModal({
          title: "紧急呼救",
          content: "确认要发送 SOS 信号并通知紧急联系人吗？",
          confirmColor: "#FF3B30"
        });
      }
      function toggleGuard() {
        isGuardMode.value = !isGuardMode.value;
        uni.showToast({
          title: isGuardMode.value ? "守护模式已开启" : "守护模式已关闭",
          icon: "none"
        });
      }
      function cleanup() {
        stopTrackingPoll();
        if (typeof stopStandardEvents === "function") {
          stopStandardEvents();
          stopStandardEvents = null;
        }
        bridge.destroyMap();
      }
      function appendDebugLog(message) {
        const stamp = (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8);
        debugLogs.value = [`${stamp} ${message}`, ...debugLogs.value].slice(0, 4);
      }
      function formatLocationDebug(location) {
        if (!location) {
          return "empty";
        }
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);
        const provider = location.provider || "unknown";
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return `${provider} invalid`;
        }
        return `${provider} ${latitude.toFixed(5)},${longitude.toFixed(5)} acc=${Number(location.accuracy || 0).toFixed(0)}`;
      }
      const __returned__ = { TRACKING_INTERVAL, MAP_MODES, bridge, isTracking, isGuardMode, mapScale, currentLocation, trackPoints, locationError, currentMapMode, networkOnline, nativeTrackSummary, offlineMapStatus, debugLogs, get pollTimer() {
        return pollTimer;
      }, set pollTimer(v) {
        pollTimer = v;
      }, get stopStandardEvents() {
        return stopStandardEvents;
      }, set stopStandardEvents(v) {
        stopStandardEvents = v;
      }, mapCenter, hasMapLocation, coordinateText, gpsStatusText, altitudeText, accuracyText, isOffline, distanceText, mapPolyline, mapMarkers, mapModeLabel, headerModeText, debugText, offlineHint, hydrateSession, bindNetworkState, bindNativeEvents, refreshLocation, persistTrackPoint, startTrackingPoll, stopTrackingPoll, handleStart, recenterMap, cycleMapMode, refreshTrackSummary, refreshOfflineMapStatus, handleSOS, toggleGuard, cleanup, appendDebugLog, formatLocationDebug, computed: vue.computed, onBeforeUnmount: vue.onBeforeUnmount, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onUnload() {
        return onUnload;
      }, HikingHeaderPanel, HikingMapStage, HikingBottomControls, get getHikingSession() {
        return getHikingSession;
      }, get updateHikingSessionLocation() {
        return updateHikingSessionLocation;
      }, get buildCurrentMarker() {
        return buildCurrentMarker;
      }, get buildTrackPolyline() {
        return buildTrackPolyline;
      }, get formatCoordinate() {
        return formatCoordinate;
      }, get formatMetric() {
        return formatMetric;
      }, get normalizeLocation() {
        return normalizeLocation;
      }, get sumTrackDistanceKm() {
        return sumTrackDistanceKm;
      }, get createHikingNativeBridge() {
        return createHikingNativeBridge;
      }, get DEFAULT_MAP_PROVIDER() {
        return DEFAULT_MAP_PROVIDER;
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
        "is-offline": $setup.isOffline,
        "mode-text": $setup.headerModeText,
        "debug-text": $setup.debugText
      }, null, 8, ["gps-status-text", "coordinate-text", "altitude-text", "distance-text", "accuracy-text", "is-offline", "mode-text", "debug-text"]),
      vue.createVNode($setup["HikingMapStage"], {
        "has-map-location": $setup.hasMapLocation,
        "map-center": $setup.mapCenter,
        "map-scale": $setup.mapScale,
        "map-polyline": $setup.mapPolyline,
        "map-markers": $setup.mapMarkers,
        "is-tracking": $setup.isTracking,
        "map-mode-label": $setup.mapModeLabel,
        "map-mode-key": $setup.currentMapMode,
        "is-offline": $setup.isOffline,
        "offline-hint": $setup.offlineHint,
        onRefresh: $setup.refreshLocation,
        onRecenter: $setup.recenterMap,
        onToggleTrack: $setup.handleStart,
        onCycleMapMode: $setup.cycleMapMode
      }, null, 8, ["has-map-location", "map-center", "map-scale", "map-polyline", "map-markers", "is-tracking", "map-mode-label", "map-mode-key", "is-offline", "offline-hint"]),
      vue.createVNode($setup["HikingBottomControls"], {
        "is-tracking": $setup.isTracking,
        "is-guard-mode": $setup.isGuardMode,
        onSos: $setup.handleSOS,
        onToggleTrack: $setup.handleStart,
        onToggleGuard: $setup.toggleGuard
      }, null, 8, ["is-tracking", "is-guard-mode"])
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
        authToken.value = getStoredAuthToken();
        currentUser.value = getStoredAuthUser();
      });
      function goBack() {
        uni.navigateBack();
      }
      function openEditModal() {
        var _a;
        editNickname.value = ((_a = currentUser.value) == null ? void 0 : _a.nickname) || "";
        editModalVisible.value = true;
      }
      async function saveProfile() {
        var _a, _b, _c;
        const nickname = editNickname.value.trim();
        if (!nickname || nickname === ((_a = currentUser.value) == null ? void 0 : _a.nickname)) {
          editModalVisible.value = false;
          return;
        }
        try {
          const res = await updateUserProfile(authToken.value, { nickname });
          const merged = { ...currentUser.value, ...res.user, avatar_url: ((_b = currentUser.value) == null ? void 0 : _b.avatar_url) || ((_c = res.user) == null ? void 0 : _c.avatar_url) };
          saveAuthSession({ token: authToken.value, user: merged });
          currentUser.value = res.user;
          editModalVisible.value = false;
          uni.showToast({ title: "昵称已更新", icon: "success" });
        } catch (e) {
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
      const __returned__ = { currentUser, authToken, editModalVisible, editNickname, isLoggedIn, profileName, menuItems, goBack, openEditModal, saveProfile, handleLogout, computed: vue.computed, ref: vue.ref, get onShow() {
        return onShow;
      }, get clearAuthSession() {
        return clearAuthSession;
      }, get getStoredAuthToken() {
        return getStoredAuthToken;
      }, get getStoredAuthUser() {
        return getStoredAuthUser;
      }, get saveAuthSession() {
        return saveAuthSession;
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
    return {
      app
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
