/**
 * Host half of the DSH Plugin Store.
 *
 * It serves one same-origin JSON document, `/dsh-plugin-store/catalog.json`, which joins:
 *
 * - the community plugin catalog (`dsh-plugin-catalog`), which carries the npm package name,
 *   the curated category and the latest published version of each plugin; and
 * - the repositories under the GitHub `dsh-plugin` topic, which add recent community
 *   discoveries and mark the catalog entries that also carry the topic.
 *
 * The browser half only renders this document, so no credential, GitHub token, CORS rule or
 * third-party origin is needed in the page. The document is cached for ten minutes and served
 * stale when a refresh fails, so a rate-limited GitHub search never empties the store.
 */

const CATALOG_URL = 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json'
const TOPIC_URL =
  'https://api.github.com/search/repositories?q=topic%3Adsh-plugin&sort=updated&order=desc&per_page=100'
const TOPIC_PAGE_URL = 'https://github.com/topics/dsh-plugin'
const CACHE_TTL_MS = 10 * 60 * 1000
const REQUEST_TIMEOUT_MS = 30 * 1000
const USER_AGENT = 'dsh-plugin-store/1.0 (+https://github.com/deepseek-ai/deepseek-harness)'
const MAX_DESCRIPTION = 280
const MAX_TOPIC_ITEMS = 120

/** Category metadata used when the catalog itself cannot provide a label. */
const FALLBACK_CATEGORY_TITLES = {
  agi: { en: 'AGI Architecture Exploration', zh: 'AGI 架构探索' },
  ui: { en: 'UI Enhancements', zh: 'UI 增强' },
  usage: { en: 'Usage & Billing', zh: '用量与计费' },
  theme: { en: 'Themes & Appearance', zh: '主题与外观' },
  model: { en: 'Models & Providers', zh: '模型与账号接入' },
  identity: { en: 'Identity & Communication', zh: '身份与通信' },
  session: { en: 'Sessions & Messages', zh: '会话与消息' },
  memory: { en: 'Memory', zh: '记忆' },
  tools: { en: 'Tools & Capabilities', zh: '工具与能力' },
  wsl: { en: 'WSL & Windows Interop', zh: 'WSL 与 Windows 互操作' },
  browser: { en: 'Browser & Web', zh: '浏览器与网页' },
  vision: { en: 'Vision & Multimodal', zh: '视觉与多模态' },
  voice: { en: 'Voice & Audio', zh: '语音与音频' },
  docs: { en: 'Docs & Rendering', zh: '文档与渲染' },
  skill: { en: 'Skills', zh: '技能包' },
  workflow: { en: 'Workflow & Automation', zh: '工作流与自动化' },
  git: { en: 'Git & Code Review', zh: 'Git 与代码评审' },
  notify: { en: 'Notifications & Integrations', zh: '通知与集成' },
  dev: { en: 'Development & Runtime', zh: '开发与运行时' },
  security: { en: 'Security & Permissions', zh: '安全与权限' },
  remote: { en: 'Remote & Mobile', zh: '远程与移动端' },
  market: { en: 'Plugin Markets & Managers', zh: '插件市场与管理' },
  fun: { en: 'Just for Fun', zh: '娱乐' },
  other: { en: 'Other', zh: '其他' },
}

/**
 * Ordered keyword rules that place a repository discovered only through the topic.
 * The first match wins; specific surfaces come before broad ones such as `tools`.
 */
