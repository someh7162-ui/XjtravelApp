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
  const ON_LOAD = "onLoad";
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
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
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
  const _sfc_main$7 = {
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
        { path: "/pages/guides/index", label: "指南", short: "G" },
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
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
  const AppTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-8715b27c"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/AppTabBar.vue"]]);
  const _sfc_main$6 = {
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
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
  const CachedImage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-7d2a8804"], ["__file", "F:/AI编程/遇见新疆_uniapp/components/CachedImage.vue"]]);
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
  function getDestinationById(id) {
    return destinationList.find((item) => String(item.id) === String(id));
  }
  function getDouyinSearchUrl(keyword) {
    return `https://www.douyin.com/search/${encodeURIComponent(keyword)}?type=live`;
  }
  const AMAP_WEB_KEY = "b16ee0a6a8f641e974a51521ca00b6f0";
  function hasAmapKey() {
    return Boolean(AMAP_WEB_KEY) && !AMAP_WEB_KEY.includes("请在这里填入");
  }
  function request(url, data = {}) {
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
  function getStaticMapUrl({ longitude, latitude, markers = [] }) {
    if (!hasAmapKey() || longitude === void 0 || latitude === void 0) {
      return "";
    }
    const markerText = markers.map((item) => `${item.size || "mid"},0xC44536,${item.label || ""}:${item.longitude},${item.latitude}`).join("|");
    return `https://restapi.amap.com/v3/staticmap?key=${encodeURIComponent(AMAP_WEB_KEY)}&size=750*360&scale=2&zoom=11&center=${longitude},${latitude}&markers=${encodeURIComponent(markerText)}`;
  }
  async function reverseGeocode(longitude, latitude) {
    if (!hasAmapKey()) {
      return null;
    }
    const data = await request("https://restapi.amap.com/v3/geocode/regeo", {
      key: AMAP_WEB_KEY,
      location: `${longitude},${latitude}`,
      extensions: "base"
    });
    if (data.status !== "1" || !data.regeocode) {
      throw new Error(data.info || "逆地理编码失败");
    }
    return data.regeocode;
  }
  async function getLiveWeather(adcode) {
    if (!hasAmapKey() || !adcode) {
      return null;
    }
    const data = await request("https://restapi.amap.com/v3/weather/weatherInfo", {
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
    const data = await request("https://restapi.amap.com/v3/direction/driving", {
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
    const data = await request("https://restapi.amap.com/v3/direction/walking", {
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
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        success: resolve,
        fail: reject
      });
    });
  }
  const _sfc_main$5 = {
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
          const distanceKm = getDistanceKm(currentCoords.value, item.coordinates);
          return {
            ...item,
            distanceKm,
            distanceText: formatDistance(distanceKm)
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
      });
      const featuredSectionTitle = vue.computed(() => currentCoords.value ? "附近景区" : "精选景区");
      const activities = [
        { short: "丝", title: "丝路人文漫游" },
        { short: "沙", title: "沙漠越野探险" }
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
      function getDistanceKm(from, to) {
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
      const __returned__ = { stats, currentCoords, featuredDestinations, featuredSectionTitle, activities, goToDestinations, openDetail, getDistanceKm, formatDistance, computed: vue.computed, ref: vue.ref, get onLoad() {
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
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
                    )
                  ])
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
                  class: "activity-card"
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
                  )
                ]);
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
  const PagesHomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-4978fed5"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/home/index.vue"]]);
  const defaultVisibleCount = 5;
  const _sfc_main$4 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchQuery = vue.ref("");
      const currentCategory = vue.ref("全部");
      const currentRegion = vue.ref("全部");
      const categoriesExpanded = vue.ref(false);
      const regionsExpanded = vue.ref(false);
      const categories = scenicCategories;
      const regions = scenicRegions;
      const visibleCategories = vue.computed(() => {
        if (categoriesExpanded.value || categories.length <= defaultVisibleCount) {
          return categories;
        }
        const compact = categories.slice(0, defaultVisibleCount);
        if (compact.includes(currentCategory.value)) {
          return compact;
        }
        return [categories[0], currentCategory.value, ...categories.slice(1, defaultVisibleCount - 1)];
      });
      const visibleRegions = vue.computed(() => {
        if (regionsExpanded.value || regions.length <= defaultVisibleCount) {
          return regions;
        }
        const compact = regions.slice(0, defaultVisibleCount);
        if (compact.includes(currentRegion.value)) {
          return compact;
        }
        return [regions[0], currentRegion.value, ...regions.slice(1, defaultVisibleCount - 1)];
      });
      const destinations = destinationList;
      const filteredDestinations = vue.computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return destinations.filter((item) => {
          const matchesCategory = currentCategory.value === "全部" || item.category === currentCategory.value;
          const matchesRegion = currentRegion.value === "全部" || item.region === currentRegion.value;
          const searchText = [item.name, item.location, item.region, item.category].join(" ").toLowerCase();
          const matchesSearch = !query || searchText.includes(query);
          return matchesCategory && matchesRegion && matchesSearch;
        });
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
      const __returned__ = { searchQuery, currentCategory, currentRegion, categoriesExpanded, regionsExpanded, defaultVisibleCount, categories, regions, visibleCategories, visibleRegions, destinations, filteredDestinations, openDetail, toggleCategories, toggleRegions, computed: vue.computed, ref: vue.ref, AppTabBar, CachedImage, get destinationList() {
        return destinationList;
      }, get scenicCategories() {
        return scenicCategories;
      }, get scenicRegions() {
        return scenicRegions;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesDestinationsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-9dd01296"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/destinations/index.vue"]]);
  const _sfc_main$3 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const quickTips = [
        {
          short: "季",
          title: "最佳季节",
          description: "5 月到 10 月更适合出行，天气舒适、景色层次也更丰富。"
        },
        {
          short: "语",
          title: "语言沟通",
          description: "准备一些常用普通话表达，部分地区也能接触到维吾尔语。"
        },
        {
          short: "费",
          title: "预算规划",
          description: "常规出行建议按每日 300 到 700 元预估住宿、餐饮与交通。"
        }
      ];
      const guides = [
        {
          id: 1,
          title: "什么时候最适合去新疆",
          category: "行程规划",
          readTime: "5 分钟阅读",
          image: "https://images.unsplash.com/photo-1698253542757-dcafef34a137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYW5hcyUyMGxha2UlMjBhdXR1bW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc2MjQ2MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
          excerpt: "按季节挑选目的地，提前避开极端天气和旺季高峰，旅程会更轻松。"
        },
        {
          id: 2,
          title: "丝路美食不踩雷指南",
          category: "吃喝推荐",
          readTime: "8 分钟阅读",
          image: "https://images.unsplash.com/photo-1756363886854-b51467278a52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXphYXIlMjBtYXJrZXQlMjBzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzYyNDYzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          excerpt: "从抓饭、烤包子到羊肉串，帮你快速找到新疆旅行中的高频美味。"
        },
        {
          id: 3,
          title: "沙漠穿越安全提醒",
          category: "安全提示",
          readTime: "6 分钟阅读",
          image: "https://images.unsplash.com/photo-1623336343731-1582577b8250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYWtsYW1ha2FuJTIwZGVzZXJ0JTIwc2FuZCUyMGR1bmVzfGVufDF8fHx8MTc3NjI0NjMzMnww&ixlib=rb-4.1.0&q=80&w=1080",
          excerpt: "做好补水、防晒和路线确认，沙漠项目更需要团队协作与专业安排。"
        },
        {
          id: 4,
          title: "天山徒步装备清单",
          category: "户外探险",
          readTime: "7 分钟阅读",
          image: "https://images.unsplash.com/photo-1766823282156-7e2de7f9f922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaWFuY2hpJTIwaGVhdmVubHklMjBsYWtlJTIwWGluamlhbmclMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc2MjQ2MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
          excerpt: "保暖、鞋服、路餐和应急物资缺一不可，高海拔徒步更要提前准备。"
        }
      ];
      const essentialInfo = [
        { label: "货币", value: "人民币（CNY）" },
        { label: "时区", value: "UTC+8，北京时间" },
        { label: "语言", value: "普通话、维吾尔语、哈萨克语等" },
        { label: "气候", value: "大陆性气候明显，夏季较热、昼夜温差较大" }
      ];
      const __returned__ = { quickTips, guides, essentialInfo, AppTabBar, CachedImage };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient top-banner section" }, [
          vue.createElementVNode("text", { class: "banner-title" }, "旅行指南"),
          vue.createElementVNode("text", { class: "banner-subtitle" }, "行前准备、玩法建议与新疆旅行常识都在这里")
        ]),
        vue.createElementVNode("view", { class: "tips-shell section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "出发前速览"),
          vue.createElementVNode("view", { class: "tips-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.quickTips, (item) => {
                return vue.createElementVNode("view", {
                  key: item.title,
                  class: "card tip-item"
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "tip-icon" },
                    vue.toDisplayString(item.short),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "tip-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "tip-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "tip-desc muted-text" },
                      vue.toDisplayString(item.description),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("text", { class: "section-title" }, "精选攻略"),
          vue.createElementVNode("view", { class: "guide-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.guides, (item) => {
                return vue.createElementVNode("view", {
                  key: item.id,
                  class: "card guide-card"
                }, [
                  vue.createElementVNode("view", { class: "guide-image-wrap" }, [
                    vue.createVNode($setup["CachedImage"], {
                      src: item.image,
                      "image-class": "cover-image"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "view",
                      { class: "guide-tag" },
                      vue.toDisplayString(item.category),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "guide-body" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "guide-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "guide-desc muted-text" },
                      vue.toDisplayString(item.excerpt),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "guide-time muted-text" },
                      vue.toDisplayString(item.readTime),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "info-panel" }, [
            vue.createElementVNode("text", { class: "section-title" }, "旅行基础信息"),
            vue.createElementVNode("view", { class: "info-list" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.essentialInfo, (item) => {
                  return vue.createElementVNode("view", {
                    key: item.label,
                    class: "info-row"
                  }, [
                    vue.createElementVNode("view", { class: "info-dot" }),
                    vue.createElementVNode("text", { class: "info-text" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "info-label" },
                        vue.toDisplayString(item.label) + ":",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "muted-text" },
                        vue.toDisplayString(item.value),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/guides/index" })
    ]);
  }
  const PagesGuidesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-4aabec35"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/guides/index.vue"]]);
  const _sfc_main$2 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const profileStats = [
        { value: "12", label: "已去过" },
        { value: "8", label: "已收藏" },
        { value: "24", label: "点评数" }
      ];
      const savedDestinations = [
        { id: 1, name: "天池", date: "2 天前收藏" },
        { id: 2, name: "喀什古城", date: "1 周前收藏" },
        { id: 3, name: "喀纳斯", date: "2 周前收藏" }
      ];
      const menuItems = [
        { short: "藏", label: "我的收藏", count: 3 },
        { short: "行", label: "旅行足迹", count: 5 },
        { short: "消", label: "消息通知", count: 3 },
        { short: "语", label: "语言设置", value: "简体中文" },
        { short: "设", label: "通用设置" }
      ];
      const __returned__ = { profileStats, savedDestinations, menuItems, AppTabBar };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient profile-banner section" }, [
          vue.createElementVNode("view", { class: "profile-row" }, [
            vue.createElementVNode("view", { class: "avatar" }, "疆游"),
            vue.createElementVNode("view", { class: "profile-meta" }, [
              vue.createElementVNode("text", { class: "profile-name" }, "新疆漫游者"),
              vue.createElementVNode("text", { class: "profile-email" }, "explorer@meetxinjiang.com")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "section stats-shell" }, [
          vue.createElementVNode("view", { class: "card stats-grid" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.profileStats, (item) => {
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
          vue.createElementVNode("text", { class: "section-title" }, "最近收藏"),
          vue.createElementVNode("view", { class: "saved-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.savedDestinations, (item) => {
                return vue.createElementVNode("view", {
                  key: item.id,
                  class: "card saved-item"
                }, [
                  vue.createElementVNode("view", { class: "saved-left" }, [
                    vue.createElementVNode("view", { class: "saved-icon" }, "SV"),
                    vue.createElementVNode("view", null, [
                      vue.createElementVNode(
                        "text",
                        { class: "saved-name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "saved-date muted-text" },
                        vue.toDisplayString(item.date),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
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
                  vue.createElementVNode("view", { class: "menu-item" }, [
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
                      item.count !== void 0 ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          class: "count-pill"
                        },
                        vue.toDisplayString(item.count),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true),
                      item.value ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 1,
                          class: "menu-value muted-text"
                        },
                        vue.toDisplayString(item.value),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true),
                      vue.createElementVNode("text", { class: "saved-arrow" }, ">")
                    ])
                  ]),
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
        vue.createElementVNode("view", { class: "section section-block" }, [
          vue.createElementVNode("view", { class: "logout-button" }, "退出登录")
        ]),
        vue.createElementVNode("view", { class: "section app-info" }, [
          vue.createElementVNode("text", { class: "muted-text" }, "遇见新疆 v1.0.0"),
          vue.createElementVNode("text", { class: "muted-text" }, "© 2026 遇见新疆，保留所有权利")
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createVNode($setup["AppTabBar"], { current: "/pages/account/index" })
    ]);
  }
  const PagesAccountIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-3c1b446f"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/account/index.vue"]]);
  const _sfc_main$1 = {
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
      const locationReady = vue.ref(false);
      const locationStatusText = vue.ref("未定位");
      const routeMode = vue.ref("driving");
      const routeData = vue.ref(null);
      const liveWeatherData = vue.ref(null);
      const weatherError = vue.ref("");
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
      onLoad(async (options) => {
        currentId.value = (options == null ? void 0 : options.id) || "";
        await refreshLocationAndWeather();
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
      const __returned__ = { routeModeOptions, currentId, destination, locationReady, locationStatusText, routeMode, routeData, liveWeatherData, weatherError, liveWeather, hasRealWeather, weatherSourceText, scenicLocationText, routeDurationText, routeDistanceText, taxiCostText, mapImageUrl, refreshLocationAndWeather, changeRouteMode, loadRoute, formatDuration, formatDistance, goBack, openDouyinSearch, copyKeyword, openScenicLocation, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, CachedImage, get getDestinationById() {
        return getDestinationById;
      }, get getDouyinSearchUrl() {
        return getDouyinSearchUrl;
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
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesDestinationDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-b4993f48"], ["__file", "F:/AI编程/遇见新疆_uniapp/pages/destination-detail/index.vue"]]);
  __definePage("pages/home/index", PagesHomeIndex);
  __definePage("pages/destinations/index", PagesDestinationsIndex);
  __definePage("pages/guides/index", PagesGuidesIndex);
  __definePage("pages/account/index", PagesAccountIndex);
  __definePage("pages/destination-detail/index", PagesDestinationDetailIndex);
  const _sfc_main = {
    onLaunch() {
      formatAppLog("log", "at App.vue:4", "Meet Xinjiang app launched");
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
