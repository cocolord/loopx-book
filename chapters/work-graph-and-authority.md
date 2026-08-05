# 工作图、权限与 Peer 协作

Todo 不是普通 checklist。它和 Gate、dependency、claim、capability、workspace、evidence 共同组成
一个可以计算的工作图。本章解释如何从 Goal 形成当前 frontier，以及多名 equal peer 如何协作而
不把某个 Agent、Host 或对话误当成隐藏 leader。

## 本章目标

读完后，你应该能：

- 区分 Goal、Acceptance 与 per-Agent Vision；
- 区分 Agent Todo、User Gate、User Action、Monitor 与 Blocker；
- 解释 claim、lease、lifecycle authority、capability gate 与 workspace guard 的不同职责；
- 使用 dependency、resume、successor、supersede、continuation 和 no-follow-up 表达工作闭环；
- 判断 Gate 是否真正覆盖某个动作，而不是看到“等待用户”就冻结整个 Goal；
- 说明 handoff 为什么传递 bounded state references，而不是复制完整 transcript。

## Goal、Acceptance 与 per-Agent Vision

三者服务不同层次：

| 对象 | 归属 | 回答的问题 |
| --- | --- | --- |
| Goal | 项目 | 最终要达成什么结果 |
| Acceptance | Goal 或明确的交付阶段 | 哪些可观察证据足以判断完成 |
| Agent Vision | `agent_id` | 这个 peer 当前承担什么方向、scope、acceptance summary 与 replan trigger |

Vision 不是泛化的产品愿景，也不是自由格式 scratchpad。
[`goal_vision_replan_contract_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/goal-vision-replan-contract-v0.md)
将它定义为 bounded、per-Agent 的执行路由状态。它可以包含：

- `role_scope`；
- `vision_summary`；
- `acceptance_summary`；
- `advancement_policy`；
- `replan_trigger_summary`；
- 最近一次 bounded patch。

当一个 peer 产生 material progress 时，需要记录 Vision 是否 patched、unchanged with reason、
retired 或 superseded。否则后续 quota 可能看到 `vision_checkpoint_missing`，要求先补齐 replan
证据，而不是静默继续。

这能防止两种漂移：

1. Todo 队列一直繁忙，但没有推进 Goal acceptance；
2. 多个 peer 都围绕同一 Goal 工作，却各自维护一套不可见的“我以为下一步是……”。

## Todo 是最小可执行或等待单元

Todo 可以承载：

- role 与 priority；
- `task_class` 与 `action_kind`；
- dependency / resume condition；
- required capability / write scope；
- claim、lease 与 continuation policy；
- Gate、evidence、successor 和 supersession refs。

它不是完整项目计划，也不应只是 prompt 中的一条提醒。

### 五类常见工作

| 类型 | 谁负责 | 典型语义 |
| --- | --- | --- |
| `advancement_task` | Agent | 当前可交付的实现、文档、分析或修复 |
| `user_gate` | User/controller | 缺少决定时，相关 action 不可合法继续 |
| `user_action` | User/controller | 需要用户处理，但不自动阻塞独立 Agent work |
| `continuous_monitor` | Agent/Host | 按 cadence 观察外部条件，仅 material change 时推进 |
| `blocker` | Agent/controller | 当前缺少可执行条件，需要明确恢复路径 |

Todo text 可以供人阅读；机器路由不能只从自然语言猜任务类型。

## Frontier 不是 open Todo 列表

**Frontier** 是当前满足全部前置条件的候选集合：

```text
open todos
  -> dependency and resume
  -> decision scope and authority
  -> agent claim and lifecycle authority
  -> host capability
  -> workspace and write scope
  -> freshness and evidence
  -> current frontier
```

因此：

- open 不等于 runnable；
- priority 不等于绕过 Gate；
- claimed 不等于仍可执行；
- capability available 不等于获得 authority；
- Todo done 不等于 Goal complete。

[`task_graph_projection_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/task-graph-projection-v0.md)
可以把这些关系渲染成图，但图本身仍是 read-only projection。真正的状态变化继续通过 Todo、Gate、
refresh 与 event protocols。

## Claim、Lease 与 Lifecycle Authority

三个概念经常被错误合并：

### Claim：软性工作归属

Claim 表示“这个 peer 当前负责这项工作”，帮助 quota 和其他 Agent 避免重复领取。它不是锁，也
不证明 Agent 仍存活或仍在正确 worktree。

### Lease：可选的并发占用

Lease 用于需要 TTL、renew、transfer、version/CAS 或幂等 identity 的显式互斥场景。它适合
高成本或有副作用的执行占用，但不自动替代 Todo lifecycle。

一个实现可以：

- 有 claim、没有 lease；
- 有 lease，但因为 Gate 仍不能运行；
- lease 到期后重新分配；
- 在 handoff 时不传递旧 lease。

### Lifecycle Authority：谁能改变状态

Claim 回答谁计划执行；lifecycle authority 回答谁有权 complete、supersede、reassign 或执行
特殊 override。显式委托某个 peer 完成 lifecycle mutation，不会把它升级为全局 leader。

LoopX 的 live multi-agent 模型是 **equal peer**。Agent id 是工作身份，不是 Host 证明，也不是
组织层级。`codex-*` 命名不能单独证明任务运行在 Codex App 还是 CLI。

## Gate 是 scoped authority

