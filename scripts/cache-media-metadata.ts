import fs from "fs/promises";
import os from "node:os";
import path from "path";
import { format, resolveConfig, resolveConfigFile } from "prettier";
import { dedent } from "ts-dedent";
import { mediaKey } from "~/features/media/mediaDescriptor";
import { getAllMediaMetadata } from "~/features/media/metadata";
import {
  MediaDescriptor,
  MediaDetails,
  OgpMediaDescriptor,
  YouTubeVideoDescriptor,
} from "~/features/media/types";
import { findFirstNonEmpty } from "~/utils/findFirstNonEmpty";
import { Err, Ok, type Result } from "~/utils/result";
import { getAllMedia } from "../app/features/media/allMedia";
import { NaiveDate } from "../app/utils/datetime/NaiveDate";
import type { SocialCards } from "../app/utils/ogp/metaData";
import { ogp } from "../app/utils/ogp/ogp";
import type { YouTubeOEmbedResponse } from "../app/utils/youtube/types";
import { validateYouTubeOEmbedResponse } from "../app/utils/youtube/youtubeOEmbed";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "../app/features/media");
const oEmbedEndpoint = "https://www.youtube.com/oembed";

type MetadataBuildError =
  | {
      kind: "ogp-missing-fields";
      key: string;
      url: string;
      missingFields: string[];
      message: string;
    }
  | {
      kind: "youtube-fetch-failed";
      key: string;
      videoId: string;
      message: string;
    }
  | {
      kind: "youtube-invalid-oembed";
      key: string;
      videoId: string;
      message: string;
    };

type MetadataStateTransition =
  | { type: "marked-deleted"; key: string; mediaUrl: string }
  | { type: "restored"; key: string; mediaUrl: string };

type ResolvedOgpFields = {
  title: string | undefined;
  siteName: string | undefined;
  image: string | undefined;
  mediaUrl: string | undefined;
};

const assertNever = (value: never): never => {
  throw new Error(`Unexpected media kind: ${JSON.stringify(value)}`);
};

