window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-opencode-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/locales.ts
		/** `opencodeUsage` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "opencodeUsage";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"usage.aria": "OpenCode Go 用量 {percent}",
			"usage.rolling": "滚动",
			"usage.weekly": "周",
			"usage.monthly": "月",
			"usage.window": "{label} {percent}% · 重置 {time}"
		};
		/** English dictionary (same key set). */
		const en = {
			"usage.aria": "OpenCode Go usage {percent}",
			"usage.rolling": "Rolling",
			"usage.weekly": "Weekly",
			"usage.monthly": "Monthly",
			"usage.window": "{label} {percent}% · resets {time}"
		};
		//#endregion
		//#region \0dsh-css:/Users/shidifenzhou/dsh/packages/client/ui-opencode-usage/src/client/UsageMeter.module.css.mjs
		const css = ".lh4dmG_root{display:inline-flex;position:relative}.lh4dmG_trigger{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;flex:none;place-items:center;display:grid}.lh4dmG_trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}.lh4dmG_track{fill:none;stroke:var(--dsw-alias-border-l3);stroke-width:2px}.lh4dmG_fill{fill:none;stroke:var(--dsw-alias-label-tertiary);stroke-width:2px;stroke-linecap:round}";
		const tagId = "@deepseek-ai/dsh-client-ui-opencode-usage/UsageMeter.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-opencode-usage";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var UsageMeter_module_css_default = {
			"root": "lh4dmG_root",
			"fill": "lh4dmG_fill",
			"track": "lh4dmG_track",
			"trigger": "lh4dmG_trigger"
		};
		//#endregion
		//#region src/client/UsageMeter.tsx
		/**
		* UsageMeter: the composer's OpenCode Go quota ring (`conversation.input.usage`
		* seat). Renders a ring beside the context meter — identical geometry and hit
		* target — fed by the host's `/api/opencode-usage` route, and shows the
		* rolling/weekly/monthly quota breakdown in a hover tooltip. Renders nothing
		* unless the session's current provider is opencode-go and the host served a
		* snapshot, so an unconfigured key or upstream failure costs no layout.
		*/
		/** Ring geometry: 14px viewBox, 2px stroke (identical to ContextMeter). */
		const RADIUS = 5.5;
		const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
		/** Browser polling interval for the host usage route. */
		const REFRESH_MS = 6e4;
		/** The exact host route the node half registers by default. */
		const USAGE_PATH = "/api/opencode-usage";
		/** Provider route id the ring renders for (the llm-pi-ai `opencode-go` route key). */
		const OPENCODE_GO_PROVIDER = "opencode-go";
		/**
		* Render the composer's local-time reset reading for an ISO timestamp.
		* @param iso - the upstream reset timestamp.
		* @returns a short locale-localized date-time, or the raw text when unparsable.
		*/
		function formatReset(iso) {
			const date = new Date(iso);
			if (Number.isNaN(date.getTime())) return iso;
			return date.toLocaleString(void 0, {
				month: "numeric",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		/**
		* Render the usage ring.
		* @param props - the injected directory face plus the standard locale seat
		* (the owner's `locked` share is deliberately not read: the ring is a
		* read-only readout).
		* @returns the ring and hover tooltip, or nothing when gated off / data-less.
		*/
		function UsageMeter({ available, directory, t }) {
			const state = (0, react.useSyncExternalStore)((fn) => directory.subscribe(fn), () => directory.getSnapshot());
			const onProvider = available && state.current?.provider === "opencode-go";
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (!onProvider) {
					setSnapshot(null);
					return;
				}
				let cancelled = false;
				const load = async () => {
					try {
						const response = await fetch(USAGE_PATH);
						if (!response.ok) {
							if (!cancelled) setSnapshot(null);
							return;
						}
						const body = await response.json();
						if (!cancelled) setSnapshot(body);
					} catch {
						if (!cancelled) setSnapshot(null);
					}
				};
				load();
				const interval = setInterval(() => {
					load();
				}, REFRESH_MS);
				return () => {
					cancelled = true;
					clearInterval(interval);
				};
			}, [onProvider]);
			if (!onProvider || snapshot === null) return null;
			const primary = snapshot.monthly ?? snapshot.weekly ?? snapshot.rolling;
			if (primary === null) return null;
			const percent = Math.min(100, Math.max(0, Math.round(primary.percent)));
			const reading = `${percent}%`;
			const rows = [];
			for (const key of [
				"rolling",
				"weekly",
				"monthly"
			]) {
				const window = snapshot[key];
				if (window !== null) rows.push({
					labelKey: `usage.${key}`,
					percent: window.percent,
					time: formatReset(window.resetsAt)
				});
			}
			const label = [t("usage.aria", { percent: reading }), ...rows.map((row) => t("usage.window", {
				label: t(row.labelKey),
				percent: String(row.percent),
				time: row.time
			}))].join("\n");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: UsageMeter_module_css_default.root,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label,
					side: "top",
					delayMs: 200,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: UsageMeter_module_css_default.trigger,
						"aria-label": t("usage.aria", { percent: reading }),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 14 14",
							width: "14",
							height: "14",
							"aria-hidden": true,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								className: UsageMeter_module_css_default.track,
								cx: "7",
								cy: "7",
								r: RADIUS
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								className: UsageMeter_module_css_default.fill,
								cx: "7",
								cy: "7",
								r: RADIUS,
								strokeDasharray: `${CIRCUMFERENCE * percent / 100} ${CIRCUMFERENCE}`,
								transform: "rotate(-90 7 7)"
							})]
						})
					})
				})
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Required services: the contribution registry, the shared model directory, locale, and sessions. */
		const inject = [
			"slots",
			"modelDirectories",
			"locale",
			"sessions"
		];
		/**
		* Client plugin body: register the dictionaries and the composer usage seat.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-opencode-usage: dictionaries");
			ctx.slots.inject("conversation.input.usage", () => ctx.slots.register({
				name: "conversation.input.usage",
				locale: NS,
				inject: (sessionId) => {
					const models = ctx.get("modelDirectories");
					const sessions = ctx.get("sessions");
					return {
						directory: models.directoryFor(sessionId).store,
						available: sessions.subagentAddress(sessionId) === void 0
					};
				}
			}, UsageMeter));
		}
		//#endregion
		exports.OPENCODE_GO_PROVIDER = OPENCODE_GO_PROVIDER;
		exports.REFRESH_MS = REFRESH_MS;
		exports.USAGE_PATH = USAGE_PATH;
		exports.UsageMeter = UsageMeter;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map