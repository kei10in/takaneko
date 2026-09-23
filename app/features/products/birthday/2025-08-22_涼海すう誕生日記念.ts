import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product.ts";

export const あくすぅた2025: OfficialGoods = {
  slug: "あくすぅた2025",
  name: "あくすぅた",
  date: "2025-08-22",
  description: dedent`
    色んなところに連れ回してください(❁ᴗ͈ˬᴗ͈)

    一緒にお出かけポストも待ってます☺️
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-08-22_あくすぅた.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const いらすぅとTシャツ2025: OfficialGoods = {
  slug: "いらすぅとTシャツ2025",
  name: "いらすぅとTシャツ",
  date: "2025-08-22",
  description: dedent`
    このイラストまだ未完成です

    まだ服とか描けてないです

    みんなの元には完成してるものが届きます！！

    色味とかちょっち変わってるかもですがデザイン変わらないです！！

    間に合うと思ってたんですけど、
    
    なんかこだわってたら間に合わなかったです😇

    でもそれくらい気合いはいってるTシャツってこと！！

    買ってください🥺🥺

    みんな天使の羽はやしてくれください！！！！🪽🪽🪽🪽
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-08-22_いらすぅとTシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-08-22_いらすぅとTシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-08-22_いらすぅとTシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 証明写真ですぅ: OfficialGoods = {
  slug: "証明写真ですぅ",
  name: "証明写真ですぅ",
  date: "2025-08-22",
  description: dedent`
    実写とイラストの証明写真です✌️

    すぅにゃろうもいます️🐱🩵
    
    留年しなければ今年で高校卒業なので

    制服グッズ欲しいなーと思いまして！！

    いろんな所に貼ったり入れたりしてください！！！！

    でもこれで書類申請とかはしない方が良いと思います^^
    `,
  priceWithTax: 999,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-08-22_証明写真ですぅ.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 涼海すう誕生日記念_2025年8月22日: BirthdayGoodsCollection = {
  slug: "涼海すう誕生日記念 2025年8月22日",
  name: "涼海すう誕生日記念 2025年8月22日",
  date: "2025-08-22",
  memberName: "涼海すう",
  lineup: [あくすぅた2025, いらすぅとTシャツ2025, 証明写真ですぅ],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-08-22_涼海すう誕生日記念グッズ.jpg",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};
