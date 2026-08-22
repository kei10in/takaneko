import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const あくマすぅた: OfficialGoods = {
  slug: "あくマすぅた",
  name: "あくﾏすぅた",
  date: "2026-08-22",
  priceWithTax: 1500,
  description: /* md */ dedent`
    飛んでるみたいでしょ！😈<br/>
    色んな所で飛ばしてください𓆩🩵𓆪
  `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-08-22_あくマすぅた.webp",
      ref: "https://takanenonadeshiko-ec.com/products/あくマすぅた",
    },
  ],
};

export const ミニフォトですぅ: OfficialGoods = {
  slug: "ミニフォトですぅ",
  name: "ミニフォトですぅ",
  date: "2026-08-22",
  priceWithTax: 500,
  description: /* md */ dedent`
    みんなのスマホの裏をすぅのミニフォトで侵略したいなと思ってミニフォトを選びましたー✌🏻ᴖ ᴖ
    (もちろんスマホ裏以外にも入れて欲しいし、いっぱい持ち歩いて欲しぃ🥹)
    ちなみに写真は12種類ﾀﾞ ﾖ！！盛りだくさん✌️
    そしてなんと当たりは‼️‼️チェキ‼️‼️
  `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-08-22_ミニフォトですぅ.webp",
      ref: "https://takanenonadeshiko-ec.com/products/ミニフォトですぅ",
    },
  ],
};

export const すうすうすうTシャツ: OfficialGoods = {
  slug: "すう！すう！すう！Tシャツ",
  name: "すう！すう！すう！Tシャツ",
  date: "2026-08-22",
  priceWithTax: 9000,
  description: /* md */ dedent`
    実写フルグラTシャツです！！
    なんかいっぱいすぅ詰め込んどきました👍️🩵
    実写ちょっち恥ずかしいけどチャレンジしたので、ちゃんと恥ずかしがらず胸張って着てね‼️‼️笑<br/>
    ※ほんのほんのちょっちだけデザイン変わるかもです！ご了承ください🙇🏻‍♀️
  `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-08-22_すう！すう！すう！Tシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/products/すう-すう-すう-tシャツ",
    },
    {
      path: "/takaneko/birthday-goods/2026-08-22_すう！すう！すう！Tシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/products/すう-すう-すう-tシャツ",
    },
    {
      path: "/takaneko/birthday-goods/2026-08-22_すう！すう！すう！Tシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/products/すう-すう-すう-tシャツ",
    },
  ],
};

export const 涼海すう誕生日記念_2026年08月22日: BirthdayGoodsCollection = {
  slug: "涼海すう誕生日記念_2026年08月22日",
  name: "涼海すう誕生日記念 2026年08月22日",
  date: "2026-08-22",
  memberName: "涼海すう",
  lineup: [あくマすぅた, ミニフォトですぅ, すうすうすうTシャツ],
  images: [
    {
      path: "/takaneko/birthday-goods/2026-08-22_涼海すう誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2091134036362268850",
    },
  ],
};
