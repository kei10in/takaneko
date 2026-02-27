import { MetaFunction, useParams } from "react-router";
import { MINI_PHOTO_CARDS, OTHER_PHOTOS, PHOTOS } from "~/features/products/photos";
import { Product } from "~/features/products/product";
import { PUBLICATIONS } from "~/features/publications/publications";
import { formatTitle } from "~/utils/htmlHeader";
import { PhotoProduct } from "./PhotoProduct";
import PublicationProduct from "./PublicationProduct";

export const meta: MetaFunction = ({ params }) => {
  const productSlug = params.productSlug;
  const fineProduct = findProduct(productSlug);
  const title = formatTitle(fineProduct.description.name);

  return [
    { title },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findProduct = (productSlug: string | undefined): Product => {
  if (productSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const photo = PHOTOS.find((p) => p.slug === productSlug);
  if (photo != undefined) {
    return { kind: "images", description: photo };
  }
  const miniPhoto = MINI_PHOTO_CARDS.find((p) => p.slug === productSlug);
  if (miniPhoto != undefined) {
    return { kind: "images", description: miniPhoto };
  }
  const otherRandomGoods = OTHER_PHOTOS.find((p) => p.slug === productSlug);
  if (otherRandomGoods != undefined) {
    return { kind: "images", description: otherRandomGoods };
  }
  const publication = PUBLICATIONS.find((p) => p.slug === productSlug);
  if (publication != undefined) {
    return { kind: "publications", description: publication };
  }

  throw new Response("", { status: 404 });
};

export default function Index() {
  const params = useParams<"productSlug">();
  const product = findProduct(params.productSlug);

  return (
    <div className="container mx-auto">
      {product.kind === "images" ? (
        <PhotoProduct product={product.description} />
      ) : (
        <PublicationProduct product={product.description} />
      )}
    </div>
  );
}
