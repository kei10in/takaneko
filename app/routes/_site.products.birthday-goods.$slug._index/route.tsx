import { MetaFunction, useParams } from "react-router";
import { ImageSlide2 } from "~/components/ImageSlide2";
import { Markdown } from "~/components/Markdown";
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

  const images = [...collection.images, ...collection.lineup.flatMap((item) => item.images ?? [])];

  return (
    <div className="mx-auto max-w-3xl">
      <section className="pt-8 pb-12">
        <h1 className="my-4 px-4 text-3xl font-semibold text-gray-600">{collection.name}</h1>

        <div className="mt-8">
          <ImageSlide2 images={images.map((img) => ({ ...img, alt: collection.name }))} />
        </div>

        <section className="mt-12 px-4">
          <h2 className="text-2xl font-semibold text-gray-500">ラインナップ</h2>
          <ul className="mt-8 space-y-8">
            {collection.lineup.map((item, i) => {
              return (
                <li key={i} className="w-full space-y-3">
                  <h3 className="text-xl font-semibold text-gray-400">{item.name}</h3>
                  <Markdown>{item.description}</Markdown>
                  {item.priceWithTax != undefined && (
                    <p className="flex items-end gap-1 text-gray-500">
                      <span className="flex items-center">
                        <span className="text-md leading-none">￥</span>
                        <span className="text-lg leading-none">
                          {item.priceWithTax.toLocaleString()}
                        </span>
                      </span>
                      <span className="text-xs leading-tight">(税込)</span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    </div>
  );
}
