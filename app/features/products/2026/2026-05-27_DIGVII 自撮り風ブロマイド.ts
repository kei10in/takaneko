import { RandomGoods, TradeTextType } from "~/features/products/product";

export const DIGVII_自撮り風ブロマイド: RandomGoods = {
  id: "DIGVII 自撮り風ブロマイド",
  slug: "DIGVII 自撮り風ブロマイド",
  name: "DIGVII コラボグッズ 自撮り風ブロマイド",
  year: 2026,
  series: "DIGVII スペシャル コラボレーション グッズ",
  category: "生写真",
  tradeText: TradeTextType.Description,
  url: "/takaneko/goods/2026/2026-05-27_DIGVII 自撮り風ブロマイド.webp",
  width: 1500,
  height: 1500,
  variants: [
    { id: 1, name: "橋本桃呼", description: "A" },
    { id: 2, name: "橋本桃呼", description: "B" },
    { id: 3, name: "橋本桃呼", description: "C" },
    { id: 4, name: "橋本桃呼", description: "D" },
    { id: 5, name: "籾山ひめり", description: "A" },
    { id: 6, name: "籾山ひめり", description: "B" },
    { id: 7, name: "籾山ひめり", description: "C" },
    { id: 8, name: "籾山ひめり", description: "D" },
  ],
  positions: [
    { id: 1, x: 50, y: 125, width: 450, height: 299 },
    { id: 2, x: 525, y: 125, width: 450, height: 299 },
    { id: 3, x: 1000, y: 125, width: 450, height: 299 },
    { id: 4, x: 50, y: 600, width: 450, height: 299 },
    { id: 5, x: 525, y: 600, width: 450, height: 299 },
    { id: 6, x: 1000, y: 600, width: 450, height: 299 },
    { id: 7, x: 50, y: 1075, width: 450, height: 299 },
    { id: 8, x: 525, y: 1075, width: 450, height: 299 },
  ],
};
