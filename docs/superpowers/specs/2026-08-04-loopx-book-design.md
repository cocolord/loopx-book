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
- 解释普通 Agent 会话、Codex Goal 与 LoopX control plane 逐层解决了什么问题，
  并判断一个任务停在哪一层已经足够；
- 使用 Goal、Todo、Gate、Evidence、Quota、Turn 和 Projection 判断一个长程任务的状态；
- 从 Codex App 或 Codex CLI 可见 TUI 把现有 Git 项目接入 LoopX；
- 确认项目连接、状态隔离、下一步工作和恢复路径；
- 判断一项能力应放在 Capability、Provider、Extension 还是项目内部 helper；
- 从官方 scaffold 创建一个 independently packaged standalone Extension；
- 完成 manifest、request/response schema、doctor、安装、启停、调用、验证、升级和回滚；
- 知道何时必须进入带权限的 Capability/provider 路径，而不能绕过管理面直接执行。

## 内容结构

### 第一部分：建立控制面心智模型

这部分为后续实践建立较完整的理论基础，不把读者直接送进命令清单。建议拆成四章。

#### 第一章：从一次 Agent 会话到长程任务

- 模型上下文为什么更适合作为工作内存，而不是长期事实源；
- session 结束、上下文压缩、模型切换、Agent 交接和外部事实变化分别会破坏什么；
- execution plane 与 control plane 的区别；
- 哪些信息必须外置，哪些临时推理可以随 Turn 结束而丢弃。

#### 第二章：普通会话、Codex Goal 与 LoopX

这一章不是竞品式功能表，而是解释控制信息如何逐层外置：

| 层次 | 主要拥有的状态 | 解决的问题 | LoopX 继续补充的部分 |
| --- | --- | --- | --- |
| 普通 Agent 会话 | 当前 transcript、工具结果和本轮计划 | 完成一次上下文内的推理与执行 | session 之外的目标连续性、工作身份和恢复 |
| Codex Goal | thread 上持久的 objective、goal lifecycle 与可选 budget | 让 Host 围绕同一目标继续 Turn，并判断 active、paused、budget-limited 或 complete | 项目级 Todo/claim、scoped gate、外部 effect receipt、跨 Agent/Host 状态和领域 lifecycle |
| LoopX control plane | 项目拥有的 canonical state，以及由它编译出的当前 Turn packet | 组织跨 session、Agent、Host 和外部系统的可审计生命周期 | 不替代模型推理、Host 执行或外部系统本身的事实权威 |

比较必须落到可观察行为，而不是抽象口号：

- **目标归属：** Codex Goal 让 objective 脱离一次 prompt；LoopX 再把项目级
  acceptance、boundary 和当前 frontier 放进可恢复状态。
- **工作结构：** Codex Goal 可以围绕目标继续执行；LoopX 把 Todo、claim、lease、
  dependency、successor 和 handoff 变成有身份的项目对象。
- **人类判断：** 普通对话可以提问；LoopX 把具体问题绑定到 scope 和 authority，
  区分 user action、blocking gate 与不依赖该 gate 的 safe fallback。
- **证据与外部动作：** 工具调用结果可以出现在 Turn 中；LoopX 区分 proposal、
  observation、validated evidence、effect readback 和 durable receipt，避免“尝试过”
  被当成“已经发生并被接受”。
- **时间与调度：** Host 可以继续或再次启动 Turn；LoopX 把 `should-run`、monitor、
  scheduler hint、backoff 和 spend 变成可重放的项目控制事实。
- **跨 Agent 与跨 Host：** Codex Goal 首先服务于其 thread/Host 的目标生命周期；
  LoopX 用项目状态让 Codex App、Codex CLI 和其他 Agent surface 读取同一份工作边界，
  但不让任一 Host 成为第二事实源。
- **恢复与领域状态：** LoopX 通过 event、lineage、projection、replan 和 self-repair
  支持失败恢复，并允许 Issue Fix 等领域增加 Domain State，而不复制 Kernel。

本章还要明确两个边界：

1. LoopX 可以与 Codex Goal 组合，Host 继续负责唤醒和执行当前 Turn；二者不是只能选一个；
2. 只把 `/goal` 字样写进普通 prompt，不等于已经建立了 Host 可读回的持久 Goal，
   具体行为必须以目标 Codex 版本的公开界面为准。

为了避免随 Host 演进而失真，书中只保留稳定的概念差异。Codex Goal 的命令、字段和
生命周期细节在 Labs 验证目标版本后展示，并指向对应的官方来源。

#### 第三章：LoopX 的核心对象如何组成一轮

- Goal、Vision 与 Acceptance 如何保持方向；
- Todo、Frontier、Claim、Lease 与 Gate 如何限定当前合法动作；
- Evidence、Receipt 与 Projection 为什么不是同一层事实；
- Quota、Turn、Monitor、Replan 与 Terminal audit 如何决定继续、等待或结束；
- 用同一个小型项目分别展示普通会话、Codex Goal 和 LoopX 的状态快照，让读者预测
  session 中断、用户插入决定和外部检查等待时会发生什么。

#### 第四章：运行责任与扩展边界

- Agent、Provider、Capability、Kernel 与 Extension 的职责；
- canonical state、外部事实源和 public/private boundary；
- 为什么 Extension 是交付和生命周期边界，不是第五种 runtime responsibility；
- 为什么 LoopX 不替代 Agent runtime、Git、CI 或领域系统。

理论必须用可检查的小场景、状态快照和反例落地，不展开 Kernel 代码演进史。第一部分结束时，
读者应能判断：短而封闭的任务何时只用普通会话，单一 Host 内的持续目标何时可由 Codex Goal
承担，以及何时需要 LoopX 的项目级 Todo、权限、证据、调度或跨 Host 恢复。

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
- 第一部分能用同一任务对比普通会话、Codex Goal 与 LoopX，并说明三者可以组合而不是互斥；
- 读者能从 Todo/claim、gate/authority、evidence/receipt、scheduler/recovery 和跨 Host
  五个维度指出 LoopX 相对原生 Goal 新增的项目级控制合同；
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
