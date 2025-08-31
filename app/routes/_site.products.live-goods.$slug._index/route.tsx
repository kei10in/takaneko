import { Link, MetaFunction, useParams } from "react-router";
import { ImageSlide2 } from "~/components/ImageSlide2";
import { pageBox, pageHeading } from "~/components/styles";
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
  const images = live.images;

  return (
    <div className="mx-auto max-w-3xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>{live.name}</h1>

        <div className="mt-8">
          <ImageSlide2 images={images.map((img) => ({ ...img, alt: live.name }))} />
        </div>

        <div className="mt-12">
          {live.goods.map((goods) => (
            <section key={goods.type} className="my-4">
              <h2 className="text-xl leading-tight font-semibold text-gray-500">{goods.type}</h2>

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
