import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import { HiArrowsRightLeft, HiArrowTopRightOnSquare, HiCalendar } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";
import { CalendarEventItem } from "~/features/calendars/CalendarEventItem";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { loadEventsInDay } from "~/features/events/events";
import { TAKANEKO_PHOTOS } from "~/features/productImages";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { getActiveDateInJapan } from "~/utils/japanTime";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content:
        "高嶺のなでしこの非公式ファンサイト。トレード画像をつくるやつでは、これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。スケジュールでは、高嶺のなでしこのライブやイベント、テレビ出演などのスケジュールを確認することができます。",
    },
  ];
};

export const clientLoader = defineClientLoader(async (_args) => {
  const date = getActiveDateInJapan(new Date());
  const events = await loadEventsInDay(date);
  return { date, events };
});

export default function Index() {
  const { date, events } = useLoaderData<typeof clientLoader>();
  const calendarEvents = events.map(convertEventModuleToCalendarEvent);

  const recentProducts = TAKANEKO_PHOTOS.slice(-6).toReversed();

  return (
    <div>
      <div className="container mx-auto text-gray-600">
        <div className="relative mx-auto w-fit lg:static lg:flex lg:w-full lg:max-w-5xl">
          <img
            className="max-h-96 min-w-96 lg:h-96 lg:w-auto lg:flex-none"
            src="/takaneko/hero.jpg"
            alt="ヒーロー画像"
          />
          <div
            className={clsx(
              "absolute bottom-0 w-full bg-nadeshiko-100 bg-opacity-90 px-6 py-4",
              "lg:static lg:flex-1 lg:px-10 lg:py-8",
            )}
          >
            <h1 className="text-right font-serif text-2xl font-bold leading-tight text-gray-500 lg:text-5xl">
              <span className="text-nadeshiko-900">高嶺のなでしこの</span>
              <br />
              ファンサイト
              <span className="text-nadeshiko-900"></span>
            </h1>

            <div className="mt-2 flex select-none justify-end gap-1 text-sm font-semibold">
              <Link to="/trade">
                <div className="flex h-7 items-center gap-1 rounded-md bg-nadeshiko-800 px-2 text-white">
                  <HiArrowsRightLeft className="h-4 w-4" />
                  <div>トレード画像つくるやつ</div>
                </div>
              </Link>
              <Link to="/calendar">
                <div className="flex h-7 w-full items-center gap-1 rounded-md bg-nadeshiko-800 px-4 text-nadeshiko-100">
                  <HiCalendar className="h-4 w-4" />
                  <div>スケジュール</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-md space-y-16 px-4 pb-12 pt-8 lg:max-w-3xl">
          <p>「{SITE_TITLE}」は、高嶺のなでしこの非公式ファンサイトです。</p>

          <section className="space-y-4">
            <h2 className="flex items-center gap-1 text-lg font-semibold leading-tight text-gray-800">
              <HiCalendar className="h-6 w-6" />
              <span>スケジュール</span>
            </h2>
            <p>
              ライブやイベント、テレビ出演などのスケジュールを確認することができます。スケジュールは必ず
              <a href="https://takanenonadeshiko.jp/schedule/">
                公式のスケジュール
                <HiArrowTopRightOnSquare className="mx-1 inline-block" />
              </a>
              や X での告知を確認してください。
            </p>
            <p className="font-semibold text-gray-400">{displayDateWithDayOfWeek(date)} の予定:</p>

            <div className="rounded-lg border bg-white px-2 py-4">
              {calendarEvents.length !== 0 ? (
                calendarEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <CalendarEventItem
                      category={event.category}
                      summary={event.summary}
                      location={event.location}
                      region={event.region}
                    />
                  </Link>
                ))
              ) : (
                <div className="mx-auto w-fit px-2 py-4 text-gray-600">予定はありません。</div>
              )}
            </div>

            <div className="!mt-4 w-full">
              <Link
                className="mx-auto block w-fit rounded-lg bg-nadeshiko-800 px-4 py-1 font-semibold text-nadeshiko-50"
                to="/calendar"
              >
                すべてのスケジュール
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-1 text-lg font-semibold leading-tight text-gray-800">
              <HiArrowsRightLeft className="h-6 w-6" />
              <span>トレード画像つくるやつ</span>
            </h2>
            <p>
              これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。
            </p>
            <p className="font-semibold text-gray-400">最近のグッズ:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {recentProducts.map((product) => (
                <Link
                  className="w-40 divide-y overflow-hidden rounded-lg border"
                  to={`/trade/${product.id}`}
                  key={product.id}
                >
                  <div className="h-40 flex-none bg-white">
                    <img
                      className="h-full w-full object-contain object-top"
                      src={product.url}
                      alt={product.name}
                    />
                  </div>
                  <div className="h-18 flex-1 overflow-hidden bg-gray-50 px-4 py-2">
                    <p className="truncate font-semibold text-nadeshiko-800">{product.name}</p>
                    <p className="text-gray-500">{product.kind}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="w-full">
              <Link
                className="mx-auto block w-fit rounded-lg bg-nadeshiko-800 px-4 py-1 font-semibold text-nadeshiko-50"
                to="/trade"
              >
                使い方とその他のグッズ
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
