import videoDisplayMetadataData from '@/data/video-display-metadata.json';
import videoData from '@/data/videos.json';
import {
  videoDisplayMetadataMapSchema,
  videoRecordsSchema,
  type VideoDisplayMetadata,
  type VideoRecord,
} from '@/schemas/video';

const videoRecords = videoRecordsSchema.parse(videoData);
const displayMetadataById = videoDisplayMetadataMapSchema.parse(videoDisplayMetadataData);

export function findVideoById(id: string): VideoRecord | undefined {
  return videoRecords.find((video) => video.id === id);
}

export function getVideoDisplayMetadataById(
  id: string,
): VideoDisplayMetadata | undefined {
  return displayMetadataById[id];
}
