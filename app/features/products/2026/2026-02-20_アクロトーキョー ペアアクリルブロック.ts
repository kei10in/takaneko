import { RandomGoods, TradeTextType } from "~/features/products/product";

export const アクロトーキョー_ペアアクリルブロック: RandomGoods = {
  id: "アクロトーキョー ペアアクリルブロック",
  slug: "アクロトーキョー ペアアクリルブロック",
  name: "アクロトーキョー コラボグッズ ペアアクリルブロック",
  year: 2026,
  series: "アクロトーキョー スペシャル コラボレーション グッズ",
  category: "アクリルブロック",
  tradeText: TradeTextType.Description,
  url: "/takaneko/goods/2026/2026-02-20_アクロトーキョー ペアアクリルブロック.webp",
  width: 1025,
  height: 1025,
  variants: [
    { id: 1, name: "城月菜央 & 橋本桃呼", description: "Grrr the Lipper & Gamchu ハグ" },
    { id: 2, name: "城月菜央 & 橋本桃呼", description: "REFLEM 横並び" },
    { id: 3, name: "城月菜央 & 橋本桃呼", description: "REFLEM 縦並び" },
    { id: 4, name: "城月菜央 & 橋本桃呼", description: "Grrr the Lipper & Gamchu 座り" },
  ],
  withFrame: true,
  positions: [
    { id: 1, x: 87, y: 50, width: 375, height: 450 },
    { id: 2, x: 562, y: 50, width: 375, height: 450 },
    { id: 3, x: 87, y: 525, width: 375, height: 450 },
    { id: 4, x: 562, y: 525, width: 375, height: 450 },
  ],
};
