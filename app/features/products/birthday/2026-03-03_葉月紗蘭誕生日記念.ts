import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const 生写真_5枚入り: OfficialGoods = {
  slug: "2026-03-03_生写真 (5枚入り)",
  name: "生写真 (5枚入り)",
  date: "2025-03-03",
  priceWithTax: 1000,
  description: dedent`
    サインもたまにインしている生写真セットです
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-03_生写真 (5枚入り).webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ぷっくり天使しゅしゅ: OfficialGoods = {
  slug: "ぷっくり天使しゅしゅ",
  name: "ぷっくり天使しゅしゅ",
  date: "2025-03-03",
  description: dedent`
    ブレスレットにもペンライトにもつけられる、かみをたばねるのにも役立つシゴデキなしゅしゅです✨️
    `,
  priceWithTax: 2200,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-03_ぷっくり天使しゅしゅ.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const _2026年葉月紗蘭生誕びっきゅTシャツ: OfficialGoods = {
  slug: "2026年葉月紗蘭生誕びっきゅTシャツ",
  name: "2026年葉月紗蘭生誕びっきゅTシャツ",
  date: "2025-03-03",
  description: dedent`
    日々私の活動を支えてくれているあざらしさん🦭

    この度びっきゅと命名されました!

    命名を記念し、びっきゅ愛溢れるTシャツへと仕上がっております
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-03_2026年葉月紗蘭生誕びっきゅTシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2026-03-03_2026年葉月紗蘭生誕びっきゅTシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2026-03-03_2026年葉月紗蘭生誕びっきゅTシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 葉月紗蘭誕生日記念_2026年03月03日: BirthdayGoodsCollection = {
  slug: "葉月紗蘭誕生日記念_2026年03月03日",
  name: "葉月紗蘭誕生日記念 2026年03月03日",
  date: "2026-03-03",
  memberName: "葉月紗蘭",
  lineup: [生写真_5枚入り, _2026年葉月紗蘭生誕びっきゅTシャツ, ぷっくり天使しゅしゅ],
  images: [
    {
      path: "/takaneko/birthday-goods/2026-03-03_葉月紗蘭誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2028817705592291800",
    },
  ],
};