const fetchAndCacheMediaMetadata = async () => {
  const allMedia = getAllMedia();

  const existingMediaMetadata = Object.fromEntries(getAllMediaMetadata().map((m) => [m.key, m]));

  const metadataPromises = allMedia.map(
    async (media): Promise<Result<MediaDetails, MetadataBuildError>> => {
      const key = mediaKey(media);

      if (media.kind == "static") {
        return Ok({
          kind: "static",
          key,
          title: media.title,
          authorName: media.authorName,
          publishedAt: media.publishedAt,
          mediaUrl: media.mediaUrl,
          imageUrl: media.image.path,
          category: media.category,
          presents: media.presents ?? [],
        });
      } else if (media.kind == "ogp") {
        const metadata = await ogp(media.mediaUrl);
        return buildOgpMediaDetails(media, key, metadata);
      } else if (media.kind == "youtube") {
        const url = `${oEmbedEndpoint}?url=https://www.youtube.com/watch?v=${media.videoId}&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
          return Err({
            kind: "youtube-fetch-failed",
            key,
            videoId: media.videoId,
            message: `${response.status} ${response.statusText}`,
          });
        }

        const jsonData = await response.json();
        const parsedOEmbed = validateYouTubeOEmbedResponse(jsonData);
        if (!parsedOEmbed) {
          return Err({
            kind: "youtube-invalid-oembed",
            key,
            videoId: media.videoId,
            message: "Unexpected response format",
          });
        }

        return buildYoutubeMediaDetails(media, key, parsedOEmbed);
      }

      return assertNever(media);
    },
  );

  const items = (await Promise.all(metadataPromises)).flatMap((result) => {
    if (result.err) {
      const existingItem = existingMediaMetadata[result.error.key];
      if (shouldLogMetadataBuildError(existingItem)) {
        logMetadataBuildError(result.error);
      }
      return [];
    }
    return [result.value];
  });
  const newMediaMetadata = Object.fromEntries(items.map((item) => [item.key, item]));

  const { merged, transitions } = mergeMediaMetadata(
    allMedia,
    existingMediaMetadata,
    newMediaMetadata,
  );
  logTransitions(transitions);

  const resultsByYear = merged.reduce((acc: { year: number; media: MediaDetails[] }[], media) => {
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

const buildOgpMediaDetails = (
  media: OgpMediaDescriptor,
  key: string,
  metadata: SocialCards,
): Result<MediaDetails, MetadataBuildError> => {
  const fields: ResolvedOgpFields = {
    title: findFirstNonEmpty([media.title, metadata?.ogp?.title]),
    siteName: findFirstNonEmpty([media.siteName, metadata?.ogp?.siteName]),
    image: findFirstNonEmpty([media.image?.path, metadata?.ogp?.image]),
    mediaUrl: findFirstNonEmpty([media.mediaUrl, metadata?.ogp?.url]),
  };

  const { title, siteName, image, mediaUrl } = fields;

  if (title == undefined || siteName == undefined || image == undefined || mediaUrl == undefined) {
    return Err({
      kind: "ogp-missing-fields",
      key,
      url: media.mediaUrl,
      missingFields: collectMissingOgpFields(fields),
      message: "Missing fields",
    });
  }

  return Ok({
    kind: "ogp",
    key,
    title: title.split(",")[0],
    authorName: siteName.split(",")[0],
    publishedAt: media.publishedAt,
    mediaUrl,
    imageUrl: image.split(",")[0],
    category: media.category,
    presents: media.presents ?? [],
  });
};

const buildYoutubeMediaDetails = (
  media: YouTubeVideoDescriptor,
  key: string,
  oEmbed: YouTubeOEmbedResponse,
): Result<MediaDetails, MetadataBuildError> => {
  return Ok({
    kind: "youtube",
    key,
    title: oEmbed.title,
    authorName: oEmbed.author_name,
    publishedAt: media.publishedAt,
    mediaUrl: `https://youtu.be/${media.videoId}`,
    imageUrl: oEmbed.thumbnail_url,
    category: "youtube",
    presents: media.presents,
  });
};

export const collectMissingOgpFields = (params: ResolvedOgpFields): string[] => {
  const missing: string[] = [];

  if (!params.title) {
    missing.push("title");
  }
  if (!params.siteName) {
    missing.push("siteName");
  }
  if (!params.image) {
    missing.push("image");
  }
  if (!params.mediaUrl) {
    missing.push("mediaUrl");
  }

  return missing;
};

export const mergeMediaMetadata = (
  allMedia: MediaDescriptor[],
  existing: Record<string, MediaDetails>,
  newItems: Record<string, MediaDetails>,
): { merged: MediaDetails[]; transitions: MetadataStateTransition[] } => {
  const transitions: MetadataStateTransition[] = [];

  const merged = allMedia.flatMap((media) => {
    const key = mediaKey(media);
    const oldItem = existing[key];
    const newItem = newItems[key];

    if (oldItem == undefined && newItem == undefined) {
      return [];
    }

    if (newItem != undefined) {
      if (oldItem?.deleted === true) {
        transitions.push({ type: "restored", key, mediaUrl: newItem.mediaUrl });
      }
      return [newItem];
    }

    if (oldItem == undefined) {
      return [];
    }

    const deletedItem = { ...oldItem, deleted: true };
    if (oldItem.deleted !== true) {
      transitions.push({ type: "marked-deleted", key, mediaUrl: oldItem.mediaUrl });
    }
    return [deletedItem];
  });

  return { merged, transitions };
};

const logTransitions = (transitions: MetadataStateTransition[]) => {
  transitions.forEach((transition) => {
    if (transition.type === "marked-deleted") {
      console.warn(`marked deleted: key=${transition.key} url=${transition.mediaUrl}`);
      return;
    }

    console.info(`restored: key=${transition.key} url=${transition.mediaUrl}`);
  });
};

const logMetadataBuildError = (error: MetadataBuildError): void => {
  if (error.kind === "ogp-missing-fields") {
    console.error(
      [
        `Error: ${error.message}: ${error.url}`,
        ...error.missingFields.map((field) => `  - ${field}`),
      ].join("\n"),
    );
    return;
  }

  if (error.kind === "youtube-fetch-failed") {
    console.error(`Error: videoId = ${error.videoId}: ${error.message}`);
    return;
  }

  console.error(`Error: videoId = ${error.videoId}: ${error.message}`);
};

export const shouldLogMetadataBuildError = (existing: MediaDetails | undefined): boolean => {
  return existing?.deleted !== true;
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
    endOfLine: os.EOL == "\n" ? "lf" : "crlf",
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

if (import.meta.main) {
  void main();
}
