import { ReactNode } from "react";
import { BsBarChartLineFill } from "react-icons/bs";
import { HiArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router";
import { CostumeBarChart } from "~/components/charts/CostumeBarChart.tsx";
import { sectionHeading } from "~/components/styles.ts";
import { calculateSongStatistics, elapsedSince } from "~/features/songs/statistics.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { PerformanceHistory } from "./PerformanceHistory.tsx";
import { useBrowserToday } from "./useBrowserToday.ts";

const number = (value: number) => value.toLocaleString("ja-JP");
const dateLabel = (date: string) => date.replaceAll("-", ".");
const relativeDay = (date: string, today: NaiveDate) => {
  const days = today.differenceInDays(NaiveDate.parseUnsafe(date));
  return days === 0 ? "今日" : days > 0 ? `${number(days)} 日前` : `${number(-days)} 日後`;
};

export default function Component() {
  const { performances, isLoading } = useSongOutletContext();
  const today = useBrowserToday();

  if (isLoading || today == undefined) {
    return (
      <output className="flex flex-col items-center gap-3 py-20 text-sm text-zinc-500">
        <BsBarChartLineFill className="size-10 animate-pulse text-zinc-300" aria-hidden="true" />
        <span>統計データを読み込んでいます…</span>
      </output>
    );
  }
  if (performances == undefined) {
    return <p className="py-12 text-center text-zinc-500">統計データを読み込めませんでした。</p>;
  }

  const statistics = calculateSongStatistics(performances);
  const first = statistics.first;
  const elapsed = first == undefined ? undefined : elapsedSince(first.date, today);
  const latest = statistics.latest;
  const firstEvent = first?.events.at(0);
  const latestEvent = latest?.events.at(0);
  const rate = performances.recentPerformanceRate;
  const ranking = performances.performanceRanking;
  const intervals = statistics.intervals;

  return (
    <div className="mt-8 space-y-12">
      <section aria-label="サマリー">
        <h2 className={sectionHeading("mb-4")}>サマリー</h2>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Statistic label="累計披露回数" value={number(statistics.performanceCount)} unit="回" />
          <Statistic label="累計披露公演数" value={number(statistics.eventCount)} unit="公演" />
          <Statistic
            label="披露回数順位"
            value={ranking == undefined ? "—" : number(ranking.rank)}
            unit={ranking == undefined ? undefined : "位"}
            detail={
              ranking == undefined
                ? "集計データがありません。"
                : `全 ${number(ranking.songCount)} 曲`
            }
          />
          <Statistic
            label="直近の披露率"
            value={
              rate == undefined || rate.eventCount === 0
                ? "—"
                : ((rate.performedCount / rate.eventCount) * 100).toFixed(1)
            }
            unit={rate == undefined || rate.eventCount === 0 ? undefined : "%"}
            detail={
              rate == undefined
                ? "集計データがありません。"
                : rate.eventCount === 0
                  ? "集計対象の公演がありません。"
                  : `${rate.performedCount} / ${rate.eventCount} 公演`
            }
          />
          <Statistic
            label="最近の披露"
            to={latestEvent == undefined ? undefined : `/events/${latestEvent.slug}`}
            value={
              latest == undefined ? (
                "記録なし"
              ) : (
                <time dateTime={latest.date}>{dateLabel(latest.date)}</time>
              )
            }
            detail={latest == undefined ? undefined : relativeDay(latest.date, today)}
          />
          <Statistic
            label="初披露"
            to={firstEvent == undefined ? undefined : `/events/${firstEvent.slug}`}
            value={
              first == undefined ? (
                "記録なし"
              ) : (
                <time dateTime={first.date}>{dateLabel(first.date)}</time>
              )
            }
            detail={
              elapsed == undefined
                ? undefined
                : elapsed.totalDays < 0
                  ? `初披露まであと${number(-elapsed.totalDays)}日`
                  : `${elapsed.years} 年 ${elapsed.days} 日前 / ${number(elapsed.totalDays)}日前`
            }
          />
        </dl>
      </section>

      <section aria-label="披露回数の推移">
        <h2 className={sectionHeading("mb-4")}>披露回数の推移</h2>
        <PerformanceHistory lives={performances.lives} today={today} />
      </section>

      <section aria-label="ライブ種別">
        <h2 className={sectionHeading("mb-4")}>ライブ種別</h2>
        {statistics.liveTypes.length === 0 ? (
          <p className="text-sm text-zinc-500">披露履歴がありません。</p>
        ) : (
          <table className="w-full text-sm tabular-nums">
            <caption className="sr-only">ライブ種別ごとの披露回数と割合</caption>
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th scope="col" className="py-2 text-left font-normal">
                  種別
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  披露回数
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  割合
                </th>
              </tr>
            </thead>
            <tbody>
              {statistics.liveTypes.map((item) => (
                <tr key={item.name} className="border-b border-zinc-100">
                  <th scope="row" className="py-3 text-left font-normal text-zinc-700">
                    {item.name}
                  </th>
                  <td className="py-3 text-right text-zinc-700">{number(item.count)}回</td>
                  <td className="py-3 text-right text-nadeshiko-800">
                    {item.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section aria-label="衣装">
        <h2 className={sectionHeading("mb-4")}>衣装</h2>
        {statistics.costumes.length === 0 ? (
          <p className="text-sm text-zinc-500">披露履歴がありません。</p>
        ) : (
          <CostumeBarChart costume={statistics.costumes} />
        )}
      </section>

      <section aria-label="披露間隔">
        <h2 className={sectionHeading("mb-2")}>披露間隔</h2>
        <p className="mb-4 text-sm text-zinc-500">
          同じ日の披露をまとめ、隣り合う披露日の間隔を集計しています。
        </p>
        {intervals == undefined ? (
          <p className="text-sm text-zinc-500">
            異なる披露日が2日以上あると、披露間隔を計算できます。
          </p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <Statistic label="平均の披露間隔" value={intervals.average.toFixed(1)} unit="日" />
            <Statistic label="最長の披露間隔" value={number(intervals.longest)} unit="日" />
          </dl>
        )}
      </section>
    </div>
  );
}

const Statistic = ({
  label,
  value,
  unit,
  detail,
  to,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  to?: string;
}) => {
  const card = (
    <div className="relative h-26 rounded-2xl bg-zinc-50 p-4 in-[a:hover]:bg-zinc-100">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1.5 text-xl leading-7 font-semibold text-zinc-800 tabular-nums">
        {value}
        {unit == undefined ? null : (
          <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>
        )}
      </dd>
      <dd className="mt-1 line-clamp-1 text-xs text-zinc-500">{detail}</dd>
    </div>
  );

  return to == undefined ? (
    card
  ) : (
    <Link to={to} className="relative block">
      {card}
      <HiArrowUpRight className="absolute top-4 right-4 size-4 text-zinc-400" aria-hidden="true" />
    </Link>
  );
};
