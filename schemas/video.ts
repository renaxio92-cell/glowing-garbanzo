import { z } from 'zod';

const videoIdSchema = z.string().min(1).max(120).regex(/^[A-Za-z0-9_-]+$/);
const videoEmbedUrlSchema = z.string().url().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'vski.cc' && !url.port && !url.username && !url.password && /^\/e\/[A-Za-z0-9_-]+$/.test(url.pathname);
  } catch {
    return false;
  }
}, 'Expected an HTTPS embed URL in the approved provider format.');

export const videoRecordSchema = z.object({ id: videoIdSchema, embedUrl: videoEmbedUrlSchema }).strict();
export const videoRecordsSchema = z.array(videoRecordSchema).superRefine((records, context) => {
  const seen = new Set<string>();
  records.forEach((record, index) => {
    if (seen.has(record.id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate video ID: ${record.id}`, path: [index, 'id'] });
    }
    seen.add(record.id);
  });
});

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, 'Expected a valid YYYY-MM-DD date.');

export const videoDisplayMetadataSchema = z.object({
  duration: z.string().regex(/^(?:\d{2,}:)?[0-5]\d:[0-5]\d$/),
  fileSize: z.string().regex(/^\d+(?:\.\d+)?\s(?:MB|GB)$/),
  views: z.number().int().nonnegative(),
  uploadDate: isoDateSchema,
}).strict();

export const videoDisplayMetadataMapSchema = z.record(z.string(), videoDisplayMetadataSchema);

export type VideoRecord = z.infer<typeof videoRecordSchema>;
export type VideoDisplayMetadata = z.infer<typeof videoDisplayMetadataSchema>;
