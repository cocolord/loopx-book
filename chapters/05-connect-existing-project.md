# 连接你的 Git 项目

项目接入是一条独立实践路径。你不需要修改 LoopX Kernel，也不需要先开发 Extension。本章先建立
项目状态和 Git 边界；后两章再分别从 Codex App 和 Codex CLI 启动。

## 成功标准

完成后，你应该能观察到：

- `loopx doctor` 报告安装可用；
- 项目存在 `.loopx/registry.json`；
- 项目存在 `.codex/goals/<goal-id>/ACTIVE_GOAL_STATE.md`；
- `loopx status` 能显示 active state、当前 Gate 和下一项 Agent Todo；
- `.loopx/` 与 `.codex/goals/` 不会进入 Git；
- 再次连接会按精确 `goal_id` 复用已有 Goal，而不是覆盖目标；
- 新接入的执行者使用 fresh `agent_id`，除非用户明确授权 takeover。

这些本地文件是控制面状态，不是项目源码。不要把它们提交到公开仓库。

## 1. 安装并检查 LoopX

要求：

- Python 3.11 或更高版本；
- macOS 或 Linux shell；
- `curl` 与 `tar`；
- 一个已有 Git 项目。

使用官方 no-clone installer：

```bash
curl -fsSL https://raw.githubusercontent.com/huangruiteng/loopx/main/scripts/install-from-github.sh | bash
export PATH="$HOME/.local/bin:$PATH"
loopx doctor
```

::: tip 为什么不先 clone LoopX
普通使用者需要的是发布快照和 CLI，不是 LoopX 源码 checkout。clone-based install 留给希望运行
live canary 或贡献 Kernel 的开发者。
:::

`loopx doctor` 是安装事实的入口。不要只以 `which loopx` 成功作为健康证明；doctor 还会检查
release snapshot、Python import、skill 安装和 Host 集成。

## 2. 建立忽略规则

在连接前，将本地控制状态加入项目 `.gitignore`：

```text
.loopx/
.codex/goals/
.local/
```

如果项目已经使用这些目录名，先检查现有内容，不要直接覆盖。LoopX 状态目录可能包含 active
state、registry、lease 和本地证据指针；`.local/` 还可能包含其他私有工作材料。

用 Git 确认规则生效：

```bash
git check-ignore -v .loopx/registry.json
git check-ignore -v .codex/goals/example/ACTIVE_GOAL_STATE.md
```

文件尚不存在时，`git check-ignore` 可能需要 `--no-index`：

```bash
git check-ignore -v --no-index .loopx/registry.json
```

## 3. 连接项目

从项目根目录运行：

```bash
loopx connect
loopx status
```

`connect` 应复用已有 registry 和 active state。如果项目还没有足够状态，它会给出下一步；此时
优先使用带明确任务的 guided start：

```bash
loopx start-goal \
  --guided \
  --project . \
  --goal-text "为这个项目建立一条可验证的发布流程"
```

这个命令生成 guided transaction packet。它默认是预览，不应被理解为已经完成 Todo 写回、Host
激活和 Agent Turn。Agent 或 Host 集成需要按 packet 执行计划、状态写回与启动步骤。

### 先选择 Goal，再选择 Agent

Guided start 会把两个选择分开：

1. **Goal selection**：如果项目只有一个已注册 Goal，复用它的精确 `goal_id`；如果有多个，返回
   只读 `goal_selection_gate`。从 `choices` 中选择一个精确重跑命令，在此之前不写 Todo、不注册
   Agent，也不激活 Host loop。
2. **Agent identity**：对带任务文本的新接入，未指定 `--agent-id` 时默认要求 fresh identity。
   已有 Agent 是 takeover choice，不是自动默认值。

不要根据 objective 的文字相似度选择 Goal，也不要因为 registry 中只有一个 Agent 就自动接管它。
推荐路径是先预览、再原子注册一个新的 public-safe id：

```bash
loopx register-agent \
  --goal-id <selected-goal-id> \
  --agent-id <new-public-safe-agent-id> \
  --require-new

loopx register-agent \
  --goal-id <selected-goal-id> \
  --agent-id <new-public-safe-agent-id> \
  --require-new \
  --execute
```

Preview 只用于检查计划。继续 Todo writeback 前，应确认 execute result 的 `ok`、`changed` 和
`written` 为 true，global sync 成功，并且 source/global registration readback 已验证。若用户确实
要求接管旧 lane，则直接选择 packet 中绑定该精确 `agent_id` 的 takeover 命令，不要伪造 fresh
registration。

如果你已经知道当前 Host，可以显式指定，避免错误路由：

```bash
# Codex App
loopx start-goal --guided --project . \
  --goal-text "为这个项目建立一条可验证的发布流程" \
  --host-surface codex-app

# Codex CLI visible TUI
loopx start-goal --guided --project . \
  --goal-text "为这个项目建立一条可验证的发布流程" \
  --host-surface codex-cli-tui
```

如果不确定 Host 类型，先省略 `--host-surface`。LoopX 会返回只读 selection gate，而不是猜测。

## 4. 读取当前状态

先使用短路径：

```bash
loopx registry
loopx status
loopx todo list --goal-id <goal-id>
loopx history --goal-id <goal-id>
loopx quota should-run --goal-id <goal-id> --agent-id <agent-id>
```

这些命令回答不同问题：

| 命令 | 主要问题 |
| --- | --- |
| `registry` | 当前项目连接到哪些 active state |
| `status` | 谁应该行动、有什么 Gate 和风险 |
| `todo list` | 当前工作单元、owner 与 lifecycle |
| `history` | 哪些有界事件已经写回 |
| `quota should-run` | 当前是否允许下一轮交付 |

不要把 `should_run: true` 简化为“立即执行任意动作”。还要读取 `interaction_contract`、
`selected_todo`、capability gate、write scope 和 scheduler hint。

## 5. 验证 Git 隔离

连接后运行：

```bash
git status --short
git ls-files .loopx .codex/goals .local
```

第二条命令应无输出。如果输出了路径，说明本地控制状态已经被 Git 跟踪；仅增加 `.gitignore`
不会自动解除跟踪。先检查是否包含应保留的历史，再从 index 中移除，避免误删本地状态。

配套的可重置练习位于
[project-onboarding](https://github.com/cocolord/loopx-book-labs/tree/main/project-onboarding)。

## 恢复路径

### `loopx doctor` 失败

先查看报告中的 command path、release snapshot 和 skill 状态。升级后命令 skill 缺失时可以运行：

```bash
loopx slash-commands
loopx slash-commands --install
```

不要在不了解原因时复制另一个 checkout 的 `.loopx/`。

### 项目已有状态

默认保留它。先执行 `loopx registry`、`loopx status` 和 `loopx history`，再按精确 `goal_id`
选择要继续的 Goal；多个 Goal 必须经过 selection gate。然后为新执行者注册 fresh `agent_id`，
或在用户明确要求时 takeover 指定 identity。不要用 force reconnect 覆盖一个仍有价值的 Goal，
也不要把旧 Agent identity 当作 Goal 本身。

### linked worktree 指向错误目录

LoopX 的 delivery workspace 必须和实际修改所在 worktree 一致。先检查 registry，再使用官方
`refresh-state --delivery-workspace-path` 修复路由；不要通过复制 active state 制造第二份事实。

### global registry 不可写

项目本地状态与 global visibility 是不同层次。检查 `loopx doctor` 的 registry permission 报告，
修复文件所有权或权限后重新同步，不要把 global registry 提交到项目仓库。
