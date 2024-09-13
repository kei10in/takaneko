import { Link, MetaFunction, useParams } from "@remix-run/react";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = ({ params }) => {
  const productId = params.productId;
  const fineProduct = findProduct(productId);
  const title = formatTitle(fineProduct.name ?? fineProduct.id);

  return [
    { title },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findProduct = (productId: string | undefined) => {
  if (productId == undefined) {
    throw new Response("", { status: 404 });
  }

  const photo = PHOTOS.find((p) => p.id === productId);
  if (photo != undefined) {
    return photo;
  }
  const miniPhoto = MINI_PHOTO_CARDS.find((p) => p.id === productId);
  if (miniPhoto != undefined) {
    return miniPhoto;
  }

  throw new Response("", { status: 404 });
};

export default function Index() {
  const params = useParams<"productId">();
  const product = findProduct(params.productId);

  return (
    <div className="container mx-auto">
      <div className="mx-4 my-8 rounded-lg border border-yellow-500 bg-yellow-50 p-4">
        <p className="mb-2 font-bold">🚧工事中🚧</p>
        <p>たかねこのグッズのページは現在作成中です。</p>
      </div>

      <div className="mx-auto min-h-[calc(100svh-var(--header-height))] pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
        <div className="w-full">
          <div className="mx-auto w-fit">
            <img
              className="block h-[28rem] object-contain object-center lg:h-[36rem]"
              src={product.url}
              alt="プロフィール"
            />
          </div>
        </div>

        <section className="p-4">
          <h1 className="my-2 text-3xl font-semibold text-nadeshiko-800 lg:mt-12">
            {product.name ?? product.id}
          </h1>

          <dl className="mt-8 grid grid-cols-3 gap-2">
            <dt className="text-gray-400">発売年</dt>
            <dd className="col-span-2">{product.year}</dd>
          </dl>

          <div className="mt-12">
            <Link
              className="rounded bg-nadeshiko-800 px-4 py-1 text-white"
              to={`/trade/${product.id}`}
            >
              トレード画像を作る
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
