import { Statistic } from "~/components/Statistic.tsx";
import type { LiveStatsSummary as SummaryData } from "~/features/live-stats/liveStatsData.ts";

export const LiveStatsSummary = ({
  summary,
  name = "期間の概要",
  comparison,
}: {
  summary: SummaryData;
  name?: string;
  comparison?: { label: string; difference: number };
}) => {
  const metrics = [
    { label: "出演イベント数", value: summary.events, unit: "件" },
    { label: "出演日数", value: summary.days, unit: "日" },
    { label: "ワンマン", value: summary.soloStages, unit: "ステージ" },
    { label: "対バン", value: summary.jointStages, unit: "ステージ" },
  ];
  return (
    <section aria-label={name}>
      <dl className="grid gap-3 lg:grid-cols-3">
        <div className="flex flex-col justify-center rounded-2xl bg-zinc-50 px-6 py-8 sm:px-8">
          <dt className="text-sm font-medium text-zinc-500">ステージ数</dt>
          <dd className="mt-3 text-6xl font-semibold tracking-tight text-zinc-900 tabular-nums sm:text-7xl">
            {summary.stages.toLocaleString("ja-JP")}
            <span className="ml-2 text-xl font-normal tracking-normal text-zinc-500">ステージ</span>
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {metrics.map((item) => (
            <Statistic
              key={item.label}
              label={item.label}
              value={item.value.toLocaleString("ja-JP")}
              unit={item.unit}
            />
          ))}
        </div>
      </dl>
      {comparison != undefined && (
        <p className="mt-3 text-sm text-zinc-500">
          {comparison.label}より {comparison.difference > 0 ? "+" : ""}
          {comparison.difference.toLocaleString("ja-JP")}ステージ
        </p>
      )}
    </section>
  );
};
