import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { ModelDirectoryState } from '@deepseek-ai/dsh-client-ui-model-selection/client';
/** Browser polling interval for the host usage route. */
export declare const REFRESH_MS = 60000;
/** The exact host route the node half registers by default. */
export declare const USAGE_PATH = "/api/opencode-usage";
/** Provider route id the ring renders for (the llm-pi-ai `opencode-go` route key). */
export declare const OPENCODE_GO_PROVIDER = "opencode-go";
/** Injected business face of the usage ring. */
export interface UsageMeterInjected {
    /** The session's shared model directory store (same instance the model seat reads). */
    directory: SnapshotStore<ModelDirectoryState>;
    /** Whether this session may read Agent-bound model state (false for addressed subagent sessions). */
    available: boolean;
}
/** Full props: the injected directory face plus the standard locale seat. */
export type UsageMeterProps = UsageMeterInjected & PropsLocale<'opencodeUsage'>;
/**
 * Render the composer's local-time reset reading for an ISO timestamp.
 * @param iso - the upstream reset timestamp.
 * @returns a short locale-localized date-time, or the raw text when unparsable.
 */
export declare function formatReset(iso: string): string;
/**
 * Render the usage ring.
 * @param props - the injected directory face plus the standard locale seat
 * (the owner's `locked` share is deliberately not read: the ring is a
 * read-only readout).
 * @returns the ring and hover tooltip, or nothing when gated off / data-less.
 */
export declare function UsageMeter({ available, directory, t }: UsageMeterProps): import("react").JSX.Element | null;
//# sourceMappingURL=UsageMeter.d.ts.map