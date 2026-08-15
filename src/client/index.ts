/**
 * OpenCode Go usage ring — browser half. Registers the `conversation.input.usage`
 * seat: a quota ring beside the context meter, visible only while the session's
 * current provider is opencode-go, over the same per-session model directory
 * the composer model seat reads. The data comes from the host route the node
 * half registers; this half owns only the gating, the polling, and the render.
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-conversation SlotMap merge (the input.usage seat)
// and the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { SessionRuntime } from '@deepseek-ai/dsh-client-runtime/client'
import { en, NS, zh, type OpencodeUsageKey } from './locales.ts'
import { UsageMeter, type UsageMeterInjected } from './UsageMeter.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The usage ring's copy. */
    'opencodeUsage': OpencodeUsageKey
  }
}

export { UsageMeter, type UsageMeterInjected, type UsageMeterProps } from './UsageMeter.tsx'
export { OPENCODE_GO_PROVIDER, REFRESH_MS, USAGE_PATH } from './UsageMeter.tsx'

/** Required services: the contribution registry, the shared model directory, locale, and sessions. */
export const inject = ['slots', 'modelDirectories', 'locale', 'sessions']

/**
 * Client plugin body: register the dictionaries and the composer usage seat.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-opencode-usage: dictionaries')
  ctx.slots.inject('conversation.input.usage', () => ctx.slots.register({
    name: 'conversation.input.usage',
    locale: NS,
    inject: (sessionId: SessionId): UsageMeterInjected => {
      const models = ctx.get('modelDirectories') as ModelDirectoryResolver
      const sessions = ctx.get('sessions') as SessionRuntime
      return {
        directory: models.directoryFor(sessionId).store,
        available: sessions.subagentAddress(sessionId) === undefined,
      }
    },
  }, UsageMeter))
}