const TOPIC_CATEGORY_RULES = [
  ['theme', /theme|主题|皮肤|外观|壁纸|glass|毛玻璃|font|字体|palette|配色|skin/i],
  ['fun', /fun\b|pet\b|桌宠|game|游戏|娱乐|whale|鲸|meme|彩蛋|tavern|酒馆|companion|social|社交|ripple/i],
  ['market', /plugin market|plugin store|marketplace|插件市场|插件商店|插件目录|plugin hub|插件大全|插件聚合|插件合集|插件集合|모음집|plugins? by/i],
  ['usage', /usage|billing|balance|用量|计费|余额|\bcost\b|费用|quota|额度|spend|花费|消费/i],
  ['notify', /notif|通知|feishu|飞书|wechat|微信|telegram|email|邮件|\bqq\b|机器人|\bbot\b|push|webhook/i],
  ['voice', /voice|audio|\btts\b|speech|语音|朗读|音频|\bsound\b|音效|music|音乐|podcast/i],
  ['vision', /vision|visual|\bimage[s]?\b|视觉|识图|图像|\bocr\b|multimodal|多模态|screenshot|截图/i],
  ['dev', /memory pressure|内存|devkit|scaffold|开发者|\bdebug\b|调试|runtime|运行时|\bbuild\b|构建|诊断|diagnose/i],
  ['memory', /memor|记忆|recall|engram|mneme|knowledge graph|知识图谱/i],
  ['security', /security|安全|permission|权限|audit|审计|guard|沙箱|sandbox|secret|密钥/i],
  ['workflow', /workflow|工作流|automat|自动化|orchestrat|编排|multi[- ]?agent|多智能体|agent team|swarm|任务|auto[- ]?continue|继续|stock|trading|投资|portfolio|proactive|主动|开口/i],
  ['model', /model[s]?\b|模型|\bllm\b|openai|anthropic|gemini|opencode|推理|reasoning effort/i],
  ['session', /session|会话|\bchat\b|聊天|message|消息|context|上下文|compact|压缩|transcript|handoff|交接/i],
  ['skill', /skill[s]?\b|技能|bmad/i],
  ['remote', /remote|远程|mobile|手机|\bssh\b|\bvps\b|tunnel|隧道|phone/i],
  ['git', /\bgit\b|commit|diff|code review|代码评审|pull request|github/i],
  ['tools', /temp file|临时文件|清理|everything|全盘搜索|\bntfs\b/i],
  ['ui', /\bui\b|\bux\b|sidebar|侧栏|\bpanel\b|面板|composer|输入框|button|按钮|widget|悬浮|overlay|layout|布局|predict|suggest/i],
  ['browser', /browser|\bweb\b|网页|浏览器|scrape|抓取|search|搜索|fetch|fofa|测绘|riskbird|企业查询/i],
  ['docs', /\bdoc[s]?\b|markdown|文档|渲染|\brender\b|\bpdf\b|wiki|diagram|图表|mermaid|课件|字幕|lecture/i],
  ['identity', /identity|persona|人设|角色|language|语言|translat|翻译/i],
  ['wsl', /wsl|windows interop|wsl2/i],
  ['agi', /\bagi\b|self[- ]?evolv|自进化|architecture|架构探索/i],
  ['tools', /\btool[s]?\b|工具|\bmcp\b|terminal|终端|\bshell\b|computer use|desktop|文件|\bfile\b|ensp|网络实验/i],
]

/** @type {{ at: number, data: Record<string, unknown> } | null} */
let cache = null
/** @type {Promise<Record<string, unknown>> | null} */
let building = null
/** @type {import('@deepseek-ai/cordis').Context | null} */
let hostContext = null

/** Wait for the Web carrier before claiming a route; a headless profile keeps the row inactive. */
export const inject = ['webServer']

/** Register the catalog route while the Host owns the web server. */
export function apply(ctx) {
  const webServer = ctx.webServer
  if (!webServer) return
  hostContext = ctx
  ctx.effect(
    () =>
      webServer.register({
        kind: 'exact',
        path: '/dsh-plugin-store/catalog.json',
        handler: handleCatalog,
      }),
    'dsh-plugin-store: catalog route',
  )
}

/** Answer one catalog request. */
async function handleCatalog(req, res) {
  const method = req.method ?? 'GET'
  if (method !== 'GET' && method !== 'HEAD') {
    sendJson(res, 405, { error: 'method not allowed' }, false, { Allow: 'GET, HEAD' })
    return
  }
  let refresh = false
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    refresh = url.searchParams.has('refresh')
  } catch {
    refresh = false
  }
  try {
    const data = await getCatalog(refresh)
    sendJson(res, 200, data, method === 'HEAD')
  } catch (error) {
    sendJson(res, 502, { error: errorMessage(error) }, method === 'HEAD')
  }
}

