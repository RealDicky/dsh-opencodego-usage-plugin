import { en, NS, zh } from "./locales.js";
import { UsageMeter } from "./UsageMeter.js";
export { UsageMeter } from "./UsageMeter.js";
export { OPENCODE_GO_PROVIDER, REFRESH_MS, USAGE_PATH } from "./UsageMeter.js";
/** Required services: the contribution registry, the shared model directory, locale, and sessions. */
export const inject = ['slots', 'modelDirectories', 'locale', 'sessions'];
/**
 * Client plugin body: register the dictionaries and the composer usage seat.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-opencode-usage: dictionaries');
    ctx.slots.inject('conversation.input.usage', () => ctx.slots.register({
        name: 'conversation.input.usage',
        locale: NS,
        inject: (sessionId) => {
            const models = ctx.get('modelDirectories');
            const sessions = ctx.get('sessions');
            return {
                directory: models.directoryFor(sessionId).store,
                available: sessions.subagentAddress(sessionId) === undefined,
            };
        },
    }, UsageMeter));
}
//# sourceMappingURL=index.js.map