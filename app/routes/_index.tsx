import { Link, MetaFunction } from "@remix-run/react";
import clsx from "clsx";
import { useMemo } from "react";
import { BsArrowLeftRight, BsBoxArrowUpRight, BsCalendar } from "react-icons/bs";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { CalendarEventItem } from "~/features/calendars/CalendarEventItem";
import { loadEventsInDay } from "~/features/events/events";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { getActiveDateInJapan } from "~/utils/japanTime";
import { ProductItem } from "./trade/ProductItem";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content:
        "高嶺のなでしこの非公式ファンサイト。トレード画像をつくるやつでは、これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。スケジュールでは、高嶺のなでしこのライブやイベント、テレビ出演などのスケジュールを確認することができます。",
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_TITLE,
        url: `https://${DOMAIN}/`,
      },
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://${DOMAIN}`,
    },
  ];
};

export default function Index() {
  const date = useMemo(() => getActiveDateInJapan(new Date()), []); // eslint-disable-line react-hooks/exhaustive-deps
  const events = useMemo(() => loadEventsInDay(date), [date]);

  const recentProducts = TAKANEKO_PHOTOS.slice(-12).toReversed();

  return (
    <div>
      <div className="container mx-auto text-gray-600">
        <div className="relative mx-auto w-fit lg:static lg:flex lg:w-full lg:max-w-5xl">
          <img
            className="aspect-[4/3] max-h-96 w-full min-w-96 lg:h-96 lg:w-auto lg:flex-none"
            src="/takaneko/hero.jpg"
            alt="ヒーロー画像"
          />
          <div
            className={clsx(
              "absolute bottom-0 w-full bg-nadeshiko-100 bg-opacity-90 px-6 py-4",
              "lg:static lg:flex-1 lg:px-10 lg:py-8",
            )}
          >
            <h1 className="text-right font-serif text-2xl italic leading-tight text-gray-500 lg:text-5xl">
              <span className="text-nadeshiko-900">高嶺のなでしこの</span>
              <br />
              ファンサイト
              <span className="text-nadeshiko-900"></span>
            </h1>

            <div className="mt-2 flex select-none justify-end gap-2 text-sm font-semibold">
              <Link to="/trade">
                <div className="flex h-7 items-center gap-1 rounded-md bg-nadeshiko-800 px-2 text-white">
                  <BsArrowLeftRight className="h-4 w-4" />
                  <div>トレード画像つくるやつ</div>
                </div>
              </Link>
              <Link to="/calendar">
                <div className="flex h-7 w-full items-center gap-1 rounded-md bg-nadeshiko-800 px-4 text-nadeshiko-100">
                  <BsCalendar className="h-4 w-4" />
                  <div>スケジュール</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-md space-y-16 px-4 pb-12 pt-8 lg:max-w-3xl">
          <p>「{SITE_TITLE}」は、高嶺のなでしこの非公式ファンサイトです。</p>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold leading-tight text-gray-800">
              <BsCalendar className="h-6 w-6" />
              <span>スケジュール</span>
            </h2>
            <p>
              ライブやイベント、テレビ出演などのスケジュールを確認することができます。スケジュールは必ず
              <a href="https://takanenonadeshiko.jp/schedule/">
                公式のスケジュール
                <BsBoxArrowUpRight className="mx-1 inline-block text-gray-500" />
              </a>
              や X での告知を確認してください。
            </p>
            <p className="font-semibold text-gray-400">{displayDateWithDayOfWeek(date)} の予定:</p>

            <div className="rounded-lg border bg-white px-2 py-4">
              {events.length !== 0 ? (
                events.map((event) => (
                  <Link key={event.slug} to={`/events/${event.slug}`}>
                    <CalendarEventItem
                      category={event.meta.category}
                      summary={event.meta.summary}
                      location={event.meta.location}
                      region={event.meta.region}
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
            <h2 className="flex items-center gap-2 text-lg font-semibold leading-tight text-gray-800">
              <BsArrowLeftRight className="h-6 w-6" />
              <span>トレード画像つくるやつ</span>
            </h2>
            <p>
              これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。
            </p>
            <p className="font-semibold text-gray-400">最近のグッズ:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {recentProducts.map((product) => (
                <Link to={`/trade/${product.slug}`} key={product.slug}>
                  <ProductItem
                    image={product.url}
                    year={product.year}
                    content={product.series}
                    description={product.category}
                  />
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
