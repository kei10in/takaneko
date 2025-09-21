import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const いらすぅとTシャツ: OfficialGoods = {
  slug: "いらすぅとTシャツ",
  name: "いらすぅとTシャツ",
  date: "2024-08-22",
  description: dedent`
    涼海すう誕生日記念限定Tシャツです。
    
    描き下ろしイラストをTシャツの両面にプリントしたデザインとなっています。
    
    ※サイズはXLのみの販売となります。
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-08-22_いらすぅとTシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2024-08-22_いらすぅとTシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2024-08-22_いらすぅとTシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const あくすぅた: OfficialGoods = {
  slug: "あくすぅた",
  name: "あくすぅた",
  date: "2024-08-22",
  description: dedent`
    涼海すう誕生日記念限定握リススタンドです。
    
    今回のために撮影した写真と描き下ろしイラストを使用したデザインとなっています。`,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-08-22_あくすぅた.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const だんぼーる: OfficialGoods = {
  slug: "だんぼーる",
  name: "だんぼーる",
  date: "2024-08-22",
  description: dedent`
    涼海すう誕生日記念限定ダンボールです。
    
    描き下ろしイラストや涼海すう監修のシークレットデザインが入った限定ダンボールです。
    `,
  priceWithTax: 999,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-08-22_だんぼーる_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2024-08-22_だんぼーる_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2024-08-22_だんぼーる_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 涼海すう誕生日記念_2024年8月22日: BirthdayGoodsCollection = {
  slug: "涼海すう誕生日記念 2024年8月22日",
  name: "涼海すう誕生日記念 2024年8月22日",
  date: "2024-08-22",
  memberName: "涼海すう",
  lineup: [いらすぅとTシャツ, あくすぅた, だんぼーる],
  images: [
    {
      path: "/takaneko/birthday-goods/2024-08-22_涼海すう誕生日記念グッズ.jpg",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};