/** Serve the cached document, rebuilding it at most once at a time. */
function getCatalog(refresh) {
  if (!refresh && cache && Date.now() - cache.at < CACHE_TTL_MS) return Promise.resolve(cache.data)
  if (building) return building
  building = buildCatalog()
    .then((data) => {
      cache = { at: Date.now(), data }
      return data
    })
    .catch((error) => {
      if (cache) {
        return {
          ...cache.data,
          stale: true,
          errors: { ...(cache.data.errors ?? {}), catalog: errorMessage(error) },
        }
      }
      throw error
    })
    .finally(() => {
      building = null
    })
  return building
}

/** Fetch the sources once and project them into the compact store document. */
async function buildCatalog() {
  const runtimeVersion = readRuntimeVersion(hostContext)
  const [catalogResult, topicResult, bundlesResult] = await Promise.allSettled([
    fetchJson(CATALOG_URL),
    fetchJson(TOPIC_URL, githubHeaders()),
    readInstalledBundles(hostContext),
  ])

  const errors = { catalog: null, topic: null }
  if (catalogResult.status === 'rejected') errors.catalog = errorMessage(catalogResult.reason)
  if (topicResult.status === 'rejected') errors.topic = errorMessage(topicResult.reason)

  const catalog = catalogResult.status === 'fulfilled' ? catalogResult.value : null
  const topic = topicResult.status === 'fulfilled' ? topicResult.value : null
  const installed = bundlesResult.status === 'fulfilled' ? bundlesResult.value : new Set()

  if (!catalog && !topic) {
    throw new Error(`catalog and topic both unavailable: ${errors.catalog ?? 'unknown'}`)
  }

  const categoryTitles = readCategoryTitles(catalog)
  const catalogItems = projectCatalog(catalog, categoryTitles, runtimeVersion, installed)
  const topicStats = applyTopic(topic, catalogItems, categoryTitles)

  const items = catalogItems.concat(topicStats.extras)
  const counts = {}
  for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1

  const categories = Object.keys(categoryTitles)
    .filter((id) => counts[id])
    .map((id) => ({
      id,
      title: categoryTitles[id],
      count: counts[id],
    }))
    .sort((left, right) => right.count - left.count)

  return {
    generatedAt: Date.now(),
    stale: false,
    runtimeVersion,
    source: {
      catalog: CATALOG_URL,
      catalogPage: 'https://awesome-dsh-plugin.com',
      topic: TOPIC_URL,
      topicPage: TOPIC_PAGE_URL,
    },
    stats: {
      total: items.length,
      catalog: catalogItems.length,
      topicOnly: topicStats.extras.length,
      topicMatched: topicStats.matched,
      topicRepos: topicStats.repos,
      categories: categories.length,
      installed: catalogItems.filter((item) => item.installed).length,
      incompatible: catalogItems.filter((item) => item.compatible === false).length,
    },
    categories,
    errors,
    items,
  }
}

/** Read localized category titles from the catalog metadata, completing the fixed set. */
function readCategoryTitles(catalog) {
  const titles = { ...FALLBACK_CATEGORY_TITLES }
  const declared = catalog && typeof catalog === 'object' ? catalog.metadata?.categories : null
  if (declared && typeof declared === 'object') {
    for (const [id, value] of Object.entries(declared)) {
      const title = value && typeof value === 'object' ? value.title : null
      if (!title || typeof title !== 'object') continue
      const en = typeof title.en === 'string' ? title.en : id
      const zh = typeof title.zh === 'string' ? title.zh : en
      titles[id] = { en, zh }
    }
  }
  return titles
}

