import { clsx } from "clsx";
import { BsArrowLeftRight, BsBoxArrowUpRight, BsCalendar, BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction, useLoaderData } from "react-router";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { sectionHeading } from "~/components/styles";
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
      <div className="relative h-lvh w-screen overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <img
            className={clsx(
              "h-full w-full object-cover",
              "mask-[linear-gradient(to_bottom,black_0%,black_94%,transparent_100%)]",
            )}
            src="/takaneko/hero.jpg"
            alt="サイトイメージ"
          />
        </div>

        {/* <div className="absolute inset-0 backdrop-blur-[4px]"></div> */}

        <div className="absolute inset-0 bg-linear-to-b from-black/24 via-black/6 to-transparent"></div>

        <div className="relative flex h-full w-full flex-col">
          <div className="relative flex flex-6 flex-col justify-center">
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
            <div className="mx-auto flex w-64 flex-1 flex-col items-center justify-end gap-2 px-4 pb-48 text-sm font-semibold select-none">
              <Link
                className={clsx(
                  "flex h-11 w-full items-center rounded-full px-6 text-white",
                  "border border-white/65 bg-white/30 backdrop-blur-[0.125rem]",
                  "shadow-[var(--glass-shadow),var(--glass-inset-shadow)]",
                )}
                to="/calendar"
              >
                <div className="mx-auto flex items-center gap-1">
                  <BsCalendar className="h-4 w-4 drop-shadow-(--glass-text-shadow)" />
                  <div className="text-shadow-(--glass-text-shadow)">スケジュール</div>
                </div>
              </Link>
              <Link
                className={clsx(
                  "flex h-11 w-full items-center rounded-full px-6 text-white",
                  "border border-white/65 bg-white/30 backdrop-blur-[0.125rem]",
                  "shadow-[var(--glass-shadow),var(--glass-inset-shadow)]",
                )}
                to="/trade"
              >
                <div className="mx-auto flex items-center gap-1">
                  <BsArrowLeftRight className="h-4 w-4 drop-shadow-(--glass-text-shadow)" />
                  <div className="text-shadow-(--glass-text-shadow)">トレード画像つくるやつ</div>
                </div>
              </Link>
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
              className="mt-2! ml-auto block w-fit px-4 text-sm text-nadeshiko-800"
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
              <Link className="block text-sm text-nadeshiko-800" to="/trade">
                <span>すべてのグッズ</span>
                <BsChevronRight className="ml-1 inline-block" />
              </Link>
            </div>

            <RandomGoodsList items={recentProducts} />

            <div className="w-full">
              <Link
                className="mx-auto block w-fit rounded-full bg-nadeshiko-800 px-8 py-2 font-semibold text-nadeshiko-50"
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
