# 一轮 LoopX 工作如何组成

LoopX 的核心不是“让 Agent 无限循环”，而是从项目状态编译出一个有边界的 Turn，并在验证后把
结果写回。本章把相关对象放进同一个因果链。

## 本章目标

读完后，你应该能：

- 从 Goal 推导当前 frontier；
- 区分 Todo、Gate、Evidence、Receipt 与 Projection；
- 解释 quota 为什么不是简单的调用次数；
- 判断一轮工作何时应该继续、等待、重规划或结束。

## 从方向到当前动作

### Goal、Vision 与 Acceptance

**Goal**描述要完成的结果。**Vision**保存长期方向和重要取舍，避免局部 Todo 逐渐偏离。
**Acceptance**定义什么证据足以判断结果完成。

三者回答不同问题：

| 对象 | 回答的问题 |
| --- | --- |
| Goal | 最终要实现什么 |
| Vision | 为什么这样实现、哪些方向不能丢 |
| Acceptance | 什么可观察结果算完成 |

Todo 不能替代 Goal。一个看似忙碌的 Todo 队列可能没有推进验收；LoopX 需要在 replan 时重新检查
Todo 与 Goal 的关系。

### Todo 与 Frontier

**Todo**是有身份的工作单元。它可以携带 priority、task class、required capability、write
scope、dependency 和 owner。

**Frontier**不是所有 open Todo，而是当前满足依赖、Gate、能力和边界后真正可以推进的集合。

```text
open todos
  -> dependency filter
  -> gate and authority filter
  -> capability and write-scope filter
  -> current frontier
```

这一区分防止 Agent 看到“还有任务”就盲目执行。

### Claim 与 Lease

**Claim**表达软性的执行归属，适合协作调度。**Lease**表达更强的、带期限的 Todo 占用，用于避免
两个执行者同时处理同一有副作用或高成本工作。

claim 并不证明执行者仍活跃，lease 也不等于工作已经推进。判断状态时还要查看期限、run history
与最新 evidence。

## Gate 不应冻结整个世界

假设维护者尚未决定 JSON 错误字段，但文档和性能测试不依赖这个字段。正确的 Gate 应只阻塞
schema finalization，而不是把整个 Goal 标记成不可工作。

```text
Gate: choose error field
├── blocks: finalize response schema
└── does not block:
    ├── benchmark serializer
    └── write migration guide
```

LoopX 将 user action 与 blocking gate 分开，并要求 scope 足够具体。宽泛的“等待用户确认”会把
本可独立推进的工作错误地移出 frontier。

## Evidence、Receipt 与 Projection

这三个对象经常被混用：

### Evidence

Evidence 是支持判断的材料，例如：

- 某 commit 上测试通过；
- 当前 CI check 状态；
- provider 返回的只读观察；
- schema validation 结果。

Evidence 需要说明来源和适用范围。“测试通过”如果没有 commit 或命令边界，恢复价值很低。

### Receipt

Receipt 记录一个动作或状态转换已经被接受。例如 extension 安装 receipt 可以绑定 manifest
revision、doctor 结果与 activation state。

Receipt 不一定证明外部世界永远保持不变。它证明的是：在特定输入、revision 和 readback 下，
某个生命周期动作曾成功完成。

### Projection

Projection 是从 canonical state 生成的读模型，例如 status、dashboard 或当前 Turn packet。
它为读者压缩信息，但不成为第二事实源。

```text
canonical state + current external observations
                     |
                     v
          status / quota / turn projection
```

如果 projection 与 canonical state 冲突，应修复投影或状态迁移，而不是手工修改多个展示面。

## Quota、Monitor 与下一轮

`quota should-run` 综合目标状态、Todo frontier、能力、Gate、调度上下文和预算，输出这一轮是否
应该运行。它不是单纯的“还剩多少 token”。

一轮正常交付至少包含：

1. 选择一个合法 Todo；
2. 交付一段有界 artifact；
3. 运行针对性验证；
4. 把结果写回 canonical state；
5. 只有在产生已验证进展后记录 spend。

当 frontier 只剩外部条件时，应该建立 monitor，而不是反复启动 Agent 问“有变化吗”。monitor
保存 target、cadence、next due 和 material change 规则；无变化轮次可以静默结束。

## Replan 与 Terminal audit

以下情况要求 replan：

- Goal 或 Vision 改变；
- Todo 与验收脱节；
- 新 evidence 推翻旧假设；
- 原 Gate 已失效或 scope 错误；
- 执行能力或 Host 发生变化；
- 多轮没有推进 primary outcome。

完成所有 Todo 也不自动等于 Goal 完成。terminal audit 需要重新检查 acceptance、未处理 Gate、
外部 effect readback 和 follow-up，才能决定 complete 还是补充 successor。

## 预测中断后的恢复

对贯穿任务，假设 Codex CLI 在完成测试后关闭。新的 Codex App session 不需要完整 transcript，
只要能读取：

- Goal 与 acceptance；
- 当前 Todo frontier；
- schema Gate；
- 绑定 commit 的测试 evidence；
- quota 与 Host 启动合同。

它便能判断：是继续写文档、等待维护者，还是因 evidence 已过期而重跑验证。这就是 Turn packet
的价值：恢复的是行动条件，不是上一轮的全部思维过程。
