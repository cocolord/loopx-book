# 运行责任与事实边界

长期 Agent 系统容易把所有组件都称为“工具”或“插件”。LoopX 使用清晰的责任边界，避免 Extension
绕过 domain policy，也避免 Kernel 成为外部系统的影子数据库。

## 本章目标

读完后，你应该能：

- 区分 Agent、Provider、Capability、Kernel 与 Extension；
- 判断 canonical state 和外部事实分别由谁拥有；
- 解释 Extension 为什么是交付边界而不是第五种 runtime responsibility；
- 识别 public/private boundary 被破坏的情况。

## 四种运行责任

| 责任 | 合同 |
| --- | --- |
| Agent | 在 Host/runtime 中规划并执行一个有界动作 |
| Provider | 调用外部系统，返回 observation、effect result 或 readback |
| Capability | 规范 provider 输出，应用 domain policy，并提出有限状态转换 |
| LoopX Kernel | 接受或拒绝 proposal，拥有 Todo、Gate、Quota、Recovery 与 Scheduling 状态 |

正常流向是：

```text
Agent -> Capability -> Provider -> external system
Provider readback -> Capability proposal -> LoopX Kernel
```

Agent 不应直接把任意 provider 输出写成 canonical state。Capability 先检查领域合同，Kernel 再决定
是否接受转换。

## Extension 是生命周期边界

**Extension**拥有独立的：

- packaging；
- installation；
- enable / disable；
- upgrade / rollback；
- compatibility；
- provider ownership。

它不拥有 Goal 状态，也不自动获得 domain authority。一个 Extension 可以交付 Provider，但 Provider
在运行时仍要遵守 Capability 与 Kernel 的合同。

因此，Extension 不是下图中的第五个处理节点：

```text
Extension package
└── delivers Provider
      └── participates in Agent -> Capability -> Provider -> Kernel flow
```

对于零权限、确定性的 standalone Extension，LoopX 允许通过 managed runtime 直接调用其有界命令。
一旦操作需要 read、write、send、publish 或 manage authority，就必须进入可以应用 domain policy
的 Capability 或领域命令。

## 谁拥有事实

### LoopX canonical state

LoopX 拥有工作生命周期事实：

- Goal、Todo、Gate；
- claim、lease、dependency；
- quota、monitor、scheduler hint；
- accepted evidence pointer 与 receipt；
- event lineage 和 projection inputs。

### 外部系统

外部系统继续拥有自己的事实：

- Git 拥有 commit 与 branch；
- GitHub 拥有 PR 与 check 当前状态；
- CI 拥有 job 结果；
- issue tracker 拥有 issue lifecycle；
- cloud service 拥有资源实际状态。

LoopX 可以保存 bounded observation、readback 和 evidence pointer，但不能让一份过期复制品替代
外部权威。

### Host 与 Agent

Host 拥有 session、模型 Turn 和唤醒表面。Agent 拥有当前推理与临时计划。它们不应成为项目 Goal
状态的唯一持有者。

## Public 与 private boundary

项目状态常包含不能公开提交的内容：

- 本地 registry；
- active goal state；
- task lease；
- raw transcript；
- 凭据与 provider config；
- 私有路径和内部链接；
- 未脱敏的外部 evidence。

本书的接入 Lab 会将以下目录排除在 Git 外：

```text
.loopx/
.codex/goals/
```

忽略规则只是第一层保护。公开提交前仍要扫描凭据、绝对路径、raw logs 和私有叙事。需要长期保存
的结论应先被压缩成 public-safe、可复用的 product behavior 或 evidence pointer。

## LoopX 不替代什么

LoopX 不替代：

- Agent runtime：模型仍负责推理；
- Host scheduler：Host 仍负责实际唤醒；
- Git：代码历史和 branch 仍由 Git 管理；
- CI：测试执行和 check 状态仍由 CI 管理；
- 外部服务认证：execution envelope 不是安全 token；
- domain system：LoopX 不伪造外部资源事实。

这个边界也是 Extension 设计的起点。第三部分会先判断一项能力是否真的需要独立生命周期，再决定
它应成为 standalone Extension、Capability provider，还是留在项目内部。
