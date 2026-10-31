import { ReactNode } from "react";
import { BsBarChartLineFill } from "react-icons/bs";
import { Link } from "react-router";
import { CostumeBarChart } from "~/components/charts/CostumeBarChart.tsx";
import { sectionHeading } from "~/components/styles.ts";
import {
  calculateSongStatistics,
  elapsedSince,
  PerformanceDay,
} from "~/features/songs/statistics.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { PerformanceHistory } from "./PerformanceHistory.tsx";
import { useBrowserToday } from "./useBrowserToday.ts";

const number = (value: number) => value.toLocaleString("ja-JP");
const dateLabel = (date: string) => date.replaceAll("-", ".");
const relativeDay = (date: string, today: NaiveDate) => {
  const days = today.differenceInDays(NaiveDate.parseUnsafe(date));
  return days === 0 ? "今日" : days > 0 ? `${number(days)}日前` : `${number(-days)}日後`;
};

export default function Component() {
  const { track, performances, isLoading } = useSongOutletContext();
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

  const statistics = calculateSongStatistics(performances, track.liveDebut);
  const firstDate = statistics.firstDate;
  const elapsed = firstDate == undefined ? undefined : elapsedSince(firstDate, today);
  const latest = statistics.latest;
  const rate = performances.recentPerformanceRate;
  const intervals = statistics.intervals;

  return (
    <div className="mt-8 space-y-12">
      <section aria-label="披露サマリー">
        <h2 className={sectionHeading("mb-4")}>披露サマリー</h2>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Statistic
            label="累計披露回数"
            value={`${number(statistics.performanceCount)}回`}
            detail="登録されたセットリストから集計"
          />
          <Statistic
            label="披露した公演数"
            value={`${number(statistics.eventCount)}公演`}
            detail="同じイベントでの披露は1公演として集計"
          />
          <Statistic
            label="直近の披露率"
            value={
              rate == undefined || rate.eventCount === 0
                ? "—"
                : `${((rate.performedCount / rate.eventCount) * 100).toFixed(1)}%`
            }
            detail={
              rate == undefined ? (
                "集計データがありません。"
              ) : rate.eventCount === 0 ? (
                "集計対象の公演がありません。"
              ) : (
                <>
                  <p>
                    {rate.performedCount} / {rate.eventCount}公演
                  </p>
                  <p className="mt-1">セットリストの登録が揃った直近{rate.eventCount}公演</p>
                </>
              )
            }
          />
          <Statistic
            label="初披露"
            value={
              firstDate == undefined ? (
                "記録なし"
              ) : (
                <time dateTime={firstDate}>{dateLabel(firstDate)}</time>
              )
            }
            detail={
              elapsed == undefined ? undefined : (
                <>
                  <p>
                    {elapsed.totalDays < 0
                      ? `初披露まであと${number(-elapsed.totalDays)}日`
                      : `${elapsed.years}年${elapsed.days}日（通算${number(elapsed.totalDays)}日）`}
                  </p>
                  <p className="mt-1">
                    {track.liveDebut == undefined ? "記録上の初披露日" : "楽曲情報の初披露日"}
                  </p>
                </>
              )
            }
          />
          <Statistic
            label="直近の披露"
            value={
              latest == undefined ? (
                "記録なし"
              ) : (
                <time dateTime={latest.date}>{dateLabel(latest.date)}</time>
              )
            }
            detail={
              latest == undefined ? undefined : (
                <>
                  <p className="mb-1">{relativeDay(latest.date, today)}</p>
                  <EventLinks day={latest} />
                </>
              )
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
          <dl className="grid gap-3 sm:grid-cols-3">
            <Statistic label="直近2回の披露間隔" value={`${number(intervals.recent)}日`} />
            <Statistic label="平均の披露間隔" value={`${intervals.average.toFixed(1)}日`} />
            <Statistic label="最長の披露間隔" value={`${number(intervals.longest)}日`} />
          </dl>
        )}
      </section>
    </div>
  );
}

const Statistic = ({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
}) => (
  <div className="rounded-2xl bg-zinc-50 p-4">
    <dt className="mb-2 text-xs text-zinc-500">{label}</dt>
    <dd className="text-xl font-semibold text-zinc-800 tabular-nums">{value}</dd>
    {detail == undefined ? null : (
      <dd className="mt-2 text-xs leading-relaxed text-zinc-500">{detail}</dd>
    )}
  </div>
);

const EventLinks = ({ day }: { day: PerformanceDay }) => (
  <ul className="space-y-1 text-sm">
    {day.events.map((event) => (
      <li key={event.slug}>
        <Link to={`/events/${event.slug}`} className="text-nadeshiko-800 hover:underline">
          {event.title}
        </Link>
      </li>
    ))}
  </ul>
);
