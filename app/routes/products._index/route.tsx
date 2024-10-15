import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
} from "@remix-run/react";
import { ImageSlide } from "~/components/ImageSlide";
import { SITE_TITLE } from "~/constants";
import { loadEventsInDay } from "~/features/events/events";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { PUBLICATIONS } from "~/features/products/publications";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { getActiveDateInJapan } from "~/utils/japanTime";
import { ProductCard } from "./ProductCard";
import { PublicationCard } from "./PublicationCard";

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
  const events = loadEventsInDay(date);
  return { date, events };
});

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">グッズ</h1>
        <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
          <p className="mb-2 font-bold">🚧工事中🚧</p>
          <p>たかねこのグッズのページは現在作成中です。</p>
          <p>
            このページに記載のないものは「
            <Link className="text-nadeshiko-800" to="/memo">
              メモ
            </Link>
            」ページに記載されているかもしれません。
          </p>
        </div>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl">ライブグッズ</h2>
          <div className="space-y-8">
            {LiveGoods.map((live) => {
              return (
                <section key={live.id}>
                  <h3 className="text-xl">{live.name}</h3>
                  <div className="py-4 md:grid md:grid-cols-2 md:gap-4">
                    <ImageSlide
                      images={live.images.map((img) => ({ src: img.path, alt: live.name }))}
                    />
                    <div className="space-y-4 pt-4 md:pt-0">
                      {live.goods.map((goods) => (
                        <section key={goods.type}>
                          <h4>{goods.type}</h4>
                          <ul className="list-outside list-disc pl-6 marker:text-gray-300">
                            {goods.items.map((item) => (
                              <li key={typeof item === "string" ? item : item.id}>
                                {typeof item === "string" ? (
                                  item
                                ) : (
                                  <Link className="text-nadeshiko-800" to={`/products/${item.id}`}>
                                    {item.name}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">生写真</h2>
          <ul className="grid grid-cols-2 place-content-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {PHOTOS.map((photo) => (
              <li key={photo.id}>
                <Link to={`/products/${photo.id}`}>
                  <ProductCard {...photo} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">ミニフォトカード</h2>
          <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {MINI_PHOTO_CARDS.map((photo) => (
              <li key={photo.id}>
                <Link to={`/products/${photo.id}`}>
                  <ProductCard {...photo} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">書籍・雑誌</h2>
          <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {PUBLICATIONS.map((publication) => (
              <li key={publication.id}>
                <Link to={`/products/${publication.id}`}>
                  <PublicationCard
                    name={publication.name}
                    date={NaiveDate.parseUnsafe(publication.date)}
                    image={publication.cover_images[0].path}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
