import { MetaFunction, useLoaderData, useSearchParams } from "react-router";
import { calculateChartDimensions } from "~/components/charts/scale.ts";
import { sumChartValues } from "~/components/charts/stackedBarChartData.ts";
import { Statistic } from "~/components/Statistic.tsx";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { Repertoire } from "~/features/songs/tags.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { RepertoireDensity } from "./RepertoireDensity.tsx";
import { buildRepertoireDensityData } from "./repertoireDensityData.ts";
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
      density: buildRepertoireDensityData(dates, today.naiveMonth()),
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
    densityScale: calculateChartDimensions(densityMax),
  };
};

export default function Component() {
  const { total, breakdown, dateBasis, history, density, historyScale, densityScale } =
    useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();

  const selectDate = (field: typeof dateBasis.field) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        next.set("date", field);
        return next;
      },
      { preventScrollReset: true },
    );
  };

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
        <fieldset className="mt-10 min-w-0">
          <legend className="sr-only">集計に使う日付</legend>
          <div className="hidden-scrollbar pill-tab-list py-2">
            {repertoireDateOptions.map(({ field, shortLabel }) => (
              <label
                key={field}
                data-active={dateBasis.field === field ? "" : undefined}
                className="pill-tab relative cursor-pointer has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-nadeshiko-600"
              >
                <input
                  type="radio"
                  name="song-stats-date"
                  value={field}
                  checked={dateBasis.field === field}
                  onChange={() => selectDate(field)}
                  className="sr-only"
                />
                <span className="pill-tab-label">{shortLabel}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <section aria-labelledby="repertoire-history-heading" className="mt-6 px-4">
          <h2 id="repertoire-history-heading" className="section-heading mb-4">
            持ち歌の追加数
          </h2>
          <RepertoireHistory
            data={history}
            countLabel={dateBasis.count}
            yAxisScale={historyScale}
          />
        </section>
        <section aria-labelledby="repertoire-density-heading" className="mt-12 px-4">
          <h2 id="repertoire-density-heading" className="section-heading mb-4">
            持ち歌追加の密度分布
          </h2>
          <RepertoireDensity data={density} dateBasis={dateBasis} yAxisScale={densityScale} />
        </section>
      </section>
    </div>
  );
}
