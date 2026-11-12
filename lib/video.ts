import { promises as fs } from 'node:fs';
import path from 'node:path';

import { videoRecordSchema } from '@/schemas/video';

export const DATA_DIR = path.join(process.cwd(), 'data');

export async function readVideoRecords(): Promise<Record<string, string>> {
  const filePath = path.join(DATA_DIR, 'videos.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const records = JSON.parse(raw) as unknown;
  const parsed = zodArraySafe(records);

  return Object.fromEntries(
    parsed.map((entry) => [entry.id, entry.embedUrl]),
  );
}

function zodArraySafe(value: unknown) {
  const parsed = Array.isArray(value) ? value : [];
  return parsed.filter((item): item is { id: string; embedUrl: string } => {
    const result = videoRecordSchema.safeParse(item);
    return result.success;
  });
}
