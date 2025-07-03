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

export const validateYouTubeOEmbedResponse = (data: unknown) => {
  const result = YouTubeOEmbedResponseSchema.safeParse(data);
  return result.success ? result.data : undefined;
};

export const fetchYouTubeOEmbed = async (
  videoId: string,
): Promise<YouTubeOEmbedResponse | undefined> => {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return undefined;
    }
    const data = await response.json();
    const parsedData = YouTubeOEmbedResponseSchema.safeParse(data);
    if (parsedData.error) {
      return undefined;
    }

    return parsedData.data;
  } catch (error) {
    console.error("Failed to fetch YouTube oEmbed:", error);
    return undefined;
  }
};
