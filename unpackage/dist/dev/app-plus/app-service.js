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
  const destinationList = [
    {
      id: 1,
      name: "天池",
      location: "新疆阜康",
      description: "群山雪岭环抱的高山湖泊，是新疆最具代表性的自然名片之一。",
      image: "https://images.unsplash.com/photo-1766823282156-7e2de7f9f922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaWFuY2hpJTIwaGVhdmVubHklMjBsYWtlJTIwWGluamlhbmclMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc2MjQ2MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.8",
      category: "自然风光",
      coordinates: { longitude: 88.1548, latitude: 43.8803 },
      weather: {
        condition: "晴转多云",
        temperature: "18°C",
        humidity: "46%",
        wind: "3级山风"
      },
      tips: ["建议上午抵达，光线更通透", "山上温差较大，带一件防风外套", "缆车与徒步路线都适合拍照打卡"],
      suggestion: "适合安排半日到一日游，重点看湖景、雪山与林线层次。",
      liveTitle: "天池景区实时直播",
      liveHint: "可通过抖音查看景区实时天气、人流和湖面状态。",
      liveKeyword: "新疆天池 景区直播"
    },
    {
      id: 2,
      name: "喀什古城",
      location: "新疆喀什",
      description: "拱门、土墙与老街交织出丝路古城的烟火气与历史感。",
      image: "https://images.unsplash.com/photo-1658423554035-ff01be23f31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYXNoZ2FyJTIwb2xkJTIwY2l0eSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzYyNDYzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.9",
      category: "人文古城",
      coordinates: { longitude: 75.9897, latitude: 39.4704 },
      weather: {
        condition: "晴",
        temperature: "24°C",
        humidity: "29%",
        wind: "2级微风"
      },
      tips: ["傍晚逛老城最有氛围", "建议穿舒适鞋子，巷道步行较多", "可结合夜市与民俗表演一起安排"],
      suggestion: "适合慢节奏漫游，体验老城建筑、茶馆、手工艺和夜市。",
      liveTitle: "喀什古城街景直播",
      liveHint: "抖音里常见街区实况直播，方便查看当前人流与夜景氛围。",
      liveKeyword: "喀什古城 直播"
    },
    {
      id: 3,
      name: "塔克拉玛干沙漠",
      location: "新疆塔里木盆地",
      description: "广袤流沙与公路穿越构成震撼景观，适合体验硬核西域之旅。",
      image: "https://images.unsplash.com/photo-1623336343731-1582577b8250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYWtsYW1ha2FuJTIwZGVzZXJ0JTIwc2FuZCUyMGR1bmVzfGVufDF8fHx8MTc3NjI0NjMzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.7",
      category: "探险穿越",
      coordinates: { longitude: 83.6177, latitude: 39.0128 },
      weather: {
        condition: "晴热",
        temperature: "29°C",
        humidity: "18%",
        wind: "4级偏东风"
      },
      tips: ["必须准备补水与遮阳装备", "沙漠线路优先跟正规车队", "日落前后是最适合拍照的时段"],
      suggestion: "更适合有越野或沙漠体验需求的游客，建议报正规线路。",
      liveTitle: "沙漠公路直播",
      liveHint: "直播可帮助快速了解风沙情况、日照与路面状态。",
      liveKeyword: "塔克拉玛干沙漠 直播"
    },
    {
      id: 4,
      name: "喀纳斯",
      location: "新疆阿勒泰",
      description: "湖水清澈通透，秋季金林环绕，是北疆风光的代表目的地。",
      image: "https://images.unsplash.com/photo-1698253542757-dcafef34a137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYW5hcyUyMGxha2UlMjBhdXR1bW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc2MjQ2MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.9",
      category: "自然风光",
      coordinates: { longitude: 87.0347, latitude: 48.713 },
      weather: {
        condition: "多云",
        temperature: "13°C",
        humidity: "58%",
        wind: "2级山谷风"
      },
      tips: ["秋季旺季需尽早预订住宿", "早晨湖面容易出薄雾，适合拍照", "景区面积大，建议预留完整一天"],
      suggestion: "适合深度看风景与摄影爱好者，推荐秋天或初夏前往。",
      liveTitle: "喀纳斯湖景直播",
      liveHint: "可先看直播确认天气和云层，再决定当天拍摄路线。",
      liveKeyword: "喀纳斯 景区直播"
    },
    {
      id: 5,
      name: "伊犁草原毡房",
      location: "新疆伊犁河谷",
      description: "住进草原毡房，近距离感受牧歌生活与辽阔天幕。",
      image: "https://images.unsplash.com/photo-1760776679643-0e28cbcd4214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFzc2xhbmQlMjB5dXJ0JTIwbm9tYWRpY3xlbnwxfHx8fDE3NzYyNDYzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.6",
      category: "人文古城",
      coordinates: { longitude: 81.3179, latitude: 43.9228 },
      weather: {
        condition: "晴间多云",
        temperature: "21°C",
        humidity: "43%",
        wind: "2级草原风"
      },
      tips: ["夜晚温度下降快，建议准备外套", "可搭配骑马或草原下午茶", "注意防晒，紫外线较强"],
      suggestion: "适合亲子与轻度度假体验，节奏比较松弛。",
      liveTitle: "伊犁草原慢直播",
      liveHint: "适合先看草场天气、云层和现场氛围。",
      liveKeyword: "伊犁草原 直播"
    },
    {
      id: 6,
      name: "国际大巴扎",
      location: "新疆乌鲁木齐",
      description: "香料、织物和手工艺品汇聚，是体验城市烟火与夜色的热门地标。",
      image: "https://images.unsplash.com/photo-1756363886854-b51467278a52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXphYXIlMjBtYXJrZXQlMjBzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzYyNDYzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: "4.5",
      category: "市集烟火",
      coordinates: { longitude: 87.6168, latitude: 43.7776 },
      weather: {
        condition: "晴",
        temperature: "26°C",
        humidity: "24%",
        wind: "2级微风"
      },
      tips: ["夜景灯光更出片", "可重点逛美食区和手工艺区", "注意高峰时段保管随身物品"],
      suggestion: "适合城市半日游，吃喝逛拍都比较集中。",
      liveTitle: "大巴扎实况直播",
      liveHint: "先看直播能快速判断夜市热度与摊位营业情况。",
      liveKeyword: "乌鲁木齐大巴扎 直播"
    }
  ];
  function getDestinationById(id) {
    return destinationList.find((item) => String(item.id) === String(id));
  }
  function getDouyinSearchUrl(keyword) {
    return `https://www.douyin.com/search/${encodeURIComponent(keyword)}?type=live`;
  }
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const stats = [
        { value: "50+", label: "景点推荐" },
        { value: "100+", label: "旅行锦囊" },
        { value: "4.8", label: "用户评分" }
      ];
      const featuredDestinations = destinationList.slice(0, 3);
      const activities = [
        { short: "丝", title: "丝路人文漫游" },
        { short: "沙", title: "沙漠越野探险" }
      ];
      function goToDestinations() {
        uni.reLaunch({ url: "/pages/destinations/index" });
      }
      function openDetail(id) {
        uni.navigateTo({ url: `/pages/destination-detail/index?id=${id}` });
      }
      const __returned__ = { stats, featuredDestinations, activities, goToDestinations, openDetail, AppTabBar, CachedImage, get destinationList() {
        return destinationList;
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
              vue.createElementVNode("text", { class: "hero-badge-text" }, "50+ 热门目的地")
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
            vue.createElementVNode("text", { class: "section-title" }, "精选目的地"),
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
  const _sfc_main$4 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const searchQuery = vue.ref("");
      const currentCategory = vue.ref("全部");
      const categories = ["全部", "自然风光", "人文古城", "探险穿越", "市集烟火"];
      const destinations = destinationList;
      const filteredDestinations = vue.computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        return destinations.filter((item) => {
          const matchesCategory = currentCategory.value === "全部" || item.category === currentCategory.value;
          const matchesSearch = !query || item.name.toLowerCase().includes(query);
          return matchesCategory && matchesSearch;
        });
      });
      function openDetail(id) {
        uni.navigateTo({ url: `/pages/destination-detail/index?id=${id}` });
      }
      const __returned__ = { searchQuery, currentCategory, categories, destinations, filteredDestinations, openDetail, computed: vue.computed, ref: vue.ref, AppTabBar, CachedImage, get destinationList() {
        return destinationList;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-shell" }, [
      vue.createElementVNode("view", { class: "page-scroll" }, [
        vue.createElementVNode("view", { class: "hero-gradient top-banner section" }, [
          vue.createElementVNode("text", { class: "banner-title" }, "探索目的地"),
          vue.createElementVNode("view", { class: "search-box" }, [
            vue.createElementVNode("text", { class: "search-mark" }, "搜"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchQuery = $event),
                class: "search-input",
                placeholder: "搜索你想去的新疆风景..."
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.searchQuery]
            ])
          ])
        ]),
        vue.createElementVNode("scroll-view", {
          "scroll-x": "",
          class: "category-strip",
          "show-scrollbar": "false"
        }, [
          vue.createElementVNode("view", { class: "category-row" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.categories, (item) => {
                return vue.createElementVNode("view", {
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
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section result-meta" }, [
          vue.createElementVNode(
            "text",
            { class: "muted-text" },
            "共找到 " + vue.toDisplayString($setup.filteredDestinations.length) + " 个目的地",
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
  const AMAP_WEB_KEY = "请在这里填入你的高德Web服务Key";
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
  const _sfc_main$1 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentId = vue.ref("");
      const destination = vue.computed(() => getDestinationById(currentId.value));
      const locationReady = vue.ref(false);
      const locationStatusText = vue.ref("未定位");
      const currentAddress = vue.ref("尚未获取定位");
      const currentCoords = vue.ref(null);
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
        return hasAmapKey() ? "定位或接口失败，已降级为预设天气" : "待填写高德 Key 后自动切换为实时天气";
      });
      const currentLocationText = vue.computed(() => currentAddress.value);
      const scenicLocationText = vue.computed(() => {
        var _a;
        const coords = (_a = destination.value) == null ? void 0 : _a.coordinates;
        if (!coords) {
          return "暂无景区坐标";
        }
        return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
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
        const center = currentCoords.value || coords;
        if (currentCoords.value) {
          markers.unshift({ longitude: currentCoords.value.longitude, latitude: currentCoords.value.latitude, label: "我" });
        }
        return getStaticMapUrl({
          longitude: center.longitude,
          latitude: center.latitude,
          markers
        });
      });
      onLoad(async (options) => {
        currentId.value = (options == null ? void 0 : options.id) || "";
        await refreshLocationAndWeather();
      });
      async function refreshLocationAndWeather() {
        var _a, _b, _c;
        if (!destination.value) {
          return;
        }
        weatherError.value = "";
        locationStatusText.value = hasAmapKey() ? "定位中" : "待 Key";
        liveWeatherData.value = null;
        if (!hasAmapKey()) {
          locationReady.value = false;
          currentAddress.value = "尚未填写高德 Web 服务 Key，暂时无法显示实时定位";
          return;
        }
        try {
          const scenicCoords = destination.value.coordinates;
          const scenicRegeo = scenicCoords ? await reverseGeocode(scenicCoords.longitude, scenicCoords.latitude) : null;
          const scenicAdcode = (_a = scenicRegeo == null ? void 0 : scenicRegeo.addressComponent) == null ? void 0 : _a.adcode;
          const weather = scenicAdcode ? await getLiveWeather(scenicAdcode) : null;
          const location = await getCurrentLocation();
          const regeo = await reverseGeocode(location.longitude, location.latitude);
          if (location) {
            currentCoords.value = {
              longitude: location.longitude,
              latitude: location.latitude
            };
            locationReady.value = true;
            locationStatusText.value = "已定位";
          }
          if (regeo) {
            currentAddress.value = regeo.formatted_address || `${((_b = regeo.addressComponent) == null ? void 0 : _b.city) || ""}${((_c = regeo.addressComponent) == null ? void 0 : _c.district) || ""}`;
          }
          if (weather) {
            liveWeatherData.value = weather;
          }
        } catch (error) {
          locationReady.value = false;
          locationStatusText.value = "定位失败";
          weatherError.value = "未能获取实时定位/天气，请检查定位授权或稍后重试。";
          currentAddress.value = destination.value.location;
        }
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
        uni.openLocation({
          longitude: coords.longitude,
          latitude: coords.latitude,
          name: destination.value.name,
          address: destination.value.location
        });
      }
      const __returned__ = { currentId, destination, locationReady, locationStatusText, currentAddress, currentCoords, liveWeatherData, weatherError, liveWeather, hasRealWeather, weatherSourceText, currentLocationText, scenicLocationText, mapImageUrl, refreshLocationAndWeather, goBack, openDouyinSearch, copyKeyword, openScenicLocation, computed: vue.computed, ref: vue.ref, get onLoad() {
        return onLoad;
      }, CachedImage, get getDestinationById() {
        return getDestinationById;
      }, get getDouyinSearchUrl() {
        return getDouyinSearchUrl;
      }, get getCurrentLocation() {
        return getCurrentLocation;
      }, get getLiveWeather() {
        return getLiveWeather;
      }, get getStaticMapUrl() {
        return getStaticMapUrl;
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
                vue.createElementVNode("text", { class: "map-title" }, "你与景区的位置关系"),
                vue.createElementVNode("text", { class: "map-subtitle muted-text" }, "优先显示你当前定位，没有授权时展示景区默认位置")
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
              vue.createElementVNode("text", { class: "meta-label" }, "当前位置"),
              vue.createElementVNode(
                "text",
                { class: "meta-value" },
                vue.toDisplayString($setup.currentLocationText),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "location-meta scenic-meta" }, [
              vue.createElementVNode("text", { class: "meta-label" }, "景区坐标"),
              vue.createElementVNode(
                "text",
                { class: "meta-value" },
                vue.toDisplayString($setup.scenicLocationText),
                1
                /* TEXT */
              )
            ]),
            $setup.mapImageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "map-preview"
            }, [
              vue.createVNode($setup["CachedImage"], {
                src: $setup.mapImageUrl,
                "image-class": "cover-image"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "map-legend" }, [
                vue.createElementVNode("text", null, "我"),
                vue.createElementVNode("text", null, "景")
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "map-fallback"
            }, [
              vue.createElementVNode("text", { class: "map-fallback-title" }, "等待高德地图 Key"),
              vue.createElementVNode("text", { class: "map-fallback-desc muted-text" }, "你给我高德 Web 服务 Key 后，这里会显示静态地图、定位点和景区点。")
            ])),
            vue.createElementVNode("view", { class: "map-actions" }, [
              vue.createElementVNode("view", {
                class: "primary-btn",
                onClick: $setup.refreshLocationAndWeather
              }, "刷新定位"),
              vue.createElementVNode("view", {
                class: "secondary-btn",
                onClick: $setup.openScenicLocation
              }, "打开地图导航")
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
        vue.createElementVNode("text", { class: "section-title" }, "目的地不存在"),
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
