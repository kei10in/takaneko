import { formatTitle } from "~/utils/htmlHeader.ts";
import { RandomGoods } from "../../features/products/product.ts";
import { flattenLineup } from "../../features/products/utils.ts";

export const titleForTradeImagesTool = (product: RandomGoods | undefined) => {
  if (product === undefined) {
    return formatTitle(`トレード画像をつくるやつ`);
  }

  return formatTitle(`${product.name} のトレード画像をつくるやつ`);
};

export const descriptionForTradeImagesTool = (product: RandomGoods | undefined) => {
  if (product === undefined) {
    return "高嶺のなでしこの生写真やミニフォトカードなどのランダムグッズのトレード用画像を作成します。";
  }

  return (
    `${product.year}年発売の高嶺のなでしこ“${product.name}”のトレード画像を作成します。` +
    `ラインナップは、${flattenLineup(product.variants).join("、")}。`
  );
};
