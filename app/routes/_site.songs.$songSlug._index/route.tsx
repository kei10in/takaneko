import clsx from "clsx";
import { Fragment, useMemo } from "react";
import { BsCalendar, BsGeo } from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { liveTypeColor } from "~/features/events/EventType";
import { SongMeta } from "~/features/songs/SongMeta";
import { ALL_SONGS } from "~/features/songs/songs";
import { SongToLiveMap } from "~/features/songs/songToLive";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = formatTitle(data?.name ?? "楽曲が見つかりません");

  return [{ title }, { name: "description", content: "高嶺のなでしこの楽曲" }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { songSlug } = params;

  if (songSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const meta = ALL_SONGS.find((x) => x.slug === songSlug);

  if (meta == undefined) {
    throw new Response("", { status: 404 });
  }

  return meta;
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  const lives = useMemo(() => (SongToLiveMap[data.name] ?? []).toReversed(), [data.name]);

  const youtubeEmbedUrl = SongMeta.youtubeEmbedUrl(data);

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

      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">{data.name}</h1>

        <section>
          <h2 className="mt-4 mb-2 text-2xl">ライブ</h2>
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
