import { notFound } from 'next/navigation';

import { VideoPageView } from '@/components/video/video-page-view';
import { getVideoDisplayMetadata, getVideoRecords } from '@/lib/video';

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideoRecords().find((entry) => entry.id === id);

  if (!video) {
    notFound();
  }

  return (
    <VideoPageView
      videoId={video.id}
      videoEmbedUrl={video.embedUrl}
      displayMetadata={getVideoDisplayMetadata(video.id)}
    />
  );
}
