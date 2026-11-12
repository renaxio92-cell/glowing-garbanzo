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
const videoIds = new Set(videoRecords.map((video) => video.id));
const unknownMetadataIds = Object.keys(displayMetadataById).filter((id) => !videoIds.has(id));

if (unknownMetadataIds.length > 0) {
  throw new Error(`Metadata contains unknown video IDs: ${unknownMetadataIds.join(', ')}`);
}

export function getVideoRecords(): VideoRecord[] {
  return videoRecords;
}

export function findVideoById(id: string): VideoRecord | undefined {
  return videoRecords.find((video) => video.id === id);
}

export function getVideoDisplayMetadataById(
  id: string,
): VideoDisplayMetadata | undefined {
  return displayMetadataById[id];
}
