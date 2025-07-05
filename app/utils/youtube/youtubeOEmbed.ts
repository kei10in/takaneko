import { YouTubeOEmbedResponse, YouTubeOEmbedResponseSchema } from "./types";

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
