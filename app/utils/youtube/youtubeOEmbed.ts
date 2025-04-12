import { z } from "zod";

export const YouTubeOEmbedResponseSchema = z.object({
  title: z.string(),
  author_name: z.string(),
  author_url: z.string().url(),
  type: z.literal("video"),
  height: z.number().optional(),
  width: z.number().optional(),
  version: z.string(),
  provider_name: z.literal("YouTube"),
  provider_url: z.string().url(),
  thumbnail_height: z.number(),
  thumbnail_width: z.number(),
  thumbnail_url: z.string().url(),
  html: z.string(),
});

export type YouTubeOEmbedResponse = z.infer<typeof YouTubeOEmbedResponseSchema>;

export const validateYouTubeOEmbedResponse = (data: unknown) => {
  const result = YouTubeOEmbedResponseSchema.safeParse(data);
  return result.success ? result.data : undefined;
};
