import fs from "fs/promises";
import path from "path";
import { format, resolveConfig, resolveConfigFile } from "prettier";
import { dedent } from "ts-dedent";
import { MediaDetails } from "~/features/media/types";
import { findFirstNonEmpty } from "~/utils/findFirstNonEmpty";
import { getAllMedia } from "../app/features/media/allMedia";
import { NaiveDate } from "../app/utils/datetime/NaiveDate";
import { ogp } from "../app/utils/ogp/ogp";
import { validateYouTubeOEmbedResponse } from "../app/utils/youtube/youtubeOEmbed";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "../app/features/media");
const oEmbedEndpoint = "https://www.youtube.com/oembed";

const fetchAndCacheMediaMetadata = async () => {
  const allMedia = getAllMedia();

  const metadataPromises = allMedia.map(async (media): Promise<MediaDetails[]> => {
    if (media.kind == "static") {
      return [
        {
          kind: "static",
          title: media.title,
          authorName: media.authorName,
          publishedAt: media.publishedAt,
          mediaUrl: media.mediaUrl,
          imageUrl: media.image.path,
          category: media.category,
          presents: media.presents ?? [],
        },
      ];
    } else if (media.kind == "ogp") {
      const metadata = await ogp(media.mediaUrl);

      const title = findFirstNonEmpty([metadata?.ogp?.title, media.title]);
      const authorName = findFirstNonEmpty([metadata?.ogp?.siteName, media.siteName]);
      const imageUrl = findFirstNonEmpty([metadata?.ogp?.image, media.image?.path]);
      const mediaUrl = findFirstNonEmpty([metadata?.ogp?.url, media.mediaUrl]);
      if (!title || !authorName || !imageUrl || !mediaUrl) {
        return [];
      }

      return [
        {
          kind: "ogp",
          title: title,
          authorName: authorName,
          publishedAt: media.publishedAt,
          mediaUrl: mediaUrl,
          imageUrl: imageUrl,
          category: media.category,
          presents: media.presents ?? [],
        },
      ];
    } else if (media.kind == "youtube") {
      const url = `${oEmbedEndpoint}?url=https://www.youtube.com/watch?v=${media.videoId}&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Error: videoId = ${media.videoId}: ${response.status} ${response.statusText}`,
        );
        return [];
      }
      const jsonData = await response.json();

      // Validate the response using the validate function
      const data = validateYouTubeOEmbedResponse(jsonData);
      if (!data) {
        console.error(`Error: videoId = ${media.videoId}: Unexpected response format`);
        return [];
      }

      return [
        {
          kind: "youtube",
          title: data.title,
          authorName: data.author_name,
          publishedAt: media.publishedAt,
          mediaUrl: `https://youtu.be/${media.videoId}`,
          imageUrl: data.thumbnail_url,
          category: "youtube",
          presents: media.presents,
        },
      ];
    } else {
      return [];
    }
  });

  const items = (await Promise.all(metadataPromises)).flatMap((x) => x);

  const resultsByYear = items.reduce((acc: { year: number; media: MediaDetails[] }[], media) => {
    const publishedDate = NaiveDate.parseUnsafe(media.publishedAt);
    const year = publishedDate.year;

    const xs = acc.find((item) => item.year === year);
    if (xs == undefined) {
      acc.push({ year, media: [media] });
    } else {
      xs.media.push(media);
    }

    return acc;
  }, []);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Write grouped media to files
  await Promise.all(
    resultsByYear.map(async ({ year, media }) => {
      const outputFilePath = path.resolve(OUTPUT_DIR, year.toString(), "metadata.ts");

      const metadataContent = dedent(`
        import { MediaDetails } from "~/features/media/types";

        export const metadata${year}: MediaDetails[] = ${JSON.stringify(media, null, 2)};
        `);

      const formattedContent = await prettier(metadataContent);
      await fs.writeFile(outputFilePath, formattedContent, "utf-8");
    }),
  );
};

/**
 * Prettier を使用してコードを整形します。
 */
const prettier = async (source: string): Promise<string> => {
  // Prettier設定ファイルを解決
  const configPath = await resolveConfigFile();
  const options = configPath ? await resolveConfig(configPath) : {};

  const formatted = await format(source, {
    ...options,
    parser: "typescript",
  });

  return formatted;
};

const main = async () => {
  try {
    await fetchAndCacheMediaMetadata();
  } catch (error) {
    console.error("Failed to cache media metadata:", error);
  }
};

main();
