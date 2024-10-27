import { SITE_TITLE } from "~/constants";
import { RandomGoods } from "../../features/products/product";
import { flattenLineup } from "../../features/products/utils";

export const titleForTradeImagesTool = (product: RandomGoods | undefined) => {
  if (product === undefined) {
    return `トレード画像をつくるやつ - ${SITE_TITLE}`;
  }

  return `${product.name} のトレード画像をつくるやつ - ${SITE_TITLE}`;
};

export const descriptionForTradeImagesTool = (product: RandomGoods | undefined) => {
  if (product === undefined) {
    return "高嶺のなでしこの生写真やミニフォトカードなどのランダムグッズのトレード用画像を作成します。";
  }

  return (
    `${product.year}年発売の高嶺のなでしこ“${product.name}”のトレード画像を作成します。` +
    `ラインナップは、${flattenLineup(product.lineup).join("、")}。`
  );
};
