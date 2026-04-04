import { BsExclamationTriangleFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useSWR from "swr";
import { type YouTubeImage, youtubeImage } from "~/utils/youtube/youtubeImage";
import { fetchYouTubeOEmbed } from "~/utils/youtube/youtubeOEmbed";

interface Props {
  videoId: string;
  publishedAt: string;
}

interface CardProps {
  videoId: string;
  title: string;
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
}

const getPrioritizedThumbnailUrls = (videoId: string, thumbnailUrl?: string): string[] => {
  const imgs = youtubeImage(videoId);
  const priorities: (keyof YouTubeImage)[] = [
    "maxResDefault",
    "maxResDefaultJpeg",
    "sdDefault",
    "sdDefaultJpeg",
    "hqDefault",
    "hqDefaultJpeg",
    "mqDefault",
    "mqDefaultJpeg",
    "default",
    "defaultJpeg",
  ];

  return [
    ...priorities.map((priority) => imgs[priority].url),
    thumbnailUrl,
  ].filter((url, index, list): url is string => {
    return url != undefined && list.indexOf(url) === index;
  });
};

const fetchCardProps = async (videoId: string): Promise<CardProps> => {
  const oEmbed = await fetchYouTubeOEmbed(videoId);
  if (oEmbed == undefined) {
    throw new Error("Failed to fetch YouTube OEmbed data");
  }

  return {
    videoId,
    title: oEmbed.title,
    authorName: oEmbed.author_name,
    authorUrl: oEmbed.author_url,
    thumbnailUrl: oEmbed.thumbnail_url,
  };
};

export const YouTubeCard: React.FC<Props> = (props: Props) => {
  const { videoId, publishedAt } = props;
  const { data: yt, error, isLoading } = useSWR(videoId, fetchCardProps);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  useEffect(() => {
    setThumbnailIndex(0);
  }, [videoId, yt?.thumbnailUrl]);

  if (yt == undefined && isLoading) {
    return (
      <div className="w-full animate-pulse p-1">
        <div>
          <div className="aspect-video w-full rounded-xl bg-gray-200" />
        </div>
        <div>
          <div className="space-y-1 py-2">
            <p className="h-4 w-4/5 rounded-full bg-gray-200 py-0.75"></p>
            <p className="line-clamp-1 flex h-3 w-1/3 items-center gap-1 rounded-full bg-gray-200 p-0.5"></p>
            <p className="line-clamp-1 flex h-3 w-1/4 items-center gap-1 rounded-full bg-gray-200 p-0.5"></p>
          </div>
        </div>
      </div>
    );
  }

  if (yt == undefined && error) {
    return (
      <div className="w-full p-1">
        <div>
          <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-200">
            <BsExclamationTriangleFill className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div>
          <div className="space-y-1 py-2">
            <p className="mt-line-clamp-2 text-base leading-snug text-gray-800">
              エラーが発生しました
            </p>
            <p className="line-clamp-1 text-xs text-gray-400">videoId = {videoId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (yt == undefined) {
    return (
      <div className="w-full p-1">
        <div>
          <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-200">
            <BsExclamationTriangleFill className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div>
          <div className="space-y-1 py-2">
            <p className="mt-line-clamp-2 text-base leading-snug text-gray-800">
              エラーが発生しました
            </p>
            <p className="line-clamp-1 text-xs text-gray-400">videoId = {videoId}</p>
          </div>
        </div>
      </div>
    );
  }

  const thumbnailUrls = getPrioritizedThumbnailUrls(videoId, yt.thumbnailUrl);
  const thumbnailUrl = thumbnailUrls[thumbnailIndex] ?? yt.thumbnailUrl;

  return (
    <div className="w-full p-1">
      <Link
        className="hover:text-nadeshiko-800 block overflow-hidden rounded-xl"
        to={`https://youtu.be/${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="bg-nadeshiko-100 text-nadeshiko-600 aspect-video w-full object-cover text-sm"
          src={thumbnailUrl}
          alt={yt.title}
          onError={() => {
            setThumbnailIndex((current) => {
              if (current >= thumbnailUrls.length - 1) {
                return current;
              }
              return current + 1;
            });
          }}
        />
      </Link>
      <div>
        <div className="space-y-0.5 px-1 py-2">
          <Link
            className="hover:text-nadeshiko-800 line-clamp-2 block text-base leading-snug text-gray-800"
            to={`https://youtu.be/${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {yt.title}
          </Link>

          <Link
            className="line-clamp-1 block w-fit text-xs text-gray-400"
            to={yt.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {yt.authorName}
          </Link>

          <p className="line-clamp-1 block w-fit text-xs text-gray-400">
            {publishedAt.replace(/-/g, ".")}
          </p>
        </div>
      </div>
    </div>
  );
};
