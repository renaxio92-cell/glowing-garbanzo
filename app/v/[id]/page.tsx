import { notFound } from 'next/navigation';

import { VideoPageView } from '@/components/video/video-page-view';
import { findVideoById, getVideoDisplayMetadataById } from '@/lib/video';

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = findVideoById(id);

  if (!video) {
    notFound();
  }

  const displayMetadata = getVideoDisplayMetadataById(id);

  return <VideoPageView videoId={video.id} displayMetadata={displayMetadata} />;
}
