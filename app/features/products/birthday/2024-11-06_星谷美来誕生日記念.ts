import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const まいにちエコるん: OfficialGoods = {
  slug: "♡まいにちエコるん",
  name: "♡まいにちエコるん",
  date: "2024-11-06",
  description: dedent`
    生まれて初めてロゴ作成したの✨
    
    愛情いっぱいの MK💘R
    
    うちわも入る大容量！
    `,
  priceWithTax: 3000,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-11-06_♡まいにちエコるん.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const みくるんお守り写真: OfficialGoods = {
  slug: "☆みくるんお守り写真",
  name: "☆みくるんお守り写真",
  date: "2024-11-06",
  description: dedent`
    恋愛成就・金運 up・健康運 up
    
    幸せ運びます❤️
    `,
  priceWithTax: 1000,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-11-06_☆みくるんお守り写真.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const シュシュるん: OfficialGoods = {
  slug: "◇シュシュるん",
  name: "◇シュシュるん",
  date: "2024-11-06",
  description: dedent`
    みけるん隊の証✨
    
    ペンライトにうちわにも！
    
    ヘアゴムでも好きなところに使ってね❤️
    
    ライブ中に見つけたらファンサしちゃうぞ🥰
    `,
  priceWithTax: 1800,
  images: [
    {
      path: "/takaneko/birthday-goods/2024-11-06_◇シュシュるん.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 星谷美来誕生日記念_2024年11月6日: BirthdayGoodsCollection = {
  slug: "星谷美来誕生日記念 2024年11月6日",
  name: "星谷美来誕生日記念 2024年11月6日",
  date: "2024-11-06",
  memberName: "星谷美来",
  lineup: [まいにちエコるん, みくるんお守り写真, シュシュるん],
  images: [
    {
      path: "/takaneko/birthday-goods/2024-11-06_星谷美来誕生日記念グッズ.jpg",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};
