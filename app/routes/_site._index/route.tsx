import { clsx } from "clsx";
import { BsArrowLeftRight, BsBoxArrowUpRight, BsCalendar, BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction, useLoaderData } from "react-router";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { sectionHeading } from "~/components/styles";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { calendarEventFromEventModule } from "~/features/calendars/calendarEvents";
import { LinkCalendarEventItem } from "~/features/calendars/LinkCalendarEventItem";
import { dateHref } from "~/features/calendars/utils";
import { importEventModulesByDate } from "~/features/events/eventModule";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { getActiveDateInJapan } from "~/utils/japanTime";
import { RandomGoodsList } from "../_app.trade/RandomGoodsList";

export const meta: MetaFunction = () => {
  const title = SITE_TITLE;
  const description =
    "HoneyWorksサウンドプロデュースの10人組アイドルグループ 高嶺のなでしこ (たかねこ) の非公式ファンサイト。トレード画像をつくるやつでは、生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成可能。スケジュールでは、ライブやイベント、テレビ出演などのスケジュールが確認可能。";
  const url = `https://${DOMAIN}/`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_TITLE },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${url}/takaneko/site-image.webp` },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:creator", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${url}icon-512.png` },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_TITLE,
        url,
      },
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://${DOMAIN}`,
    },
  ];
};

export const loader = async () => {
  const date = getActiveDateInJapan(new Date());

  const events = await Promise.all(
    [0, 1, 2, 3, 4, 5, 6].map(async (i) => {
      const d = date.addDays(i);
      const { year, month, day } = d;
      const events = await importEventModulesByDate(d);
      return { year, month, day, events: events.map(calendarEventFromEventModule) };
    }),
  );

  return { events };
};

export const clientLoader = async () => {
  const date = getActiveDateInJapan(new Date());

  const events = await Promise.all(
    [0, 1, 2, 3, 4, 5, 6].map(async (i) => {
      const d = date.addDays(i);
      const { year, month, day } = d;
      const events = await importEventModulesByDate(d);
      return { year, month, day, events: events.map(calendarEventFromEventModule) };
    }),
  );

  return { events };
};

