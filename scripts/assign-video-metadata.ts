import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  videoDisplayMetadataMapSchema,
  videoDisplayMetadataSchema,
  videoRecordsSchema,
} from '../schemas/video';

const dataDir = path.join(process.cwd(), 'data');
const videosPath = path.join(dataDir, 'videos.json');
const poolPath = path.join(dataDir, 'simulation-pool.json');
const assignedPath = path.join(dataDir, 'video-display-metadata.json');

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, 'utf8')) as unknown;
}

async function readAssignments(): Promise<Record<string, { duration: string; fileSize: string; views: number; uploadDate: string }>> {
  try {
    return videoDisplayMetadataMapSchema.parse(await readJson(assignedPath));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return {};
    throw error;
  }
}

async function writeJsonAtomically(filePath: string, value: unknown): Promise<void> {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await fs.rename(temporaryPath, filePath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true });
    throw error;
  }
}

function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

async function main(): Promise<void> {
  const videos = videoRecordsSchema.parse(await readJson(videosPath));
  const assignments = await readAssignments();
  const pool = videoDisplayMetadataSchema.array().parse(await readJson(poolPath));
  const knownIds = new Set(videos.map(({ id }) => id));
  const danglingIds = Object.keys(assignments).filter((id) => !knownIds.has(id));
  if (danglingIds.length) throw new Error(`Assignments exist for unknown video IDs: ${danglingIds.join(', ')}`);

  const pending = videos.filter(({ id }) => !Object.hasOwn(assignments, id));
  if (!pending.length) {
    console.log('No new metadata assignments required.');
    return;
  }

  const stableValue = (value: unknown) => JSON.stringify(value);
  const existing = new Set(Object.values(assignments).map(stableValue));
  const seenPool = new Set<string>();
  const available = pool.filter((entry) => {
    const key = stableValue(entry);
    if (existing.has(key) || seenPool.has(key)) return false;
    seenPool.add(key);
    return true;
  });

  if (available.length < pending.length) {
    throw new Error(`Metadata pool is insufficient: ${pending.length} required, ${available.length} unique unused combinations available.`);
  }

  const selected = shuffle(available).slice(0, pending.length);
  const nextAssignments = { ...assignments };
  pending.forEach(({ id }, index) => {
    nextAssignments[id] = selected[index];
  });
  const consumed = new Set(selected.map(stableValue));
  const nextPool = pool.filter((entry) => !consumed.has(stableValue(entry)));

  // Commit assignments first: if the pool update fails, rerunning safely excludes already-assigned values.
  await writeJsonAtomically(assignedPath, nextAssignments);
  await writeJsonAtomically(poolPath, nextPool);
  console.log(`Assigned metadata to ${pending.length} video record(s).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Unknown metadata assignment error');
  process.exitCode = 1;
});
