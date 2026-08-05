# Connect an existing Git project

Project onboarding is an independent track. You do not need to modify the LoopX Kernel or develop an
Extension first. This chapter establishes the project state and Git boundary; the next two chapters
activate work from Codex App and the visible Codex CLI TUI.

## Observable success

When onboarding is complete:

- `loopx doctor` reports a usable installation;
- `.loopx/registry.json` exists in the project;
- `.codex/goals/<goal-id>/ACTIVE_GOAL_STATE.md` exists;
- `loopx status` can show active state, current Gates, and the next Agent Todo;
- `.loopx/` and `.codex/goals/` do not enter Git;
- reconnecting reuses the exact existing `goal_id` instead of overwriting the Goal;
- a new executor receives a fresh `agent_id` unless the user explicitly authorizes a takeover.

These files are local control-plane state, not project source. Do not commit them to a public repository.

## 1. Install and inspect LoopX

Prerequisites:

- Python 3.11 or later;
- a macOS or Linux shell;
- `curl` and `tar`;
- an existing Git project.

Use the official no-clone installer:

```bash
curl -fsSL https://raw.githubusercontent.com/huangruiteng/loopx/main/scripts/install-from-github.sh | bash
export PATH="$HOME/.local/bin:$PATH"
loopx doctor
```

::: tip Why not clone LoopX first?
Most users need a release snapshot and CLI, not a Kernel source checkout. Clone-based installation is for
developers who need live canaries or intend to contribute to LoopX.
:::

Treat `loopx doctor` as the installation fact. A successful `which loopx` only proves that one executable
is on `PATH`; doctor also checks the release snapshot, Python import, installed skills, and Host
integration.

## 2. Establish the Git boundary

Before connecting, add local control state to the project's `.gitignore`:

```text
.loopx/
.codex/goals/
.local/
```

If the project already uses any of these names, inspect the existing contents before changing the rule.
LoopX directories may contain active state, registry, leases, and local evidence pointers. `.local/` may
also contain unrelated private work.

Confirm the ignore rules:

```bash
git check-ignore -v .loopx/registry.json
git check-ignore -v .codex/goals/example/ACTIVE_GOAL_STATE.md
```

For paths that do not yet exist, Git may need `--no-index`:

```bash
git check-ignore -v --no-index .loopx/registry.json
```

## 3. Connect the project

From the project root:

```bash
loopx connect
loopx status
```

`connect` should reuse an existing registry and active state. If the project has too little state to
continue, start with an explicit task:

```bash
loopx start-goal \
  --guided \
  --project . \
  --goal-text "Establish a verifiable release workflow for this project"
```

This produces a guided transaction packet. It is a preview, not proof that Todo writeback, Host activation,
or an Agent turn has already happened. The Host integration must execute the planning, state writeback, and
activation described by the packet.

### Choose the Goal before choosing the Agent

Guided start keeps two decisions separate:

1. **Goal selection:** when the project has one registered Goal, reuse that exact `goal_id`; when it has
   several, return a read-only `goal_selection_gate`. Select one exact rerun command from `choices`. Before
   that selection, do not write Todos, register an Agent, or activate a Host loop.
2. **Agent identity:** for new onboarding with task text, omitting `--agent-id` defaults to fresh identity
   registration. Existing Agents are explicit takeover choices, not automatic defaults.

Do not select a Goal from objective similarity, and do not take over an Agent merely because it is the only
registered identity. Preview and then atomically register a new public-safe id:

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

The preview lets you inspect the plan. Before Todo writeback, confirm that the execute result reports
`ok`, `changed`, and `written` as true, global sync succeeded, and source/global registration readback was
verified. If the user explicitly requests an old lane, use the packet command bound to that exact
`agent_id` instead of pretending to create a fresh registration.

If you know the active Host, state it explicitly:

```bash
# Codex App
loopx start-goal --guided --project . \
  --goal-text "Establish a verifiable release workflow for this project" \
  --host-surface codex-app

# Visible Codex CLI TUI
loopx start-goal --guided --project . \
  --goal-text "Establish a verifiable release workflow for this project" \
  --host-surface codex-cli-tui
```

When the Host is unknown, omit `--host-surface`. LoopX should return a read-only selection Gate instead of
guessing.

## 4. Read current state

Use the shortest read paths first:

```bash
loopx registry
loopx status
loopx todo list --goal-id <goal-id>
loopx history --goal-id <goal-id>
loopx quota should-run --goal-id <goal-id> --agent-id <agent-id>
```

| Command | Primary question |
| --- | --- |
| `registry` | Which active states are connected to this project? |
| `status` | Who should act, and which Gates or risks are current? |
| `todo list` | What work units, owners, and lifecycle states exist? |
| `history` | Which bounded events were written back? |
| `quota should-run` | Is another delivery turn allowed now? |

Do not reduce `should_run: true` to permission for any arbitrary action. Also inspect the
`interaction_contract`, selected Todo, capability Gate, write scope, and scheduler hint.

## 5. Verify Git isolation

After connecting:

```bash
git status --short
git ls-files .loopx .codex/goals .local
```

The second command should print nothing. If it lists a path, Git is already tracking local control state;
adding `.gitignore` does not untrack it. Inspect the history before removing anything from the index so you
do not delete valuable local state.

The resettable exercise lives in
[project-onboarding](https://github.com/cocolord/loopx-book-labs/tree/main/project-onboarding).

## Recovery paths

### `loopx doctor` fails

Read the command path, release snapshot, and skill status in the report. If a command skill is missing
after an upgrade:

```bash
loopx slash-commands
loopx slash-commands --install
```

Do not copy `.loopx/` from another checkout without understanding the failure.

### The project already has LoopX state

Reuse it by default. Run `loopx registry`, `loopx status`, and `loopx history` before deciding whether a
migration is necessary. Continue one exact `goal_id`; when several Goals exist, resolve the selection Gate
first. Then register a fresh `agent_id` for the new executor or take over a named identity only when the
user requests it. Do not force a reconnect over a Goal that still carries useful state, and do not confuse
an old Agent identity with the Goal itself.

### A linked worktree points at the wrong directory

The delivery workspace must match the worktree where files are actually changing. Inspect the registry and
repair the route with the supported `refresh-state --delivery-workspace-path` flow. Do not copy active state
to manufacture a second source of truth.

### The global registry is not writable

Project-local state and global visibility are separate layers. Use the registry permission report from
`loopx doctor`, repair ownership or permissions, and sync again. Never commit the global registry to the
project.
