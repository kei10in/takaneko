import { Fragment } from "react";
import {
  BsBarChartLineFill,
  BsMicFill,
  BsPersonStandingDress,
  BsPlayBtnFill,
} from "react-icons/bs";
import { useOutletContext } from "react-router";
import useSWR from "swr";
import { CostumeBarChart } from "~/components/charts/CostumeBarChart.tsx";
import { sectionHeading } from "~/components/styles.ts";
import { LivesForSong, SongMetaDescriptor } from "~/features/songs/types.ts";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId.ts";
import { LiveCard } from "./LiveCard.tsx";
import { LiveSkeleton } from "./LiveSkeleton.tsx";
import { YouTubeCard } from "./YouTubeCard.tsx";

export default function Component() {
  const track = useOutletContext<SongMetaDescriptor>();

  const { data: performances, isLoading } = useSWR(`songs/${track.slug}/lives.json`, async () => {
    const response = await fetch(`/data/songs/${track.slug}/lives.json`);
    if (!response.ok) {
      return undefined;
    }

    const json = await response.json();
    const result = LivesForSong.safeParse(json);
    if (result.error) {
      return undefined;
    }
    return result.data;
  });

  const lives = performances?.lives ?? [];
  const costumeStats = performances?.costumeStats ?? [];

  return (
    <>
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

      <section className="mt-8">
        <h2 className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}>
          <span className="flex items-center gap-2">
            <BsPersonStandingDress className="inline-block text-gray-400" />
            <span>衣装</span>
          </span>
        </h2>

        <p>この楽曲のときの衣装を、使用回数が多い順に表示しています。</p>

        <div className="mt-4 space-y-2 px-1">
          {isLoading && (
            <div className="flex h-40 w-full items-center justify-center">
              <BsBarChartLineFill className="h-12 w-12 animate-pulse text-gray-300" />
            </div>
          )}
          {!isLoading && costumeStats.length == 0 && (
            <p className="p-1 text-gray-500">この楽曲を披露したライブが見つかりませんでした。</p>
          )}
          {!isLoading && costumeStats.length > 0 && (
            <CostumeBarChart
              costume={costumeStats.map(({ costumeName, count }) => ({
                costumeName,
                value: count,
              }))}
            />
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2
          className={sectionHeading("sticky top-0 z-10 bg-white/90 py-2 lg:top-(--header-height)")}
        >
          <span className="flex items-center gap-2">
            <BsMicFill className="inline-block text-gray-400" />
            <span>ライブ</span>
          </span>
        </h2>

        <ul className="mt-4 space-y-2">
          {isLoading &&
            [1, 2, 3].map((x) => (
              <li key={x}>
                <LiveSkeleton />
              </li>
            ))}
          {!isLoading && lives.length == 0 && (
            <li>
              <p className="p-1 text-gray-500">この楽曲を披露したライブが見つかりませんでした。</p>
            </li>
          )}
          {lives.map(({ segments, event: e }, i) => (
            <Fragment key={i}>
              {segments.map((segment, j) => (
                <li key={j}>
                  <LiveCard event={e} segment={segment} />
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </section>
    </>
  );
}
