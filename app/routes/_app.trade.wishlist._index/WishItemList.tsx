import { Link } from "react-router";
import { croppedImagePath } from "~/features/products/croppedProductImage";
import { RandomGoods, TradeTextType } from "~/features/products/product";
import type { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";

type WishItemListProps = {
  productImage: RandomGoods;

  /** トレード対象アイテムの詳細情報の配列です */
  tradingItemDetails: TradingItemDetail[];
};

/**
 * トレード希望アイテムの一覧を表示するコンポーネントです。
 * アイテムごとに切り抜かれた画像、アイテム名、ID、シリーズ名を表示します。
 */
export function WishItemList(props: WishItemListProps) {
  const { productImage, tradingItemDetails } = props;

  const shadow = (productImage.withFrame ?? false) ? undefined : true;

  return (
    <div className="my-4">
      <h3 className="font-semibold text-gray-600">
        <Link to={`/trade/${productImage.slug}`}>{productImage.name}</Link>
      </h3>
      <ul className="mt-2 grid grid-cols-3 justify-items-center gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {tradingItemDetails.map((detail) => {
          const scale = Math.min(112 / detail.position.width, 144 / detail.position.height);
          const width = detail.position.width * scale;
          const height = detail.position.height * scale;

          const imagePath = croppedImagePath(detail.product.url, detail.position.id);

          return (
            <li
              key={detail.item.id}
              className="flex w-28 items-center justify-center overflow-hidden text-sm"
            >
              <div>
                <img
                  className="mx-auto block max-h-36 max-w-full object-contain data-[shadow]:drop-shadow-sm"
                  data-shadow={shadow}
                  src={imagePath}
                  alt={`${detail.item.name} ${detail.item.id}`}
                  width={width}
                  height={height}
                />
                <div className="pt-1 text-center">
                  <p className="line-clamp-2">{makeTitle(detail)}</p>
                  <p className="line-clamp-2 text-xs text-gray-400">{detail.product.series}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const makeTitle = (detail: TradingItemDetail) => {
  if (detail.product.tradeText == TradeTextType.Numbering) {
    return `${detail.item.name} ${detail.item.id}`;
  } else if (detail.product.tradeText == TradeTextType.NameOnly) {
    return detail.item.name;
  } else if (detail.product.tradeText == TradeTextType.Description) {
    if (detail.item.description == undefined) {
      return detail.item.name;
    } else {
      return `${detail.item.name} ${detail.item.description}`;
    }
  } else if (detail.product.tradeText == TradeTextType.GroupByDescription) {
    if (detail.item.description == undefined) {
      return detail.item.name;
    } else {
      return `${detail.item.name} ${detail.item.description}`;
    }
  } else {
    return detail.item.name;
  }
};
