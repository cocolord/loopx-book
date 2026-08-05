import { spawn } from 'node:child_process'
import { access, mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const base = '/loopx-book'
const chapterCount = 19
const timeoutMs = 30_000

const cases = [
  {
    name: '中文首章',
    route: '/chapters/01-from-session-to-loop',
    counterpart: '/en/chapters/01-from-session-to-loop',
    expectedPagerCount: 2,
    expectedStrongTerms: [
      'Execution plane（执行面）',
      'Control plane（控制面）',
    ],
  },
  {
    name: '中文中间章',
    route: '/chapters/source-protocol-map',
    counterpart: '/en/chapters/source-protocol-map',
    expectedPagerCount: 2,
  },
  {
    name: '中文项目接入',
    route: '/chapters/05-connect-existing-project',
    counterpart: '/en/chapters/05-connect-existing-project',
    expectedPagerCount: 2,
    expectedArticleTerms: [
      '让 Agent 帮你接入',
      '接入时启用已有 Extension',
      'loopx-finance-value-discovery',
    ],
  },
  {
    name: '中文 Extension placement',
    route: '/chapters/08-extension-placement',
    counterpart: '/en/chapters/08-extension-placement',
    expectedPagerCount: 2,
    expectedArticleTerms: [
      '案例：财经发现 Extension',
      'capability_id',
      'entrypoint_missing',
    ],
  },
  {
    name: '中文末章',
    route: '/chapters/appendix-reference',
    counterpart: '/en/chapters/appendix-reference',
    expectedPagerCount: 1,
  },
  {
    name: 'English first chapter',
    route: '/en/chapters/01-from-session-to-loop',
    counterpart: '/chapters/01-from-session-to-loop',
    expectedPagerCount: 2,
  },
  {
    name: 'English middle chapter',
    route: '/en/chapters/source-protocol-map',
    counterpart: '/chapters/source-protocol-map',
    expectedPagerCount: 2,
  },
  {
    name: 'English project onboarding',
    route: '/en/chapters/05-connect-existing-project',
    counterpart: '/chapters/05-connect-existing-project',
    expectedPagerCount: 2,
    expectedArticleTerms: [
      'Delegate onboarding to an Agent',
      'Enable an existing Extension during onboarding',
      'loopx-finance-value-discovery',
    ],
  },
  {
    name: 'English Extension placement',
    route: '/en/chapters/08-extension-placement',
    counterpart: '/chapters/08-extension-placement',
    expectedPagerCount: 2,
    expectedArticleTerms: [
      'Case: the Finance value-discovery Extension',
      'capability_id',
      'entrypoint_missing',
    ],
  },
  {
    name: 'English last chapter',
    route: '/en/chapters/appendix-reference',
    counterpart: '/chapters/appendix-reference',
    expectedPagerCount: 1,
  },
]

function expect(condition, message, failures) {
  if (!condition) failures.push(message)
}

function allMatches(source, pattern) {
  return [...source.matchAll(pattern)]
}

function extract(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker)
  if (start === -1) return ''
  const end = source.indexOf(endMarker, start)
  return end === -1 ? '' : source.slice(start, end + endMarker.length)
}

function normalizeFragment(href) {
  const hash = href.indexOf('#')
  if (hash === -1) return ''
  try {
    return decodeURIComponent(href.slice(hash + 1))
  } catch {
    return href.slice(hash + 1)
  }
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      await access(candidate)
      return candidate
    } catch {
    }
  }

  throw new Error(
    'Chrome/Chromium not found. Set CHROME_PATH to a headless-capable browser.',
  )
}

async function reservePort() {
  const server = createServer()
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : null
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
  if (!port) throw new Error('Could not reserve a preview port.')
  return port
}

function collectProcess(child, label) {
  let stdout = ''
  let stderr = ''
  child.stdout?.on('data', (chunk) => {
    stdout += chunk
  })
  child.stderr?.on('data', (chunk) => {
    stderr += chunk
  })

  const completed = new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('close', (code, signal) => {
      resolve({ code, signal, stdout, stderr, label })
    })
  })

  return { completed, output: () => ({ stdout, stderr }) }
}

async function waitForPreview(url, preview, previewOutput) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const exited = await Promise.race([
      preview.completed.then((result) => result),
      new Promise((resolve) => setTimeout(() => resolve(null), 100)),
    ])
    if (exited) {
      throw new Error(
        `VitePress preview exited before startup.\n${exited.stderr || exited.stdout}`,
      )
    }

    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
    }
  }

  const output = previewOutput()
  throw new Error(
    `Timed out waiting for VitePress preview at ${url}.\n${output.stderr || output.stdout}`,
  )
}

