import clsx from "clsx";
import { Fragment, useMemo } from "react";
import { BsCalendar, BsGeo, BsMicFill, BsPlayBtnFill } from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction } from "react-router";
import { liveTypeColor } from "~/features/events/EventType";
import { SongMeta } from "~/features/songs/SongMeta";
import { ALL_SONGS } from "~/features/songs/songs";
import { SongToLiveMap } from "~/features/songs/songToLive";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId";
import { Route } from "./+types/route";
import { Credit } from "./Credit";
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

  const lives = useMemo(() => (SongToLiveMap[track.name]?.events ?? []).toReversed(), [track.name]);

  const youtubeEmbedUrl = SongMeta.youtubeEmbedUrl(track);

  return (
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

      <section className="my-8 px-4">
        <h1 className="text-nadeshiko-800 my-4 text-5xl font-semibold lg:mt-12">{track.name}</h1>

        <div>
          <Credit song={track} />
        </div>

        <section>
          <h2 className="sticky top-0 mt-4 bg-white/90 py-2 text-2xl text-gray-800 lg:top-[var(--header-height)]">
            <span className="flex items-center gap-2">
              <BsPlayBtnFill className="inline-block text-gray-400" />
              <span>ビデオ</span>
            </span>
          </h2>
          <ul className="grid grid-cols-1 space-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {track.youtube?.map((yt) => {
              const videoId = extractYouTubeVideoId(yt.videoId);
              if (videoId == undefined) {
                return null;
              }

              return (
                <li key={videoId}>
                  <YouTubeCard videoId={videoId} />
                </li>
              );
            }) ?? null}
          </ul>
        </section>

        <section>
          <div className="sticky top-0 mt-2 bg-white/90 py-2 text-2xl text-gray-800 lg:top-[var(--header-height)]">
            <span className="flex items-center gap-2">
              <BsMicFill className="inline-block text-gray-400" />
              <span>ライブ</span>
            </span>
          </div>
          <ul className="space-y-1">
            {lives.map(({ recaps, event: e }, i) => (
              <Fragment key={i}>
                {recaps.map((recap, j) => (
                  <li key={j}>
                    <div className="flex items-stretch gap-2 p-1">
                      <div
                        className={clsx(
                          "w-1 flex-none rounded-full",
                          liveTypeColor(e.meta.liveType),
                        )}
                      />
                      <div className="text-sm">
                        <p>
                          <Link to={`/events/${e.slug}`}>
                            {recap.title ? `${e.meta.title} - ${recap.title}` : e.meta.title}
                          </Link>
                        </p>
                        <p className="flex items-center gap-1 text-gray-400">
                          <BsCalendar className="inline flex-none text-xs" />
                          <span className="line-clamp-1">
                            {displayDateWithDayOfWeek(e.meta.date)}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-gray-400">
                          <BsGeo className="inline flex-none text-xs" />
                          <span className="line-clamp-1">
                            {e.meta.region} {e.meta.location}
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
  );
}
