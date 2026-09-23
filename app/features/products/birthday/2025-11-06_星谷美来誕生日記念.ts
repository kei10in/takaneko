import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product.ts";

export const みにるん: OfficialGoods = {
  slug: "みにるん🍒",
  name: "みにるん🍒",
  date: "2024-11-06",
  description: dedent`
    お待たせ〜初バースデーアクスタ🌟

    天使🪽が君のそばで見守ってるん

    いつも一緒だよ💘
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-11-06_みにるん🍒.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const みくるん口上じょっき: OfficialGoods = {
  slug: "みくるん口上じょっき🍒",
  name: "みくるん口上じょっき🍒",
  date: "2025-11-06",
  description: dedent`
    保温性もあるサーモタンブラー！
    
    常連さんもご新規さんもご一緒にカンパーイ🥂みくるのロゴ入り
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-11-06_みくるん口上じょっき🍒.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 愛情いっぱいにゃにゃ登場アクキー: OfficialGoods = {
  slug: "愛情いっぱいにゃにゃ登場アクキー🍒",
  name: "愛情いっぱいにゃにゃ登場アクキー🍒ん",
  date: "2025-11-06",
  description: dedent`
    天使みくるとにゃにゃの初アクキー😻🪽

    ロゴ付きで毎日一緒だね！

    大切な君のキーもつけれるよう工夫したよぉ🔑
    `,
  priceWithTax: 1800,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-11-06_愛情いっぱいにゃにゃ登場アクキー🍒.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 星谷美来誕生日記念_2025年11月06日: BirthdayGoodsCollection = {
  slug: "星谷美来誕生日記念 2025年11月06日",
  name: "星谷美来誕生日記念 2025年11月06日",
  date: "2024-11-06",
  memberName: "星谷美来",
  lineup: [みにるん, みくるん口上じょっき, 愛情いっぱいにゃにゃ登場アクキー],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-11-06_星谷美来誕生日記念グッズ.jpg",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};
