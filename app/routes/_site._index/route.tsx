import { clsx } from "clsx";
import { BsArrowLeftRight, BsCalendar, BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction, useLoaderData } from "react-router";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { DomainName, OgpSiteName, SiteName, SiteTitle } from "~/constants";
import { calendarEventFromEventModule } from "~/features/calendars/calendarEvents";
import { LinkCalendarEventItem } from "~/features/calendars/LinkCalendarEventItem";
import { dateHref } from "~/features/calendars/utils";
import { Events } from "~/features/events/events";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { getActiveDateInJapan } from "~/utils/japanTime";
import { RandomGoodsList } from "../_app.trade/RandomGoodsList";

export const meta: MetaFunction = () => {
  const title = SiteTitle;
  const description =
    "HoneyWorksサウンドプロデュースの10人組アイドルグループ 高嶺のなでしこ (たかねこ) の非公式ファンサイト。トレード画像をつくるやつでは、生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成可能。スケジュールでは、ライブやイベント、テレビ出演などのスケジュールが確認可能。";
  const url = `https://${DomainName}/`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: OgpSiteName },
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
    { name: "twitter:image", content: `${url}takanekono-card.png` },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SiteTitle,
        url,
      },
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://${DomainName}`,
    },
  ];
};

export const loader = async () => {
  const date = getActiveDateInJapan(new Date());

  const events = await Promise.all(
    [0, 1, 2, 3, 4, 5, 6].map(async (i) => {
      const d = date.addDays(i);
      const { year, month, day } = d;
      const events = await Events.importEventModulesByDate(d);
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
      const events = await Events.importEventModulesByDate(d);
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
      <div className="relative h-lvh overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <img
            className={clsx("h-full w-full object-cover")}
            src="/takaneko/hero.jpg"
            alt="サイトイメージ"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-black/24 via-black/6 to-transparent"></div>

        <div className="relative flex h-full max-h-lvh w-full flex-col">
          <div className="relative flex flex-4 flex-col justify-center">
            <h1
              className={clsx(
                "mx-auto flex w-fit flex-col justify-center gap-2 text-center font-serif",
              )}
            >
              <span className="text-lg font-thin text-white text-shadow-[0_0_0.25rem] text-shadow-black/22">
                高嶺のなでしこの非公式ファンサイト
              </span>
              <span
                className={clsx(
                  "line-clamp-1 text-4xl font-thin text-white text-shadow-[0_0_0.25rem] text-shadow-black/30",
                  "xl:text-5xl",
                )}
              >
                {SiteName}
              </span>
            </h1>
          </div>
          <div className="flex flex-6 flex-col">
            <div className="mx-auto flex w-64 flex-1 flex-col items-center justify-center gap-4 px-4 text-sm font-semibold select-none">
              <Link
                className={clsx(
                  "flex h-11 w-full items-center rounded-full px-6 text-white transition-transform hover:scale-105",
                  "border border-white/65 bg-white/30 backdrop-blur-[0.125rem]",
                  "shadow-[var(--glass-shadow),var(--glass-inset-shadow)]",
                )}
                to="/calendar"
              >
                <div className="mx-auto flex items-center gap-1">
                  <BsCalendar className="h-4 w-4 overflow-visible filter-(--glass-drop-shadow)" />
                  <div className="text-shadow-(--glass-text-shadow)">スケジュール</div>
                </div>
              </Link>
              <Link
                className={clsx(
                  "flex h-11 w-full items-center rounded-full px-6 text-white transition-transform hover:scale-105",
                  "border border-white/65 bg-white/30 backdrop-blur-[0.125rem]",
                  "shadow-[var(--glass-shadow),var(--glass-inset-shadow)]",
                )}
                to="/trade"
              >
                <div className="mx-auto flex items-center gap-1">
                  <BsArrowLeftRight className="h-4 w-4 overflow-visible filter-(--glass-drop-shadow)" />
                  <div className="text-shadow-(--glass-text-shadow)">トレード画像つくるやつ</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div>
        <section className="space-y-6 py-18">
          <h2 className="lp-section-heading mx-auto px-4 lg:max-w-7xl">スケジュール</h2>

          {/* Swiper からはみ出た部分をウィンドウの幅に収める */}
          <div className="overflow-clip">
            <Swiper
              className={clsx(
                "mx-auto overflow-visible px-3 lg:max-w-7xl",
                "[&_.swiper-pagination-bullet]:bg-black",
                "[&_.swiper-pagination-bullet-active]:bg-nadeshiko-800!",
              )}
              modules={[A11y]}
              slidesPerView="auto"
            >
              {events.map(({ year, month, day, events }, i) => {
                const date = new NaiveDate(year, month, day);
                return (
                  <SwiperSlide key={i} className="w-96/100 max-w-96/100 sm:w-120 sm:max-w-120">
                    <div className="px-1">
                      <p className="mb-4 font-semibold text-gray-400">
                        <Link to={dateHref(date)}>{displayDateWithDayOfWeek(date)} の予定:</Link>
                      </p>
                      <div className="h-64 space-y-4 overflow-y-auto rounded-lg border border-gray-200 px-4 py-4">
                        {events.length !== 0 ? (
                          events.map((event) => (
                            <LinkCalendarEventItem
                              key={event.slug}
                              to={`/events/${event.slug}`}
                              category={event.category}
                              summary={event.summary}
                              location={event.location}
                              region={event.region}
                              thumbnail={event.thumbnail}
                              time={event.time}
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
          </div>

          <div className="w-full">
            <Link className="graceful-link mx-auto block" to="/calendar">
              すべてのスケジュール
            </Link>
          </div>
        </section>

        <section className="mx-auto space-y-6 py-18 lg:max-w-7xl">
          <h2 className="lp-section-heading px-4">トレード画像つくるやつ</h2>
          <p className="px-4 text-gray-500">
            これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。
          </p>
          <div className="items-bottom flex justify-between px-4">
            <p className="font-semibold text-gray-400">最近のグッズ:</p>
            <Link className="block text-sm text-nadeshiko-800" to="/trade">
              <span>すべてのグッズ</span>
              <BsChevronRight className="ml-1 inline-block" />
            </Link>
          </div>

          <RandomGoodsList items={recentProducts} />

          <div className="w-full">
            <Link className="graceful-link mx-auto block" to="/trade">
              すべてのグッズ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
