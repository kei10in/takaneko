import { useMemo } from "react";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
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

  return (
    <div className="container mx-auto lg:max-w-5xl">
      {data.youtube?.[0] == undefined ? null : (
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${data.youtube[0].videoId}`}
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
            {lives.map((e, i) => (
              <li key={i}>
                <Link to={`/events/${e.slug}`}>
                  {displayDateWithDayOfWeek(e.meta.date)} {e.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