export default function Index() {
  const { events } = useLoaderData<typeof loader>();

  const recentProducts = TAKANEKO_PHOTOS.slice(0, 12);

  return (
    <div className="bg-white">
      <div className="lg:bg-nadeshiko-100">
        <div className="mx-auto lg:container">
          <div className="flex min-h-[calc(100svh-var(--header-height))] w-full flex-col lg:min-h-auto lg:flex-row-reverse">
            <div className="aspect-4/3 w-full min-w-96 lg:min-h-0 lg:w-auto lg:min-w-0 lg:flex-1">
              <img
                className={clsx("aspect-4/3 w-full min-w-96 lg:w-auto lg:min-w-0 lg:flex-1")}
                src="/takaneko/hero.jpg"
                alt="ヒーロー画像"
              />
            </div>

            <div className="flex w-full flex-1 items-center lg:w-auto lg:flex-none">
              <div className={clsx("w-full space-y-6 pt-6 pb-10 lg:space-y-8 lg:pb-24 2xl:px-8")}>
                <div
                  className={clsx(
                    "relative",
                    "before:absolute before:inset-x-0 before:bottom-0 before:mx-auto before:bg-[url(/icon.svg)] before:bg-cover before:bg-no-repeat",
                    "before:opacity-30",
                    "before:size-6 before:-translate-x-24.5 before:translate-y-1",
                    "xl:before:size-9 xl:before:-translate-x-40 xl:before:translate-y-2",
                  )}
                >
                  <h1
                    className={clsx(
                      "relative flex flex-col px-8 text-center font-serif text-zinc-600 xl:gap-1",
                    )}
                  >
                    <span className="text-lg xl:text-2xl">高嶺のなでしこの非公式ファンサイト</span>
                    <span className="text-nadeshiko-800 line-clamp-1 text-4xl xl:text-6xl">
                      {SITE_TITLE}
                    </span>
                  </h1>
                </div>

                <p className="px-8 text-center font-serif text-lg text-zinc-600 xl:text-xl">
                  たかねこのファンを技術で支援する。
                </p>

                <div className="mx-auto flex w-64 flex-col items-center justify-center gap-2 px-4 text-sm font-semibold select-none">
                  <Link
                    className="bg-nadeshiko-800 text-nadeshiko-100 flex h-9 w-full items-center rounded-full px-4"
                    to="/calendar"
                  >
                    <div className="mx-auto flex items-center gap-1">
                      <BsCalendar className="h-4 w-4" />
                      <div>スケジュール</div>
                    </div>
                  </Link>
                  <Link
                    className="bg-nadeshiko-800 text-nadeshiko-100 flex h-9 w-full items-center rounded-full px-4"
                    to="/trade"
                  >
                    <div className="mx-auto flex items-center gap-1">
                      <BsArrowLeftRight className="h-4 w-4" />
                      <div>トレード画像つくるやつ</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 lg:mt-24 lg:max-w-5xl">
        <section className="mx-auto w-full max-w-md space-y-16 pb-12 lg:max-w-3xl">
          <section className="space-y-4">
            <h2 className={sectionHeading("flex items-center gap-2 px-4")}>
              <BsCalendar className="inline-block text-gray-400" />
              <span>スケジュール</span>
            </h2>

            <p className="px-4">
              ライブやイベント、テレビ出演などのスケジュールを確認することができます。スケジュールは必ず
              <a href="https://takanenonadeshiko.jp/schedule/">
                公式のスケジュール
                <BsBoxArrowUpRight className="mx-1 inline-block text-gray-500" />
              </a>
              や X での告知を確認してください。
            </p>

            <Link
              className="text-nadeshiko-800 mt-2! ml-auto block w-fit px-4 text-sm"
              to="/calendar"
            >
              <span>すべてのスケジュール</span>
              <BsChevronRight className="ml-1 inline-block" />
            </Link>

            <Swiper
              className={clsx(
                "[&_.swiper-pagination-bullet]:bg-black",
                "[&_.swiper-pagination-bullet-active]:bg-nadeshiko-800!",
              )}
              modules={[A11y]}
              slidesPerView={1.15}
            >
              {events.map(({ year, month, day, events }, i) => {
                const date = new NaiveDate(year, month, day);
                return (
                  <SwiperSlide key={i}>
                    <div className="pl-4">
                      <p className="mb-4 font-semibold text-gray-400">
                        <Link to={dateHref(date)}>{displayDateWithDayOfWeek(date)} の予定:</Link>
                      </p>
                      <div className="h-56 overflow-y-auto rounded-lg border border-gray-200 px-2 py-4">
                        {events.length !== 0 ? (
                          events.map((event) => (
                            <LinkCalendarEventItem
                              key={event.slug}
                              to={`/events/${event.slug}`}
                              category={event.category}
                              summary={event.summary}
                              location={event.location}
                              region={event.region}
                            />
                          ))
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            予定はありません。
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </section>

          <section className="space-y-4 px-4">
            <h2 className={sectionHeading("flex items-center gap-2")}>
              <BsArrowLeftRight className="inline-block text-gray-400" />
              <span>トレード画像つくるやつ</span>
            </h2>
            <p>
              これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。
            </p>
            <div className="items-bottom flex justify-between">
              <p className="font-semibold text-gray-400">最近のグッズ:</p>
              <Link className="text-nadeshiko-800 block text-sm" to="/trade">
                <span>すべてのグッズ</span>
                <BsChevronRight className="ml-1 inline-block" />
              </Link>
            </div>

            <RandomGoodsList items={recentProducts} />

            <div className="w-full">
              <Link
                className="bg-nadeshiko-800 text-nadeshiko-50 mx-auto block w-fit rounded-full px-8 py-2 font-semibold"
                to="/trade"
              >
                すべてのグッズ
              </Link>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
