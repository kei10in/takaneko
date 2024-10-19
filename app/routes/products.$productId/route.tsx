import { MetaFunction, useParams } from "@remix-run/react";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { Product } from "~/features/products/product";
import { PUBLICATIONS } from "~/features/products/publications";
import { formatTitle } from "~/utils/htmlHeader";
import { PhotoProduct } from "./PhotoProduct";
import PublicationProduct from "./PublicationProduct";

export const meta: MetaFunction = ({ params }) => {
  const productId = params.productId;
  const fineProduct = findProduct(productId);
  const title = formatTitle(fineProduct.description.name);

  return [
    { title },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findProduct = (productId: string | undefined): Product => {
  if (productId == undefined) {
    throw new Response("", { status: 404 });
  }

  const photo = PHOTOS.find((p) => p.id === productId);
  if (photo != undefined) {
    return { kind: "images", description: photo };
  }
  const miniPhoto = MINI_PHOTO_CARDS.find((p) => p.id === productId);
  if (miniPhoto != undefined) {
    return { kind: "images", description: miniPhoto };
  }
  const publication = PUBLICATIONS.find((p) => p.id === productId);
  if (publication != undefined) {
    return { kind: "publications", description: publication };
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

      <div className="min-h-[calc(100svh-var(--header-height))]">
        {product.kind === "images" ? (
          <PhotoProduct product={product.description} />
        ) : (
          <PublicationProduct product={product.description} />
        )}
      </div>
    </div>
  );
}
