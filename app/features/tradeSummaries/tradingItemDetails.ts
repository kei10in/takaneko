import { ImagePosition, ItemDescription, RandomGoods } from "../products/product";
import { TradeDescription, TradeStatus } from "../trade/TradeStatus";

export type TradingItemDetail = {
  item: ItemDescription;
  position: ImagePosition;
  status: TradeStatus;
};

export const combineToTradingItemDetails = (
  productImage: RandomGoods,
  tradeDescriptions: Record<string, TradeDescription>,
): TradingItemDetail[] => {
  return productImage.lineup.map((item, i) => {
    return {
      item,
      position: productImage.positions[i],
      status: tradeDescriptions[item.id]?.status ?? { tag: "none" },
    };
  });
};

export const groupTradingItemDetailsByMember = (
  tradingItemDetails: TradingItemDetail[],
): TradingItemDetail[][] => {
  const getMemberName = (tradingItemDetail: TradingItemDetail) => tradingItemDetail.item.name;

  const result: TradingItemDetail[][] = [];

  tradingItemDetails.forEach((item) => {
    const r = result.find((m) => getMemberName(m[0]) === getMemberName(item));
    if (r) {
      r.push(item);
    } else {
      result.push([item]);
    }
  });

  return result;
};
