import { Fragment } from "react";
import {
  BsBarChartLineFill,
  BsMicFill,
  BsPersonStandingDress,
  BsPlayBtnFill,
} from "react-icons/bs";
import { LoaderFunctionArgs, MetaFunction } from "react-router";
import useSWR from "swr";
import { Breadcrumb } from "~/components/Breadcrumb.tsx";
import { CostumeBarChart } from "~/components/charts/CostumeBarChart.tsx";
import { sectionHeading } from "~/components/styles.ts";
import { SongMeta } from "~/features/songs/SongMeta.ts";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { LivesForSong } from "~/features/songs/types.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId.ts";
import type { Route } from "./+types/route.ts";
import { Credit } from "./Credit.tsx";
import { LiveCard } from "./LiveCard.tsx";
import { LiveSkeleton } from "./LiveSkeleton.tsx";
import { YouTubeCard } from "./YouTubeCard.tsx";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const title = formatTitle(loaderData?.track.name ?? "楽曲が見つかりません");

  return [{ title }, { name: "description", content: "高嶺のなでしこの楽曲" }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { songSlug } = params;

  if (songSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const track = ALL_SONGS.find((x) => x.slug === songSlug);

  if (track == undefined) {
    throw new Response("", { status: 404 });
  }

  return { track };
};

export default function Component({ loaderData }: Route.ComponentProps) {
  const { track } = loaderData;

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

  const youtubeEmbedUrl = SongMeta.youtubeEmbedUrl(track);

  return (
    <div>
      <div className="bg-zinc-900">
        <div className="container mx-auto lg:max-w-5xl">
          {youtubeEmbedUrl == undefined ? null : (
            // YouTube の公式プレイヤーの再生・認証機能を維持するため sandbox は指定しません。
            // oxlint-disable-next-line react/iframe-missing-sandbox
            <iframe
              className="aspect-video w-full"
              src={youtubeEmbedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </div>

      <div className="container mx-auto lg:max-w-5xl">
        <div className="px-4 py-4">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "楽曲", to: "/songs" },
            ]}
          />
        </div>

        <section className="px-4 py-20">
          <h1 className="page-heading">{track.name}</h1>

          {track.digitalRelease && (
            <p className="mt-1 text-sm text-nadeshiko-700">
              {track.digitalRelease.replace(/-/gu, ".")} <span className="">release</span>
            </p>
          )}

          <div className="mt-8">
            <Credit song={track} />
          </div>

          <section className="mt-8">
            <h2
              className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}
            >
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
            <h2
              className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}
            >
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
                <p className="p-1 text-gray-500">
                  この楽曲を披露したライブが見つかりませんでした。
                </p>
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
              className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}
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
                  <p className="p-1 text-gray-500">
                    この楽曲を披露したライブが見つかりませんでした。
                  </p>
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
        </section>
      </div>
    </div>
  );
}
