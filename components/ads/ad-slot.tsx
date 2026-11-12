type AdSlotProps = {
  id: string;
  variant?: 'header' | 'player' | 'footer';
};

export function AdSlot({ id, variant = 'player' }: AdSlotProps) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  if (!adsEnabled) {
    return null;
  }

  return (
    <div
      id={id}
      data-ad-slot={variant}
      className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center text-xs uppercase tracking-[0.2em] text-slate-500"
    >
      Ad slot: {variant}
    </div>
  );
}
