import { MetaFunction, useLoaderData } from "react-router";
import { Statistic } from "~/components/Statistic.tsx";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { Original, Repertoire, TakanekoVersion } from "~/features/songs/tags.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲統計") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の統計情報です。",
    },
  ];
};

export const loader = () => {
  const repertoire = ALL_SONGS.filter((song) =>
    song.tags?.some((tag) => tag.key === Repertoire.key),
  );
  const breakdown = [Original, TakanekoVersion].map((category) => ({
    label: category.name,
    count: repertoire.filter((song) => song.tags?.some((tag) => tag.key === category.key)).length,
  }));

  return { total: repertoire.length, breakdown };
};

export default function Component() {
  const { total, breakdown } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="page-box px-4">
        <h1 className="page-heading">楽曲統計</h1>
        <section aria-labelledby="summary-heading" className="mt-8 space-y-5">
          <h2 id="summary-heading" className="section-heading">
            サマリー
          </h2>
          <dl className="grid gap-3 lg:grid-cols-3">
            <div className="flex flex-col justify-center rounded-2xl bg-zinc-50 px-6 py-8 sm:px-8">
              <dt className="text-sm font-medium text-zinc-500">持ち歌数</dt>
              <dd className="mt-3 text-6xl font-semibold tracking-tight text-zinc-900 tabular-nums sm:text-7xl">
                {total.toLocaleString("ja-JP")}
                <span className="ml-2 text-xl font-normal tracking-normal text-zinc-500">曲</span>
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {breakdown.map(({ label, count }) => (
                <Statistic
                  key={label}
                  label={label}
                  value={count.toLocaleString("ja-JP")}
                  unit="曲"
                />
              ))}
            </div>
          </dl>
        </section>
      </section>
    </div>
  );
}
