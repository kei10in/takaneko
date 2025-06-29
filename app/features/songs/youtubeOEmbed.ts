import { z } from "zod/v4";

export const YouTubeOEmbedResponse = z.object({
  title: z.string(),
  author_name: z.string(),
  author_url: z.string(),
  type: z.string(),

  height: z.number(),
  width: z.number(),

  version: z.string(),

  provider_name: z.string(),
  provider_url: z.string(),

  thumbnail_height: z.number(),
  thumbnail_width: z.number(),
  thumbnail_url: z.string(),

  html: z.string(),
});

export type YouTubeOEmbedResponse = z.infer<typeof YouTubeOEmbedResponse>;

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
    const parsedData = YouTubeOEmbedResponse.safeParse(data);
    if (parsedData.error) {
      return undefined;
    }

    return parsedData.data;
  } catch (error) {
    console.error("Failed to fetch YouTube oEmbed:", error);
    return undefined;
  }
};
