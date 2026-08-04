# 术语与命令入口

本附录只提供阅读路由，不替代 LoopX CLI reference。运行 `loopx <command> --help` 获取当前版本的
完整参数。

## 核心术语

| 术语 | 本书中的含义 |
| --- | --- |
| Agent | 在 Host/runtime 中规划并执行一个有界动作的执行者 |
| Host | 承载 session、模型 Turn 与唤醒表面的产品或 runtime |
| Goal | 长程工作要实现的结果 |
| Vision | 保持 Goal 长期方向与关键取舍的状态 |
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

## 常用只读入口

```bash
loopx doctor
loopx registry
loopx status
loopx todo list --goal-id <goal-id>
loopx history --goal-id <goal-id>
loopx quota should-run --goal-id <goal-id>
loopx extension list --format json
```

## 项目接入入口

```bash
loopx connect

loopx start-goal --guided --project . \
  --goal-text "<goal text>" \
  --host-surface codex-app

loopx start-goal --guided --project . \
  --goal-text "<goal text>" \
  --host-surface codex-cli-tui
```

如果不确定 Host，省略 `--host-surface` 以获得只读 selection gate。

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

## 官方入口

- [LoopX repository](https://github.com/huangruiteng/loopx)
- [Getting Started](https://github.com/huangruiteng/loopx/blob/main/docs/guides/getting-started.md)
- [Extensions and Capabilities](https://github.com/huangruiteng/loopx/blob/main/docs/reference/extensions.md)
- [LoopX Book Labs](https://github.com/cocolord/loopx-book-labs)
