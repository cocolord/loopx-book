# 术语与命令入口

本附录只提供阅读路由，不替代 LoopX CLI reference。运行 `loopx <command> --help` 获取当前版本的
完整参数。

## 核心术语

| 术语 | 本书中的含义 |
| --- | --- |
| Agent | 在 Host/runtime 中规划并执行一个有界动作的执行者 |
| Host | 承载 session、模型 Turn 与唤醒表面的产品或 runtime |
| Goal | 由 stable `goal_id` 标识的长期项目结果与状态边界 |
| Agent identity | 由 `agent_id` 标识的 peer/lane；不等于 Goal，也不证明 Host |
| Vision | 绑定 `agent_id` 的 bounded execution-routing contract，记录当前 role scope、方向、acceptance summary 与 replan trigger |
| Acceptance | 判断 Goal 完成所需的可观察条件 |
| Todo | 有身份、可调度的工作单元 |
| Frontier | 当前满足依赖、Gate、能力与边界后可推进的 Todo 集合 |
| Claim | Todo 的软性执行归属 |
| Lease | 带期限的强占用，避免冲突执行 |
| Gate | 带 scope 与 authority 的阻塞决定 |
| Evidence | 支持判断的可验证材料 |
| Receipt | 已接受动作或 lifecycle transition 的持久记录 |
| Projection | 从 canonical state 生成的读模型 |
| Quota | 决定当前是否允许一轮工作并记录已验证消耗的合同 |
| Monitor | 按 cadence 观察外部条件、仅在 material change 时推进的 Todo |
| Capability | 调用者可依赖的 outcome contract |
| Provider | 调用外部系统或提供实现，并返回 bounded result |
| Extension | Provider/package 的安装、启停、升级与兼容生命周期 |
| Kernel | 接受状态转换并拥有 durable control-plane state 的核心 |

## 核心协议索引

按开发任务选择协议，不必从完整目录逐项阅读：

| 要解决的问题 | 优先阅读 |
| --- | --- |
| `/loopx <goal text>`、Goal selection、fresh Agent identity 与 Host activation | [`loopx_goal_command_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/loopx-goal-command-v0.md) |
| 长程 Agent source/projection、并发 lane 与 lifecycle | [`long_horizon_agent_state_protocol_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/long-horizon-agent-state-protocol-v0.md) |
| Replan/handoff 前的 Agent-scoped chronology | [`agent_scoped_evidence_ledger_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/agent-scoped-evidence-ledger-v0.md) |
| Canonical event、replay 与 privacy | [`event_sourced_state_contract_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/event-sourced-state-contract-v0.md) |
| Active-state workbench 的 typed read model | [`active_state_structured_projection_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/active-state-structured-projection-v0.md) |
| Todo、Gate、dependency 与 handoff 图 | [`task_graph_projection_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/task-graph-projection-v0.md) |
| Gate coverage 与 scoped authority | [`decision_scope_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/decision-scope-v0.md) |
| Per-Agent Vision 与 replan | [`goal_vision_replan_contract_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/goal-vision-replan-contract-v0.md) |
| Equal peer、claim 与 continuation | [`peer_agent_runtime_v1`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/peer-agent-runtime-v1.md) |
| 一轮 governed execution（experimental） | [`loopx_turn_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/loopx-turn-v0.md) |
| 已仲裁 decision 的 opt-in bounded projection | [`turn_envelope_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/turn-envelope-v0.md) |
| Host capability、controlled write 与 fallback | [`host_integration_surface_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/host-integration-surface-v0.md) |
| Session runtime 的只读一屏投影 | [`session_runtime_loopx_projection_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/session-runtime-loopx-projection-v0.md) |
| Session runtime metadata writeback（draft） | [`session_runtime_controlled_writeback_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/session-runtime-controlled-writeback-v0.md) |
| Revision、idempotency 与本地写正确性 | [`local_state_write_correctness_v0`](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/local-state-write-correctness-v0.md) |

完整协议目录仍以
[LoopX Protocol Contracts](https://github.com/huangruiteng/loopx/blob/main/docs/reference/protocols/README.md)
为准。

## 常用只读入口

```bash
loopx doctor
loopx registry
loopx status
loopx todo list --goal-id <goal-id>
loopx history --goal-id <goal-id>
loopx evidence-log --goal-id <goal-id> --agent-id <agent-id> --thin --limit 30
loopx quota should-run --goal-id <goal-id> --agent-id <agent-id>
loopx extension list --format json
```

## 项目接入入口

```bash
loopx connect

loopx start-goal --guided --project . \
  --goal-id <goal-id> \
  --agent-id <agent-id> \
  --goal-text "<goal text>" \
  --host-surface codex-app

loopx start-goal --guided --project . \
  --goal-id <goal-id> \
  --agent-id <agent-id> \
  --goal-text "<goal text>" \
  --host-surface codex-cli-tui
```

初次运行可以先省略 `--goal-id`、`--agent-id` 或 `--host-surface`，分别获得只读 Goal、fresh Agent
identity 或 Host selection gate。选择后使用 packet 给出的精确命令重跑；不要根据相似文本或唯一
已有 Agent 猜测。新 identity 的推荐注册路径使用 `register-agent --require-new` preview，再以
`--execute` 原子写入；已有 identity 只用于用户明确授权的 takeover。

## Scheduler 收敛入口

当 Codex App packet 报告 `stateful_backoff.apply_needed=true` 时，先让 Host 应用
`recommended_rrule` 并读取真实结果，再执行 packet 中完整的 `ack_hint.cli_args`。当前通常是：

```bash
loopx quota scheduler-ack-current <packet-bound-args...>
```

如果 apply 失败或超时，不要 ACK；执行一次 `failure_hint.cli_args`。若
`apply_needed=false, ack_needed=true`，说明精确 Host readback 已匹配目标 cadence，可以跳过 no-op
update 并直接执行绑定 ACK。Scheduler proposal、Host apply、readback 和 ACK 缺一不可，且 cadence
变化不记 delivery spend。

## Extension 生命周期入口

```bash
loopx extension init <extension-id>
loopx extension install --manifest <extension.toml>
loopx extension doctor <extension-id>
loopx extension run <extension-id> --input-json <request.json>
loopx extension disable <extension-id>
loopx extension enable <extension-id>
loopx extension upgrade --manifest <extension.toml>
loopx extension rollback <extension-id>
```

除 list 外，生命周期命令通常默认 preview。执行 mutation 或 provider invocation 前显式检查当前
`--help`，并只在确认后添加 `--execute`。

## 源码贡献入口

- [Contributor Task Board](https://github.com/huangruiteng/loopx/blob/main/CONTRIBUTOR_TASKS.md)
- [Contributing](https://github.com/huangruiteng/loopx/blob/main/CONTRIBUTING.md)
- [Control-Plane Developer Course](https://github.com/huangruiteng/loopx/tree/main/docs/development/control-plane-course)
- [Core Control-Plane Graphs](https://github.com/huangruiteng/loopx/tree/main/docs/product/core-control-plane)
- [Testing and Quality](https://github.com/huangruiteng/loopx/blob/main/docs/development/testing-and-quality.md)

## 官方入口

- [LoopX repository](https://github.com/huangruiteng/loopx)
- [Getting Started](https://github.com/huangruiteng/loopx/blob/main/docs/guides/getting-started.md)
- [Extensions and Capabilities](https://github.com/huangruiteng/loopx/blob/main/docs/reference/extensions.md)
- [LoopX Book Labs](https://github.com/cocolord/loopx-book-labs)
