# LoopX Book 设计

## 结论

`loopx-book` 面向准备使用和扩展 LoopX 的外部开发者。它不是 LoopX 官方文档的镜像，
也不以培养 Kernel 核心贡献者为目标。全书通过一套必要的 Loop Engineering 理论，
支持两条并列的实践路径：

1. 把读者已有的开发项目接入 LoopX；
2. 开发、验证并管理一个 LoopX Extension。

`loopx-book-labs` 独立承载可运行项目、命令和练习。案例叙事与 public-safe narrative
不进入首版主线，后续在 Labs 中以可复现实验为前提补充。

## 读者与学习结果

主要读者是熟悉 Git、命令行和基本软件开发流程，但没有 LoopX 内部开发经验的开发者。
读者不需要先了解 LoopX Kernel 源码。

完成首版后，读者应能：

- 解释 LoopX 与 Agent runtime 的职责边界；
- 使用 Goal、Todo、Gate、Evidence、Quota、Turn 和 Projection 判断一个长程任务的状态；
- 从 Codex App 或 Codex CLI 可见 TUI 把现有 Git 项目接入 LoopX；
- 确认项目连接、状态隔离、下一步工作和恢复路径；
- 判断一项能力应放在 Capability、Provider、Extension 还是项目内部 helper；
- 从官方 scaffold 创建一个 independently packaged standalone Extension；
- 完成 manifest、request/response schema、doctor、安装、启停、调用、验证、升级和回滚；
- 知道何时必须进入带权限的 Capability/provider 路径，而不能绕过管理面直接执行。

## 内容结构

### 第一部分：建立控制面心智模型

这部分只讲后续实践依赖的理论：

- 为什么一次 Agent 会话不足以承载长程任务；
- Goal、Todo、Gate、Evidence、Quota、Turn 和 Projection 如何组成一轮；
- Agent、Provider、Capability、Kernel 与 Extension 的职责；
- canonical state、外部事实源和 public/private boundary。

理论必须用可检查的小场景落地，不展开 Kernel 代码演进史。

### 第二部分：把现有项目接入 LoopX

项目接入是一条独立路径，不要求读者先开发 Extension。章节覆盖：

- 安装与 `loopx doctor`；
- 连接已有项目与忽略本地控制状态；
- 从 Codex App 启动；
- 从 Codex CLI 可见 TUI 启动；
- 建立或继续 Goal，读取 status、todo、gate、history 与 quota；
- 处理已有状态、连接失败、过期 host task body 和恢复场景。

同一项目状态分别通过 Codex App 和 Codex CLI 展示，避免把 Host 当成第二套控制面。

### 第三部分：Extension 二次开发

Extension 开发与项目接入并列。章节覆盖：

- Capability、Provider、Extension 和内部 helper 的放置决策；
- `loopx extension init` 生成的标准 standalone scaffold；
- manifest、JSON schema、stdin/stdout protocol 与 side-effect-free doctor；
- 本地安装、`extension install`、enable、disable、doctor 和 `extension run`；
- 测试、失败处理、版本升级和 rollback；
- effectful provider、permission、execution envelope 和 receipt 的进阶边界。

首版完整实现一个无权限、确定性的 standalone Extension。带外部 effect 的实现只解释
标准边界和进入条件，不伪造一个缺乏真实调用者契约的 Capability。

### 第四部分：工程化边界

用少量章节收束：

- 版本与兼容性；
- 安全、权限和 public/private boundary；
- 如何验证文档、代码和发布包；
- 下一步阅读路径。

## 主书与 Labs 的边界

| 仓库 | 拥有的内容 | 不拥有的内容 |
| --- | --- | --- |
| `loopx-book` | 学习路径、概念解释、任务导向教程、必要代码片段、权威来源指针 | LoopX Kernel 事实、完整命令参考、可运行练习仓库、原始案例日志 |
| `loopx-book-labs` | 可运行样例、失败夹具、测试、逐步练习、预期输出 | 长篇理论、重复的产品说明、未经脱敏的真实项目状态 |
| LoopX 官方仓库 | CLI、协议、源码、版本化行为和 release | 本书的教学顺序 |

主书中的命令以已发布 LoopX 版本验证。容易变化的细节指向官方文档，并明确验证版本。
Labs 使用自动化 smoke 检查命令、链接和预期结构，不能依赖本机路径、凭据或私有状态。

## 语言与术语

- 正文、章节标题、解释和练习说明以简体中文编写；
- CLI 命令、代码、schema 字段、文件名、类型名和无法无损翻译的术语保留英文；
- 首次出现的核心术语给出中文解释，后续保持英文标识稳定；
- 不为追求“全中文”翻译产品表面实际显示的命令或字段；
- 不以英文原文加中文逐段翻译制造重复内容。

## 写作与证据规则

每章先说明读者要解决的问题和可观察的成功标准，再引入概念、命令和恢复路径。
代码片段必须标注为以下一种：

- 可直接运行；
- 从 Labs 摘取；
- 为解释而简化。

重要行为以当前 LoopX release、官方仓库源码或版本化协议为依据。书中建议必须与已验证事实
分开。无法由发布版本证明的未来方向不写成当前能力。

## 首版范围

首版交付：

- 可构建的中文 VitePress 书站；
- 一条完整项目接入教程，覆盖 Codex App 与 Codex CLI；
- 一条完整 standalone Extension 教程；
- 一个项目接入 Lab；
- 一个由 `loopx extension init` 产生并最小改造的 Extension Lab；
- 链接、构建和基础命令 smoke。

首版不交付：

- Kernel 修改教程；
- 完整 CLI 百科；
- 多 Host 全覆盖；
- effectful production provider；
- benchmark 或企业内部案例；
- public-safe narrative 案例正文；
- 自动发布到 GitHub Pages。

## 验收

主书：

- 首页在第一屏说明读者、两条路径和当前范围；
- 中文正文占主导，代码与必要术语保持英文；
- `npm run docs:build` 成功；
- 内部链接通过检查；
- 每条高影响命令均在目标 LoopX release 上验证或明确标注未执行。

Labs：

- 仓库可在干净环境完成安装和测试；
- Lab 不包含凭据、绝对本机路径、LoopX 私有状态或 raw Agent 日志；
- 项目接入 Lab 能证明 `.loopx/` 与 `.codex/goals/` 不进入 Git；
- Extension Lab 能证明 scaffold、schema、doctor 与 managed runtime 的边界；
- 主书链接到稳定 Lab 路径，Labs 反向指向对应章节。

## 维护策略

每次 LoopX minor release 后只检查高漂移面：安装、Host 启动、`start-goal`、项目连接和
Extension lifecycle。概念章节仅在公开契约变化时更新。章节头记录验证版本；Labs CI
负责发现命令和结构漂移，主书不复制官方完整参考。
