import { clsx } from "clsx";
import { useMemo } from "react";
import { BsArrowLeftRight, BsBoxArrowUpRight, BsCalendar, BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { CalendarEventItem } from "~/features/calendars/CalendarEventItem";
import { dateHref } from "~/features/calendars/utils";
import { loadEventsInDay } from "~/features/events/events";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { thumbnailSrcSet } from "~/utils/fileConventions";
import { getActiveDateInJapan } from "~/utils/japanTime";
import { ProductItem } from "../_app.trade/ProductItem";

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

export default function Index() {
  const date = useMemo(() => getActiveDateInJapan(new Date()), []);
  const events = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const d = date.addDays(i);
        return { date: d, events: loadEventsInDay(d) };
      }),
    [date],
  );

  const recentProducts = TAKANEKO_PHOTOS.slice(0, 12);

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto bg-white text-gray-600 shadow-lg lg:max-w-5xl">
        <div className="relative mx-auto w-fit lg:static lg:flex lg:w-full">
          <img
            className="aspect-4/3 max-h-96 w-full min-w-96 lg:h-96 lg:w-auto lg:flex-none"
            src="/takaneko/hero.jpg"
            alt="ヒーロー画像"
          />
          <div
            className={clsx(
              "bg-nadeshiko-100/90 absolute bottom-0 w-full px-6 py-4",
              "lg:static lg:flex-1 lg:px-10 lg:py-8",
            )}
          >
            <h1 className="text-right font-serif text-2xl leading-tight text-gray-500 italic lg:text-5xl">
              <span className="text-nadeshiko-900">高嶺のなでしこの</span>
              <br />
              ファンサイト
              <span className="text-nadeshiko-900"></span>
            </h1>

            <div className="mt-2 flex justify-end gap-2 text-sm font-semibold select-none">
              <Link to="/trade">
                <div className="bg-nadeshiko-800 flex h-7 items-center gap-1 rounded-md px-2 text-white">
                  <BsArrowLeftRight className="h-4 w-4" />
                  <div>トレード画像つくるやつ</div>
                </div>
              </Link>
              <Link to="/calendar">
                <div className="bg-nadeshiko-800 text-nadeshiko-100 flex h-7 w-full items-center gap-1 rounded-md px-4">
                  <BsCalendar className="h-4 w-4" />
                  <div>スケジュール</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-md space-y-16 pt-8 pb-12 lg:max-w-3xl">
          <p className="px-4">「{SITE_TITLE}」は、高嶺のなでしこの非公式ファンサイトです。</p>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 px-4 text-xl leading-tight font-semibold text-gray-500">
              <BsCalendar className="h-6 w-6" />
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
              {events.map(({ date, events }, i) => (
                <SwiperSlide key={i}>
                  <div className="pl-4">
                    <p className="mb-4 font-semibold text-gray-400">
                      <Link to={dateHref(date)}>{displayDateWithDayOfWeek(date)} の予定:</Link>
                    </p>
                    <div className="h-56 overflow-y-auto rounded-lg border border-gray-200 px-2 py-4">
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
                        <div className="flex h-full items-center justify-center text-gray-600">
                          予定はありません。
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <section className="space-y-4 px-4">
            <h2 className="flex items-center gap-2 text-xl leading-tight font-semibold text-gray-500">
              <BsArrowLeftRight className="h-6 w-6" />
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
            <div className="flex flex-wrap justify-center gap-4">
              {recentProducts.map((product) => {
                const thumbs = thumbnailSrcSet(product.url);
                return (
                  <Link to={`/trade/${product.slug}`} key={product.slug}>
                    <ProductItem
                      image={thumbs.src}
                      imageSet={thumbs.srcset}
                      year={product.year}
                      content={product.series}
                      description={product.category}
                    />
                  </Link>
                );
              })}
            </div>
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
