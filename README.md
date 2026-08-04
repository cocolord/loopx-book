# LoopX Book

面向外部开发者的 LoopX 中文教程。

本书先解释长程 Agent 工作为什么需要控制面，再提供两条并列路径：

- 把已有 Git 项目接入 LoopX；
- 开发、验证和管理 LoopX Extension。

正文使用 Markdown，由 VitePress 构建，并计划发布到
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

## 内容边界

- 本书拥有学习路径、概念解释和任务导向教程；
- [loopx-book-labs](https://github.com/cocolord/loopx-book-labs) 拥有可运行练习；
- [LoopX 官方仓库](https://github.com/huangruiteng/loopx) 拥有 CLI、协议、源码和版本化行为。

当前内容以 LoopX `0.4.0` 为验证基线。命令与产品行为发生冲突时，以对应版本的 LoopX
发布物和官方文档为准。
