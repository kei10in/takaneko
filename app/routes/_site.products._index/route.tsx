import { BsBook, BsChevronRight } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { SquareCard } from "~/components/SquareCard";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { PUBLICATIONS } from "~/features/publications/publications";
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
      title: "ライブ・イベント グッズ",
      slug: "/products/live-goods",
      items: LiveGoods.slice(0, 10).map((live) => {
        const thumbs = thumbnailSrcSet(live.images[0].path);
        return {
          slug: `/products/live-goods/${live.slug}`,
          image: thumbs.src,
          imageSet: thumbs.srcset,
          name: live.name,
        };
      }),
    },
    {
      title: "誕生日記念グッズ",
      slug: "/products/birthday-goods",
      items: BirthdayGoods.slice(0, 10).map((item) => {
        const thumbs = thumbnailSrcSet(item.images[0].path);
        return {
          slug: `/products/birthday-goods/${item.slug}`,
          image: thumbs.src,
          imageSet: thumbs.srcset,
          name: item.name,
        };
      }),
    },
    {
      title: "生写真",
      slug: "/products/photos",
      items: PHOTOS.slice(0, 10).map((photo) => {
        const thumbs = thumbnailSrcSet(photo.url);
        return {
          slug: `/products/${photo.slug}`,
          image: thumbs.src,
          imageSet: thumbs.srcset,
          name: photo.name,
        };
      }),
    },
    {
      title: "ミニフォトカード",
      slug: "/products/mini-photo-cards",
      items: MINI_PHOTO_CARDS.slice(0, 10).map((photo) => {
        const thumbs = thumbnailSrcSet(photo.url);
        return {
          slug: `/products/${photo.slug}`,
          image: thumbs.src,
          imageSet: thumbs.srcset,
          name: photo.name,
        };
      }),
    },
    {
      title: "書籍・雑誌",
      slug: "/products/publications",
      items: PUBLICATIONS.slice(0, 10).map((publication) => {
        const thumbs =
          publication.coverImages[0] == undefined
            ? undefined
            : thumbnailSrcSet(publication.coverImages[0].path);

        return {
          slug: `/products/${publication.slug}`,
          image: thumbs?.src,
          imageSet: thumbs?.srcset,
          name: publication.name,
        };
      }),
    },
  ];

  return (
    <div className="container mx-auto text-gray-600">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>グッズ</h1>
        <div className="mt-8 rounded-lg border border-yellow-500 bg-yellow-50 p-4">
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
              <Link className="flex items-end justify-between" to={slug}>
                <h2 className={sectionHeading()}>{title}</h2>
                <p className="flex w-fit items-center text-sm text-nadeshiko-800">
                  <span>すべて表示</span>
                  <BsChevronRight className="ml-1 inline-block" />
                </p>
              </Link>
              <div className="mt-6">
                <Swiper slidesPerView="auto" className="py-2">
                  {items.map((item) => {
                    const { slug, image, imageSet, name } = item;

                    return (
                      <SwiperSlide key={slug} className="w-46 px-2">
                        <Link to={slug} className="block">
                          <SquareCard
                            image={image}
                            imageSet={imageSet}
                            title={name}
                            fallback={<BsBook />}
                          />
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
