# 普通会话、Codex Goal 与 LoopX

这三者不是互斥产品，而是不同层次的状态与责任。选择的关键不是“哪个更强”，而是你的任务需要
把多少控制信息移出当前会话。

## 本章目标

读完后，你应该能：

- 说明普通会话、Codex Goal 与 LoopX 各自拥有的状态；
- 从五类可观察行为解释 LoopX 在 Goal 之上增加了什么；
- 判断什么时候 Codex Goal 已经足够；
- 解释 LoopX 与 Codex Goal 如何组合。

## 三层状态

| 层次 | 主要拥有的状态 | 主要解决的问题 |
| --- | --- | --- |
| 普通 Agent 会话 | 当前 transcript、工具结果和本轮计划 | 完成一次上下文内的推理与执行 |
| Codex Goal | Host/thread 上持久的 objective 与 Goal lifecycle | 让同一 Host 围绕目标继续 Turn，并判断 active、blocked 或 complete |
| LoopX | 项目拥有的 Goal、Todo、Gate、Evidence、Quota 与恢复状态 | 组织跨 session、Agent、Host 和外部系统的可审计生命周期 |

LoopX 不复制 Host 的模型执行，也不把 Codex Goal 降级为一个 prompt 技巧。Host Goal 负责“继续
围绕目标运行”，LoopX 负责“从项目状态编译出当前合法的一轮工作”。

## 用同一任务比较

仍以“为 CLI 增加 JSON 输出”为例。

### 普通会话

你对 Agent 说：

> 增加 `--format json`，保持默认输出兼容并补测试。

Agent 可以读取代码、修改文件和运行测试。如果 session 在等待 CI 时结束，恢复者通常只能依赖
Git diff、CI 和人类重新描述。下面这些信息可能只存在于对话中：

- 为什么选择当前 schema；
- 是否还在等维护者决定；
- 哪个失败是预期的；
- 哪个动作尚未真正发生。

### Codex Goal

Codex Goal 把 objective 和 Goal lifecycle 从单次 prompt 中分离。Host 可以围绕同一目标启动
后续 Turn，并在目标处于 active、blocked 或 complete 时采取不同动作。

因此，等待 CI 后继续工作不再要求用户重新粘贴完整目标。Goal 解决的是 **Host 内目标连续性**。
它不必自动成为项目 Todo 图、权限账本或跨 Host registry。

::: warning 以当前 Host 为准
只在普通 prompt 中写 `/goal` 不等于建立了 Host 可读回的持久 Goal。具体入口、状态和恢复操作
必须以当前 Codex 产品表面为准。
:::

### LoopX

LoopX 在项目侧保存更细的控制合同。例如：

```text
Goal: ship-compatible-json-output
├── Todo A: implement formatter              done
├── Todo B: add schema tests                 done
├── Todo C: obtain field-name decision       blocked by Gate G
└── Todo D: release                          deferred until C

Gate G
├── scope: response.error_code
├── authority: maintainer
└── blocks: Todo C
```

下一轮不只知道“目标还没完成”，还知道：

- 哪个 Todo 可执行；
- Gate 只阻塞哪条 lane；
- 哪个 Agent 持有 claim 或 lease；
- 哪份测试结果是 evidence；
- 发布是否需要外部 effect receipt；
- 当前是否应该运行、等待或 monitor。

## LoopX 增加的五类项目合同

### 1. Todo、claim 与 handoff

Goal 表达方向，Todo 表达可调度的工作单元。LoopX 可以为 Todo 记录优先级、依赖、claim、lease、
successor 和 handoff。

这使“目标仍 active”与“当前谁可以做哪件事”成为两个问题。多 Agent 场景中，Agent id 是工作
身份，不是 Host 身份；`codex-*` 前缀也不能证明任务实际运行在 Codex App 还是 CLI。

### 2. Gate 与 authority

对话可以向人提问，但一个问题是否阻塞所有工作、只阻塞一个 Todo，或者只是一条提醒，需要
明确建模。

LoopX 区分：

- `user_gate`：缺少决定时相关工作不能合法继续；
- `user_action`：需要人处理，但不必阻塞 Agent 的其他 lane；
- safe fallback：不依赖该决定、仍可安全执行的工作。

Gate 的重点不是“让人参与”，而是把决定的 scope、authority 和被阻塞工作绑定起来。

### 3. Evidence 与 receipt

“Agent 运行了命令”不是“状态转换已被证明”。LoopX 区分：

- proposal：建议做什么；
- observation：看到了什么；
- validated evidence：经过检查、可以支持结论的证据；
- effect readback：外部系统返回的当前事实；
- receipt：对一次已接受动作的持久记录。

例如发起 `git push` 后网络超时，不能仅凭工具调用开始就标记发布完成。需要远端 readback 或
其他可验证 receipt。

### 4. Scheduler、monitor 与 quota

Codex Goal 可以由 Host 继续。LoopX 进一步把“现在是否应该继续”变成项目决策：

- `quota should-run`：这一轮是否符合预算与状态；
- monitor：外部条件未变化时静默等待；
- scheduler hint：Host 应在什么节奏再次唤醒；
- backoff：连续无变化时避免盲目轮询；
- spend：只有产生并写回有界进展后才记账。

Host 仍然拥有实际唤醒机制。LoopX 输出调度合同，不假装自己是所有 Host 的 scheduler。

### 5. 跨 Agent、跨 Host 与恢复

LoopX 的 canonical state 属于项目。Codex App、Codex CLI 或其他受支持 Host 可以读取同一个
Goal 边界，而不是各自维护一份“当前进度”。

```text
Codex App heartbeat ─┐
Codex CLI Goal ──────┼──> LoopX project state ──> current Turn packet
Other host hook ─────┘
```

Host 可以不同，项目状态不能分叉成多个事实源。恢复依赖 event、lineage、projection 与 replan，
而不是要求新 Host 继承旧 transcript。

## 如何组合 Codex Goal 与 LoopX

典型组合是：

1. LoopX 从项目状态选择 Todo，检查 Gate、能力与 quota；
2. LoopX 生成有界 task body 或 decision packet；
3. Codex Goal 持续承载这个 Host 上的执行；
4. Agent 完成一段工作并验证；
5. 结果写回 LoopX，LoopX 再决定下一轮。

```text
LoopX control plane -> Codex Goal continuation -> Agent Turn
        ^                                      |
        `---------- validated writeback -------'
```

因此，Codex Goal 与 LoopX 的关系更像 Host lifecycle 与 project lifecycle 的组合，而不是两套
互相替代的 Agent runtime。

## 选择哪一层

| 任务特征 | 建议起点 |
| --- | --- |
| 单次、封闭、可低成本重做 | 普通会话 |
| 同一 Host 内需要持续目标和恢复 | Codex Goal |
| 有项目 Todo、权限 Gate、外部 effect、跨 Agent/Host 或调度恢复 | LoopX，可与 Codex Goal 组合 |

选择最小足够层次。控制面本身也有维护成本；没有项目级问题时，不要为了“更 Agentic”而制造状态。