/** Project catalog entries into the store shape, dropping the fields the page never needs. */
function projectCatalog(catalog, categoryTitles, runtimeVersion, installed) {
  const plugins = catalog && Array.isArray(catalog.plugins) ? catalog.plugins : []
  const items = []
  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== 'object') continue
    const npmName = typeof plugin.name === 'string' ? plugin.name.trim() : ''
    const repository = plugin.repository && typeof plugin.repository === 'object' ? plugin.repository : null
    const rawRepoUrl = typeof repository?.url === 'string' ? repository.url.replace(/\/+$/, '') : ''
    const repoFull = githubFullName(rawRepoUrl)
    const repoUrl = safeGithubUrl(rawRepoUrl, repoFull)
    const [owner = '', repoName = repoFull] = repoFull ? repoFull.split('/') : ['', '']
    const directory = typeof repository?.directory === 'string' ? repository.directory : ''
    const title = displayTitle(repoName, directory, npmName)
    const versions = Array.isArray(plugin.versions) ? plugin.versions : []
    const latest = versions.length > 0 ? versions[versions.length - 1] : null
    const version = latest && typeof latest.version === 'string' ? latest.version : ''
    const publishedAt = latest && Number.isFinite(latest.publishTimestamp) ? latest.publishTimestamp : 0
    const requires = typeof latest?.engines?.dsh === 'string' ? latest.engines.dsh : ''
    const category = typeof plugin.metadata?.category === 'string' && categoryTitles[plugin.metadata.category]
      ? plugin.metadata.category
      : 'other'
    items.push({
      id: npmName || `gh:${repoFull}`,
      source: 'catalog',
      npmName,
      title,
      owner,
      repo: repoFull,
      repoUrl,
      repoDirectory: directory,
      descriptionZh: cleanDescription(plugin.description?.zh),
      descriptionEn: cleanDescription(plugin.description?.en),
      category,
      version,
      publishedAt,
      requires,
      compatible: checkCompatibility(runtimeVersion, requires),
      installed: installed.has(npmName),
      installable: Boolean(npmName),
      topic: false,
      stars: 0,
      language: '',
      topics: [],
      updatedAt: 0,
    })
  }
  return items
}

/** Mark catalog entries that appear under the topic and append the topic-only discoveries. */
function applyTopic(topic, catalogItems, categoryTitles) {
  const repos = topic && Array.isArray(topic.items) ? topic.items : []
  const byRepo = new Map()
  for (const item of catalogItems) {
    if (!item.repo) continue
    const key = item.repo.toLowerCase()
    const bucket = byRepo.get(key)
    if (bucket) bucket.push(item)
    else byRepo.set(key, [item])
  }

  const seen = new Set(byRepo.keys())
  const extras = []
  let matched = 0

  for (const repo of repos) {
    if (!isPluginRepository(repo)) continue
    const fullName = typeof repo.full_name === 'string' ? repo.full_name : ''
    if (!fullName) continue
    const key = fullName.toLowerCase()
    const stars = Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0
    const updatedAt = Date.parse(repo.pushed_at ?? '') / 1000 || 0
    const createdAt = Date.parse(repo.created_at ?? '') / 1000 || updatedAt
    const topicTags = Array.isArray(repo.topics)
      ? repo.topics.filter((value) => typeof value === 'string').slice(0, 4)
      : []

    if (seen.has(key)) {
      const bucket = byRepo.get(key) ?? []
      for (const item of bucket) {
        item.topic = true
        item.stars = Math.max(item.stars ?? 0, stars)
        item.updatedAt = Math.max(item.updatedAt ?? 0, updatedAt)
        item.topics = topicTags
        if (!item.language && typeof repo.language === 'string') item.language = repo.language
      }
      matched += bucket.length
      continue
    }
    seen.add(key)

    const description = cleanDescription(repo.description)
    const name = typeof repo.name === 'string' ? repo.name : fullName.split('/')[1] ?? fullName
    const owner = typeof repo.owner?.login === 'string' ? repo.owner.login : fullName.split('/')[0] ?? ''
    const category = classifyTopic(repo)
    extras.push({
      id: `gh:${fullName}`,
      source: 'topic',
      npmName: '',
      title: name,
      owner,
      repo: fullName,
      repoUrl: safeGithubUrl(typeof repo.html_url === 'string' ? repo.html_url : '', fullName),
      repoDirectory: '',
      descriptionZh: containsCjk(description) ? description : '',
      descriptionEn: containsCjk(description) ? '' : description,
      category,
      version: '',
      publishedAt: createdAt,
      requires: '',
      compatible: null,
      installed: false,
      installable: false,
      topic: true,
      stars,
      language: typeof repo.language === 'string' ? repo.language : '',
      topics: topicTags,
      updatedAt,
    })
  }

  extras.sort((left, right) => right.stars - left.stars || right.publishedAt - left.publishedAt)
  const limited = extras.slice(0, MAX_TOPIC_ITEMS)
  return { extras: limited, matched, repos: repos.length }
}

