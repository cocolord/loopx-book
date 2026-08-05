import { access, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('..', import.meta.url)
const distDir = new URL('.vitepress/dist/', root)
const base = '/loopx-book'

const chapters = [
  '00-reading-guide',
  '01-from-session-to-loop',
  '02-session-goal-loopx',
  'state-substrate',
  'work-graph-and-authority',
  '03-one-turn',
  '04-runtime-boundaries',
  '05-connect-existing-project',
  '06-codex-app',
  '07-codex-cli',
  'source-protocol-map',
  'source-trace-protocol-chain',
  'source-change-control-plane-rule',
  'source-validation-to-pr',
  '08-extension-placement',
  '09-extension-scaffold',
  '10-extension-lifecycle',
  '11-engineering-boundaries',
  'appendix-reference',
]

const locales = [
  {
    name: '中文',
    prefix: '',
    outlineLabel: '本页目录',
    agentOnboardingMarkers: ['让 Agent 帮你接入', '接入回报', '不要提交或推送'],
    financeExtensionOnboardingMarkers: [
      '接入时启用已有 Extension',
      'loopx-finance-value-discovery',
      '源码包',
    ],
    financePlacementMarkers: [
      '财经发现 Extension',
      'capability_id',
      '不自动拉取行情',
    ],
    sourceGroundedChapterMarkers: {
      '02-session-goal-loopx': [
        '任务资格卡',
        'Host 兼容矩阵',
        'same task semantics',
      ],
      'state-substrate': [
        '存储介质不是 authority contract',
        '本地优先',
        'Draft',
      ],
      'work-graph-and-authority': [
        '多仓库与并行协作',
        'task_repository',
        '不授予写权限',
      ],
      '05-connect-existing-project': [
        '发现 Capability 与可选功能',
        'loopx capability list',
        'configure-goal --goal-id',
      ],
      'appendix-reference': [
        '安全升级 runbook',
        'loopx update --check',
        'loopx update --dry-run',
      ],
    },
  },
  {
    name: 'English',
    prefix: '/en',
    outlineLabel: 'On this page',
    agentOnboardingMarkers: [
      'Delegate onboarding to an Agent',
      'onboarding report',
      'Do not commit or push',
    ],
    financeExtensionOnboardingMarkers: [
      'Enable an existing Extension during onboarding',
      'loopx-finance-value-discovery',
      'provider source package',
    ],
    financePlacementMarkers: [
      'Finance value-discovery Extension',
      'capability_id',
      'does not fetch market data',
    ],
    sourceGroundedChapterMarkers: {
      '02-session-goal-loopx': [
        'Task qualification card',
        'Host compatibility matrix',
        'same task semantics',
      ],
      'state-substrate': [
        'Storage medium is not the authority contract',
        'local-first',
        'Draft',
      ],
      'work-graph-and-authority': [
        'Multi-repository and parallel work',
        'task_repository',
        'does not grant write authority',
      ],
      '05-connect-existing-project': [
        'Discover Capabilities and optional features',
        'loopx capability list',
        'configure-goal --goal-id',
      ],
      'appendix-reference': [
        'Safe upgrade runbook',
        'loopx update --check',
        'loopx update --dry-run',
      ],
    },
  },
]

const failures = []
let pagesChecked = 0

function expect(condition, message) {
  if (!condition) failures.push(message)
}

function route(prefix, slug) {
  return `${base}${prefix}/chapters/${slug}`
}

function hasPager(html, direction, href) {
  const anchor = new RegExp(
    `<a(?=[^>]*class="[^"]*pager-link ${direction}[^"]*")(?=[^>]*href="${href}")[^>]*>`,
  )
  return anchor.test(html)
}

function hasBrandCta(html, href) {
  const anchor = new RegExp(
    `<a(?=[^>]*class="[^"]*VPButton[^"]*brand[^"]*")(?=[^>]*href="${href}")[^>]*>`,
  )
  return anchor.test(html)
}

async function listHtmlFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listHtmlFiles(path))
    } else if (entry.name.endsWith('.html')) {
      files.push(path)
    }
  }
  return files
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function hasPublishedTarget(href) {
  const cleanHref = href.split(/[?#]/, 1)[0]
  const relative = decodeURIComponent(
    cleanHref === base ? '' : cleanHref.slice(`${base}/`.length),
  )
  const target = join(distDir.pathname, relative)
  const candidates = relative === '' || cleanHref.endsWith('/')
    ? [join(target, 'index.html')]
    : /\.[a-z0-9]+$/i.test(relative)
      ? [target]
      : [`${target}.html`, join(target, 'index.html')]

  return (await Promise.all(candidates.map(pathExists))).some(Boolean)
}

for (const locale of locales) {
  const localeDir = locale.prefix ? locale.prefix.slice(1) : ''
  const homepage = await readFile(
    new URL(`${localeDir ? `${localeDir}/` : ''}index.html`, distDir),
    'utf8',
  )
  expect(
    hasBrandCta(homepage, route(locale.prefix, '01-from-session-to-loop')),
    `${locale.name}首页的主 CTA 没有进入第一章`,
  )

  for (const [index, slug] of chapters.entries()) {
    const pagePath = join(localeDir, 'chapters', `${slug}.html`)
    const html = await readFile(new URL(pagePath, distDir), 'utf8')
    const pageLabel = `${locale.name} ${slug}`
    pagesChecked += 1

    expect(
      html.includes('<main class="main"') &&
        /<div[^>]*class="[^"]*\bvp-doc\b[^"]*"/.test(html) &&
        html.includes('<h1 id=') &&
        html.includes('<h2 id='),
      `${pageLabel} 缺少完整的章节正文结构`,
    )

    const hasSidebar =
      html.includes('class="VPSidebar"') &&
      html.includes('id="VPSidebarNav"')
    expect(
      hasSidebar,
      `${pageLabel} 缺少全书侧栏`,
    )

    if (hasSidebar) {
      const sidebarStart = html.indexOf('class="VPSidebar"')
      const sidebarEnd = html.indexOf('</aside>', sidebarStart)
      const sidebar = html.slice(sidebarStart, sidebarEnd)
      for (const sidebarSlug of chapters) {
        expect(
          sidebar.includes(`href="${route(locale.prefix, sidebarSlug)}"`),
          `${pageLabel} 的侧栏缺少 ${sidebarSlug}`,
        )
      }
    }

    const outlineStart = html.indexOf('class="VPDocAsideOutline"')
    const outlineEnd = outlineStart === -1 ? -1 : html.indexOf('</nav>', outlineStart)
    const outline =
      outlineStart === -1 || outlineEnd === -1
        ? ''
        : html.slice(outlineStart, outlineEnd)
    expect(
      outline.includes('class="VPDocOutlineItem root"') &&
        outline.includes(`>${locale.outlineLabel}</div>`) &&
        html.includes('<h2 id='),
      `${pageLabel} 缺少本页目录挂载点、locale 标题或章节标题源`,
    )

    if (slug === '05-connect-existing-project') {
      for (const marker of locale.agentOnboardingMarkers) {
        expect(
          html.includes(marker),
          `${pageLabel} 缺少 Agent 辅助接入合同标记 ${marker}`,
        )
      }
      for (const marker of locale.financeExtensionOnboardingMarkers) {
        expect(
          html.includes(marker),
          `${pageLabel} 缺少接入期 Extension 启用标记 ${marker}`,
        )
      }
    }

    if (slug === '08-extension-placement') {
      for (const marker of locale.financePlacementMarkers) {
        expect(
          html.includes(marker),
          `${pageLabel} 缺少财经发现 placement 标记 ${marker}`,
        )
      }
    }

    for (const marker of locale.sourceGroundedChapterMarkers[slug] ?? []) {
      expect(
        html.includes(marker),
        `${pageLabel} 缺少源码事实标记 ${marker}`,
      )
    }

    const previous = chapters[index - 1]
    const next = chapters[index + 1]
    if (previous) {
      expect(
        hasPager(html, 'prev', route(locale.prefix, previous)),
        `${pageLabel} 缺少指向 ${previous} 的上一页`,
      )
    } else {
      expect(!html.includes('pager-link prev'), `${pageLabel} 不应显示上一页`)
    }

    if (next) {
      expect(
        hasPager(html, 'next', route(locale.prefix, next)),
        `${pageLabel} 缺少指向 ${next} 的下一页`,
      )
    } else {
      expect(!html.includes('pager-link next'), `${pageLabel} 不应显示下一页`)
    }
  }
}

for (const htmlPath of await listHtmlFiles(distDir.pathname)) {
  const html = await readFile(htmlPath, 'utf8')
  expect(
    !html.includes('loopx-book-labs') && !/>Labs?</.test(html),
    `${htmlPath.slice(distDir.pathname.length)} 仍包含已移除的 Labs 路径或导航`,
  )
  const internalHrefs = [
    ...html.matchAll(/href="(\/loopx-book(?:\/[^"#?]*)?(?:[?#][^"]*)?)"/g),
  ].map((match) => match[1])

  for (const href of new Set(internalHrefs)) {
    expect(
      await hasPublishedTarget(href),
      `${htmlPath.slice(distDir.pathname.length)} 包含无法发布的站内链接 ${href}`,
    )
  }
}

if (failures.length > 0) {
  console.error(`Publication check failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `Publication check passed: ${pagesChecked} chapter pages across ${locales.length} locales.`,
  )
}
