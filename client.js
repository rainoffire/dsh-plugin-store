/**
 * Browser half of the DSH Plugin Store.
 *
 * It contributes one tab to the Plugins page. The Host serves the joined catalog at
 * `/dsh-plugin-store/catalog.json`; this file only filters, sorts, renders and remembers
 * the local shopping list.
 */

window.__ModuleLoader__.load({
  id: '@rainoffire/dsh-plugin-store',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'pluginStore'
    const ENDPOINT = '/dsh-plugin-store/catalog.json'
    const SELECTION_KEY = 'dsh-plugin-store:selection:v1'
    const PAGE_SIZE = 36
    const MAX_SELECTION = 80

    const zh = {
      tab: '插件商店',
      eyebrow: 'GitHub 话题 · #dsh-plugin',
      title: '插件商店',
      subtitle: '从 GitHub 话题和社区目录同步 DSH 插件，按用途分类。像逛商店一样筛选、收藏，再一次安装。',
      statPlugins: '个插件',
      statCategories: '个分类',
      statTopic: '个话题插件',
      statUpdated: '更新于 {time}',
      searchPlaceholder: '搜索插件、作者、包名或关键词…',
      searchClear: '清空搜索',
      category: '分类',
      all: '全部',
      sort: '排序',
      sortTopic: '话题优先',
      sortNewest: '最新上架',
      sortName: '名称',
      sortStars: '星标最多',
      sourceAll: '全部来源',
      sourceTopic: '话题发现',
      sourceCatalog: '目录收录',
      resultCount: '找到 {n} 个插件',
      loadMore: '加载更多',
      shownOf: '已显示 {shown} / {total}',
      install: '安装',
      select: '加入清单',
      deselect: '移出清单',
      details: '插件详情',
      viewRepo: '打开 GitHub 仓库',
      repoOnly: '仅仓库',
      installed: '已安装',
      notInstalled: '未安装',
      incompatible: '不兼容',
      compatibility: '兼容性',
      requiresDsh: '需要 DSH {range}',
      currentDsh: '当前 DSH {version}',
      installBlocked: '需要 DSH {range}，当前为 {version}',
      installedHint: '已在当前 profile 安装',
      openInstalled: '打开已安装',
      unknownCompatibility: '未声明版本要求',
      status: '状态',
      incompatibleNotice: '有 {n} 个插件要求其他 DSH 版本，已标记为不兼容；当前 DSH 为 {version}。',
      noDescription: '这个插件还没有填写简介。',
      topicBadge: '话题',
      newBadge: '上新',
      cartTitle: '我的选品清单',
      selectedCount: '已选 {n} 个',
      cartHint: '清单只保存在本机浏览器',
      viewCart: '查看清单',
      clear: '清空',
      remove: '移除',
      copyCommand: '复制安装命令',
      copied: '已复制',
      copyFailed: '复制失败，请手动选择命令',
      commandHint: '在终端逐行运行，或在清单里逐个点“安装”。',
      cartEmpty: '清单还是空的',
      cartEmptyHint: '在卡片右上角点购物袋，把想装的插件放进来。',
      emptyTitle: '没有找到匹配的插件',
      emptyHint: '换个关键词，或切回“全部”分类看看。',
      clearFilters: '清除筛选',
      errorTitle: '插件目录加载失败',
      errorHint: '请检查网络后重试。',
      retry: '重试',
      refresh: '刷新',
      refreshing: '刷新中',
      topicError: 'GitHub 话题同步暂时受限（通常是搜索 API 限流），当前展示目录收录；稍后刷新即可补齐。',
      catalogError: '社区目录暂时无法读取，当前只展示 GitHub 话题发现。',
      staleNotice: '当前展示的是上一次成功同步的缓存。',
      footerNote: '插件来自社区，安装前请确认来源与权限；清单和筛选只保存在本机浏览器。',
      footerTopic: 'GitHub 话题 #dsh-plugin',
      footerCatalog: 'awesome-dsh-plugin 目录',
      categoryLabel: '分类',
      npm: 'npm 包',
      version: '版本',
      published: '发布时间',
      stars: '星标',
      source: '来源',
      close: '关闭',
      addToCart: '加入清单',
      inCart: '已在清单',
      installHint: '将打开 DSH 的安装确认窗口',
      pluginCount: '{n} 个插件',
      topicCount: '{n} 个话题',
      cat_agi: 'AGI 架构探索',
      cat_ui: 'UI 增强',
      cat_usage: '用量与计费',
      cat_theme: '主题与外观',
      cat_model: '模型与账号接入',
      cat_identity: '身份与通信',
      cat_session: '会话与消息',
      cat_memory: '记忆',
      cat_tools: '工具与能力',
      cat_wsl: 'WSL 与 Windows 互操作',
      cat_browser: '浏览器与网页',
      cat_vision: '视觉与多模态',
      cat_voice: '语音与音频',
      cat_docs: '文档与渲染',
      cat_skill: '技能包',
      cat_workflow: '工作流与自动化',
      cat_git: 'Git 与代码评审',
      cat_notify: '通知与集成',
      cat_dev: '开发与运行时',
      cat_security: '安全与权限',
      cat_remote: '远程与移动端',
      cat_market: '插件市场与管理',
      cat_fun: '娱乐',
      cat_other: '其他',
    }

    const en = {
      tab: 'Plugin Store',
      eyebrow: 'GitHub topic · #dsh-plugin',
      title: 'Plugin Store',
      subtitle: 'DSH plugins synced from the GitHub topic and the community catalog, sorted by what they do. Browse, shortlist and install like a store.',
      statPlugins: 'plugins',
      statCategories: 'categories',
      statTopic: 'topic finds',
      statUpdated: 'Updated {time}',
      searchPlaceholder: 'Search plugins, authors, package names or keywords…',
      searchClear: 'Clear search',
      category: 'Categories',
      all: 'All',
      sort: 'Sort',
      sortTopic: 'Topic first',
      sortNewest: 'Newest',
      sortName: 'Name',
      sortStars: 'Most starred',
      sourceAll: 'All sources',
      sourceTopic: 'Topic finds',
      sourceCatalog: 'Catalog',
      resultCount: '{n} plugins found',
      loadMore: 'Load more',
      shownOf: 'Showing {shown} / {total}',
      install: 'Install',
      select: 'Add to list',
      deselect: 'Remove from list',
      details: 'Plugin details',
      viewRepo: 'Open the GitHub repository',
      repoOnly: 'Repo only',
      installed: 'Installed',
      notInstalled: 'Not installed',
      incompatible: 'Incompatible',
      compatibility: 'Compatibility',
      requiresDsh: 'Requires DSH {range}',
      currentDsh: 'Current DSH {version}',
      installBlocked: 'Requires DSH {range}; this DSH is {version}',
      installedHint: 'Already installed in this profile',
      openInstalled: 'Open installed',
      unknownCompatibility: 'No version requirement declared',
      status: 'Status',
      incompatibleNotice: '{n} plugins require another DSH version and are marked incompatible; this DSH is {version}.',
      noDescription: 'This plugin has no description yet.',
      topicBadge: 'Topic',
      newBadge: 'New',
      cartTitle: 'My shortlist',
      selectedCount: '{n} selected',
      cartHint: 'The list stays in this browser',
      viewCart: 'View list',
      clear: 'Clear',
      remove: 'Remove',
      copyCommand: 'Copy install commands',
      copied: 'Copied',
      copyFailed: 'Copy failed — select the commands manually',
      commandHint: 'Run these lines in a terminal, or press Install on each row.',
      cartEmpty: 'Your shortlist is empty',
      cartEmptyHint: 'Use the bag on a card to put the plugins you want here.',
      emptyTitle: 'No matching plugins',
      emptyHint: 'Try another keyword, or switch back to All.',
      clearFilters: 'Clear filters',
      errorTitle: 'Could not load the plugin catalog',
      errorHint: 'Check the connection and try again.',
      retry: 'Retry',
      refresh: 'Refresh',
      refreshing: 'Refreshing',
      topicError: 'GitHub topic sync is temporarily limited (usually the search API rate limit). The catalog is shown for now; refresh later to fill it in.',
      catalogError: 'The community catalog is temporarily unavailable. Only GitHub topic finds are shown.',
      staleNotice: 'Showing the last successful sync from the cache.',
      footerNote: 'Plugins come from the community. Check the source and permissions before installing. The shortlist and filters stay in this browser.',
      footerTopic: 'GitHub topic #dsh-plugin',
      footerCatalog: 'awesome-dsh-plugin catalog',
      categoryLabel: 'Category',
      npm: 'npm package',
      version: 'Version',
      published: 'Published',
      stars: 'Stars',
      source: 'Source',
      close: 'Close',
      addToCart: 'Add to list',
      inCart: 'In the list',
      installHint: 'Opens the DSH install confirmation',
      pluginCount: '{n} plugins',
      topicCount: '{n} topic finds',
      cat_agi: 'AGI Architecture Exploration',
      cat_ui: 'UI Enhancements',
      cat_usage: 'Usage & Billing',
      cat_theme: 'Themes & Appearance',
      cat_model: 'Models & Providers',
      cat_identity: 'Identity & Communication',
      cat_session: 'Sessions & Messages',
      cat_memory: 'Memory',
      cat_tools: 'Tools & Capabilities',
      cat_wsl: 'WSL & Windows Interop',
      cat_browser: 'Browser & Web',
      cat_vision: 'Vision & Multimodal',
      cat_voice: 'Voice & Audio',
      cat_docs: 'Docs & Rendering',
      cat_skill: 'Skills',
      cat_workflow: 'Workflow & Automation',
      cat_git: 'Git & Code Review',
      cat_notify: 'Notifications & Integrations',
      cat_dev: 'Development & Runtime',
      cat_security: 'Security & Permissions',
      cat_remote: 'Remote & Mobile',
      cat_market: 'Plugin Markets & Managers',
      cat_fun: 'Just for Fun',
      cat_other: 'Other',
    }

    const CSS = `
.dsh-store{--store-radius:14px;position:relative;display:flex;flex-direction:column;gap:18px;padding:22px 24px 120px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}
.dsh-store *{box-sizing:border-box}
.dsh-store button,.dsh-store input,.dsh-store select,.dsh-store textarea{font:inherit;color:inherit}
.dsh-store button{cursor:pointer}
.dsh-store a{color:inherit}
.dsh-store :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-store-hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 26px;border:1px solid var(--dsw-alias-border-l1);border-radius:18px;background:var(--dsw-alias-bg-layer-1)}
.dsh-store-hero::after{content:'';position:absolute;inset:-40% -10% auto auto;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,var(--dsw-alias-brand-primary) 0%,transparent 68%);opacity:.10;pointer-events:none}
.dsh-store-hero-copy{position:relative;z-index:1;min-width:0}
.dsh-store-eyebrow{display:inline-flex;align-items:center;gap:6px;margin-bottom:6px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:11.5px;letter-spacing:.02em}
.dsh-store-title{margin:0;font-size:26px;line-height:1.2;font-weight:650;letter-spacing:-.02em}
.dsh-store-subtitle{margin:8px 0 0;max-width:640px;color:var(--dsw-alias-label-secondary);font-size:13px}
.dsh-store-stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.dsh-store-stat{display:inline-flex;align-items:baseline;gap:5px;padding:5px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11.5px}
.dsh-store-stat strong{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:650}
.dsh-store-hero-art{position:relative;z-index:1;flex:none;width:132px;height:132px;display:grid;place-items:center;border:1px solid var(--dsw-alias-border-l1);border-radius:28px;background:var(--dsw-alias-bg-layer-2);transform:rotate(-4deg)}
.dsh-store-toolbar{display:flex;align-items:center;gap:10px}
.dsh-store-search{position:relative;display:flex;align-items:center;gap:8px;flex:1;min-width:0;height:38px;padding:0 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary)}
.dsh-store-search:focus-within{border-color:var(--dsw-alias-brand-primary)}
.dsh-store-search input{flex:1;min-width:0;height:100%;border:0;background:transparent;outline:none;color:var(--dsw-alias-label-primary);font-size:13px}
.dsh-store-search input::placeholder{color:var(--dsw-alias-label-secondary)}
.dsh-store-search input::-webkit-search-cancel-button{display:none}
.dsh-store-search-clear{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary)}
.dsh-store-search-clear:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-store-toolbar-right{display:flex;align-items:center;gap:8px;flex:none}
.dsh-store-select{position:relative;display:flex;align-items:center;gap:6px;height:38px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary)}
.dsh-store-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:none;padding-right:14px;color:var(--dsw-alias-label-primary);font-size:12.5px;cursor:pointer}
.dsh-store-select::after{content:'';position:absolute;right:10px;top:50%;width:6px;height:6px;border-right:1.5px solid var(--dsw-alias-label-secondary);border-bottom:1.5px solid var(--dsw-alias-label-secondary);transform:translateY(-70%) rotate(45deg);pointer-events:none}
.dsh-store-refresh{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 13px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12.5px}
.dsh-store-refresh:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-store-refresh:disabled{opacity:.6;cursor:default}
.dsh-store-refresh.is-busy svg{animation:dsh-store-spin 1s linear infinite}
.dsh-store-body{display:grid;grid-template-columns:206px minmax(0,1fr);gap:22px;align-items:start}
.dsh-store-rail{position:sticky;top:8px;z-index:1;display:flex;flex-direction:column;gap:2px;max-height:calc(100vh - 150px);overflow-y:auto;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:var(--store-radius);background:var(--dsw-alias-bg-layer-1)}
.dsh-store-rail-title{padding:2px 8px 8px;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.dsh-store-rail button{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:7px 9px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12.5px;text-align:left}
.dsh-store-rail button:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-store-rail button.is-active{border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-store-rail .dsh-store-count{color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}
.dsh-store-main{display:flex;flex-direction:column;gap:14px;min-width:0}
.dsh-store-resultbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.dsh-store-segment{display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1)}
.dsh-store-segment button{height:26px;padding:0 10px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-store-segment button:hover{color:var(--dsw-alias-label-primary)}
.dsh-store-segment button.is-active{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-store-result{color:var(--dsw-alias-label-secondary);font-size:12px;font-variant-numeric:tabular-nums}
.dsh-store-notice{display:flex;align-items:flex-start;gap:9px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-store-notice svg{flex:none;margin-top:1px}
.dsh-store-notice.is-warn{border-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-label-primary)}
.dsh-store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:12px}
.dsh-store-card{position:relative;display:flex;flex-direction:column;gap:10px;min-height:184px;padding:14px;border:1px solid var(--dsw-alias-border-l1);border-radius:var(--store-radius);background:var(--dsw-alias-bg-layer-1);cursor:pointer;transition:border-color .15s ease,transform .15s ease}
.dsh-store-card:hover{border-color:var(--dsw-alias-border-l2);transform:translateY(-1px)}
.dsh-store-card.is-selected{border-color:var(--dsw-alias-brand-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary)}
.dsh-store-card-head{display:flex;align-items:flex-start;gap:10px;min-width:0}
.dsh-store-avatar{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:11px;color:#fff;font-size:13px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;user-select:none}
.dsh-store-card-titles{flex:1;min-width:0;padding-top:1px}
.dsh-store-card-title{overflow:hidden;color:var(--dsw-alias-label-primary);font-size:13.5px;font-weight:640;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-card-owner{overflow:hidden;margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:11.5px;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-cart-toggle{flex:none;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}
.dsh-store-cart-toggle:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-store-cart-toggle.is-on{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.dsh-store-card-desc{display:-webkit-box;overflow:hidden;margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.55;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.dsh-store-card-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto}
.dsh-store-tag{padding:2px 7px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:1.55;white-space:nowrap}
.dsh-store-tag.is-topic{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.dsh-store-tag.is-new{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.dsh-store-tag.is-installed{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.dsh-store-tag.is-incompatible{border-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary)}
.dsh-store-card-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:2px}
.dsh-store-card-meta{overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-card-actions{display:flex;align-items:center;gap:6px;flex:none}
.dsh-store-install{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-brand-primary);border-radius:7px;background:var(--dsw-alias-brand-primary);color:#fff;font-size:12px;font-weight:600}
.dsh-store-install:hover{filter:brightness(1.06)}
.dsh-store-installed{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 9px;border:1px solid var(--dsw-alias-state-success-primary);border-radius:7px;background:transparent;color:var(--dsw-alias-state-success-primary);font-size:11.5px}
.dsh-store-installed:hover{background:var(--dsw-alias-bg-layer-2)}
.dsh-store-incompatible{padding:3px 7px;border:1px solid var(--dsw-alias-state-warn-primary);border-radius:999px;color:var(--dsw-alias-state-warn-primary);font-size:10.5px;line-height:1.55;white-space:nowrap}
.dsh-store-cart-row-note{color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap}
.dsh-store-cart-row-note.is-warn{color:var(--dsw-alias-state-warn-primary)}
.dsh-store-link{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;color:var(--dsw-alias-label-secondary);text-decoration:none}
.dsh-store-link:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-store-repo-only{color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap}
.dsh-store-load{display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0 4px}
.dsh-store-load button{height:34px;padding:0 18px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:12.5px}
.dsh-store-load button:hover{border-color:var(--dsw-alias-border-l2)}
.dsh-store-load span{color:var(--dsw-alias-label-secondary);font-size:11.5px;font-variant-numeric:tabular-nums}
.dsh-store-empty,.dsh-store-error{display:flex;flex-direction:column;align-items:center;gap:8px;padding:56px 20px;border:1px dashed var(--dsw-alias-border-l1);border-radius:var(--store-radius);background:var(--dsw-alias-bg-layer-1);text-align:center}
.dsh-store-empty h3,.dsh-store-error h3{margin:4px 0 0;font-size:14px;font-weight:640}
.dsh-store-empty p,.dsh-store-error p{margin:0;max-width:460px;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-store-empty button,.dsh-store-error button{margin-top:6px;height:32px;padding:0 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:12px}
.dsh-store-foot{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:6px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-store-foot p{margin:8px 0 0}
.dsh-store-foot a{color:var(--dsw-alias-label-secondary);text-decoration:none}
.dsh-store-foot a:hover{color:var(--dsw-alias-label-primary);text-decoration:underline}
.dsh-store-cartbar{position:fixed;left:50%;bottom:18px;z-index:30;transform:translateX(-50%);display:flex;align-items:center;justify-content:space-between;gap:14px;width:min(720px,calc(100vw - 48px));padding:11px 12px 11px 16px;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-overlay)}
.dsh-store-cartbar-info{display:flex;align-items:center;gap:10px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-store-cartbar-info strong{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:650;white-space:nowrap}
.dsh-store-cartbar-actions{display:flex;align-items:center;gap:8px;flex:none}
.dsh-store-primary{height:34px;padding:0 15px;border:1px solid var(--dsw-alias-brand-primary);border-radius:9px;background:var(--dsw-alias-brand-primary);color:#fff;font-size:12.5px;font-weight:600}
.dsh-store-primary:hover{filter:brightness(1.06)}
.dsh-store-ghost{height:34px;padding:0 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12.5px}
.dsh-store-ghost:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-store-modal-backdrop{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px}
.dsh-store-modal-backdrop::before{content:'';position:absolute;inset:0;background:var(--dsw-alias-bg-base);opacity:.72}
.dsh-store-modal{position:relative;z-index:1;display:flex;flex-direction:column;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-overlay);overflow:hidden}
.dsh-store-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px 12px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-store-modal-head h2{margin:0;font-size:15px;font-weight:650}
.dsh-store-modal-close{display:grid;place-items:center;width:28px;height:28px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary)}
.dsh-store-modal-close:hover{border-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary)}
.dsh-store-modal-body{overflow:auto;padding:16px 18px}
.dsh-store-modal-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dsh-store-detail-head{display:flex;align-items:center;gap:12px}
.dsh-store-detail-head .dsh-store-avatar{width:54px;height:54px;border-radius:14px;font-size:16px}
.dsh-store-detail-title{font-size:17px;font-weight:660;line-height:1.3}
.dsh-store-detail-owner{margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-store-detail-desc{margin:14px 0;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.65}
.dsh-store-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-border-l1)}
.dsh-store-detail-row{display:flex;flex-direction:column;gap:3px;padding:9px 11px;background:var(--dsw-alias-bg-layer-1);min-width:0}
.dsh-store-detail-row span{color:var(--dsw-alias-label-secondary);font-size:10.5px}
.dsh-store-detail-row strong{overflow:hidden;font-size:12px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-detail-row code{overflow:hidden;font-size:11.5px;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-detail-links{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px}
.dsh-store-detail-links a{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-brand-primary);font-size:12px;text-decoration:none}
.dsh-store-detail-links a:hover{text-decoration:underline}
.dsh-store-cart-list{display:flex;flex-direction:column;gap:2px}
.dsh-store-cart-row{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-store-cart-row:last-child{border-bottom:0}
.dsh-store-cart-row .dsh-store-avatar{width:32px;height:32px;border-radius:9px;font-size:11px}
.dsh-store-cart-row-main{flex:1;min-width:0}
.dsh-store-cart-row-title{overflow:hidden;font-size:12.5px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-cart-row-meta{overflow:hidden;color:var(--dsw-alias-label-secondary);font-size:11px;text-overflow:ellipsis;white-space:nowrap}
.dsh-store-cart-row-actions{display:flex;align-items:center;gap:6px;flex:none}
.dsh-store-mini{height:26px;padding:0 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11.5px}
.dsh-store-mini:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-store-mini.is-brand{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.dsh-store-command{margin-top:12px}
.dsh-store-command textarea{width:100%;min-height:76px;resize:vertical;padding:9px 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.6}
.dsh-store-hint{color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-store-copied{color:var(--dsw-alias-state-success-primary);font-size:11.5px}
.dsh-store-skeleton{pointer-events:none}
.dsh-store-skeleton .dsh-store-sk{background:var(--dsw-alias-bg-layer-2);border-radius:6px;animation:dsh-store-pulse 1.4s ease-in-out infinite}
.dsh-store-sk-title{width:64%;height:13px}
.dsh-store-sk-owner{width:38%;height:10px;margin-top:7px}
.dsh-store-sk-desc{width:100%;height:30px;margin-top:12px}
.dsh-store-sk-foot{width:46%;height:12px;margin-top:auto}
.dsh-store-rail-skeleton{height:34px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);animation:dsh-store-pulse 1.4s ease-in-out infinite}
@keyframes dsh-store-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes dsh-store-spin{to{transform:rotate(360deg)}}
@media (max-width:980px){
  .dsh-store{padding:18px 16px 110px}
  .dsh-store-hero-art{display:none}
  .dsh-store-body{grid-template-columns:1fr;gap:14px}
  .dsh-store-rail{position:static;flex-direction:row;gap:6px;max-height:none;padding:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
  .dsh-store-rail::-webkit-scrollbar{display:none}
  .dsh-store-rail-title{display:none}
  .dsh-store-rail button{width:auto;flex:none;padding:6px 10px;white-space:nowrap}
  .dsh-store-rail .dsh-store-count{display:none}
  .dsh-store-toolbar{flex-wrap:wrap}
  .dsh-store-search{flex-basis:100%}
  .dsh-store-toolbar-right{width:100%;justify-content:space-between}
}
@media (max-width:560px){
  .dsh-store-title{font-size:22px}
  .dsh-store-grid{grid-template-columns:1fr}
  .dsh-store-cartbar{flex-wrap:wrap}
  .dsh-store-detail-grid{grid-template-columns:1fr}
  .dsh-store-modal-foot{flex-wrap:wrap}
}
@media (prefers-reduced-motion:reduce){
  .dsh-store-card{transition:none}
  .dsh-store-skeleton .dsh-store-sk,.dsh-store-rail-skeleton,.dsh-store-refresh.is-busy svg{animation:none}
}
`

    const ICONS = {
      search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 0L20 20',
      bag: 'M5.5 8.5h13l-1 11h-11l-1-11Zm3.5 0V6a3 3 0 0 1 6 0v2.5',
      check: 'M4.5 12.5 9 17l10.5-10.5',
      plus: 'M12 5v14M5 12h14',
      close: 'M6 6l12 12M18 6 6 18',
      external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
      refresh: 'M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6',
      download: 'M12 4v11m0 0 4-4m-4 4-4-4M5 20h14',
      sort: 'M7 5v14m0 0-3-3m3 3 3-3M17 19V5m0 0-3 3m3-3 3 3',
      alert: 'M12 4 3 20h18L12 4Zm0 5v6m0 3v.01',
      sparkles: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm7 10 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z',
      inbox: 'M4 5h16v10h-4l-2 3h-4l-2-3H4V5Z',
    }

    function Icon(name, size = 16) {
      const path = ICONS[name] ?? ICONS.sparkles
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('path', { d: path }),
      )
    }

    function cx(...values) {
      return values.filter(Boolean).join(' ')
    }

    function hash(text) {
      let value = 0
      const source = String(text || 'dsh')
      for (let index = 0; index < source.length; index += 1) {
        value = (value * 31 + source.charCodeAt(index)) >>> 0
      }
      return value
    }

    function avatarStyle(seed) {
      const hue = hash(seed) % 360
      return {
        background: `linear-gradient(135deg, hsl(${hue} 64% 52%), hsl(${(hue + 52) % 360} 68% 38%))`,
      }
    }

    function initials(text) {
      const value = String(text || '?').replace(/^@/, '').replace(/[-_/]+/g, ' ').trim()
      if (!value) return '?'
      const latin = value.split(/\s+/).filter(Boolean)
      if (latin.length >= 2 && /^[\x20-\x7e]+$/.test(latin[0])) {
        return (latin[0][0] + latin[1][0]).toUpperCase()
      }
      return Array.from(value).slice(0, 2).join('').toUpperCase()
    }

    function isFresh(publishedAt) {
      if (!Number.isFinite(publishedAt) || publishedAt <= 0) return false
      return Date.now() - publishedAt * 1000 < 30 * 24 * 60 * 60 * 1000
    }

    function readSelection() {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(SELECTION_KEY) ?? '[]')
        if (!Array.isArray(parsed)) return []
        return parsed.filter((value) => typeof value === 'string').slice(0, MAX_SELECTION)
      } catch {
        return []
      }
    }

    function writeSelection(ids) {
      try {
        window.localStorage.setItem(SELECTION_KEY, JSON.stringify(ids))
      } catch {
        /* a browser with storage disabled keeps the list for this page only */
      }
    }

    let cachedDocument = null
    let inflight = null

    function loadDocument(force) {
      if (!force && cachedDocument) return Promise.resolve(cachedDocument)
      if (inflight) return inflight
      const url = force ? `${ENDPOINT}?refresh=1` : ENDPOINT
      inflight = fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.json()
        })
        .then((document) => {
          if (!document || !Array.isArray(document.items)) throw new Error('unexpected catalog payload')
          cachedDocument = document
          return document
        })
        .finally(() => {
          inflight = null
        })
      return inflight
    }

    function useCatalog() {
      const [state, setState] = React.useState(() =>
        cachedDocument ? { status: 'ready', data: cachedDocument, notice: null } : { status: 'loading' },
      )
      const load = React.useCallback((force) => {
        setState((previous) => ({ ...previous, status: previous.data ? 'ready' : 'loading', notice: null }))
        return loadDocument(force)
          .then((data) => {
            setState({ status: 'ready', data, notice: null })
          })
          .catch((error) => {
            setState((previous) =>
              previous.data
                ? { status: 'ready', data: previous.data, notice: error instanceof Error ? error.message : String(error) }
                : { status: 'error', error: error instanceof Error ? error.message : String(error) },
            )
          })
      }, [])
      React.useEffect(() => {
        const age = cachedDocument ? Date.now() - (cachedDocument.generatedAt ?? 0) : Infinity
        if (!cachedDocument || age > 10 * 60 * 1000) load(false)
      }, [load])
      return [state, load]
    }

    function formatNumber(value, localeId) {
      return new Intl.NumberFormat(localeId, { maximumFractionDigits: 0 }).format(value)
    }

    function fill(template, values) {
      return Object.entries(values).reduce(
        (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
        template,
      )
    }

    function formatDate(seconds, localeId) {
      if (!Number.isFinite(seconds) || seconds <= 0) return ''
      return new Intl.DateTimeFormat(localeId, { year: 'numeric', month: 'short', day: 'numeric' }).format(
        new Date(seconds * 1000),
      )
    }

    function formatClock(milliseconds, localeId) {
      return new Intl.DateTimeFormat(localeId, { hour: '2-digit', minute: '2-digit' }).format(new Date(milliseconds))
    }

    function Modal({ title, closeLabel, onClose, children, footer, width }) {
      const dialogRef = React.useRef(null)
      const closeRef = React.useRef(onClose)
      closeRef.current = onClose
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key === 'Escape') closeRef.current()
        }
        document.addEventListener('keydown', onKeyDown)
        const timer = window.setTimeout(() => dialogRef.current?.focus(), 0)
        return () => {
          document.removeEventListener('keydown', onKeyDown)
          window.clearTimeout(timer)
        }
      }, [])
      return h(
        'div',
        {
          className: 'dsh-store-modal-backdrop',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) onClose()
          },
        },
        h(
          'div',
          {
            className: 'dsh-store-modal',
            style: { width: width ?? 560 },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': title,
            tabIndex: -1,
            ref: dialogRef,
          },
          h(
            'div',
            { className: 'dsh-store-modal-head' },
            h('h2', null, title),
            h(
              'button',
              { className: 'dsh-store-modal-close', type: 'button', onClick: onClose, 'aria-label': closeLabel ?? 'Close' },
              Icon('close'),
            ),
          ),
          h('div', { className: 'dsh-store-modal-body' }, children),
          footer ? h('div', { className: 'dsh-store-modal-foot' }, footer) : null,
        ),
      )
    }

    function StoreTab(props) {
      const { t, install, openPackage } = props
      const localeId = React.useSyncExternalStore(props.subscribeLocale, props.getLocaleId, props.getLocaleId)
      const isZh = String(localeId).toLowerCase().startsWith('zh')
      const [catalog, load] = useCatalog()
      const [query, setQuery] = React.useState('')
      const deferredQuery = React.useDeferredValue(query)
      const [category, setCategory] = React.useState('all')
      const [source, setSource] = React.useState('all')
      const [sort, setSort] = React.useState('topic')
      const [limit, setLimit] = React.useState(PAGE_SIZE)
      const [selection, setSelection] = React.useState(readSelection)
      const [detailId, setDetailId] = React.useState(null)
      const [cartOpen, setCartOpen] = React.useState(false)
      const [refreshing, setRefreshing] = React.useState(false)
      const copiedTimer = React.useRef(0)
      const [copyState, setCopyState] = React.useState('idle')

      React.useEffect(() => writeSelection(selection), [selection])
      React.useEffect(() => {
        setLimit(PAGE_SIZE)
      }, [deferredQuery, category, source, sort])
      React.useEffect(
        () => () => {
          if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
        },
        [],
      )

      const data = catalog.status === 'ready' ? catalog.data : null
      const items = data?.items ?? []
      const categories = data?.categories ?? []
      const stats = data?.stats ?? {
        total: 0,
        catalog: 0,
        topicOnly: 0,
        topicMatched: 0,
        topicRepos: 0,
        categories: 0,
      }
      const generatedAt = data?.generatedAt ?? Date.now()
      const runtimeVersion = data?.runtimeVersion ?? ''
      const topicTotal = (stats.topicMatched ?? 0) + (stats.topicOnly ?? 0)

      const searchIndex = React.useMemo(
        () =>
          items.map((item) => ({
            item,
            haystack: [
              item.title,
              item.owner,
              item.npmName,
              item.repo,
              item.category,
              item.descriptionZh,
              item.descriptionEn,
              Array.isArray(item.topics) ? item.topics.join(' ') : '',
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase(),
          })),
        [items],
      )

      const filtered = React.useMemo(() => {
        const tokens = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)
        return searchIndex
          .filter(({ item, haystack }) => {
            if (category !== 'all' && item.category !== category) return false
            if (source === 'topic' && !item.topic) return false
            if (source === 'catalog' && item.source !== 'catalog') return false
            for (const token of tokens) {
              if (!haystack.includes(token)) return false
            }
            return true
          })
          .map(({ item }) => item)
      }, [searchIndex, deferredQuery, category, source])

      const sorted = React.useMemo(() => {
        const list = filtered.slice()
        if (sort === 'name') list.sort((left, right) => left.title.localeCompare(right.title, localeId))
        else if (sort === 'stars') {
          list.sort((left, right) => (right.stars ?? 0) - (left.stars ?? 0) || (right.publishedAt ?? 0) - (left.publishedAt ?? 0))
        } else if (sort === 'newest') {
          list.sort((left, right) => (right.publishedAt ?? 0) - (left.publishedAt ?? 0))
        } else {
          list.sort(
            (left, right) =>
              Number(Boolean(right.topic)) - Number(Boolean(left.topic)) ||
              Number(Boolean(right.installable)) - Number(Boolean(left.installable)) ||
              (right.publishedAt ?? 0) - (left.publishedAt ?? 0),
          )
        }
        return list
      }, [filtered, sort, localeId])

      const visible = sorted.slice(0, limit)
      const itemById = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items])
      const categoryLabels = React.useMemo(
        () => new Map(categories.map((entry) => [entry.id, entry.title])),
        [categories],
      )
      const categoryLabel = React.useCallback(
        (id) => {
          const title = categoryLabels.get(id)
          if (!title) return id
          return isZh ? title.zh : title.en
        },
        [categoryLabels, isZh],
      )
      const selectedItems = selection.map((id) => itemById.get(id)).filter(Boolean)
      React.useEffect(() => {
        if (items.length === 0) return
        setSelection((previous) => {
          const next = previous.filter((id) => itemById.has(id))
          return next.length === previous.length ? previous : next
        })
      }, [itemById, items.length])
      const detail = detailId ? itemById.get(detailId) : null
      const command = selectedItems
        .map((item) => `dsh plugin add ${item.npmName || item.repoUrl}`)
        .join('\n')

      const toggle = React.useCallback((id) => {
        setSelection((previous) =>
          previous.includes(id)
            ? previous.filter((value) => value !== id)
            : previous.length >= MAX_SELECTION
              ? previous
              : [...previous, id],
        )
      }, [])

      const openDetail = React.useCallback((id) => setDetailId(id), [])

      const runInstall = React.useCallback(
        (item) => {
          if (!item || !item.installable || !item.npmName || typeof install !== 'function') return
          if (item.installed || item.compatible === false) return
          try {
            install({
              spec: item.npmName,
              title: item.title,
              ...(item.version ? { version: item.version } : {}),
            })
          } catch (error) {
            console.error('dsh-plugin-store: install could not open', error)
          }
        },
        [install],
      )

      const refresh = React.useCallback(() => {
        setRefreshing(true)
        load(true).finally(() => setRefreshing(false))
      }, [load])

      const copyCommands = React.useCallback(() => {
        const text = command
        if (!text) return
        const done = () => {
          setCopyState('copied')
          if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
          copiedTimer.current = window.setTimeout(() => setCopyState('idle'), 2200)
        }
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done, () => setCopyState('failed'))
        } else {
          setCopyState('failed')
        }
      }, [command])

      const resetFilters = React.useCallback(() => {
        setQuery('')
        setCategory('all')
        setSource('all')
        setSort('topic')
      }, [])

      const descriptionOf = (item) =>
        isZh
          ? item.descriptionZh || item.descriptionEn || ''
          : item.descriptionEn || item.descriptionZh || ''

      const canInstallItem = (item) =>
        Boolean(item?.installable && item?.npmName && item?.compatible !== false && !item?.installed)

      const openInstalled = (item) => {
        if (typeof openPackage === 'function' && item?.npmName) openPackage(item.npmName)
      }

      const hero = h(
        'section',
        { className: 'dsh-store-hero' },
        h(
          'div',
          { className: 'dsh-store-hero-copy' },
          h('span', { className: 'dsh-store-eyebrow' }, Icon('sparkles', 13), t('eyebrow')),
          h('h1', { className: 'dsh-store-title' }, t('title')),
          h('p', { className: 'dsh-store-subtitle' }, t('subtitle')),
          h(
            'div',
            { className: 'dsh-store-stats' },
            h(
              'span',
              { className: 'dsh-store-stat' },
              h('strong', null, formatNumber(stats.total, localeId)),
              t('statPlugins'),
            ),
            h(
              'span',
              { className: 'dsh-store-stat' },
              h('strong', null, formatNumber(stats.categories, localeId)),
              t('statCategories'),
            ),
            h(
              'span',
              { className: 'dsh-store-stat' },
              h('strong', null, formatNumber(topicTotal, localeId)),
              t('statTopic'),
            ),
            runtimeVersion
              ? h('span', { className: 'dsh-store-stat' }, h('strong', null, 'DSH'), runtimeVersion)
              : null,
            h(
              'span',
              { className: 'dsh-store-stat' },
              fill(t('statUpdated'), { time: formatClock(generatedAt, localeId) }),
            ),
          ),
        ),
        h('div', { className: 'dsh-store-hero-art', 'aria-hidden': true }, Icon('bag', 62)),
      )

      const toolbar = h(
        'div',
        { className: 'dsh-store-toolbar' },
        h(
          'label',
          { className: 'dsh-store-search' },
          Icon('search', 15),
          h('input', {
            type: 'search',
            value: query,
            placeholder: t('searchPlaceholder'),
            'aria-label': t('searchPlaceholder'),
            onChange: (event) => setQuery(event.target.value),
          }),
          query
            ? h(
                'button',
                {
                  className: 'dsh-store-search-clear',
                  type: 'button',
                  onClick: () => setQuery(''),
                  'aria-label': t('searchClear'),
                },
                Icon('close', 13),
              )
            : null,
        ),
        h(
          'div',
          { className: 'dsh-store-toolbar-right' },
          h(
            'label',
            { className: 'dsh-store-select', title: t('sort') },
            Icon('sort', 14),
            h(
              'select',
              { value: sort, onChange: (event) => setSort(event.target.value), 'aria-label': t('sort') },
              h('option', { value: 'topic' }, t('sortTopic')),
              h('option', { value: 'newest' }, t('sortNewest')),
              h('option', { value: 'stars' }, t('sortStars')),
              h('option', { value: 'name' }, t('sortName')),
            ),
          ),
          h(
            'button',
            {
              className: cx('dsh-store-refresh', refreshing && 'is-busy'),
              type: 'button',
              onClick: refresh,
              disabled: refreshing,
              title: t('refresh'),
            },
            Icon('refresh', 14),
            refreshing ? t('refreshing') : t('refresh'),
          ),
        ),
      )

      const rail = h(
        'nav',
        { className: 'dsh-store-rail', 'aria-label': t('category') },
        h('div', { className: 'dsh-store-rail-title' }, t('category')),
        h(
          'button',
          {
            type: 'button',
            className: cx(category === 'all' && 'is-active'),
            onClick: () => setCategory('all'),
          },
          h('span', null, t('all')),
          h('span', { className: 'dsh-store-count' }, formatNumber(stats.total, localeId)),
        ),
        categories.map((entry) =>
          h(
            'button',
            {
              type: 'button',
              key: entry.id,
              className: cx(category === entry.id && 'is-active'),
              onClick: () => setCategory(entry.id),
              title: isZh ? entry.title.zh : entry.title.en,
            },
            h('span', null, categoryLabel(entry.id)),
            h('span', { className: 'dsh-store-count' }, formatNumber(entry.count, localeId)),
          ),
        ),
      )

      const resultbar = h(
        'div',
        { className: 'dsh-store-resultbar' },
        h(
          'div',
          { className: 'dsh-store-segment', role: 'tablist', 'aria-label': t('source') },
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': source === 'all',
              className: cx(source === 'all' && 'is-active'),
              onClick: () => setSource('all'),
            },
            t('sourceAll'),
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': source === 'topic',
              className: cx(source === 'topic' && 'is-active'),
              onClick: () => setSource('topic'),
            },
            t('sourceTopic'),
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': source === 'catalog',
              className: cx(source === 'catalog' && 'is-active'),
              onClick: () => setSource('catalog'),
            },
            t('sourceCatalog'),
          ),
        ),
        h('span', { className: 'dsh-store-result' }, fill(t('resultCount'), { n: formatNumber(sorted.length, localeId) })),
      )

      const notices = []
      if (catalog.notice) {
        notices.push(
          h(
            'div',
            { className: 'dsh-store-notice is-warn', key: 'load' },
            Icon('alert', 15),
            h('span', { title: catalog.notice }, t('staleNotice')),
          ),
        )
      }
      if (data?.stale) {
        notices.push(h('div', { className: 'dsh-store-notice is-warn', key: 'stale' }, Icon('alert', 15), h('span', null, t('staleNotice'))))
      }
      if ((stats.incompatible ?? 0) > 0) {
        notices.push(
          h(
            'div',
            { className: 'dsh-store-notice is-warn', key: 'compat' },
            Icon('alert', 15),
            h(
              'span',
              null,
              fill(t('incompatibleNotice'), {
                n: formatNumber(stats.incompatible, localeId),
                version: runtimeVersion || '?',
              }),
            ),
          ),
        )
      }
      if (data?.errors?.topic) {
        notices.push(
          h('div', { className: 'dsh-store-notice is-warn', key: 'topic' }, Icon('alert', 15), h('span', null, t('topicError'))),
        )
      }
      if (data?.errors?.catalog) {
        notices.push(
          h('div', { className: 'dsh-store-notice is-warn', key: 'catalog' }, Icon('alert', 15), h('span', null, t('catalogError'))),
        )
      }

      let content
      if (catalog.status === 'loading') {
        content = h(
          'div',
          { className: 'dsh-store-body' },
          h(
            'aside',
            { className: 'dsh-store-rail' },
            Array.from({ length: 8 }, (_, index) => h('div', { className: 'dsh-store-rail-skeleton', key: index })),
          ),
          h(
            'div',
            { className: 'dsh-store-main' },
            h(
              'div',
              { className: 'dsh-store-grid' },
              Array.from({ length: 8 }, (_, index) =>
                h(
                  'div',
                  { className: 'dsh-store-card dsh-store-skeleton', key: index },
                  h(
                    'div',
                    { className: 'dsh-store-card-head' },
                    h('div', { className: 'dsh-store-avatar', style: avatarStyle(`skeleton-${index}`) }, ''),
                    h(
                      'div',
                      { style: { flex: 1 } },
                      h('div', { className: 'dsh-store-sk dsh-store-sk-title' }),
                      h('div', { className: 'dsh-store-sk dsh-store-sk-owner' }),
                    ),
                  ),
                  h('div', { className: 'dsh-store-sk dsh-store-sk-desc' }),
                  h('div', { className: 'dsh-store-sk dsh-store-sk-foot' }),
                ),
              ),
            ),
          ),
        )
      } else if (catalog.status === 'error') {
        content = h(
          'div',
          { className: 'dsh-store-error' },
          Icon('alert', 28),
          h('h3', null, t('errorTitle')),
          h('p', null, `${catalog.error || ''} ${t('errorHint')}`.trim()),
          h('button', { type: 'button', onClick: () => load(true) }, t('retry')),
        )
      } else {
        content = h(
          'div',
          { className: 'dsh-store-body' },
          rail,
          h(
            'main',
            { className: 'dsh-store-main' },
            resultbar,
            notices,
            visible.length === 0
              ? h(
                  'div',
                  { className: 'dsh-store-empty' },
                  Icon('inbox', 28),
                  h('h3', null, t('emptyTitle')),
                  h('p', null, t('emptyHint')),
                  h('button', { type: 'button', onClick: resetFilters }, t('clearFilters')),
                )
              : h(
                  'div',
                  { className: 'dsh-store-grid' },
                  visible.map((item) => {
                    const selected = selection.includes(item.id)
                    const description = descriptionOf(item)
                    return h(
                      'article',
                      {
                        className: cx('dsh-store-card', selected && 'is-selected'),
                        key: item.id,
                        role: 'button',
                        tabIndex: 0,
                        'aria-label': item.title,
                        onClick: () => openDetail(item.id),
                        onKeyDown: (event) => {
                          if (event.target !== event.currentTarget) return
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            openDetail(item.id)
                          }
                        },
                      },
                      h(
                        'div',
                        { className: 'dsh-store-card-head' },
                        h('div', { className: 'dsh-store-avatar', style: avatarStyle(item.owner || item.title) }, initials(item.title)),
                        h(
                          'div',
                          { className: 'dsh-store-card-titles' },
                          h('div', { className: 'dsh-store-card-title', title: item.title }, item.title),
                          h('div', { className: 'dsh-store-card-owner' }, item.owner ? `@${item.owner}` : item.npmName || t('repoOnly')),
                        ),
                        h(
                          'button',
                          {
                            className: cx('dsh-store-cart-toggle', selected && 'is-on'),
                            type: 'button',
                            'aria-pressed': selected,
                            'aria-label': selected ? t('deselect') : t('select'),
                            title: selected ? t('deselect') : t('select'),
                            onClick: (event) => {
                              event.stopPropagation()
                              toggle(item.id)
                            },
                          },
                          Icon(selected ? 'check' : 'plus', 15),
                        ),
                      ),
                      h('p', { className: 'dsh-store-card-desc' }, description || t('noDescription')),
                      h(
                        'div',
                        { className: 'dsh-store-card-tags' },
                        h('span', { className: 'dsh-store-tag is-category' }, categoryLabel(item.category)),
                        item.topic ? h('span', { className: 'dsh-store-tag is-topic' }, t('topicBadge')) : null,
                        isFresh(item.publishedAt) ? h('span', { className: 'dsh-store-tag is-new' }, t('newBadge')) : null,
                        item.installed ? h('span', { className: 'dsh-store-tag is-installed' }, t('installed')) : null,
                        item.compatible === false
                          ? h('span', { className: 'dsh-store-tag is-incompatible' }, t('incompatible'))
                          : null,
                      ),
                      h(
                        'div',
                        { className: 'dsh-store-card-foot' },
                        h(
                          'span',
                          { className: 'dsh-store-card-meta' },
                          item.version ? `v${item.version}` : item.language || t('repoOnly'),
                        ),
                        h(
                          'div',
                          { className: 'dsh-store-card-actions' },
                          item.installed
                            ? h(
                                'button',
                                {
                                  className: 'dsh-store-installed',
                                  type: 'button',
                                  title: t('installedHint'),
                                  onClick: (event) => {
                                    event.stopPropagation()
                                    openInstalled(item)
                                  },
                                },
                                Icon('check', 13),
                                t('installed'),
                              )
                            : item.compatible === false
                              ? h(
                                  'span',
                                  {
                                    className: 'dsh-store-incompatible',
                                    title: fill(t('installBlocked'), {
                                      range: item.requires || '?',
                                      version: runtimeVersion || '?',
                                    }),
                                  },
                                  t('incompatible'),
                                )
                              : item.installable
                                ? h(
                                    'button',
                                    {
                                      className: 'dsh-store-install',
                                      type: 'button',
                                      title: t('installHint'),
                                      disabled: !canInstallItem(item),
                                      onClick: (event) => {
                                        event.stopPropagation()
                                        runInstall(item)
                                      },
                                    },
                                    Icon('download', 13),
                                    t('install'),
                                  )
                                : h('span', { className: 'dsh-store-repo-only' }, t('repoOnly')),
                          h(
                            'a',
                            {
                              className: 'dsh-store-link',
                              href: item.repoUrl,
                              target: '_blank',
                              rel: 'noreferrer',
                              title: t('viewRepo'),
                              'aria-label': t('viewRepo'),
                              onClick: (event) => event.stopPropagation(),
                              onKeyDown: (event) => event.stopPropagation(),
                            },
                            Icon('external', 14),
                          ),
                        ),
                      ),
                    )
                  }),
                ),
            visible.length > 0 && sorted.length > visible.length
              ? h(
                  'div',
                  { className: 'dsh-store-load' },
                  h(
                    'button',
                    { type: 'button', onClick: () => setLimit((value) => value + PAGE_SIZE) },
                    t('loadMore'),
                  ),
                  h(
                    'span',
                    null,
                    fill(t('shownOf'), {
                      shown: formatNumber(visible.length, localeId),
                      total: formatNumber(sorted.length, localeId),
                    }),
                  ),
                )
              : null,
            h(
              'footer',
              { className: 'dsh-store-foot' },
              h('p', null, t('footerNote')),
              h(
                'div',
                null,
                h(
                  'a',
                  { href: data?.source?.topicPage ?? 'https://github.com/topics/dsh-plugin', target: '_blank', rel: 'noreferrer' },
                  t('footerTopic'),
                ),
                ' · ',
                h(
                  'a',
                  { href: data?.source?.catalogPage ?? 'https://awesome-dsh-plugin.com', target: '_blank', rel: 'noreferrer' },
                  t('footerCatalog'),
                ),
              ),
            ),
          ),
        )
      }

      const cartbar =
        selectedItems.length > 0
          ? h(
              'div',
              { className: 'dsh-store-cartbar' },
              h(
                'div',
                { className: 'dsh-store-cartbar-info' },
                Icon('bag', 17),
                h('strong', null, fill(t('selectedCount'), { n: formatNumber(selectedItems.length, localeId) })),
                h('span', null, t('cartHint')),
              ),
              h(
                'div',
                { className: 'dsh-store-cartbar-actions' },
                h('button', { className: 'dsh-store-ghost', type: 'button', onClick: () => setSelection([]) }, t('clear')),
                h('button', { className: 'dsh-store-primary', type: 'button', onClick: () => setCartOpen(true) }, t('viewCart')),
              ),
            )
          : null

      const detailModal = detail
        ? (() => {
            const description = descriptionOf(detail)
            const rows = [
              [t('categoryLabel'), categoryLabel(detail.category)],
              [t('status'), detail.installed ? t('installed') : t('notInstalled')],
              [
                t('compatibility'),
                detail.compatible === false
                  ? fill(t('requiresDsh'), { range: detail.requires || '?' })
                  : detail.compatible === true
                    ? fill(t('currentDsh'), { version: runtimeVersion || '?' })
                    : t('unknownCompatibility'),
              ],
              detail.npmName ? [t('npm'), detail.npmName] : null,
              detail.version ? [t('version'), `v${detail.version}`] : null,
              detail.publishedAt ? [t('published'), formatDate(detail.publishedAt, localeId)] : null,
              (detail.stars ?? 0) > 0 ? [t('stars'), formatNumber(detail.stars, localeId)] : null,
              [t('source'), detail.source === 'catalog' ? t('sourceCatalog') : t('sourceTopic')],
            ].filter(Boolean)
            const selected = selection.includes(detail.id)
            return h(
              Modal,
              {
                title: t('details'),
                closeLabel: t('close'),
                onClose: () => setDetailId(null),
                width: 600,
                footer: h(
                  React.Fragment,
                  null,
                  h(
                    'button',
                    {
                      className: 'dsh-store-ghost',
                      type: 'button',
                      onClick: () => toggle(detail.id),
                    },
                    selected ? t('inCart') : t('addToCart'),
                  ),
                  detail.installed
                    ? h(
                        'button',
                        {
                          className: 'dsh-store-ghost',
                          type: 'button',
                          onClick: () => openInstalled(detail),
                        },
                        t('openInstalled'),
                      )
                    : detail.compatible === false
                      ? h(
                          'span',
                          { className: 'dsh-store-hint' },
                          fill(t('installBlocked'), {
                            range: detail.requires || '?',
                            version: runtimeVersion || '?',
                          }),
                        )
                      : detail.installable
                        ? h(
                            'button',
                            {
                              className: 'dsh-store-primary',
                              type: 'button',
                              onClick: () => {
                                setDetailId(null)
                                runInstall(detail)
                              },
                              title: t('installHint'),
                            },
                            t('install'),
                          )
                        : h('span', { className: 'dsh-store-hint' }, t('repoOnly')),
                ),
              },
              h(
                'div',
                { className: 'dsh-store-detail' },
                h(
                  'div',
                  { className: 'dsh-store-detail-head' },
                  h('div', { className: 'dsh-store-avatar', style: avatarStyle(detail.owner || detail.title) }, initials(detail.title)),
                  h(
                    'div',
                    { style: { minWidth: 0 } },
                    h('div', { className: 'dsh-store-detail-title' }, detail.title),
                    h('div', { className: 'dsh-store-detail-owner' }, detail.owner ? `@${detail.owner}` : detail.repo || detail.npmName),
                  ),
                ),
                h('p', { className: 'dsh-store-detail-desc' }, description || t('noDescription')),
                h(
                  'div',
                  { className: 'dsh-store-detail-grid' },
                  rows.map(([label, value]) =>
                    h(
                      'div',
                      { className: 'dsh-store-detail-row', key: label },
                      h('span', null, label),
                      label === t('npm') ? h('code', null, value) : h('strong', { title: String(value) }, value),
                    ),
                  ),
                ),
                h(
                  'div',
                  { className: 'dsh-store-detail-links' },
                  h(
                    'a',
                    { href: detail.repoUrl, target: '_blank', rel: 'noreferrer' },
                    Icon('external', 13),
                    t('viewRepo'),
                  ),
                ),
              ),
            )
          })()
        : null

      const cartModal = cartOpen
        ? h(
            Modal,
            {
              title: `${t('cartTitle')} · ${formatNumber(selectedItems.length, localeId)}`,
              closeLabel: t('close'),
              onClose: () => setCartOpen(false),
              width: 620,
              footer: h(
                React.Fragment,
                null,
                h('button', { className: 'dsh-store-ghost', type: 'button', onClick: () => setSelection([]) }, t('clear')),
                h('button', { className: 'dsh-store-primary', type: 'button', onClick: () => setCartOpen(false) }, t('close')),
              ),
            },
            selectedItems.length === 0
              ? h(
                  'div',
                  { className: 'dsh-store-empty' },
                  Icon('bag', 28),
                  h('h3', null, t('cartEmpty')),
                  h('p', null, t('cartEmptyHint')),
                )
              : h(
                  React.Fragment,
                  null,
                  h(
                    'div',
                    { className: 'dsh-store-cart-list' },
                    selectedItems.map((item) =>
                      h(
                        'div',
                        { className: 'dsh-store-cart-row', key: item.id },
                        h('div', { className: 'dsh-store-avatar', style: avatarStyle(item.owner || item.title) }, initials(item.title)),
                        h(
                          'div',
                          { className: 'dsh-store-cart-row-main' },
                          h('div', { className: 'dsh-store-cart-row-title' }, item.title),
                          h(
                            'div',
                            { className: 'dsh-store-cart-row-meta' },
                            `${categoryLabel(item.category)}${item.version ? ` · v${item.version}` : ''}${item.installable ? '' : ` · ${t('repoOnly')}`}`,
                          ),
                        ),
                        h(
                          'div',
                          { className: 'dsh-store-cart-row-actions' },
                          item.installed
                            ? h('span', { className: 'dsh-store-cart-row-note' }, t('installed'))
                            : item.compatible === false
                              ? h('span', { className: 'dsh-store-cart-row-note is-warn' }, t('incompatible'))
                              : item.installable
                                ? h(
                                    'button',
                                    {
                                      className: 'dsh-store-mini is-brand',
                                      type: 'button',
                                      onClick: () => {
                                        setCartOpen(false)
                                        runInstall(item)
                                      },
                                      title: t('installHint'),
                                    },
                                    t('install'),
                                  )
                                : null,
                          h(
                            'button',
                            {
                              className: 'dsh-store-mini',
                              type: 'button',
                              onClick: () => toggle(item.id),
                              'aria-label': t('remove'),
                            },
                            t('remove'),
                          ),
                        ),
                      ),
                    ),
                  ),
                  h(
                    'div',
                    { className: 'dsh-store-command' },
                    h('textarea', { readOnly: true, value: command, 'aria-label': t('copyCommand') }),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 } },
                      h('button', { className: 'dsh-store-mini', type: 'button', onClick: copyCommands }, t('copyCommand')),
                      copyState === 'copied' ? h('span', { className: 'dsh-store-copied' }, t('copied')) : null,
                      copyState === 'failed' ? h('span', { className: 'dsh-store-hint' }, t('copyFailed')) : null,
                    ),
                    h('p', { className: 'dsh-store-hint', style: { margin: '8px 0 0' } }, t('commandHint')),
                  ),
                ),
          )
        : null

      return h(
        'div',
        { className: 'dsh-store' },
        h('style', null, CSS),
        hero,
        toolbar,
        content,
        cartbar,
        detailModal,
        cartModal,
      )
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-store: dictionaries')
      const t = ctx.locale.bind(NS)
      const locale = ctx.locale
      const localeFace = {
        getLocaleId: () => document.documentElement.lang || navigator.language || 'en',
        subscribeLocale: (listener) => locale.subscribe(listener),
      }
      ctx.slots.inject('plugins.tab', () =>
        ctx.slots.register(
          {
            name: 'plugins.tab',
            id: 'store',
            order: 20,
            label: () => t('tab'),
            locale: NS,
            inject: () => localeFace,
          },
          StoreTab,
        ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply,
    }
  },
})
