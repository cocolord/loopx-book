# 如何使用本书

本书面向已经会使用 Git、终端和至少一种 Agent 开发工具的外部开发者。你不需要先读
LoopX Kernel 源码，也不需要理解所有 CLI 子命令。

## 你会完成什么

全书先建立一套控制面心智模型，再进入两条并列路径：

```text
控制面基础
├── 接入现有 Git 项目
└── 开发 standalone Extension
```

如果你的目标只是让 LoopX 管理现有项目，从第五章开始实践即可。如果你要交付可独立安装、
启停和升级的能力，从第八章开始实践。两条路径之间没有先后依赖。

## 章节如何组织

每章优先回答四个问题：

1. 读者此时要解决什么问题；
2. 成功后能观察到什么；
3. 哪些概念足以解释这些行为；
4. 正常路径失败时从哪里恢复。

命令片段会标明其性质：

- **可直接运行：** 已在标注的 LoopX 版本上核对命令表面；
- **从 Labs 摘取：** 完整文件位于
  [loopx-book-labs](https://github.com/cocolord/loopx-book-labs)；
- **为解释而简化：** 用于说明状态关系，不应直接写入生产配置。

## 权威来源

本书拥有教学顺序和解释，不拥有 LoopX 的版本化行为：

| 内容 | 权威来源 |
| --- | --- |
| CLI 参数、协议和 runtime 行为 | LoopX 发布物、`--help` 与官方仓库 |
| 可运行练习 | `loopx-book-labs` |
| 学习路径、概念解释与取舍建议 | 本书 |
| 你的项目事实 | Git、CI、外部服务和项目自己的事实源 |

当本书与当前发布版本冲突时，先以发布物为准，再提交文档修正。不要为了让教程“跑通”而绕过
新版本的权限或生命周期检查。

## 版本基线

首版命令以 LoopX `0.4.0` 验证。以下表面容易随 minor release 演进：

- 安装与升级；
- Host 启动方式；
- `start-goal` guided packet；
- Codex App heartbeat 与 Codex CLI visible Goal；
- Extension manifest 与生命周期命令。

运行练习前先执行：

```bash
loopx --version
loopx doctor
```

如果版本不同，先查看当前命令帮助和官方 release notes，再判断差异是文档漂移还是产品行为变化。

## 不在首版范围内

本书暂不覆盖 Kernel 贡献、完整 CLI reference、生产级 effectful provider、企业内部案例和
benchmark 操作。`public-safe narrative` 案例将在 Labs 中作为后续练习出现，不进入当前主线。
