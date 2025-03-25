import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const あくすたひめり生誕ばーじょん: OfficialGoods = {
  slug: "あくすたひめり生誕ばーじょん",
  name: "あくすたひめり生誕ばーじょん。",
  date: "2025-03-22",
  priceWithTax: 1500,
  description: dedent`
    私の好きを詰め込んだアクスタですっ♡
    
    魔法少女ひめちゃんを

    色んなところに連れていってね✨
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-22_あくすたひめり生誕ばーじょん.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const きらきらTシャツ: OfficialGoods = {
  slug: "きらきらTシャツ",
  name: "きらきらTシャツ。",
  date: "2025-03-22",
  description: dedent`
    胸元にはラメのロゴ、裏にはとってもかわいいイラストが大きめに入ってますっ！

    メンカラも入れつつ推し活にも普段にも着れるようなかわちいTシャツにしてみたお！

    ※ラメラメにしたからちょっとお高めごめん！笑
    `,
  priceWithTax: 4800,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-22_きらきらTシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-03-22_きらきらTシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-03-22_きらきらTシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const たからものはここにぽーち: OfficialGoods = {
  slug: "『たからものはここに』ぽーち",
  name: "『たからものはここに』ぽーち。",
  date: "2025-03-22",
  description: dedent`
    カラビナが付いてるので普段持ってるカバンにアクセサリーとしてつけたり、お洋服にさりげなく付けれるよ♡

    つい無くしちゃう小さなたからものはここに入れてね！

    ※ポーチ部分サイズ: 約82×62mm
    `,
  priceWithTax: 3220,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-22_『たからものはここに』ぽーち.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 籾山ひめり誕生日記念_2025年03月22日: BirthdayGoodsCollection = {
  slug: "籾山ひめり誕生日記念_2025年03月22日",
  name: "籾山ひめり誕生日記念 2025年03月22日",
  memberName: "籾山ひめり",
  lineup: [あくすたひめり生誕ばーじょん, きらきらTシャツ, たからものはここにぽーち],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-03-22_籾山ひめり誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/1903431480099143909",
    },
  ],
};