async function dumpHydratedDom(chrome, url, profileDir) {
  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-sandbox',
      `--user-data-dir=${profileDir}`,
      '--virtual-time-budget=5000',
      '--window-size=1440,1000',
      '--dump-dom',
      url,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )
  let stdout = ''
  let stderr = ''

  const html = await new Promise((resolve, reject) => {
    let renderedHtml = ''
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      reject(
        new Error(
          `Chrome timed out rendering ${url}.\n${stderr}`,
        ),
      )
    }, timeoutMs)

    child.stdout.on('data', (chunk) => {
      stdout += chunk
      if (!renderedHtml && stdout.includes('</html>')) {
        renderedHtml = stdout
        child.kill('SIGKILL')
      }
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.once('close', (code, signal) => {
      clearTimeout(timer)
      if (renderedHtml) {
        resolve(renderedHtml)
        return
      }
      reject(
        new Error(
          `Chrome could not render ${url} (code=${code}, signal=${signal}).\n${stderr}`,
        ),
      )
    })
  })

  return html
}

function validatePage(testCase, html) {
  const failures = []
  const sidebar = extract(html, 'class="VPSidebar"', '</aside>')
  const outline = extract(html, 'class="VPDocAsideOutline', '</nav>')
  const article = extract(html, 'class="vp-doc ', '</main>')

  const sidebarRoutes = new Set(
    allMatches(
      sidebar,
      /<a(?=[^>]*class="[^"]*\bVPLink\b)(?=[^>]*href="([^"]*\/chapters\/[^"]+)")[^>]*>/g,
    ).map((match) => match[1]),
  )
  expect(
    sidebarRoutes.size === chapterCount,
    `${testCase.name}: expected ${chapterCount} sidebar chapter routes, found ${sidebarRoutes.size}`,
    failures,
  )

  expect(
    /\bclass="[^"]*\bVPDocAsideOutline\b[^"]*\bhas-outline\b/.test(outline),
    `${testCase.name}: hydrated page outline is not visible`,
    failures,
  )

  const headingIds = new Set(
    allMatches(article, /<h[23][^>]*\sid="([^"]+)"/g).map((match) => match[1]),
  )
  const outlineHrefs = allMatches(
    outline,
    /<a(?=[^>]*class="[^"]*\boutline-link\b)(?=[^>]*href="([^"]+)")[^>]*>/g,
  ).map((match) => match[1])
  expect(
    outlineHrefs.length > 0,
    `${testCase.name}: hydrated page outline has no links`,
    failures,
  )
  expect(
    outlineHrefs.some((href) => headingIds.has(normalizeFragment(href))),
    `${testCase.name}: outline links do not target this chapter's h2/h3 headings`,
    failures,
  )

  const pagerCount = allMatches(
    html,
    /<a[^>]*class="[^"]*\bpager-link\b[^"]*"/g,
  ).length
  expect(
    pagerCount === testCase.expectedPagerCount,
    `${testCase.name}: expected ${testCase.expectedPagerCount} pager links, found ${pagerCount}`,
    failures,
  )

  expect(
    html.includes(`href="${base}${testCase.counterpart}"`),
    `${testCase.name}: language switch does not preserve the chapter slug`,
    failures,
  )

  const hasSearchEntry =
    html.includes('id="local-search"') &&
    /\bclass="[^"]*\bDocSearch-Button\b/.test(html)
  expect(
    hasSearchEntry,
    `${testCase.name}: local search button is missing after hydration`,
    failures,
  )

  for (const term of testCase.expectedStrongTerms ?? []) {
    expect(
      article.includes(`<strong>${term}</strong>`),
      `${testCase.name}: "${term}" is not rendered as strong text`,
      failures,
    )
    expect(
      !article.includes(`**${term}**`),
      `${testCase.name}: literal Markdown markers leaked around "${term}"`,
      failures,
    )
  }

  for (const term of testCase.expectedArticleTerms ?? []) {
    expect(
      article.includes(term),
      `${testCase.name}: expected article content "${term}" is missing`,
      failures,
    )
  }

  return failures
}

const chrome = await findChrome()
const port = await reservePort()
const previewRoot = `http://127.0.0.1:${port}${base}`
const tempRoot = await mkdtemp(join(tmpdir(), 'loopx-book-browser-check-'))
const previewChild = spawn(
  process.execPath,
  [
    'node_modules/vitepress/bin/vitepress.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)
const preview = collectProcess(previewChild, 'VitePress preview')
const failures = []

try {
  await waitForPreview(`${previewRoot}/`, preview, preview.output)

  for (const [index, testCase] of cases.entries()) {
    const profileDir = join(tempRoot, `chrome-${index}`)
    const html = await dumpHydratedDom(
      chrome,
      `${previewRoot}${testCase.route}`,
      profileDir,
    )
    const pageFailures = validatePage(testCase, html)
    failures.push(...pageFailures)
    if (pageFailures.length === 0) {
      console.log(`✓ ${testCase.name}`)
    }
  }
} finally {
  previewChild.kill('SIGTERM')
  await Promise.race([
    preview.completed,
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ])
  if (previewChild.exitCode === null) previewChild.kill('SIGKILL')
  await rm(tempRoot, { recursive: true, force: true })
}

if (failures.length > 0) {
  console.error(`Browser publication check failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `Browser publication check passed: ${cases.length} hydrated chapter pages.`,
  )
}
