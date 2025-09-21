import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const フォトアルバム: OfficialGoods = {
  slug: "フォトアルバム",
  name: "フォトアルバム",
  date: "2025-03-03",
  priceWithTax: 2500,
  description: dedent`
    生写真がちょうどはいります
    
    表紙は私が描いたたかねこちゃんです

    裏面はお楽しみに！
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-03_フォトアルバム.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 前髪ピン: OfficialGoods = {
  slug: "前髪ピン",
  name: "前髪ピン",
  date: "2025-03-03",
  description: dedent`
    前髪ピンです
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-03_前髪ピン.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const アクリルスタンド: OfficialGoods = {
  slug: "アクリルスタンド",
  name: "アクリルスタンド",
  date: "2025-03-03",
  description: dedent`
    18 歳衣装のアクリルスタンドです

    アザラシもついています
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-03_アクリルスタンド.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 葉月紗蘭誕生日記念_2025年03月03日: BirthdayGoodsCollection = {
  slug: "葉月紗蘭誕生日記念_2025年03月03日",
  name: "葉月紗蘭誕生日記念 2025年03月03日",
  date: "2025-03-03",
  memberName: "葉月紗蘭",
  lineup: [フォトアルバム, 前髪ピン, アクリルスタンド],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-03_葉月紗蘭誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/1896545044771004478",
    },
  ],
};
