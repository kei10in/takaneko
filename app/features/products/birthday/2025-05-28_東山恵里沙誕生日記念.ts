import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const アクスタ: OfficialGoods = {
  slug: "⭐️アクスタ🪄",
  name: "⭐️アクスタ🪄",
  date: "2025-05-28",
  priceWithTax: 1500,
  description: dedent`
    生誕衣装のアクスタです🎤

    ぜひ色んなところに連れてってね🐾
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-05-28_⭐️アクスタ🪄.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ひょっこりTシャツ: OfficialGoods = {
  slug: "🥚ひょっこりTシャツ🐾",
  name: "🥚ひょっこりTシャツ🐾",
  date: "2025-05-28",
  description: dedent`
    ポケットからひょっこりしてみました🥺

    背中には新キャラクターの

    「にゃん熟たまご」もいるよ～🐱
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-05-28_🥚ひょっこりTシャツ🐾.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 箱推しミニフォトケース: OfficialGoods = {
  slug: "箱推し🐾ミニフォトケース",
  name: "箱推し🐾ミニフォトケース",
  date: "2025-05-28",
  description: dedent`
    チェキやトレカも入るよ🎶

    下手っぴですがメンバーを描いてみました👭

    お気に入りを入れて推し活してね🫶🎶
    `,
  priceWithTax: 2400,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-05-28_箱推し🐾ミニフォトケース.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 東山恵里沙誕生日記念_2025年05月28日: BirthdayGoodsCollection = {
  slug: "東山恵里沙誕生日記念_2025年05月28日",
  name: "東山恵里沙誕生日記念 2025年05月28日",
  date: "2025-05-28",
  memberName: "東山恵里沙",
  lineup: [アクスタ, ひょっこりTシャツ, 箱推しミニフォトケース],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-05-28_東山恵里沙誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/1927696461958963475",
    },
  ],
};
