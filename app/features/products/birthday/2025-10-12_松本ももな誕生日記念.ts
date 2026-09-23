import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product.ts";

export const ももにゃくすた2: OfficialGoods = {
  slug: "ももにゃくすた2",
  name: "🎀ももにゃくすた🍼",
  date: "2025-10-12",
  description: dedent`
    ももにゃが地雷姫に変身🪄✨

    両面アクスタで前後にかわいいをぎゅっと閉じこめました🫶🏻

    お部屋に飾ったり、ぽでかけに連れてったり

    いつでも ももにゃを君のそばにいさせてね🥺💕
    `,
  priceWithTax: 2323,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ももにゃくすた🍼_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ももにゃくすた🍼_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ぽしにゃんT: OfficialGoods = {
  slug: "ぽしにゃんT",
  name: "🎀ぽしにゃんT🐈‍⬛",
  date: "2025-10-12",
  description: dedent`
    ぽしの参戦服は「ぽしにゃんT」で決まりっ！！

    ももにゃへの愛を全力でアピールできるTシャツです💭🎀

    ももにゃ要素をたっぷり詰めこんだ両面デザインになっていて着るともっと可愛くなれちゃうこと間違いなし🍼
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ぽしにゃんT🐈‍⬛_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ぽしにゃんT🐈‍⬛_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ぽしにゃんT🐈‍⬛_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ももにゃちゅいんになれるへあごむ: OfficialGoods = {
  slug: "ももにゃちゅいんになれるへあごむ",
  name: "🎀ももにゃちゅいんになれるへあごむᥬ🥹ᩤྀི",
  date: "2025-10-12",
  description: dedent`
    ももにゃのお顔がついてるアクリルへあごむ♡

    髪につけても腕につけても身につけるだけで“ももにゃみ”があふれちゃう🍑💕

    おそろいでつけて、みんなもきゅるきゅるあいどるになっちゃお🎵
    `,
  priceWithTax: 1800,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-12_🎀ももにゃちゅいんになれるへあごむᥬ🥹ᩤྀི.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 松本ももな誕生日記念_2025年10月12日: BirthdayGoodsCollection = {
  slug: "松本ももな誕生日記念 2025年10月12日",
  name: "松本ももな誕生日記念 2025年10月12日",
  date: "2025-10-12",
  memberName: "松本ももな",
  lineup: [ももにゃくすた2, ぽしにゃんT, ももにゃちゅいんになれるへあごむ],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-12_松本ももな誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/1977359045431627981",
    },
  ],
};
