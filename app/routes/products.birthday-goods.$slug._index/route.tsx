import { MetaFunction, useParams } from "@remix-run/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { BirthdayGoodsCollection } from "~/features/products/product";

export const meta: MetaFunction = ({ params }) => {
  const slug = params.slug;
  const collection = findBirthdayGoods(slug);

  return [
    { title: `${collection.name} - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findBirthdayGoods = (slug: string | undefined): BirthdayGoodsCollection => {
  const v = BirthdayGoods.find((p) => p.slug === slug);
  if (v == undefined) {
    throw new Response("", { status: 404 });
  }

  return v;
};

export default function Index() {
  const params = useParams<"slug">();
  const collection = findBirthdayGoods(params.slug);

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))]">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">{collection.name}</h1>

        <div className="mt-8">
          <Swiper
            loop={true}
            slidesPerView="auto"
            navigation={true}
            pagination={true}
            thumbs={{}}
            modules={[Navigation, Pagination, Thumbs]}
          >
            {collection.images.map((image) => (
              <SwiperSlide key={image.path} className="w-fit">
                <img
                  key={image.path}
                  src={image.path}
                  alt={collection.name}
                  className="aspect-square w-full bg-gray-100 object-contain lg:w-96"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-12">
          <ul className="mt-4 list-outside list-disc pl-6 marker:text-gray-300">
            {collection.lineup.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
