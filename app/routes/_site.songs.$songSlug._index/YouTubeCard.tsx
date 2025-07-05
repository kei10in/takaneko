import { BsExclamationTriangleFill } from "react-icons/bs";
import { Link } from "react-router";
import useSWR from "swr";
import { YouTubeVideoMetadata } from "~/utils/youtube/types";
import { YouTubeImage, youtubeImage } from "~/utils/youtube/youtubeImage";
import { fetchYouTubeOEmbed } from "~/utils/youtube/youtubeOEmbed";

interface Props {
  videoId: string;
  metadata?: YouTubeVideoMetadata;
}

interface CardProps {
  videoId: string;
  title: string;
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
}

const metadataToCardProps = (videoId: string, metadata: YouTubeVideoMetadata): CardProps => {
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

  const thumbnailType = priorities.find((x) => metadata.thumbnails.includes(x)) ?? "hqDefaultJpeg";
  const thumbnailUrl = imgs[thumbnailType].url;

  return {
    videoId,
    title: metadata.title,
    authorName: metadata.authorName,
    authorUrl: metadata.authorUrl,
    thumbnailUrl: thumbnailUrl,
  };
};

const fetchCardProps = async (videoId: string): Promise<CardProps> => {
  console.log(videoId);

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

export const YouTubeCard: React.FC<Props> = ({ videoId, metadata }: Props) => {
  const { data, error, isLoading } = useSWR(metadata == undefined ? videoId : null, fetchCardProps);

  const yt = metadata != undefined ? metadataToCardProps(videoId, metadata) : data;

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

  return (
    <div className="w-full p-1">
      <div>
        <Link
          className="hover:text-nadeshiko-800"
          to={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="aspect-video w-full rounded-xl object-cover"
            src={yt.thumbnailUrl}
            alt={yt.title}
          />
        </Link>
      </div>
      <div>
        <div className="space-y-0.5 px-1 py-2">
          <p className="line-clamp-2 text-base leading-snug text-gray-800">
            <Link
              className="hover:text-nadeshiko-800"
              to={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {yt.title}
            </Link>
          </p>
          <p className="line-clamp-1 text-xs text-gray-400">
            <Link to={yt.authorUrl} target="_blank" rel="noopener noreferrer">
              {yt.authorName}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
