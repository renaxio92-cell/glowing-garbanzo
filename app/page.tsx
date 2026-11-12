import { redirect } from 'next/navigation';

import { getVideoRecords } from '@/lib/video';

export default function HomePage() {
  const firstVideo = getVideoRecords()[0];
  if (firstVideo) redirect(`/v/${encodeURIComponent(firstVideo.id)}`);
  redirect('/404');
}
