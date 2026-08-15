# dsh-opencodego-usage-plugin

OpenCode Go 订阅用量圆环插件（DeepSeek Harness Web GUI）。

在 composer 的上下文圆环（ContextMeter）右侧新增一枚样式一致的用量圆环：仅当会话当前模型来自 `opencode-go` provider 时显示，以月配额为主读数（依次回退到周、滚动），悬停展示滚动/周/月三个配额窗口的百分比与重置时间，60 秒轮询。

- **host 半**：挂载 `/api/opencode-usage` 路由，通过凭据引用 `OPENCODE_GO_API_KEY` 调官方配额接口 `GET https://opencode.ai/zen/go/v1/usage`（未公开文档，见 [farion1231/cc-switch#6433](https://github.com/farion1231/cc-switch/issues/6433)），30 秒缓存，只返回配额百分比。
- **浏览器半**：注册 `conversation.input.usage` 插槽（需要 ui-conversation 声明该插槽，见下方硬依赖）。

## 安装

> ⚠️ **先打插槽补丁（一次性，每个目标机都要做）**：圆环渲染依赖 ui-conversation 的
> `conversation.input.usage` 插槽，原版 dsh **没有**这个插槽。在目标机的
> deepseek-harness 仓库里：

```bash
cd /path/to/deepseek-harness
git apply /path/to/dsh-opencodego-usage-plugin/patches/ui-conversation-usage-slot.patch
pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle   # 重建 ui-conversation
```

> 插槽已随本插件提交到 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
> 的 ui-conversation（`contract/slots.ts`、`apply.ts`、`skeleton/InputBar.tsx`）；
> 如果你的目标仓库已是含该插槽的版本，跳过这步。

### 方式一：npm 包（发布后，一键）

```bash
dsh plugin --profile web add @deepseek-ai/dsh-client-ui-opencode-usage
# 自动激活（本包是 dsh.bundle，装完自动进 bundle 层）
# 只需配好 key，然后重启 dsh web：
#   ~/.dsh/.credentials.yaml（或环境变量）里放 OPENCODE_GO_API_KEY: sk-...
```

### 方式二：git 仓库直装

```bash
dsh plugin --profile web add git+https://github.com/RealDicky/dsh-opencodego-usage-plugin.git
# 同样自动激活；配 key 后重启 dsh web
```

### 方式三：手动（普通包，未走 dsh.bundle 时）

```bash
dsh plugin --profile web add <包>
# 编辑 ~/.dsh/profiles/web/cordis.patch.yml，加入：
#    - id: ui-opencode-usage
#      name: '@deepseek-ai/dsh-client-ui-opencode-usage'
#      config:
#        apiKeyEnv: OPENCODE_GO_API_KEY
# 配 key 后重启 dsh web
```

## 配置

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `apiKeyEnv` | （必填） | 指向 OpenCode Go API Key 的凭据/环境变量引用 |
| `baseUrl` | `https://opencode.ai/zen/go/v1` | 上游地址（含 `/v1`） |
| `cacheMs` | `30000` | 上游应答缓存时长 |
| `routePath` | `/api/opencode-usage` | 浏览器拉取的路由路径 |

## 开发

源码在 `src/`，构建产物在 `lib/`（随仓库提交，安装无需构建）。本包源自 DeepSeek Harness 仓库 `packages/client/ui-opencode-usage`；在 monorepo 内重新构建：

```bash
cd /path/to/deepseek-harness
pnpm --filter @deepseek-ai/dsh-client-ui-opencode-usage bundle
```

## License

MIT
