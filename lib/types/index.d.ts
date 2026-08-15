/**
 * OpenCode Go usage ring — node half. Serves the OpenCode Go subscription
 * quota snapshot (`GET https://opencode.ai/zen/go/v1/usage`) to the browser
 * through an exact webserver route, resolving the API key through the same
 * credential-reference seam the `llm-pi-ai` provider profile uses, and caching
 * the upstream answer briefly so browser polling never hammers the quota API.
 * The route answers quota percentages only — no secrets cross the wire.
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { UsageSnapshot, UsageWindow } from './types.ts';
export type { UsageSnapshot, UsageWindow } from './types.ts';
/** Plugin config: the upstream endpoint, the credential reference, and the serving policy. */
export interface Config {
    /** opencode.ai base URL including the `/v1` segment. */
    baseUrl: string;
    /** Credential/env reference naming the OpenCode Go API key (same as the llm-pi-ai profile). */
    apiKeyEnv: string;
    /** Upstream response cache TTL in milliseconds. */
    cacheMs: number;
    /** Exact webserver path serving the snapshot to the browser. */
    routePath: string;
}
export declare const Config: z<Config>;
/** The raw upstream window shape (`/v1/usage` is undocumented; tolerate drift). */
interface UpstreamUsage {
    status?: unknown;
    percent?: unknown;
    resetsAt?: unknown;
}
/** Services required before the route can serve: the webserver and the credential resolver. */
export declare const inject: string[];
/**
 * Accept a window only when the upstream reports `ok` with a numeric percent
 * and a string reset timestamp.
 * @param raw - the raw upstream window.
 * @returns the normalized window, or null when unhealthy/malformed.
 */
export declare function windowOf(raw: UpstreamUsage | undefined): UsageWindow | null;
/**
 * Normalize an unknown upstream body into the snapshot shape. Malformed
 * bodies yield all-null windows instead of throwing, so a quota-API redesign
 * degrades the ring to hidden rather than failing the request.
 * @param body - parsed upstream JSON.
 * @returns the normalized snapshot.
 */
export declare function normalizeSnapshot(body: unknown): UsageSnapshot;
/**
 * Whether the request authority is one a browser reachable at this server can
 * legitimately carry: loopback names or IP literals. A DNS-rebinding probe
 * names an attacker domain, so any other hostname is refused even though the
 * payload (quota percentages) is not sensitive.
 * @param hostHeader - the request Host header value.
 * @returns whether the authority is loopback or an IP literal.
 */
export declare function isTrustedHost(hostHeader: string | undefined): boolean;
/**
 * Register the quota route: resolve the credential per request, serve a
 * short-TTL cache of the upstream snapshot, and answer JSON errors with the
 * failure named for the browser to render nothing.
 * @param ctx - host context carrying the webserver and credentials services.
 * @param config - resolved plugin config.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map