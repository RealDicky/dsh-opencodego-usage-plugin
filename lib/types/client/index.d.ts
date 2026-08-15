/**
 * OpenCode Go usage ring — browser half. Registers the `conversation.input.usage`
 * seat: a quota ring beside the context meter, visible only while the session's
 * current provider is opencode-go, over the same per-session model directory
 * the composer model seat reads. The data comes from the host route the node
 * half registers; this half owns only the gating, the polling, and the render.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type OpencodeUsageKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The usage ring's copy. */
        'opencodeUsage': OpencodeUsageKey;
    }
}
export { UsageMeter, type UsageMeterInjected, type UsageMeterProps } from './UsageMeter.tsx';
export { OPENCODE_GO_PROVIDER, REFRESH_MS, USAGE_PATH } from './UsageMeter.tsx';
/** Required services: the contribution registry, the shared model directory, locale, and sessions. */
export declare const inject: string[];
/**
 * Client plugin body: register the dictionaries and the composer usage seat.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map