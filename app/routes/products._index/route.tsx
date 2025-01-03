import { Link, MetaFunction } from "@remix-run/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { PUBLICATIONS } from "~/features/products/publications";

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

export default function Index() {
  const sections = [
    {
      title: "ライブ グッズ",
      slug: "live-goods",
      items: LiveGoods.map((live) => ({
        slug: live.slug,
        image: live.images[0].path,
        name: live.name,
      })),
    },
    {
      title: "誕生日記念グッズ",
      slug: "birthday-goods",
      items: BirthdayGoods.map((item) => ({
        slug: item.slug,
        image: item.images[0].path,
        name: item.name,
      })),
    },
    {
      title: "生写真セット",
      slug: "photos",
      items: PHOTOS.map((photo) => ({
        slug: photo.slug,
        image: photo.url,
        name: photo.name,
      })),
    },
    {
      title: "ミニフォトカードセット",
      slug: "mini-photo-cards",
      items: MINI_PHOTO_CARDS.map((photo) => ({
        slug: photo.slug,
        image: photo.url,
        name: photo.name,
      })),
    },
    {
      title: "書籍・雑誌",
      slug: "publications",
      items: PUBLICATIONS.map((publication) => ({
        slug: publication.slug,
        image: publication.coverImages[0].path,
        name: publication.name,
      })),
    },
  ];

  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">グッズ</h1>
        <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
          <p>
            このページに記載のないものは「
            <Link className="text-nadeshiko-800" to="/memo">
              メモ
            </Link>
            」ページに記載されているかもしれません。
          </p>
        </div>

        {sections.map((section) => {
          const { title, slug, items } = section;
          return (
            <section className="mt-12" key={slug}>
              <Link className="mb-8 flex items-end justify-between" to={`/products/${slug}`}>
                <h2 className="text-2xl">{title}</h2>
                <p>すべて表示</p>
              </Link>
              <div>
                <Swiper slidesPerView="auto">
                  {items.map((item) => {
                    const { slug, image, name } = item;

                    return (
                      <SwiperSlide key={slug} className="w-fit px-1">
                        <div className="w-44 overflow-hidden">
                          <img
                            className="aspect-square w-full bg-gray-50 object-contain"
                            src={image}
                            alt={name}
                          />
                          <div className="px-2 py-2">
                            <p className="mx-auto line-clamp-4 w-fit text-sm">{name}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}
