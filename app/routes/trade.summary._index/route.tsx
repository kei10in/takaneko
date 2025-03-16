import { Link, MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { useTradeStore } from "~/features/trade/store";
import { mapProductToTradingItemDetails } from "~/features/tradeSummaries/tradingItemDetails";
import { ProductItems } from "./ProductItems";

export const meta: MetaFunction = () => {
  return [
    { title: `トレードしたいやつのサマリー - ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const photos = TAKANEKO_PHOTOS.filter((x) => x.category === "生写真");
  const miniPhotoCards = TAKANEKO_PHOTOS.filter((x) => x.category === "ミニフォト");

  const photoWants = photos.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details.filter((i) => i.status.tag === "want");
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const miniPhotoCardWants = miniPhotoCards.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details.filter((i) => i.status.tag === "want");
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  return (
    <div className="mx-auto min-h-[calc(100lvh-3rem-3.5rem)] w-full max-w-lg lg:min-h-[calc(100vh-var(--header-height)-4rem)] lg:max-w-3xl">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">トレードしたいやつのサマリー</h1>

        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-600">生写真</h2>
          {photoWants.map(({ productImage, tradingItemDetails }) => {
            return (
              <div key={productImage.id} className="my-4">
                <h3 className="font-semibold text-gray-600">
                  <Link to={`/trade/${productImage.slug}`}>{productImage.name}</Link>
                </h3>
                <ProductItems tradingItemDetails={tradingItemDetails} />
              </div>
            );
          })}
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-600">ミニフォトカード</h2>
          {miniPhotoCardWants.map(({ productImage, tradingItemDetails }) => {
            return (
              <div key={productImage.id} className="my-4">
                <h3 className="font-semibold text-gray-600">
                  <Link to={`/trade/${productImage.slug}`}>{productImage.name}</Link>
                </h3>
                <ProductItems tradingItemDetails={tradingItemDetails} />
              </div>
            );
          })}
        </section>
      </section>
    </div>
  );
}
