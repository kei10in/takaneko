import { RandomGoods, TradeTextType } from "~/features/products/product";

export const DIGVII_ペアアクリルブロック: RandomGoods = {
  id: "DIGVII ペアアクリルブロック",
  slug: "DIGVII ペアアクリルブロック",
  name: "DIGVII コラボグッズ ペアアクリルブロック",
  year: 2026,
  series: "DIGVII スペシャル コラボレーション グッズ",
  category: "アクリルキーホルダー",
  tradeText: TradeTextType.Description,
  url: "/takaneko/goods/2026/2026-05-27_DIGVII ペアアクリルブロック.webp",
  width: 1500,
  height: 1025,
  variants: [
    { id: 1, name: "橋本桃呼 & 籾山ひめり", description: "A" },
    { id: 2, name: "橋本桃呼 & 籾山ひめり", description: "B" },
    { id: 3, name: "橋本桃呼 & 籾山ひめり", description: "C" },
    { id: 4, name: "橋本桃呼 & 籾山ひめり", description: "D" },
    { id: 5, name: "橋本桃呼 & 籾山ひめり", description: "E" },
  ],
  withFrame: true,
  positions: [
    { id: 1, x: 87, y: 50, width: 375, height: 450 },
    { id: 2, x: 562, y: 50, width: 375, height: 450 },
    { id: 3, x: 1037, y: 50, width: 375, height: 450 },
    { id: 4, x: 87, y: 525, width: 375, height: 450 },
    { id: 5, x: 562, y: 525, width: 375, height: 450 },
  ],
};
