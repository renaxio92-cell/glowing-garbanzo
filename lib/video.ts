import videoData from '@/data/videos.json';
import { videoRecordsSchema, type VideoRecord } from '@/schemas/video';

const videoRecords = videoRecordsSchema.parse(videoData);

export function findVideoById(id: string): VideoRecord | undefined {
  return videoRecords.find((video) => video.id === id);
}
