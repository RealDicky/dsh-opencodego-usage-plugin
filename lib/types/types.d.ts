/** Wire and component types shared by the host and browser halves. */
/** One quota window as the browser renders it. */
export interface UsageWindow {
    /** Quota consumed, 0–100. */
    percent: number;
    /** ISO timestamp of the window reset. */
    resetsAt: string;
}
/** The normalized snapshot the host route answers. A window is null while the upstream reports it unhealthy. */
export interface UsageSnapshot {
    rolling: UsageWindow | null;
    weekly: UsageWindow | null;
    monthly: UsageWindow | null;
}
//# sourceMappingURL=types.d.ts.map