[`decision_scope_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/decision-scope-v0.md)
要求 user/controller decision 说明：

- `kind`：例如 `private_read`、`write_scope`、`resource`、`production`、`public_claim` 或
  `direction`；
- `granularity`：action、lane、goal、project 或 global；
- `scope_key`：具体被阻塞的公共安全标识；
- 可选 expiry、decision id 与 reason。

Agent Todo 可以声明 `required_decision_scopes`。只有 unresolved Gate 的 scope 覆盖当前 action
需求时，它才阻塞这项工作。

例如：

```text
Gate G1
  decision_scope = public_claim:action:bilingual_homepage

Todo A
  required_decision_scopes = public_claim:action:bilingual_homepage

Todo B
  write internal link checker
  required_decision_scopes = none
```

G1 阻塞 A，不阻塞 B。如果 projection 只有“等待用户确认”这句 prose，却没有 scope relation，
正确动作是修复 projection 或询问具体决定，不能默认给 Agent authority，也不能默认冻结整个 Goal。

`user_action` 更不能冒充 authority。用户看到了提醒，不等于批准了 production、publish 或 private
read。

## Capability Gate 与 Workspace Guard

Gate、capability 与 workspace 是三条不同轴：

| 边界 | 主要问题 | 不能证明 |
| --- | --- | --- |
| Decision scope | 是否获得这项动作需要的人类/控制器决定 | Host 是否能执行 |
| Capability gate | 当前 Host/runtime 是否具备所需能力 | 是否获得用户授权 |
| Workspace guard | 当前 Agent 是否位于正确 repository/worktree/write scope | 业务结果是否正确 |

例如一个 Agent 已获 publish approval，但当前 Host 没有 network capability，仍不能发布；Host
有 shell 和 network，却位于错误 worktree，也不能修改目标仓库。

这些边界应在 current decision 中组合，而不是让 automation prompt 复制一套项目专属 `if` 链。

## Dependency、Resume 与 Successor

工作图不仅表达“先做 A，再做 B”，还要表达等待后如何恢复。

### Dependency

说明当前 Todo 依赖哪些 durable facts 或其他 Todo。

### Resume condition

说明 deferred/blocked Todo 在什么机器可读条件满足后重新进入 replan，例如：

```text
todo_done:<todo-id>
pr_merged:<pr-id>
capacity_available:<capability>
```

条件满足不一定意味着原 Todo 直接运行。旧任务可能已经 stale，需要 successor replan。

### Successor

当前 Todo 完成后，明确下一项有身份的工作。Successor 让“下一步”进入 durable graph，而不是留在
完成者的聊天里。

### Supersede

方向改变时，用新 Todo 取代旧 Todo，同时保留 lineage。不要把已失效工作伪装成 done。

### No-follow-up

如果确实不需要 successor，记录为什么 acceptance 已闭合或为什么后续不属于当前 Goal。结构化
no-follow-up 比“看起来做完了”更可审计。

## Continuation 与 Handoff

完成当前 Todo 后有两种常见 continuation：

- `same_agent_non_delivery`：同一 peer 继续一项明确、非独立交付的后续；
- `independent_handoff`：后续保持 unclaimed，任何合格 peer 都可接手，除非显式指派。

默认不应因为某个 Agent 刚完成上一项，就自动拥有整个 Goal 的后续工作。

Handoff 也不是复制 transcript。一个 bounded handoff 至少应让接手者重建：

- Goal、Todo 与 stop condition；
- current revision/workspace；
- Gate、capability 与 authority boundary；
- evidence/material references 及 freshness；
- next action 与 validation；
- 哪些内容被截断或留在 private store。

接手者仍要重新运行 current guard。旧 Agent 的 receipt 不会自动授予新 Agent source permission，
旧 workspace observation 也不能证明当前环境未变化。

## 工作图的三种结束方式

一项 Todo 离开 active frontier 时，至少属于以下之一：

1. **Completed with evidence**：交付与验证都成立；
2. **Superseded with lineage**：方向改变，新 Todo 接管；
3. **Blocked/deferred with resume contract**：等待具体条件，且不会丢失恢复路径。

“从列表里删掉”不是合法的生命周期。

整个 Goal terminal 还要额外检查：

- acceptance 是否满足；
- 是否存在 unresolved Gate；
- 是否有 due monitor、pending external effect 或 fresh readback；
- 是否有 successor、replan obligation 或 acceptance gap；
- 是否有 retryable postcondition；
- 是否明确记录 no-follow-up。

## 协议阅读入口

需要修改工作图或权限语义时，优先按问题读取协议：

- [`task_graph_projection_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/task-graph-projection-v0.md)：
  依赖、Gate、validation、repair 与 handoff 的只读图；
- [`decision_scope_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/decision-scope-v0.md)：
  Gate 覆盖关系与 fail-closed 行为；
- [`goal_vision_replan_contract_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/goal-vision-replan-contract-v0.md)：
  per-Agent Vision、checkpoint 与 replan；
- [Peer Agent Runtime v1](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/peer-agent-runtime-v1.md)：
  equal peer、continuation 与 identity；
- [Host Integration Surface](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/host-integration-surface-v0.md)：
  claim、optional lease、capability 与 Host 边界。

下一章把这些状态与权限编译成一次受治理的 Turn：谁应行动、谁应等待、哪个 channel 应通知，以及
什么时候允许 writeback 与 spend。
