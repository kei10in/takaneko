import { IconType } from "react-icons";
import {
  BsCameraReelsFill,
  BsCollectionPlayFill,
  BsMegaphoneFill,
  BsMicFill,
  BsMusicNoteBeamed,
  BsPersonArmsUp,
  BsPlayBtnFill,
  BsTicketPerforatedFill,
} from "react-icons/bs";
import { sectionHeading } from "~/components/styles.ts";
import { SongVideoType } from "~/features/songs/types.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId.ts";
import type { Route } from "./+types/route.ts";
import { YouTubeCard } from "./YouTubeCard.tsx";

const videoSections: { type?: SongVideoType; title: string; Icon: IconType }[] = [
  { type: "mv", title: "MV", Icon: BsPlayBtnFill },
  { type: "mv-making", title: "MV Making", Icon: BsCameraReelsFill },
  { type: "dance-performance", title: "Dance Performance Video", Icon: BsPlayBtnFill },
  { type: "dance-performance-making", title: "DPV Making", Icon: BsCameraReelsFill },
  { type: "pv", title: "Promotion Video", Icon: BsMegaphoneFill },
  { type: "singing", title: "歌ってみた", Icon: BsMicFill },
  { type: "dancing", title: "踊ってみた", Icon: BsPersonArmsUp },
  { type: "dance-practice", title: "Dance Practice Video", Icon: BsPersonArmsUp },
  { type: "live", title: "ライブ動画", Icon: BsTicketPerforatedFill },
  { type: "original", title: "オリジナル曲", Icon: BsMusicNoteBeamed },
  { title: "関連動画", Icon: BsCollectionPlayFill },
];

export const meta: Route.MetaFunction = ({ matches }) => {
  const track = matches[2].loaderData?.track;
  const title = formatTitle(track == undefined ? "楽曲が見つかりません" : `${track.name}のビデオ`);
  const description =
    track == undefined
      ? "高嶺のなでしこの楽曲の動画一覧。"
      : `高嶺のなでしこ「${track.name}」の動画一覧。MV・ダンスプラクティスなどの動画を掲載しています。`;

  return [{ title }, { name: "description", content: description }];
};

export default function Component() {
  const { track } = useSongOutletContext();
  const videos =
    track.youtube?.flatMap((video) => {
      const videoId = extractYouTubeVideoId(video.videoId);
      return videoId == undefined ? [] : [{ ...video, videoId }];
    }) ?? [];
  const sections = videoSections
    .map((section) => ({
      ...section,
      videos: videos.filter((video) => video.type === section.type),
    }))
    .filter((section) => section.videos.length > 0);

  return (
    <section aria-label="ビデオ" className="mt-8 space-y-4 px-4">
      {sections.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h2 className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}>
            <span className="flex items-center gap-2">
              <section.Icon className="shrink-0 text-gray-400" aria-hidden="true" />
              <span>{section.title}</span>
            </span>
          </h2>

          <ul className="grid grid-cols-1 space-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {section.videos.map((video) => (
              <li key={video.videoId}>
                <YouTubeCard videoId={video.videoId} publishedAt={video.publishedAt} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
