# LoopX Book

面向外部开发者的 LoopX 中英双语教程。

- [简体中文](https://cocolord.github.io/loopx-book/)
- [English](https://cocolord.github.io/loopx-book/en/)

本书先用六章建立长程 Agent 控制面的基础模型，再提供两条实践主线：

- 把已有 Git 项目接入 LoopX；
- 给 LoopX 做开发者贡献，包括 Control Plane、Capability、Provider、Host/Runner、
  Projection/Docs/fixtures，以及 Extension。

正文使用 Markdown，由 VitePress 构建，并发布到
[GitHub Pages](https://cocolord.github.io/loopx-book/)。

## 本地阅读

```bash
npm install
npm run docs:dev
```

构建静态站点：

```bash
npm run docs:build
```

验证中英文全部章节的正文、全书侧栏、本页目录挂载点和前后翻页：

```bash
npm run check:publication
```

再用本机 Chrome 或 Chromium 启动一个全新的 preview，抽查中英文首章、中间章和末章在
hydration 后的页内目录、侧栏、翻页、同页语言切换、本地搜索入口与关键 Markdown 渲染：

```bash
npm run check:publication:browser
```

两项出版检查都读取 `.vitepress/dist`，因此应在构建后运行。浏览器检查会自动寻找常见的
Chrome/Chromium 路径；非标准安装可通过 `CHROME_PATH` 指定。GitHub Pages workflow 会在上传
站点前依次执行构建、静态检查和浏览器检查。

## 内容边界

- 本书拥有学习路径、概念解释和任务导向教程；
- [loopx-book-labs](https://github.com/cocolord/loopx-book-labs) 拥有可运行练习；
- [LoopX 官方仓库](https://github.com/huangruiteng/loopx) 拥有 CLI、协议、源码和版本化行为。

当前内容以 LoopX GitHub release `v0.4.1` 为发布锚点；本地命令示例已在 `loopx 0.4.0`
CLI 表面核对。发布标签、已安装 CLI 与源码 checkout 可能处于不同 revision，运行前应读取
`loopx --version`、当前 `--help` 和官方 release notes。命令与产品行为发生冲突时，以实际使用的
LoopX 发布物和官方文档为准。

中文根路径是编辑事实源；英文版共享相同的章节结构、命令与产品合同，但按英语读者的任务重新
组织表达，不维护第二套产品规范。
