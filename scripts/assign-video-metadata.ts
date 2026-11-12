import { promises as fs } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import {
  videoDisplayMetadataMapSchema,
  videoDisplayMetadataSchema,
  videoRecordsSchema,
} from '../schemas/video';

const baseDir = process.cwd();
const videosPath = path.join(baseDir, 'data', 'videos.json');
const poolPath = path.join(baseDir, 'data', 'simulation-pool.json');
const assignedPath = path.join(baseDir, 'data', 'video-display-metadata.json');

async function readJson<T>(filePath: string, parser: z.ZodType<T>): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return parser.parse(JSON.parse(raw) as unknown);
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, filePath);
}

async function main(): Promise<void> {
  const videoRecords = await readJson(videosPath, videoRecordsSchema);
  const currentAssignments = await readJson(assignedPath, videoDisplayMetadataMapSchema).catch(() => ({}));
  const currentPool = await readJson(poolPath, z.array(videoDisplayMetadataSchema));

  const assignedKeys = new Set(Object.keys(currentAssignments));
  const pendingAssignments = videoRecords.filter((record) => !assignedKeys.has(record.id));

  if (pendingAssignments.length === 0) {
    console.log('No new assignments required. Existing metadata assignments are already in place.');
    return;
  }

  if (currentPool.length < pendingAssignments.length) {
    throw new Error(
      `Not enough metadata combinations in data/simulation-pool.json. Required: ${pendingAssignments.length}. Available: ${currentPool.length}.`,
    );
  }

  const existingPoolValues = new Set(
    Object.values(currentAssignments).map((value) => JSON.stringify(value)),
  );

  const remainingPool = currentPool.filter(
    (entry) => !existingPoolValues.has(JSON.stringify(entry)),
  );

  if (remainingPool.length < pendingAssignments.length) {
    throw new Error(
      `Remaining metadata pool is insufficient for all pending video assignments. Required: ${pendingAssignments.length}. Available: ${remainingPool.length}.`,
    );
  }

  const shuffledPool = [...remainingPool].sort(() => Math.random() - 0.5);
  const nextAssignments = { ...currentAssignments };

  pendingAssignments.forEach((record, index) => {
    nextAssignments[record.id] = shuffledPool[index];
  });

  const updatedPool = remainingPool.filter(
    (entry) => !pendingAssignments.some((record) => JSON.stringify(nextAssignments[record.id]) === JSON.stringify(entry)),
  );

  await writeJson(assignedPath, nextAssignments);
  await writeJson(poolPath, updatedPool);

  console.log(
    `Assigned metadata to ${pendingAssignments.length} video record(s) and updated the remaining metadata pool.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown metadata assignment error';
  console.error(message);
  process.exitCode = 1;
});
