import { notFound, redirect } from 'next/navigation';

import { getVideoRecords } from '@/lib/video';

export default function HomePage() {
  const firstVideo = getVideoRecords()[0];
  if (!firstVideo) notFound();

  redirect(`/v/${encodeURIComponent(firstVideo.id)}`);
}
