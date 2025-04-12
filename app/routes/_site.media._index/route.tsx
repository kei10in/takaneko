import { BsYoutube } from "react-icons/bs";
import { Link, MetaFunction, useLoaderData } from "react-router";
import { YouTube2022 } from "~/features/media/2022/youtube";
import { YouTube2023 } from "~/features/media/2023/youtube";
import { YouTube2024 } from "~/features/media/2024/youtube";
import { YouTube2025 } from "~/features/media/2025/youtube";
import { YouTubeVideoMetadata } from "~/features/media/types";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";
import { validateYouTubeOEmbedResponse } from "~/utils/youtube/youtubeOEmbed";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("出演情報") },
    {
      name: "description",
      content: "高嶺のなでしこが出演しているメディアの一覧です。",
    },
  ];
};

export const loader = async () => {
  const oEmbedEndpoint = "https://www.youtube.com/oembed";

  const metadataPromises = [...YouTube2025, ...YouTube2024, ...YouTube2023, ...YouTube2022].map(
    async (video) => {
      const url = `${oEmbedEndpoint}?url=https://www.youtube.com/watch?v=${video.videoId}&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        return [];
      }
      const jsonData = await response.json();

      // Validate the response using the validate function
      const data = validateYouTubeOEmbedResponse(jsonData);
      if (!data) {
        return [];
      }

      return [
        {
          kind: "youtube",
          videoId: video.videoId,
          title: data.title,
          publishedAt: video.publishedAt,
          channelTitle: data.author_name,
          channelUrl: data.author_url,
          thumbnailUrl: data.thumbnail_url,
        } satisfies YouTubeVideoMetadata,
      ];
    },
  );

  const metadata = (await Promise.all(metadataPromises)).flatMap((x) => x);
  return metadata;
};

export default function MediaIndex() {
  const metadata = useLoaderData<YouTubeVideoMetadata[]>();

  return (
    <div className="container mx-auto max-w-3xl">
      <section className="p-4">
        <h1 className="text-nadeshiko-800 my-4 text-5xl font-semibold lg:mt-12">メディア</h1>
        <ul className="max-w-2xl space-y-6">
          {metadata.map((video) => {
            return (
              <li key={video.videoId}>
                <Link
                  to={`https://youtu.be/${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600"
                >
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <h2 className="text-md line-clamp-3 font-semibold">{video.title}</h2>
                      <p className="line-clamp-1 text-sm text-gray-600">
                        <BsYoutube className="mr-2 inline" />
                        {video.channelTitle}
                      </p>
                      <p className="line-clamp-1 text-sm text-gray-600">
                        {displayDate(NaiveDate.parseUnsafe(video.publishedAt))}
                      </p>
                    </div>
                    <div className="max-h-32 w-32 flex-none">
                      <img src={video.thumbnailUrl} alt={video.title} className="object-contain" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
