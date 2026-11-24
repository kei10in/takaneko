import { HiChevronDown } from "react-icons/hi2";
import { MetaFunction, useLoaderData, useSearchParams } from "react-router";
import { calculateChartDimensions } from "~/components/charts/scale.ts";
import { sumChartValues } from "~/components/charts/stackedBarChartData.ts";
import { Statistic } from "~/components/Statistic.tsx";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { Repertoire } from "~/features/songs/tags.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { RepertoireDensity } from "./RepertoireDensity.tsx";
import {
  buildRepertoireDensityData,
  repertoireDensityDisplayDays,
} from "./repertoireDensityData.ts";
import { RepertoireHistory } from "./RepertoireHistory.tsx";
import {
  buildRepertoireHistoryData,
  listRepertoireDates,
  repertoireDateOptions,
  repertoireSeries,
} from "./repertoireHistoryData.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲統計") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の統計情報です。",
    },
  ];
};

export const loader = ({ request }: { request: Request }) => {
  const field = new URL(request.url).searchParams.get("date");
  const repertoire = ALL_SONGS.filter((song) =>
    song.tags?.some((tag) => tag.key === Repertoire.key),
  );
  const breakdown = repertoireSeries.map(({ category }) => ({
    label: category.name,
    count: repertoire.filter((song) => song.tags?.some((tag) => tag.key === category.key)).length,
  }));
  const today = NaiveDate.todayInJapan();
  const charts = repertoireDateOptions.map((dateBasis) => {
    const dates = listRepertoireDates(repertoire, dateBasis.field, today);
    return {
      dateBasis,
      history: buildRepertoireHistoryData(dates, today),
      density: buildRepertoireDensityData(dates, today),
    };
  });
  const selected = charts.find(({ dateBasis }) => dateBasis.field === field) ?? charts[0];
  const historyMax = Math.max(
    0,
    ...charts.flatMap(({ history }) =>
      [...history.career, ...history.calendar].map(({ values }) => sumChartValues(values) ?? 0),
    ),
  );
  const densityMax = Math.max(
    0,
    ...charts.flatMap(({ density }) => density.map(({ values }) => sumChartValues(values) ?? 0)),
  );

  return {
    total: repertoire.length,
    breakdown,
    ...selected,
    historyScale: calculateChartDimensions(historyMax),
    densityScale: calculateChartDimensions(densityMax * repertoireDensityDisplayDays),
  };
};

export default function Component() {
  const { total, breakdown, dateBasis, history, density, historyScale, densityScale } =
    useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="page-box">
        <h1 className="page-heading px-4">楽曲統計</h1>
        <section aria-labelledby="summary-heading" className="mt-8 space-y-5 px-4">
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
        <div className="mt-12 px-4">
          <label className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            集計に使う日付
            <span className="relative block shrink-0">
              <select
                value={dateBasis.field}
                onChange={(event) => {
                  const field = event.currentTarget.value;
                  setSearchParams(
                    (params) => {
                      const next = new URLSearchParams(params);
                      next.set("date", field);
                      return next;
                    },
                    { preventScrollReset: true },
                  );
                }}
                className="h-10 appearance-none rounded-full bg-zinc-100 pr-10 pl-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 forced-colors:appearance-auto"
              >
                {repertoireDateOptions.map(({ field, label }) => (
                  <option key={field} value={field}>
                    {label}
                  </option>
                ))}
              </select>
              <HiChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500 forced-colors:hidden"
              />
            </span>
          </label>
        </div>
        <section aria-labelledby="repertoire-history-heading" className="mt-6 px-4">
          <h2 id="repertoire-history-heading" className="section-heading mb-4">
            {dateBasis.count}
          </h2>
          <RepertoireHistory
            data={history}
            countLabel={dateBasis.count}
            yAxisScale={historyScale}
          />
        </section>
        <section aria-labelledby="repertoire-density-heading" className="mt-12 px-4">
          <h2 id="repertoire-density-heading" className="section-heading mb-4">
            {dateBasis.activity}の密度分布
          </h2>
          <RepertoireDensity
            key={dateBasis.field}
            data={density}
            dateBasis={dateBasis}
            yAxisScale={densityScale}
          />
        </section>
      </section>
    </div>
  );
}
