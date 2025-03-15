import { ClippedImage } from "~/components/ClippedImage";
import type { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";

type ProductItemsProps = {
  /** トレード対象アイテムの詳細情報の配列です */
  tradingItemDetails: TradingItemDetail[];
};

/**
 * トレード希望アイテムの一覧を表示するコンポーネントです。
 * アイテムごとに切り抜かれた画像、アイテム名、ID、シリーズ名を表示します。
 */
export function ProductItems({ tradingItemDetails }: ProductItemsProps) {
  return (
    <ul className="mt-2 space-y-2">
      {tradingItemDetails.map((detail) => (
        <li key={detail.item.id} className="flex gap-2">
          <ClippedImage
            className="h-24 w-24 flex-none object-contain drop-shadow-lg"
            src={detail.product.url}
            clip={detail.position}
          />
          <div className="py-2">
            <p>
              {detail.item.name} {detail.item.id}
            </p>
            <p className="text-gray-400">{detail.product.series}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
