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
    <ul className="mx-auto mt-2 flex flex-wrap gap-2">
      {tradingItemDetails.map((detail) => (
        <li key={detail.item.id} className="flex w-28 flex-col overflow-hidden">
          <ClippedImage
            className="aspect-square w-full object-contain drop-shadow-sm"
            src={detail.product.url}
            alt={`${detail.item.name} ${detail.item.id}`}
            clip={detail.position}
          />
          <div className="p-2 text-center text-sm">
            <p className="line-clamp-2">
              {detail.item.name} {detail.item.id}
            </p>
            <p className="line-clamp-2 text-xs text-gray-400">{detail.product.series}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
