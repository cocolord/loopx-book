# 验证、兼容与安全

一个教程只有在读者能复现、能判断成功，并且不会被引导跨过权限边界时才算完成。本章收束主书与
Labs 的验证策略。

## 本章目标

读完后，你应该能：

- 为项目接入与 Extension 选择合适的验证层；
- 区分版本兼容、readiness 与业务正确性；
- 在公开提交前检查 private state；
- 知道哪些内容应该留在官方文档、Labs 或项目事实源。

## 四层验证

### 1. Artifact validation

确认文件和 schema 自洽：

- Markdown 可以构建；
- 内部链接存在；
- JSON 与 TOML 可解析；
- request/response 满足 JSON Schema；
- fixture 可以从头创建。

主书：

```bash
npm ci
npm run docs:build
```

当前站点使用 VitePress `1.6.4`，并将兼容的 Vite 精确 override 到 `6.4.3`，以避开旧版
dev server 的已知安全问题。依赖变更后运行：

```bash
npm audit --audit-level=moderate
```

override 是当前依赖图的一部分，不应在升级 VitePress 时盲目保留。先检查新版本的依赖与
`@vitejs/plugin-vue` peer range，再通过 clean install、build 和 audit 决定是否删除或更新。

Labs：

```bash
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -e './standalone-extension[test]'
./scripts/smoke.sh
```

### 2. Product-surface validation

确认教程使用的是发布物真实表面：

```bash
loopx --version
loopx doctor
loopx start-goal --help
loopx extension --help
```

命令存在不代表完整流程已验证。Host automation、visible Goal 和 Extension activation 需要各自的
readback。

### 3. Lifecycle validation

项目接入至少验证：

- reconnect 复用已有状态；
- status 能找到 active Goal；
- local state 被 Git 忽略；
- Host activation 可观察；
- quota 与 selected Todo 一致。

Extension 至少验证：

- package entrypoint 可解析；
- doctor 成功且无 effect；
- install 生成 revision-bound state；
- disable 后不能 run；
- enable 重新 doctor；
- invalid request fail closed；
- upgrade 失败不破坏当前 revision。

### 4. Outcome validation

最后检查读者目标，而不只是命令退出码：

- 项目接入后，Agent 是否真的从同一 canonical state 恢复？
- Extension 是否返回稳定、正确的 domain result？
- 有权限的动作是否被拒绝或正确路由？
- 文档是否让读者知道失败后怎么恢复？

## 兼容性不是一个版本号

Extension compatibility 至少有四层：

| 层 | 示例 |
| --- | --- |
| package | Python version、dependency range |
| LoopX API | `requires_loopx_api = ">=1,<2"` |
| wire protocol | `loopx_text_stats_extension_v0` |
| domain schema | request/response schema version |

升级 package version 不应静默改变同一 schema 的含义。破坏性 wire contract 应使用新 protocol 或
schema version，并为 caller 提供迁移路径。

## Public/private boundary scan

公开提交前检查：

```bash
git status --short
git diff --name-only
git ls-files --others --exclude-standard

loopx check \
  --scan-path README.md \
  --scan-path chapters/
```

Labs 还要扫描：

```bash
loopx check \
  --scan-path README.md \
  --scan-path project-onboarding/ \
  --scan-path standalone-extension/
```

人工复查以下内容：

- credentials、token、cookie；
- 本机绝对路径；
- `.loopx/`、`.codex/goals/` 或 runtime state；
- raw Agent transcript、trajectory、verifier output；
- 私有 issue、内部链接和未经脱敏的组织叙事；
- 临时探针和生成日志。

`.gitignore` 不能替代扫描。已经被跟踪的文件不会因为新增 ignore 自动消失。

## 文档的 authority 分工

| 内容 | 放置位置 |
| --- | --- |
| 学习顺序、概念解释、恢复思路 | `loopx-book` |
| 可运行代码、fixture、smoke | `loopx-book-labs` |
| 完整 CLI 参数、协议与 release behavior | LoopX 官方仓库 |
| 当前项目 Goal、Todo、Gate 与 evidence | 项目本地 LoopX state |
| commit、PR、CI、外部资源事实 | 对应外部系统 |

本书不复制完整 reference。高漂移命令只保留完成任务所需的最小路径，并指向 `--help` 和官方文档。

## 文档维护触发器

每次 LoopX minor release 后优先复查：

- installer 与 `doctor`；
- `connect` / `start-goal`；
- Host surface 名称；
- Codex App heartbeat 与 Codex CLI Goal activation；
- Extension manifest、doctor、run 与 lifecycle；
- Labs smoke。

理论章节只在公开 contract 改变时更新。不要因为内部文件重构就重写用户心智模型。

## 发布前 checklist

### 主书

- [ ] 首页第一屏说明读者、价值和两条路径；
- [ ] 中文为主，代码与必要术语保留英文；
- [ ] 普通会话、Codex Goal 与 LoopX 的差异可由同一场景验证；
- [ ] 项目接入覆盖 Codex App 与 Codex CLI；
- [ ] Extension 教程对应真实 Labs；
- [ ] `npm run docs:build` 成功；
- [ ] internal links 与 public boundary scan 通过；
- [ ] 首页预览已由 owner 审阅。

### Labs

- [ ] 可从干净 venv 安装；
- [ ] project-onboarding 可重置；
- [ ] Git ignore smoke 通过；
- [ ] request/response schema tests 通过；
- [ ] managed install/doctor/run smoke 通过；
- [ ] 没有凭据、私有状态或本机路径；
- [ ] 主书与 Labs 双向链接有效。

完成这些检查后，GitHub Pages workflow 才应从 `main` 发布站点。Pages 是展示面，不是内容或
LoopX 状态的事实源。

