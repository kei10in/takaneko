import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const ふぉとTシャツ: OfficialGoods = {
  slug: "ふぉとTシャツ",
  name: "ふぉとTシャツ。",
  date: "2026-03-22",
  priceWithTax: 4500,
  description: dedent`
    自分のお写真をTシャツにしてみました🫣

    大好きなデジカメの質感をTシャツに👕

    みんなにたくさん着てもらえたら嬉しいな🖤
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-22_ふぉとTシャツ.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const あくすた生誕ばーじょん2: OfficialGoods = {
  slug: "あくすた生誕ばーじょん2",
  name: "あくすた生誕ばーじょん2。",
  date: "2026-03-22",
  description: dedent`
    大好きなチュールのお衣装だお💎

    全身としゃがみのひめちゃんがいます🤭

    アクスタ、アクキー好きな方で使ってね⭐️
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-22_あくすた生誕ばーじょん2_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2026-03-22_あくすた生誕ばーじょん2_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const いらすと巾着: OfficialGoods = {
  slug: "いらすと巾着",
  name: "いらすと巾着。",
  date: "2026-03-22",
  description: dedent`
    いらすと書いてみたよ♡(ドットの中にもお顔書いた👧🏻‎)

    ペンライトが入る大きさの巾着になってます!

    電池と一緒にいれて持ち歩いてね🪄

    大きめの巾着なので日常づかいにもおすすめ⭐️
    `,
  priceWithTax: 2000,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-22_いらすと巾着.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 籾山ひめり誕生日記念_2026年03月22日: BirthdayGoodsCollection = {
  slug: "籾山ひめり誕生日記念_2026年03月22日",
  name: "籾山ひめり誕生日記念 2026年03月22日",
  date: "2026-03-22",
  memberName: "籾山ひめり",
  lineup: [ふぉとTシャツ, あくすた生誕ばーじょん2, いらすと巾着],
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-22_籾山ひめり誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2035687938386690261",
    },
  ],
};
