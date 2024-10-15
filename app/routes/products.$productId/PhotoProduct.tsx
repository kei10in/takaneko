import { Link } from "@remix-run/react";
import { ProductImage } from "~/features/products/product";

interface Props {
  product: ProductImage;
}

export function PhotoProduct(props: Props) {
  const { product } = props;

  return (
    <div className="mx-auto pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
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
        <h1 className="my-2 text-3xl font-semibold text-nadeshiko-800 lg:mt-12">{product.name}</h1>

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
  );
}
