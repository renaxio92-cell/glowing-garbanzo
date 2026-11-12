type AdSlotProps = {
  id: string;
  variant?: 'header' | 'player' | 'footer';
};

/** Reserved placement only. Vendor scripts are intentionally not injected until approved code is reviewed. */
export function AdSlot({ id, variant = 'player' }: AdSlotProps) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== 'true') return null;

  return (
    <aside
      id={id}
      aria-label="Advertisement"
      data-ad-slot={variant}
      className="mt-5 min-h-20 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-center text-xs uppercase tracking-[0.2em] text-slate-500"
    >
      Advertisement
    </aside>
  );
}
