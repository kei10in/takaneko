import { BsPlayBtnFill } from "react-icons/bs";
import { sectionHeading } from "~/components/styles.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId.ts";
import type { Route } from "./+types/route.ts";
import { YouTubeCard } from "./YouTubeCard.tsx";

export const meta: Route.MetaFunction = ({ matches }) => {
  const track = matches[2].loaderData?.track;
  const title = formatTitle(track?.name ?? "楽曲が見つかりません");
  const description =
    track == undefined
      ? "高嶺のなでしこの楽曲情報。"
      : `高嶺のなでしこ「${track.name}」の楽曲情報。MV・ダンスプラクティスなどの動画、制作クレジットやリリース情報を掲載しています。`;

  return [{ title }, { name: "description", content: description }];
};

export default function Component() {
  const { track } = useSongOutletContext();

  return (
    <section className="mt-8">
      <h2 className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}>
        <span className="flex items-center gap-2">
          <BsPlayBtnFill className="inline-block text-gray-400" />
          <span>ビデオ</span>
        </span>
      </h2>

      <ul className="mt-4 grid grid-cols-1 space-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {track.youtube?.map((yt) => {
          const videoId = extractYouTubeVideoId(yt.videoId);
          if (videoId == undefined) {
            return null;
          }

          return (
            <li key={videoId}>
              <YouTubeCard videoId={videoId} publishedAt={yt.publishedAt} />
            </li>
          );
        }) ?? null}
      </ul>
    </section>
  );
}
