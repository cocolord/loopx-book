import { defineConfig } from 'vitepress'

const zhThemeConfig = {
  nav: [
    { text: '首页', link: '/' },
    { text: '理论基础', link: '/chapters/01-from-session-to-loop' },
    { text: '项目接入', link: '/chapters/05-connect-existing-project' },
    { text: '开发者贡献', link: '/chapters/source-protocol-map' },
    { text: 'Labs', link: 'https://github.com/cocolord/loopx-book-labs' },
  ],

  sidebar: [
    {
      text: '开始',
      items: [
        { text: '如何使用本书', link: '/chapters/00-reading-guide' },
      ],
    },
    {
      text: '第一部分：控制面基础',
      items: [
        { text: '1. 从一次会话到长程任务', link: '/chapters/01-from-session-to-loop' },
        { text: '2. 会话、Codex Goal 与 LoopX', link: '/chapters/02-session-goal-loopx' },
        { text: '3. 持久状态与只读投影', link: '/chapters/state-substrate' },
        { text: '4. 工作图、权限与 Peer 协作', link: '/chapters/work-graph-and-authority' },
        { text: '5. 一轮受治理的工作', link: '/chapters/03-one-turn' },
        { text: '6. 恢复、自修复与运行边界', link: '/chapters/04-runtime-boundaries' },
      ],
    },
    {
      text: '第二部分：接入现有项目',
      items: [
        { text: '7. 连接你的 Git 项目', link: '/chapters/05-connect-existing-project' },
        { text: '8. 从 Codex App 启动', link: '/chapters/06-codex-app' },
        { text: '9. 从 Codex CLI 启动', link: '/chapters/07-codex-cli' },
      ],
    },
    {
      text: '第三部分：开发者贡献',
      items: [
        { text: '10. 开发者贡献地图与协议入口', link: '/chapters/source-protocol-map' },
        { text: '11. 沿一条协议链定位实现', link: '/chapters/source-trace-protocol-chain' },
        { text: '12. 修改一条 Control-Plane 规则', link: '/chapters/source-change-control-plane-rule' },
        { text: '13. 从聚焦验证到 PR', link: '/chapters/source-validation-to-pr' },
        { text: '14. 先选择正确的放置位置', link: '/chapters/08-extension-placement' },
        { text: '15. 创建 standalone Extension', link: '/chapters/09-extension-scaffold' },
        { text: '16. 生命周期与 managed runtime', link: '/chapters/10-extension-lifecycle' },
      ],
    },
    {
      text: '第四部分：工程边界',
      items: [
        { text: '17. 验证、兼容与安全', link: '/chapters/11-engineering-boundaries' },
        { text: '附录：术语与命令入口', link: '/chapters/appendix-reference' },
      ],
    },
  ],

  editLink: {
    pattern: 'https://github.com/cocolord/loopx-book/edit/main/:path',
    text: '在 GitHub 上编辑此页',
  },
  docFooter: {
    prev: '上一页',
    next: '下一页',
  },
  outline: {
    label: '本页目录',
    level: [2, 3],
  },
  lastUpdated: {
    text: '最后更新',
  },
  langMenuLabel: '切换语言',
  returnToTopLabel: '返回顶部',
  sidebarMenuLabel: '目录',
  darkModeSwitchLabel: '主题',
  search: {
    options: {
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索文档',
        },
        modal: {
          noResultsText: '没有找到相关内容',
          resetButtonTitle: '清除查询',
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
          },
        },
      },
    },
  },
}

const enThemeConfig = {
  nav: [
    { text: 'Home', link: '/en/' },
    { text: 'Foundations', link: '/en/chapters/01-from-session-to-loop' },
    { text: 'Project onboarding', link: '/en/chapters/05-connect-existing-project' },
    { text: 'Developer contributions', link: '/en/chapters/source-protocol-map' },
    { text: 'Labs', link: 'https://github.com/cocolord/loopx-book-labs' },
  ],

  sidebar: [
    {
      text: 'Start',
      items: [
        { text: 'How to use this book', link: '/en/chapters/00-reading-guide' },
      ],
    },
    {
      text: 'Part I: Control-plane foundations',
      items: [
        { text: '1. From one session to long-running work', link: '/en/chapters/01-from-session-to-loop' },
        { text: '2. Sessions, Codex Goal, and LoopX', link: '/en/chapters/02-session-goal-loopx' },
        { text: '3. Durable state and read-only projections', link: '/en/chapters/state-substrate' },
        { text: '4. Work graphs, authority, and peers', link: '/en/chapters/work-graph-and-authority' },
        { text: '5. One governed turn', link: '/en/chapters/03-one-turn' },
        { text: '6. Recovery, self-repair, and boundaries', link: '/en/chapters/04-runtime-boundaries' },
      ],
    },
    {
      text: 'Part II: Connect an existing project',
      items: [
        { text: '7. Connect an existing Git project', link: '/en/chapters/05-connect-existing-project' },
        { text: '8. Start from Codex App', link: '/en/chapters/06-codex-app' },
        { text: '9. Start from Codex CLI', link: '/en/chapters/07-codex-cli' },
      ],
    },
    {
      text: 'Part III: Developer contributions',
      items: [
        { text: '10. Developer contribution map', link: '/en/chapters/source-protocol-map' },
        { text: '11. Trace one protocol chain', link: '/en/chapters/source-trace-protocol-chain' },
        { text: '12. Change one control-plane rule', link: '/en/chapters/source-change-control-plane-rule' },
        { text: '13. From focused validation to a PR', link: '/en/chapters/source-validation-to-pr' },
        { text: '14. Choose the right extension point', link: '/en/chapters/08-extension-placement' },
        { text: '15. Build a standalone Extension', link: '/en/chapters/09-extension-scaffold' },
        { text: '16. Lifecycle and managed runtime', link: '/en/chapters/10-extension-lifecycle' },
      ],
    },
    {
      text: 'Part IV: Engineering boundaries',
      items: [
        { text: '17. Validation, compatibility, and safety', link: '/en/chapters/11-engineering-boundaries' },
        { text: 'Appendix: Terms and commands', link: '/en/chapters/appendix-reference' },
      ],
    },
  ],

  editLink: {
    pattern: 'https://github.com/cocolord/loopx-book/edit/main/:path',
    text: 'Edit this page on GitHub',
  },
  docFooter: {
    prev: 'Previous page',
    next: 'Next page',
  },
  outline: {
    label: 'On this page',
    level: [2, 3],
  },
  lastUpdated: {
    text: 'Last updated',
  },
  langMenuLabel: 'Change language',
  returnToTopLabel: 'Return to top',
  sidebarMenuLabel: 'Menu',
  darkModeSwitchLabel: 'Theme',
}

export default defineConfig({
  title: 'LoopX Book',
  description: 'A protocol-first developer book for LoopX foundations, project onboarding, and developer contributions',
  base: '/loopx-book/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '从长程 Agent 控制面到项目接入与开发者贡献',
      themeConfig: zhThemeConfig,
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'From control-plane protocols to project onboarding and developer contributions',
      themeConfig: enThemeConfig,
    },
  },

  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cocolord/loopx-book' },
    ],
  },

  markdown: {
    lineNumbers: true,
  },
})
