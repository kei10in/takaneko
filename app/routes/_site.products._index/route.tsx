import { BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { PUBLICATIONS } from "~/features/products/publications";
import { thumbnailSrcSet } from "~/utils/fileConventions";

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
      slug: "/products/live-goods",
      items: LiveGoods.slice(0, 10).map((live) => ({
        slug: `/products/live-goods/${live.slug}`,
        image: live.images[0].path,
        imageSet: undefined,
        name: live.name,
      })),
    },
    {
      title: "誕生日記念グッズ",
      slug: "/products/birthday-goods",
      items: BirthdayGoods.slice(0, 10).map((item) => ({
        slug: `/products/birthday-goods/${item.slug}`,
        image: item.images[0].path,
        imageSet: undefined,
        name: item.name,
      })),
    },
    {
      title: "生写真",
      slug: "/products/photos",
      items: PHOTOS.slice(0, 10).map((photo) => ({
        slug: `/products/${photo.slug}`,
        image: photo.url,
        imageSet: undefined,
        name: photo.name,
      })),
    },
    {
      title: "ミニフォトカード",
      slug: "/products/mini-photo-cards",
      items: MINI_PHOTO_CARDS.slice(0, 10).map((photo) => ({
        slug: `/products/${photo.slug}`,
        image: photo.url,
        imageSet: undefined,
        name: photo.name,
      })),
    },
    {
      title: "書籍・雑誌",
      slug: "/products/publications",
      items: PUBLICATIONS.slice(0, 10).map((publication) => {
        const thumbs = thumbnailSrcSet(publication.coverImages[0].path);
        return {
          slug: `/products/${publication.slug}`,
          image: thumbs.src,
          imageSet: thumbs.srcset,
          name: publication.name,
        };
      }),
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
              <Link className="mb-8 flex items-end justify-between" to={slug}>
                <h2 className="text-2xl">{title}</h2>
                <p className="text-nadeshiko-800 flex w-fit items-center text-sm">
                  <span>すべて表示</span>
                  <BsChevronRight className="ml-1 inline-block" />
                </p>
              </Link>
              <div>
                <Swiper slidesPerView="auto">
                  {items.map((item) => {
                    const { slug, image, imageSet, name } = item;

                    return (
                      <SwiperSlide key={slug} className="w-fit px-1">
                        <Link to={slug}>
                          <div className="w-44 overflow-hidden">
                            <img
                              className="aspect-square w-full bg-gray-50 object-contain"
                              src={image}
                              srcSet={imageSet}
                              alt={name}
                            />
                            <div className="px-2 py-2">
                              <p className="mx-auto line-clamp-4 w-fit text-sm">{name}</p>
                            </div>
                          </div>
                        </Link>
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
