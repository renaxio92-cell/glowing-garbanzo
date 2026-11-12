type HistatsTrackerProps = {
  enabled?: boolean;
  trackingId?: string;
};

/** Tracking is intentionally disabled until a provider-specific, reviewed integration is configured. */
export function HistatsTracker({ enabled = false, trackingId = '' }: HistatsTrackerProps) {
  if (!enabled || !/^\d+$/.test(trackingId)) return null;
  return null;
}
