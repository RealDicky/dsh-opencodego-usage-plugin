/**
 * UsageMeter: the composer's OpenCode Go quota ring (`conversation.input.usage`
 * seat). Renders a ring beside the context meter — identical geometry and hit
 * target — fed by the host's `/api/opencode-usage` route, and shows the
 * rolling/weekly/monthly quota breakdown in a hover tooltip. Renders nothing
 * unless the session's current provider is opencode-go and the host served a
 * snapshot, so an unconfigured key or upstream failure costs no layout.
 */
import { useEffect, useSyncExternalStore, useState } from 'react'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { ModelDirectoryState } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { UsageSnapshot } from '../types.ts'
import css from './UsageMeter.module.css'

/** Ring geometry: 14px viewBox, 2px stroke (identical to ContextMeter). */
const RADIUS = 5.5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Browser polling interval for the host usage route. */
export const REFRESH_MS = 60_000

/** The exact host route the node half registers by default. */
export const USAGE_PATH = '/api/opencode-usage'

/** Provider route id the ring renders for (the llm-pi-ai `opencode-go` route key). */
export const OPENCODE_GO_PROVIDER = 'opencode-go'

/** Injected business face of the usage ring. */
export interface UsageMeterInjected {
  /** The session's shared model directory store (same instance the model seat reads). */
  directory: SnapshotStore<ModelDirectoryState>
  /** Whether this session may read Agent-bound model state (false for addressed subagent sessions). */
  available: boolean
}

/** One hover-tooltip breakdown row. */
interface Row {
  labelKey: 'usage.rolling' | 'usage.weekly' | 'usage.monthly'
  percent: number
  time: string
}

/** Full props: the injected directory face plus the standard locale seat. */
export type UsageMeterProps = UsageMeterInjected & PropsLocale<'opencodeUsage'>

/**
 * Render the composer's local-time reset reading for an ISO timestamp.
 * @param iso - the upstream reset timestamp.
 * @returns a short locale-localized date-time, or the raw text when unparsable.
 */
export function formatReset(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/**
 * Render the usage ring.
 * @param props - the injected directory face plus the standard locale seat
 * (the owner's `locked` share is deliberately not read: the ring is a
 * read-only readout).
 * @returns the ring and hover tooltip, or nothing when gated off / data-less.
 */
export function UsageMeter(
  { available, directory, t }: UsageMeterProps,
) {
  const state = useSyncExternalStore(
    fn => directory.subscribe(fn),
    () => directory.getSnapshot(),
  )
  const onProvider = available && state.current?.provider === OPENCODE_GO_PROVIDER
  const [snapshot, setSnapshot] = useState<UsageSnapshot | null>(null)

  // Poll the host quota route while the session is on opencode-go; clear the
  // snapshot the moment it switches away (a stale quota would mislead).
  useEffect(() => {
    if (!onProvider) {
      setSnapshot(null)
      return
    }
    let cancelled = false
    const load = async (): Promise<void> => {
      try {
        const response = await fetch(USAGE_PATH)
        if (!response.ok) {
          if (!cancelled) setSnapshot(null)
          return
        }
        const body = (await response.json()) as UsageSnapshot
        if (!cancelled) setSnapshot(body)
      } catch {
        if (!cancelled) setSnapshot(null)
      }
    }
    void load()
    const interval = setInterval(() => { void load() }, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [onProvider])

  if (!onProvider || snapshot === null) return null
  const primary = snapshot.monthly ?? snapshot.weekly ?? snapshot.rolling
  if (primary === null) return null
  const percent = Math.min(100, Math.max(0, Math.round(primary.percent)))
  const reading = `${percent}%`
  const rows: Row[] = []
  for (const key of ['rolling', 'weekly', 'monthly'] as const) {
    const window = snapshot[key]
    if (window !== null) rows.push({ labelKey: `usage.${key}`, percent: window.percent, time: formatReset(window.resetsAt) })
  }
  const label = [
    t('usage.aria', { percent: reading }),
    ...rows.map(row => t('usage.window', {
      label: t(row.labelKey),
      percent: String(row.percent),
      time: row.time,
    })),
  ].join('\n')

  return (
    <span className={css.root}>
      <Tooltip label={label} side="top" delayMs={200}>
        <button
          type="button"
          className={css.trigger}
          aria-label={t('usage.aria', { percent: reading })}
        >
          <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
            <circle className={css.track} cx="7" cy="7" r={RADIUS} />
            <circle
              className={css.fill}
              cx="7"
              cy="7"
              r={RADIUS}
              strokeDasharray={`${CIRCUMFERENCE * percent / 100} ${CIRCUMFERENCE}`}
              transform="rotate(-90 7 7)"
            />
          </svg>
        </button>
      </Tooltip>
    </span>
  )
}
