import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  videoDisplayMetadataMapSchema,
  videoDisplayMetadataSchema,
  videoRecordSchema,
  videoRecordsSchema,
  type VideoDisplayMetadata,
  type VideoRecord,
} from '@/schemas/video';

export const DATA_DIR = path.join(process.cwd(), 'data');

function safeJsonParse<T>(value: unknown, schema: { parse: (input: unknown) => T }): T | undefined {
  try {
    return schema.parse(value);
  } catch {
    return undefined;
  }
}

export function getVideoRecords(): VideoRecord[] {
  const filePath = path.join(DATA_DIR, 'videos.json');

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return safeJsonParse(parsed, videoRecordsSchema) ?? [];
  } catch {
    return [];
  }
}

export function getVideoDisplayMetadata(videoId: string): VideoDisplayMetadata | undefined {
  const filePath = path.join(DATA_DIR, 'video-display-metadata.json');

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    const map = safeJsonParse(parsed, videoDisplayMetadataMapSchema) ?? {};
    return map[videoId];
  } catch {
    return undefined;
  }
}

export async function readVideoRecords(): Promise<Record<string, string>> {
  const filePath = path.join(DATA_DIR, 'videos.json');

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    const records = safeJsonParse(parsed, videoRecordsSchema) ?? [];
    return Object.fromEntries(records.map((entry) => [entry.id, entry.embedUrl]));
  } catch {
    return {};
  }
}

export async function readVideoDisplayMetadata(): Promise<Record<string, VideoDisplayMetadata>> {
  const filePath = path.join(DATA_DIR, 'video-display-metadata.json');

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return safeJsonParse(parsed, videoDisplayMetadataMapSchema) ?? {};
  } catch {
    return {};
  }
}

export function getVideoRecord(videoId: string): VideoRecord | undefined {
  return getVideoRecords().find((entry) => entry.id === videoId);
}

export function getVideoMetadataPool(): VideoDisplayMetadata[] {
  const filePath = path.join(DATA_DIR, 'simulation-pool.json');

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return safeJsonParse(parsed, z.array(videoDisplayMetadataSchema)) ?? [];
  } catch {
    return [];
  }
}

export function zodArraySafe(value: unknown): Array<{ id: string; embedUrl: string }> {
  const parsed = Array.isArray(value) ? value : [];
  return parsed.filter((item): item is { id: string; embedUrl: string } => {
    const result = videoRecordSchema.safeParse(item);
    return result.success;
  });
}
