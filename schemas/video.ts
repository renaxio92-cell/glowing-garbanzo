import { z } from 'zod';

const videoEmbedUrlSchema = z.string().url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === 'https:' &&
    url.hostname === 'vski.cc' &&
    url.port === '' &&
    url.username === '' &&
    url.password === '' &&
    /^\/e\/[^/]+$/.test(url.pathname)
  );
}, 'Expected an HTTPS Vidoy embed URL in the form https://vski.cc/e/{video_id}.');

export const videoRecordSchema = z
  .object({
    id: z.string().min(1),
    embedUrl: videoEmbedUrlSchema,
  })
  .strict();

export const videoRecordsSchema = z
  .array(videoRecordSchema)
  .superRefine((records, context) => {
    const seenIds = new Set<string>();

    records.forEach((record, index) => {
      if (seenIds.has(record.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate video ID: ${record.id}`,
          path: [index, 'id'],
        });
      }
      seenIds.add(record.id);
    });
  });

export const videoDisplayMetadataSchema = z
  .object({
    duration: z.string().min(1),
    fileSize: z.string().min(1),
    views: z.number().int().nonnegative(),
    uploadDate: z.string().min(1),
  })
  .strict();

export const videoDisplayMetadataMapSchema = z.record(
  z.string(),
  videoDisplayMetadataSchema,
);

export type VideoRecord = z.infer<typeof videoRecordSchema>;
export type VideoDisplayMetadata = z.infer<typeof videoDisplayMetadataSchema>;
