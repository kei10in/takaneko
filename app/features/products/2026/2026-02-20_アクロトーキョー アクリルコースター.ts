import { RandomGoods, TradeTextType } from "~/features/products/product";

export const アクロトーキョー_アクリルコースター: RandomGoods = {
  id: "アクロトーキョー アクリルコースター",
  slug: "アクロトーキョー アクリルコースター",
  name: "アクロトーキョー コラボグッズ アクリルコースター",
  year: 2026,
  series: "アクロトーキョー スペシャル コラボレーション グッズ",
  category: "アクリルコースター",
  tradeText: TradeTextType.Description,
  url: "/takaneko/goods/2026/2026-02-20_アクロトーキョー アクリルコースター.webp",
  width: 1500,
  height: 1500,
  variants: [
    // https://www.acrotokyo.com/c/new/an25-019
    { id: 1, name: "城月菜央", description: "AdaNous" },
    // https://www.acrotokyo.com/c/new/gl25-026
    // https://www.acrotokyo.com/c/new/gl25-028
    { id: 2, name: "城月菜央", description: "Grrr the Lipper" },
    // https://www.acrotokyo.com/c/new/tr25-h07
    { id: 3, name: "城月菜央", description: "TRAVAS TOKYO" },
    // https://www.acrotokyo.com/c/new/rf25-r04
    { id: 4, name: "城月菜央", description: "REFLEM" },
    // https://www.acrotokyo.com/c/new/il25-s07
    { id: 5, name: "橋本桃呼", description: "ililil" },
    // https://www.acrotokyo.com/c/new/rf25-r11
    { id: 6, name: "橋本桃呼", description: "REFLEM" },
    // https://www.acrotokyo.com/c/item/gam26-001
    // https://www.acrotokyo.com/c/item/gam26-005
    { id: 7, name: "橋本桃呼", description: "Gamchu" },
    // https://www.acrotokyo.com/c/item/tr25-r06
    { id: 8, name: "橋本桃呼", description: "TRAVAS TOKYO" },
  ],
  withFrame: true,
  positions: [
    { id: 1, x: 50, y: 50, width: 450, height: 450 },
    { id: 2, x: 525, y: 50, width: 450, height: 450 },
    { id: 3, x: 1000, y: 50, width: 450, height: 450 },
    { id: 4, x: 50, y: 525, width: 450, height: 450 },
    { id: 5, x: 525, y: 525, width: 450, height: 450 },
    { id: 6, x: 1000, y: 525, width: 450, height: 450 },
    { id: 7, x: 50, y: 1000, width: 450, height: 450 },
    { id: 8, x: 525, y: 1000, width: 450, height: 450 },
  ],
};
