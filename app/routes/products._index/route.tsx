import { Link, MetaFunction } from "@remix-run/react";
import { BsChevronRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { PUBLICATIONS } from "~/features/products/publications";

export const meta: MetaFunction = () => {
  return [
    { title: `グッズ - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこのグッズをまとめました。" +
        "公式に販売されているグッズにはライブグッズや誕生日記念グッズ、生写真、ミニフォトカードがあります。" +
        "また高嶺のなでしこやメンバー個別に掲載された雑誌・書籍などの出版物についてもまとめています。",
    },
  ];
};

export default function Index() {
  const sections = [
    {
      title: "ライブ グッズ",
      slug: "live-goods",
      items: LiveGoods.slice(0, 10).map((live) => ({
        slug: live.slug,
        image: live.images[0].path,
        name: live.name,
      })),
    },
    {
      title: "誕生日記念グッズ",
      slug: "birthday-goods",
      items: BirthdayGoods.slice(0, 10).map((item) => ({
        slug: item.slug,
        image: item.images[0].path,
        name: item.name,
      })),
    },
    {
      title: "生写真",
      slug: "photos",
      items: PHOTOS.slice(0, 10).map((photo) => ({
        slug: photo.slug,
        image: photo.url,
        name: photo.name,
      })),
    },
    {
      title: "ミニフォトカード",
      slug: "mini-photo-cards",
      items: MINI_PHOTO_CARDS.slice(0, 10).map((photo) => ({
        slug: photo.slug,
        image: photo.url,
        name: photo.name,
      })),
    },
    {
      title: "書籍・雑誌",
      slug: "publications",
      items: PUBLICATIONS.slice(0, 10).map((publication) => ({
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
                <p className="flex w-fit items-center text-sm text-nadeshiko-800">
                  <span>すべて表示</span>
                  <BsChevronRight className="ml-1 inline-block" />
                </p>
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