/** Keep repositories that look like a DSH plugin rather than topic-tagged unrelated software. */
function isPluginRepository(repo) {
  if (!repo || typeof repo !== 'object') return false
  const fullName = typeof repo.full_name === 'string' ? repo.full_name : ''
  const name = typeof repo.name === 'string' ? repo.name.toLowerCase() : ''
  const description = typeof repo.description === 'string' ? repo.description : ''
  const topics = Array.isArray(repo.topics)
    ? repo.topics.filter((value) => typeof value === 'string').map((value) => value.toLowerCase())
    : []
  if (!topics.includes('dsh-plugin')) return false
  if (topics.includes('awesome-list')) return false
  if (fullName === 'deepseek-ai/deepseek-harness') return false
  if (fullName === 'awesome-dsh-plugin/awesome-dsh-plugin') return false
  if (/^(dsh-desktop|deepseek-harness-desktop)$/.test(name)) return false
  const nameHit = /(^|[-_])dsh([-_]|$)|dsh[-_]|deepseek[-_]harness/.test(name)
  const descriptionHit = /deepseek[ -]?harness|\bdsh\b|dsh[ -]?plugin|harness plugin|dsh 插件/i.test(description)
  const topicHit = topics.includes('deepseek-harness') || topics.includes('dsh')
  return nameHit || (descriptionHit && topicHit)
}

/** Place a topic-only repository in one of the store's categories. */
function classifyTopic(repo) {
  const haystack = [
    typeof repo.name === 'string' ? repo.name : '',
    typeof repo.description === 'string' ? repo.description : '',
  ]
    .join(' ')
    .toLowerCase()
  for (const [category, pattern] of TOPIC_CATEGORY_RULES) {
    if (pattern.test(haystack)) return category
  }
  return 'other'
}

/** A display title built from the repository, its subdirectory and the package name. */
function displayTitle(repoName, directory, npmName) {
  const base = repoName || (npmName ? npmName.split('/').pop() : 'plugin')
  if (!directory) return base
  const leaf = directory.split('/').filter(Boolean).pop()
  return leaf && leaf !== base ? `${base} · ${leaf}` : base
}

/** Normalize `https://github.com/owner/repo` into `owner/repo`. */
function githubFullName(url) {
  if (typeof url !== 'string') return ''
  const match = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/i.exec(url.trim())
  return match ? `${match[1]}/${match[2]}` : ''
}

/** Only publish an https GitHub link; anything else falls back to the repository identity. */
function safeGithubUrl(value, fullName) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/i.test(trimmed)) return trimmed.replace(/\/+$/, '')
  return fullName ? `https://github.com/${fullName}` : ''
}

/** Collapse whitespace and bound a description for transport. */
function cleanDescription(value) {
  if (typeof value !== 'string') return ''
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= MAX_DESCRIPTION) return text
  return `${text.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…`
}

/** Whether a string contains CJK text (used to label a topic description). */
function containsCjk(text) {
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(text)
}

/** Headers for the unauthenticated (or token-backed) GitHub search. */
function githubHeaders() {
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = typeof process.env.GITHUB_TOKEN === 'string' ? process.env.GITHUB_TOKEN.trim() : ''
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/** Fetch one JSON document with a bounded deadline. */
async function fetchJson(url, headers = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...headers },
      redirect: 'follow',
      signal: controller.signal,
    })
    if (!response.ok) {
      let detail = ''
      try {
        const body = await response.text()
        if (body) detail = `: ${body.slice(0, 180)}`
      } catch {
        detail = ''
      }
      throw new Error(`HTTP ${response.status}${detail}`)
    }
    return JSON.parse(await response.text())
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`request timed out after ${REQUEST_TIMEOUT_MS} ms`)
    throw error
  } finally {
    clearTimeout(timer)
  }
}

