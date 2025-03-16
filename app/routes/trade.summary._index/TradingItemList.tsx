import { Link } from "react-router";
import { ClippedImage } from "~/components/ClippedImage";
import { RandomGoods, TradeTextType } from "~/features/products/product";
import type { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";

type TradingItemListProps = {
  productImage: RandomGoods;

  /** トレード対象アイテムの詳細情報の配列です */
  tradingItemDetails: TradingItemDetail[];
};

/**
 * トレード希望アイテムの一覧を表示するコンポーネントです。
 * アイテムごとに切り抜かれた画像、アイテム名、ID、シリーズ名を表示します。
 */
export function TradingItemList(props: TradingItemListProps) {
  const { productImage, tradingItemDetails } = props;

  return (
    <div className="my-4">
      <h3 className="font-semibold text-gray-600">
        <Link to={`/trade/${productImage.slug}`}>{productImage.name}</Link>
      </h3>
      <ul className="mx-auto mt-2 flex flex-wrap gap-2">
        {tradingItemDetails.map((detail) => (
          <li key={detail.item.id} className="flex w-28 flex-col overflow-hidden text-sm">
            <ClippedImage
              className="aspect-square w-full object-contain drop-shadow-sm"
              src={detail.product.url}
              alt={`${detail.item.name} ${detail.item.id}`}
              clip={detail.position}
            />
            <div className="p-2 text-center">
              <p className="line-clamp-2">{makeTitle(detail)}</p>
              <p className="line-clamp-2 text-xs text-gray-400">{detail.product.series}</p>
            </div>
          </li>
        ))}
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
  } else {
    return detail.item.name;
  }
};
