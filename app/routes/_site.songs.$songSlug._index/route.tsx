import { clsx } from "clsx";
import { Fragment } from "react";
import { BsCalendar, BsGeo, BsMicFill, BsPlayBtnFill } from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction } from "react-router";
import useSWR from "swr";
import { Breadcrumb } from "~/components/Breadcrumb";
import { pageHeading, sectionHeading } from "~/components/styles";
import { liveTypeColor } from "~/features/events/EventType";
import { SongMeta } from "~/features/songs/SongMeta";
import { ALL_SONGS } from "~/features/songs/songs";
import { LivesForSong } from "~/features/songs/types";
import { AllYouTubeVideoMetadata } from "~/features/songs/youtubeVideoMetadata";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId";
import type { Route } from "./+types/route";
import { Credit } from "./Credit";
import { LiveSkeleton } from "./LiveSkeleton";
import { YouTubeCard } from "./YouTubeCard";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = formatTitle(data?.track.name ?? "楽曲が見つかりません");

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

  const youtubeEmbedUrl = SongMeta.youtubeEmbedUrl(track);

  return (
    <div>
      <div className="bg-zinc-900">
        <div className="container mx-auto lg:max-w-5xl">
          {youtubeEmbedUrl == undefined ? null : (
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

        <section className="px-4 py-8">
          <h1 className={pageHeading()}>{track.name}</h1>

          {track.digitalRelease && (
            <p className="text-nadeshiko-700 mt-1 text-sm">
              {track.digitalRelease.replace(/-/g, ".")} <span className="">release</span>
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
                    <YouTubeCard
                      videoId={videoId}
                      publishedAt={yt.publishedAt}
                      metadata={AllYouTubeVideoMetadata[videoId]}
                    />
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
                      <div className="flex items-stretch gap-2 p-1">
                        <div
                          className={clsx("w-1 flex-none rounded-full", liveTypeColor(e.liveType))}
                        />
                        <div className="text-xs">
                          <p className="text-sm">
                            <Link to={`/events/${e.slug}`}>
                              {segment.actTitle ? `${e.title} - ${segment.actTitle}` : e.title}
                            </Link>
                          </p>
                          <p className="flex items-center gap-1 text-gray-400">
                            <BsCalendar className="inline flex-none text-xs" />
                            <span className="line-clamp-1">{displayDateWithDayOfWeek(e.date)}</span>
                          </p>
                          <p className="flex items-center gap-1 text-gray-400">
                            <BsGeo className="inline flex-none text-xs" />
                            <span className="line-clamp-1">
                              {e.region} {e.location}
                            </span>
                          </p>
                          <p className="flex items-center gap-1 text-gray-400">
                            <span>
                              {segment.section == "main" ? "M" : "EN"}
                              {(segment.index + 1).toString().padStart(2, "0")}
                            </span>
                            {" / "}
                            <span className="line-clamp-1">
                              {segment.costumeName || "衣装不明"}
                            </span>
                          </p>
                        </div>
                      </div>
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