/** Read the running DSH release from the client module graph. */
function readRuntimeVersion(ctx) {
  try {
    const clientModules = ctx?.get?.('clientModules')
    const version = clientModules?.graph?.()?.release?.version
    return typeof version === 'string' && version ? version : null
  } catch {
    return null
  }
}

/** Read the package names this profile already installed, if the manager exposes them. */
async function readInstalledBundles(ctx) {
  try {
    const manager = ctx?.get?.('pluginManager')
    if (!manager || typeof manager.listBundles !== 'function') return new Set()
    const bundles = await manager.listBundles()
    if (!Array.isArray(bundles)) return new Set()
    return new Set(
      bundles
        .filter((bundle) => bundle && bundle.installed === true && typeof bundle.name === 'string')
        .map((bundle) => bundle.name),
    )
  } catch {
    return new Set()
  }
}

/** Whether a declared DSH engine range accepts the running release. `null` means unknown. */
function checkCompatibility(runtimeVersion, range) {
  if (!range || range === '*') return true
  if (!runtimeVersion) return null
  const result = satisfiesRange(runtimeVersion, range)
  return result === null ? null : result
}

/** Minimal semver range check for the catalog's comparator ranges (`>=`, `<`, `||`, `^`, `~`). */
function satisfiesRange(version, range) {
  const current = parseVersion(version)
  if (!current) return null
  const groups = String(range)
    .split('||')
    .map((group) => group.trim())
    .filter(Boolean)
  if (groups.length === 0) return true
  for (const group of groups) {
    const tokens =
      group.match(/(>=|<=|>|<|=|\^|~)?\s*v?[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?/g) ?? []
    if (tokens.length === 0) return null
    let accepted = true
    for (const token of tokens) {
      const match = /^(>=|<=|>|<|=|\^|~)?\s*v?([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)$/.exec(token)
      if (!match) return null
      const operator = match[1] ?? '='
      const target = parseVersion(match[2])
      if (!target) return null
      const order = compareVersions(current, target)
      let pass
      if (operator === '>=') pass = order >= 0
      else if (operator === '<=') pass = order <= 0
      else if (operator === '>') pass = order > 0
      else if (operator === '<') pass = order < 0
      else if (operator === '=') pass = order === 0
      else if (operator === '^') {
        pass = current.major === target.major && compareVersions(current, target) >= 0
      } else if (operator === '~') {
        pass =
          current.major === target.major &&
          current.minor === target.minor &&
          compareVersions(current, target) >= 0
      } else {
        return null
      }
      if (!pass) {
        accepted = false
        break
      }
    }
    if (accepted) return true
  }
  return false
}

function parseVersion(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(value))
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
  }
}

function compareVersions(left, right) {
  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] < right[key] ? -1 : 1
  }
  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0
  if (left.prerelease.length === 0) return 1
  if (right.prerelease.length === 0) return -1
  const length = Math.max(left.prerelease.length, right.prerelease.length)
  for (let index = 0; index < length; index += 1) {
    const a = left.prerelease[index]
    const b = right.prerelease[index]
    if (a === undefined) return -1
    if (b === undefined) return 1
    const aNumber = /^\d+$/.test(a)
    const bNumber = /^\d+$/.test(b)
    if (aNumber && bNumber) {
      const diff = Number(a) - Number(b)
      if (diff !== 0) return diff < 0 ? -1 : 1
    } else if (aNumber) return -1
    else if (bNumber) return 1
    else if (a !== b) return a < b ? -1 : 1
  }
  return 0
}

/** Write a JSON response, honoring HEAD. */
function sendJson(res, status, payload, headOnly, extraHeaders = {}) {
  const text = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  })
  res.end(headOnly ? undefined : text)
}

/** A single-line message for logs and the page's failure notice. */
function errorMessage(error) {
  if (error instanceof Error) return error.message
  return String(error)
}
