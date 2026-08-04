---
layout: home

hero:
  name: LoopX Book
  text: 让 Agent 工作跨过一次会话
  tagline: 面向外部开发者的中文教程：先建立控制面心智模型，再选择接入现有项目或开发 Extension。
  actions:
    - theme: brand
      text: 从理论开始
      link: /chapters/01-from-session-to-loop
    - theme: alt
      text: 接入现有项目
      link: /chapters/05-connect-existing-project
    - theme: alt
      text: 开发 Extension
      link: /chapters/08-extension-placement

features:
  - title: 控制面基础
    details: 用同一个任务比较普通 Agent 会话、Codex Goal 与 LoopX，理解三者如何组合。
  - title: 项目接入
    details: 把已有 Git 项目接入 LoopX，并分别从 Codex App 与 Codex CLI 启动。
  - title: Extension 开发
    details: 从官方 scaffold 开始，完成一个确定性、零权限的 standalone Extension。
  - title: 可运行 Labs
    details: 命令、schema 和失败恢复由独立 Labs 仓库承载，可重复验证。
---

## 这本书解决什么问题

普通 Agent 会话擅长完成一次上下文内的推理与执行，但真实开发工作会经历中断、压缩、
交接、等待和外部状态变化。LoopX 把这些过程中的目标、工作队列、权限、证据和恢复条件
放进项目拥有的控制面。

本书不复制 LoopX CLI reference，也不要求读者成为 Kernel 核心贡献者。它提供一条稳定的
学习路径，让外部开发者能够判断：

- 当前任务只需要一次普通会话，还是需要持久 Goal；
- 什么时候需要 LoopX 的项目级 Todo、Gate、Evidence、Quota 与恢复合同；
- 如何把自己的项目接入 LoopX；
- 如何在不绕过权限和生命周期的前提下交付 Extension。

## 两条并列实践路径

完成第一部分后，可以按需求选择：

1. **接入现有项目：** 从[第五章](./chapters/05-connect-existing-project.md)开始；
2. **开发 Extension：** 从[第八章](./chapters/08-extension-placement.md)开始。

两条路径互不依赖。项目接入不要求先写 Extension，Extension 开发也不要求修改 LoopX Kernel。

## 当前验证基线

- 正文格式：Markdown；
- 站点生成器：VitePress；
- 在线发布：GitHub Pages；
- LoopX 行为验证基线：`0.4.0`；
- 可运行练习：[loopx-book-labs](https://github.com/cocolord/loopx-book-labs)。

易变化的命令以 LoopX 官方文档和当前 `--help` 为准。本书负责教学顺序与心智模型，不成为
另一份完整命令参考。
