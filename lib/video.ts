import videoDisplayMetadataData from '@/data/video-display-metadata.json';
import simulationPoolData from '@/data/simulation-pool.json';
import videoData from '@/data/videos.json';
import {
  videoDisplayMetadataMapSchema,
  videoDisplayMetadataSchema,
  videoRecordsSchema,
  type VideoDisplayMetadata,
  type VideoRecord,
} from '@/schemas/video';

const videoRecords = videoRecordsSchema.parse(videoData);
const displayMetadataById = videoDisplayMetadataMapSchema.parse(videoDisplayMetadataData);
const metadataPool = videoDisplayMetadataSchema.array().parse(simulationPoolData);

const videoIds = new Set(videoRecords.map(({ id }) => id));
const unknownMetadataIds = Object.keys(displayMetadataById).filter((id) => !videoIds.has(id));
if (unknownMetadataIds.length > 0) {
  throw new Error(`Metadata contains unknown video IDs: ${unknownMetadataIds.join(', ')}`);
}

export const DATA_DIR = 'data';

export function getVideoRecords(): VideoRecord[] {
  return videoRecords;
}

export function getVideoRecord(videoId: string): VideoRecord | undefined {
  return videoRecords.find(({ id }) => id === videoId);
}

export function findVideoById(videoId: string): VideoRecord | undefined {
  return getVideoRecord(videoId);
}

export function getVideoDisplayMetadata(videoId: string): VideoDisplayMetadata | undefined {
  return displayMetadataById[videoId];
}

export function getVideoDisplayMetadataById(videoId: string): VideoDisplayMetadata | undefined {
  return getVideoDisplayMetadata(videoId);
}

export function getVideoMetadataPool(): VideoDisplayMetadata[] {
  return metadataPool;
}

export async function readVideoRecords(): Promise<Record<string, string>> {
  return Object.fromEntries(videoRecords.map(({ id, embedUrl }) => [id, embedUrl]));
}

export async function readVideoDisplayMetadata(): Promise<Record<string, VideoDisplayMetadata>> {
  return displayMetadataById;
}

export function zodArraySafe(value: unknown): VideoRecord[] {
  const parsed = videoRecordsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}
