//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-opencode-usage`.
* @module @deepseek-ai/dsh-client-ui-opencode-usage/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-opencode-usage";
/** Cordis companion plugin name. */
const name = "client-ui-opencode-usage-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the webserver route registration is an effect with
* its disposer returned, the browser slot ride the slot-system ledger owned
* by the runtime slots package, and the quota snapshot is a stateless fetch
* with no session events or mutable cross-request state to relate.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
