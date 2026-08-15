/** `opencodeUsage` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'opencodeUsage'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'usage.aria': 'OpenCode Go 用量 {percent}',
  'usage.rolling': '滚动',
  'usage.weekly': '周',
  'usage.monthly': '月',
  'usage.window': '{label} {percent}% · 重置 {time}',
}

/** English dictionary (same key set). */
export const en: Record<OpencodeUsageKey, string> = {
  'usage.aria': 'OpenCode Go usage {percent}',
  'usage.rolling': 'Rolling',
  'usage.weekly': 'Weekly',
  'usage.monthly': 'Monthly',
  'usage.window': '{label} {percent}% · resets {time}',
}

/** Union of this namespace's dictionary keys. */
export type OpencodeUsageKey = keyof typeof zh
