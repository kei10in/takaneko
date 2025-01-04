import { Link, MetaFunction, useParams } from "@remix-run/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { LiveGoods } from "~/features/products/liveGoods";
import { LiveGoodsCollection } from "~/features/products/product";

export const meta: MetaFunction = ({ params }) => {
  const slug = params.slug;
  const live = findLive(slug);

  return [
    { title: `${live.name} ライブグッズ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findLive = (slug: string | undefined): LiveGoodsCollection => {
  const v = LiveGoods.find((p) => p.slug === slug);
  if (v == undefined) {
    throw new Response("", { status: 404 });
  }

  return v;
};

export default function Index() {
  const params = useParams<"slug">();
  const live = findLive(params.slug);

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))]">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">{live.name}</h1>

        <div className="mt-8">
          <Swiper
            loop={true}
            slidesPerView="auto"
            navigation={true}
            pagination={true}
            thumbs={{}}
            modules={[Navigation, Pagination, Thumbs]}
          >
            {live.images.map((image) => (
              <SwiperSlide key={image.path} className="w-fit">
                <img
                  key={image.path}
                  src={image.path}
                  alt={live.name}
                  className="aspect-square w-full bg-gray-100 object-contain lg:w-96"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-12">
          {live.goods.map((goods) => (
            <section key={goods.type} className="my-4">
              <h2 className="text-xl font-semibold leading-tight text-gray-500">{goods.type}</h2>

              <ul className="mt-4 list-outside list-disc pl-6 marker:text-gray-300">
                {goods.lineup.map((item) => (
                  <li key={typeof item === "string" ? item : item.slug}>
                    {typeof item === "string" ? (
                      item
                    ) : (
                      <Link className="text-nadeshiko-800" to={`/products/${item.slug}`}>
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
