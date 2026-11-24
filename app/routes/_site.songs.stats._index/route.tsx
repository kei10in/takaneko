import { MetaFunction, useLoaderData, useSearchParams } from "react-router";
import { calculateChartDimensions } from "~/components/charts/scale.ts";
import { sumChartValues } from "~/components/charts/stackedBarChartData.ts";
import { Statistic } from "~/components/Statistic.tsx";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { Repertoire } from "~/features/songs/tags.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { repertoireDateOptions, type RepertoireDateOption } from "./repertoireDateOptions.ts";
import { RepertoireDensity } from "./RepertoireDensity.tsx";
import { buildRepertoireDensityData } from "./repertoireDensityData.ts";
import { RepertoireHistory } from "./RepertoireHistory.tsx";
import {
  buildRepertoireHistoryData,
  listRepertoireDates,
  repertoireDateFields,
  repertoireSeries,
  type RepertoireDateField,
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
  const charts = repertoireDateFields.map((dateField: RepertoireDateField) => {
    const dates = listRepertoireDates(repertoire, dateField, today);
    return {
      dateField,
      history: buildRepertoireHistoryData(dates, today),
      density: buildRepertoireDensityData(dates, today.naiveMonth()),
    };
  });
  const selected = charts.find(({ dateField }) => dateField === field) ?? charts[0];
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
  const { total, breakdown, dateField, history, density, historyScale, densityScale } =
    useLoaderData<typeof loader>();
  const dateOption: RepertoireDateOption = repertoireDateOptions[dateField];
  const [, setSearchParams] = useSearchParams();

  const selectDate = (field: RepertoireDateField) => {
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
        <p className="page-description mt-2 px-4">
          楽曲のリリース状況に関する統計を確認できます。
        </p>{" "}
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
          <legend className="sr-only">リリース日として扱う日付</legend>
          <div className="hidden-scrollbar pill-tab-list py-2">
            {repertoireDateFields.map((field: RepertoireDateField) => (
              <label
                key={field}
                data-active={dateField === field ? "" : undefined}
                className="pill-tab relative cursor-pointer has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-nadeshiko-600"
              >
                <input
                  type="radio"
                  name="song-stats-date"
                  value={field}
                  checked={dateField === field}
                  onChange={() => selectDate(field)}
                  className="sr-only"
                />
                <span className="pill-tab-label">{repertoireDateOptions[field].displayName}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="line-clamp-2 min-h-[2lh] px-6 text-zinc-500">{dateOption.description}</p>
        <section aria-labelledby="repertoire-history-heading" className="mt-8 px-4">
          <h2 id="repertoire-history-heading" className="section-heading mb-4">
            リリース数
          </h2>
          <RepertoireHistory
            data={history}
            chartNames={dateOption.historyChartNames}
            yAxisScale={historyScale}
          />
        </section>
        <section aria-labelledby="repertoire-density-heading" className="mt-12 px-4">
          <h2 id="repertoire-density-heading" className="section-heading mb-4">
            リリース密度
          </h2>
          <RepertoireDensity
            data={density}
            chartName={dateOption.densityChartName}
            yAxisScale={densityScale}
          />
        </section>
      </section>
    </div>
  );
}
