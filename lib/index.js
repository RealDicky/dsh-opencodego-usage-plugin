import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { isIP } from "node:net";
import z from "@deepseek-ai/schemastery";
//#region lib/types/index.js
/**
* OpenCode Go usage ring — node half. Serves the OpenCode Go subscription
* quota snapshot (`GET https://opencode.ai/zen/go/v1/usage`) to the browser
* through an exact webserver route, resolving the API key through the same
* credential-reference seam the `llm-pi-ai` provider profile uses, and caching
* the upstream answer briefly so browser polling never hammers the quota API.
* The route answers quota percentages only — no secrets cross the wire.
*/
const Config = z.object({
	baseUrl: z.string().default("https://opencode.ai/zen/go/v1"),
	apiKeyEnv: z.string().required(),
	cacheMs: z.natural().default(3e4),
	routePath: z.string().default("/api/opencode-usage")
});
/** Services required before the route can serve: the webserver and the credential resolver. */
const inject = ["webServer", "credentials"];
/**
* Accept a window only when the upstream reports `ok` with a numeric percent
* and a string reset timestamp.
* @param raw - the raw upstream window.
* @returns the normalized window, or null when unhealthy/malformed.
*/
function windowOf(raw) {
	if (raw === void 0 || raw.status !== "ok" || typeof raw.percent !== "number" || typeof raw.resetsAt !== "string") return null;
	return {
		percent: raw.percent,
		resetsAt: raw.resetsAt
	};
}
/**
* Normalize an unknown upstream body into the snapshot shape. Malformed
* bodies yield all-null windows instead of throwing, so a quota-API redesign
* degrades the ring to hidden rather than failing the request.
* @param body - parsed upstream JSON.
* @returns the normalized snapshot.
*/
function normalizeSnapshot(body) {
	const usage = body?.usage;
	return {
		rolling: windowOf(usage?.rolling),
		weekly: windowOf(usage?.weekly),
		monthly: windowOf(usage?.monthly)
	};
}
/**
* Whether the request authority is one a browser reachable at this server can
* legitimately carry: loopback names or IP literals. A DNS-rebinding probe
* names an attacker domain, so any other hostname is refused even though the
* payload (quota percentages) is not sensitive.
* @param hostHeader - the request Host header value.
* @returns whether the authority is loopback or an IP literal.
*/
function isTrustedHost(hostHeader) {
	if (hostHeader === void 0) return false;
	try {
		const hostname = new URL(`http://${hostHeader}`).hostname;
		const bare = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
		return bare === "localhost" || isIP(bare) !== 0;
	} catch {
		return false;
	}
}
function sendJson(res, status, body) {
	const text = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json",
		"content-length": Buffer.byteLength(text)
	});
	res.end(text);
}
/**
* Register the quota route: resolve the credential per request, serve a
* short-TTL cache of the upstream snapshot, and answer JSON errors with the
* failure named for the browser to render nothing.
* @param ctx - host context carrying the webserver and credentials services.
* @param config - resolved plugin config.
*/
function apply(ctx, config) {
	let cache = null;
	const ref = credentialRef(config.apiKeyEnv);
	const route = {
		kind: "exact",
		path: config.routePath,
		handler: async (req, res) => {
			if (!isTrustedHost(req.headers.host)) {
				sendJson(res, 403, { error: "forbidden" });
				return;
			}
			const hit = await ctx.credentials.resolve(ref);
			if (hit === void 0) {
				sendJson(res, 503, {
					error: "not-configured",
					ref: config.apiKeyEnv
				});
				return;
			}
			const now = Date.now();
			if (cache !== null && now - cache.at < config.cacheMs) {
				sendJson(res, 200, cache.snapshot);
				return;
			}
			try {
				const upstream = await fetch(`${config.baseUrl}/usage`, { headers: {
					authorization: `Bearer ${hit.value}`,
					"user-agent": "dsh-web/1.0"
				} });
				if (!upstream.ok) {
					sendJson(res, 502, {
						error: "upstream",
						status: upstream.status
					});
					return;
				}
				const snapshot = normalizeSnapshot(await upstream.json());
				cache = {
					at: now,
					snapshot
				};
				sendJson(res, 200, snapshot);
			} catch (error) {
				sendJson(res, 502, { error: error instanceof Error ? error.message : "unknown" });
			}
		}
	};
	ctx.effect(() => ctx.webServer.register(route), "ui-opencode-usage: quota route");
}
//#endregion
export { Config, apply, inject, isTrustedHost, normalizeSnapshot, windowOf };
