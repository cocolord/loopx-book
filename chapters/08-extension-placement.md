# 先选择正确的放置位置

“要扩展 LoopX”不自动意味着“新建 Extension”。先判断用户结果、调用合同与生命周期，才能决定
能力应放在 Capability、Provider、Extension，还是项目内部 helper。

## 本章目标

读完后，你应该能：

- 区分 Capability 与 Extension 两个维度；
- 为一项新能力写出 placement rationale；
- 识别不需要注册为产品能力的内部 helper；
- 判断何时适合 standalone Extension。

## Capability 与 Extension 不是同一维度

**Capability**描述调用者可以获得什么结果，以及结果要满足什么合同。

**Extension**描述一个实现如何被交付和管理，包括安装、启停、升级、回滚与兼容性。

```text
Capability: caller-facing outcome contract
      ^
      | implemented by
Provider
      ^
      | delivered by
Extension: package and lifecycle
```

一个 Extension 可以：

- 提供一个新的 Capability；
- 实现一个已有 Capability；
- 只暴露自己的 bounded standalone command。

一个 Capability 也可以由 LoopX core 内置 Provider 实现，不需要 Extension。

## 四个候选位置

### 1. 项目内部 helper

如果代码只服务当前项目，没有独立调用合同、安装需求或生命周期，就放在最近的 owning module。

例如当前项目需要把两种内部状态转换成统一 dict，但没有外部调用者，也没有独立版本兼容要求。
把它注册成 Capability 或打包成 Extension 只会增加 manifest、doctor 和升级成本。

### 2. 现有 Capability 的 Provider

如果调用者需要的结果已经由一个 Capability 定义，新实现应进入该合同，而不是创建同义 Capability。

Provider 可以是：

- built-in：随 LoopX core 一起发布；
- extension-delivered：由独立 Extension 提供。

是否访问外部系统不是判断 Extension 的唯一条件。一个和 core 同生命周期、由 core 始终维护的
connector 仍可能是 built-in Provider。

### 3. 新 Capability

只有当 LoopX 调用者需要 provider-neutral 的稳定结果合同、catalog identity 和 routing surface
时，才创建新 Capability。

新 Capability 至少需要：

- 清晰的 caller outcome；
- 稳定 id 与 versioned protocol；
- 真实入口或调用点；
- domain validation 与 transition policy；
- focused validation；
- catalog registration。

仅仅“未来可能有多个 Provider”不足以让抽象提前进入产品。

### 4. Standalone Extension

如果能力：

- 有独立 package 与版本；
- 需要独立安装、启停、升级或回滚；
- 有一个有界 request/response command；
- 不需要进入现有 Capability；
- 直接调用不需要任何权限；

那么 standalone Extension 是合适的起点。

本书的 `loopx-text-stats` 就属于这一类：它根据 request 中的文本计算统计值，不读文件、不访问
网络、不修改外部系统，也没有跨 Provider 的产品合同。

## 按顺序做 placement decision

在创建目录前回答：

1. **用户结果是什么？**  
   不要用 `connector`、`adapter`、`sink` 这类实现机制代替结果名称。
2. **最近的现有 owner 能否拥有它？**  
   如果现有 Capability 已经定义相同结果，扩展它。
3. **LoopX core 是否必须始终发布这个实现？**  
   是则考虑 built-in；否则考虑 Extension。
4. **是否需要独立生命周期？**  
   独立依赖、版本、启停、凭据或 provider ownership 通常指向 Extension。
5. **是否只是内部 helper？**  
   没有独立调用合同就留在 owning module。
6. **是否有权限或外部 effect？**  
   有则不能通过 generic standalone runner 绕过 Capability/domain policy。

## 记录最小 rationale

在实现前写一段短记录：

```text
capability_id: none
provider_id: loopx-text-stats
origin: extension
placement: standalone package
reason: bounded deterministic command with an independent lifecycle;
        no provider-neutral LoopX capability is needed
```

如果 Extension 实现已有 Capability：

```text
capability_id: <existing-capability>
provider_id: <extension-id>
origin: extension
placement: independently packaged provider
reason: reuses the caller contract but needs independent dependencies
        and activation lifecycle
```

记录的目的不是生产更多设计文档，而是在动手前暴露错误抽象。对于小改动，这段 rationale 可以直接
进入 Todo、PR 描述或 commit history。

## 反例

### “这是外部 API，所以创建 connector Capability”

传输机制不是用户结果。先找谁需要这个 API 返回的结果，以及现有 Capability 是否已经拥有它。

### “先生成 `[[provides]]`，以后再接调用入口”

manifest 可发现但不可调用，会制造假的产品表面。先建立真实 caller contract、resolver、policy
和 validation，再声明 Capability。

### “standalone runner 能启动进程，所以也可以发消息”

generic runner 要求 manifest 和 runtime 的权限都为空。发消息、写文件、发布或管理资源是 effect，
必须进入能检查 authority 与 scope 的 Capability/domain command。

### “多个文件共用代码，所以抽成 Extension”

共享代码只说明可能存在 helper，不说明需要独立安装和生命周期。抽象应该跟随 change reason，
而不是文件数量。

## 本书示例的决定

`loopx-text-stats` 的 placement：

| 字段 | 决定 |
| --- | --- |
| `capability_id` | `none` |
| `provider_id` | `loopx-text-stats` |
| origin | `extension` |
| kind | standalone |
| permissions | `[]` |
| managed entrypoint | `loopx extension run` |

下一章会从官方 `extension init` 生成这套结构，再只修改 request/response domain contract。
