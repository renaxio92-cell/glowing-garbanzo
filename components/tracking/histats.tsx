type HistatsTrackerProps = {
  enabled?: boolean;
  code?: string;
};

export function HistatsTracker({ enabled = false, code = '' }: HistatsTrackerProps) {
  if (!enabled || !code) {
    return null;
  }

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
