import { Link } from "react-router";
import { pageColumnBox, pageHeading } from "~/components/styles";
import { RandomGoods } from "~/features/products/product";

interface Props {
  product: RandomGoods;
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

      <section className={pageColumnBox("px-4")}>
        <h1 className={pageHeading()}>{product.name}</h1>

        <dl className="mt-8 grid grid-cols-3 gap-2">
          <dt className="text-gray-400">発売年</dt>
          <dd className="col-span-2">{product.year}</dd>
        </dl>

        <div className="mt-12">
          <Link
            className="bg-nadeshiko-800 rounded-sm px-4 py-1 text-white"
            to={`/trade/${product.slug}`}
          >
            トレード画像を作る
          </Link>
        </div>
      </section>
    </div>
  );
}
