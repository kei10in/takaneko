import { RandomGoods, TradeTextType } from "../products/product";

export const getTradeItemTitle = (product: RandomGoods, i: number): string => {
  const item = product.lineup[i];
  if (item == undefined) {
    return "";
  }

  if (product.tradeText == TradeTextType.Numbering) {
    return `${item.id.toString().padStart(2, "0")} ${item.name}`;
  } else if (product.tradeText == TradeTextType.NameOnly) {
    return item.name;
  } else if (product.tradeText == TradeTextType.Description) {
    if (item.description == undefined) {
      return item.name;
    } else {
      return `${item.name} ${item.description}`;
    }
  } else if (product.tradeText == TradeTextType.GroupByDescription) {
    if (item.description == undefined) {
      return item.name;
    } else {
      return `${item.name} ${item.description}`;
    }
  } else {
    return item.name;
  }
};
