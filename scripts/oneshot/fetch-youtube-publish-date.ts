import { youtube_v3 } from "@googleapis/youtube";
import { globSync } from "glob";
import path from "node:path";
import { Project, SyntaxKind } from "ts-morph";
import { ALL_SONGS } from "~/features/songs/songs";
import { SongMetaDescriptor } from "~/features/songs/types";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId";

const main = async () => {
  await processSong(ALL_SONGS);
};

const processSong = async (songs: SongMetaDescriptor[]): Promise<void> => {
  const videos = songs
    .flatMap((song) => song.youtube ?? [])
    .map((x) => extractYouTubeVideoId(x.videoId))
    .filter((x): x is string => x !== undefined);

  const videoIdToPublishedData = await fetchPublishedDate(videos);

  const project = new Project({
    tsConfigFilePath: path.resolve("tsconfig.json"),
  });

  const files = globSync("app/features/songs/*/*.ts", { ignore: ["**/__snapshots__/**"] });
  for (const filepath of files) {
    try {
      await editToAddPublishedDateToSong(project, filepath, videoIdToPublishedData);
    } catch (error) {
      console.error(`Error processing file ${filepath}:`, error);
    }
  }
};

const fetchPublishedDate = async (videoIds: string[]): Promise<Record<string, NaiveDate>> => {
  const youtube = new youtube_v3.Youtube({ apiVersion: "v3", auth: process.env.YOUTUBE_API_KEY });

  const chunks = videoIds.reduce<string[][]>((result, item, index) => {
    const chunkIndex = Math.floor(index / 50);
    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }
    result[chunkIndex].push(item);
    return result;
  }, []);

  const responses = await Promise.all(
    chunks.map((chunk) => youtube.videos.list({ id: chunk, part: ["snippet"] })),
  );
  const metadata = responses.flatMap((response) => response.data.items?.map((x) => x) ?? []);

  return Object.fromEntries(
    metadata.flatMap((item) => {
      const videoId = item.id;
      const publishedAt = item.snippet?.publishedAt;
      const d = NaiveDate.parseUnsafeInJapan(publishedAt ?? "");
      if (videoId == undefined || publishedAt == undefined) {
        return [];
      }

      return [[videoId, d]];
    }),
  );
};

const editToAddPublishedDateToSong = async (
  project: Project,
  filepath: string,
  videoToDate: Record<string, NaiveDate>,
) => {
  const sourceFile = project.getSourceFileOrThrow(filepath);

  const songVar = sourceFile.getVariableDeclarations().find((decl) => {
    const t = decl.getType();
    const symbol = t.getSymbol();
    return symbol?.getName() === "SongMetaDescriptor";
  });

  if (!songVar) {
    throw new Error("SongMetaDescriptor の変数が見つかりません");
  }

  const initializer = songVar.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  // youtube: [ ... ]
  const youtubeProp = initializer
    .getPropertyOrThrow("youtube")
    .getFirstDescendantByKindOrThrow(SyntaxKind.ArrayLiteralExpression);

  // 配列要素を走査
  youtubeProp.getElements().forEach((element) => {
    if (!element.isKind(SyntaxKind.ObjectLiteralExpression)) {
      return;
    }

    const obj = element;

    // videoId を取得
    const videoIdProp = obj.getProperty("videoId");
    if (!videoIdProp) {
      return;
    }

    const videoIdStr = videoIdProp
      .getFirstDescendantByKindOrThrow(SyntaxKind.StringLiteral)
      .getLiteralText();
    const videoId = extractYouTubeVideoId(videoIdStr);
    if (videoId == undefined) {
      return;
    }

    const publishedAt = videoToDate[videoId];
    if (publishedAt == undefined) {
      return;
    }

    const publishedAtProp = obj.getProperty("publishedAt");
    if (publishedAtProp != undefined) {
      publishedAtProp.remove();
    }

    obj.addPropertyAssignment({
      name: "publishedAt",
      initializer: `"${publishedAt}"`,
    });
  });

  // 保存
  await sourceFile.save();
};

main();
