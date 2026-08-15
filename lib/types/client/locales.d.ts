/** `opencodeUsage` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "opencodeUsage";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    'usage.aria': string;
    'usage.rolling': string;
    'usage.weekly': string;
    'usage.monthly': string;
    'usage.window': string;
};
/** English dictionary (same key set). */
export declare const en: Record<OpencodeUsageKey, string>;
/** Union of this namespace's dictionary keys. */
export type OpencodeUsageKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map