import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LoopX Book',
  description: '从长程 Agent 控制面到项目接入与 Extension 开发',
  lang: 'zh-CN',
  base: '/loopx-book/',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '理论基础', link: '/chapters/01-from-session-to-loop' },
      { text: '项目接入', link: '/chapters/05-connect-existing-project' },
      { text: 'Extension', link: '/chapters/08-extension-placement' },
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
          { text: '3. 一轮工作如何组成', link: '/chapters/03-one-turn' },
          { text: '4. 运行责任与事实边界', link: '/chapters/04-runtime-boundaries' },
        ],
      },
      {
        text: '第二部分：接入现有项目',
        items: [
          { text: '5. 连接你的 Git 项目', link: '/chapters/05-connect-existing-project' },
          { text: '6. 从 Codex App 启动', link: '/chapters/06-codex-app' },
          { text: '7. 从 Codex CLI 启动', link: '/chapters/07-codex-cli' },
        ],
      },
      {
        text: '第三部分：Extension 开发',
        items: [
          { text: '8. 先选择正确的放置位置', link: '/chapters/08-extension-placement' },
          { text: '9. 创建 standalone Extension', link: '/chapters/09-extension-scaffold' },
          { text: '10. 生命周期与 managed runtime', link: '/chapters/10-extension-lifecycle' },
        ],
      },
      {
        text: '第四部分：工程边界',
        items: [
          { text: '11. 验证、兼容与安全', link: '/chapters/11-engineering-boundaries' },
          { text: '附录：术语与命令入口', link: '/chapters/appendix-reference' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cocolord/loopx-book' },
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

    search: {
      provider: 'local',
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
  },

  markdown: {
    lineNumbers: true,
  },
})
