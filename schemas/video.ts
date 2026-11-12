import { z } from 'zod';

export const videoRecordSchema = z.object({
  id: z.string().min(1),
  embedUrl: z.string().url(),
});

export const videoDisplayMetadataSchema = z.object({
  duration: z.string().min(1),
  fileSize: z.string().min(1),
  views: z.number().int().nonnegative(),
  uploadDate: z.string().min(1),
});

export type VideoRecord = z.infer<typeof videoRecordSchema>;
export type VideoDisplayMetadata = z.infer<typeof videoDisplayMetadataSchema>;
