import { z } from "zod/v4";

export const YouTubeOEmbedResponseSchema = z.object({
  title: z.string(),
  author_name: z.string(),
  author_url: z.url(),
  type: z.literal("video"),
  height: z.number().optional(),
  width: z.number().optional(),
  version: z.string(),
  provider_name: z.literal("YouTube"),
  provider_url: z.url(),
  thumbnail_height: z.number(),
  thumbnail_width: z.number(),
  thumbnail_url: z.url(),
  html: z.string(),
});

export type YouTubeOEmbedResponse = z.infer<typeof YouTubeOEmbedResponseSchema>;

export interface YouTubeVideoMetadata {
  videoId: string;

  title: string;
  authorName: string;
  authorUrl: string;

  thumbnails: string[];
}
