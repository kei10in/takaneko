import { BsExclamationTriangleFill } from "react-icons/bs";
import { Link } from "react-router";
import useSWR from "swr";
import { fetchYouTubeOEmbed } from "~/features/songs/youtubeOEmbed";

interface Props {
  videoId: string;
}

export const YouTubeCard: React.FC<Props> = ({ videoId }: Props) => {
  const { data: yt, error, isLoading } = useSWR(videoId, fetchYouTubeOEmbed);

  if (isLoading) {
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

  if (error) {
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
            src={yt.thumbnail_url}
            alt={yt.title}
          />
        </Link>
      </div>
      <div>
        <div className="space-y-1 px-1 py-2">
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
            <Link to={yt.author_url} target="_blank" rel="noopener noreferrer">
              {yt.author_name}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
