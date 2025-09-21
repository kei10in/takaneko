import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const おはもーこおやもーこアクリルスタンド: OfficialGoods = {
  slug: "おはもーこ🍑おやもーこ🛌🍑アクリルスタンド",
  name: "おはもーこ🍑おやもーこ🛌🍑アクリルスタンド",
  date: "2025-06-28",
  priceWithTax: 2222,
  description: dedent`
    起きてるもーこさんとおやすみもーこさんの両面アクスタですっっ！！

    パジャマのお衣装にしたのでたくさん、色んなところに連れて行ってももこをあたたかいもふとんにねかせてねえ🛌
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-06-28_おはもーこ🍑おやもーこ🛌🍑アクリルスタンド.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-06-28_おはもーこ🍑おやもーこ🛌🍑アクリルスタンド_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const もーこと未来の思い出をカレンダー: OfficialGoods = {
  slug: "もーこと未来の思い出をカレンダー🩷",
  name: "もーこと未来の思い出をカレンダー🩷",
  date: "2025-05-28",
  description: dedent`
    みんなのお部屋や職場など、目の前にもーこさんをいつでも見れるカレンダーにしたよお🫶

    今回はたくさん違うパターンのお衣装を着たので、いろんなかあいいもーこさんを堪能してくだちゃい🍑
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-06-28_もーこと未来の思い出をカレンダー🩷.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-06-28_もーこと未来の思い出をカレンダー🩷_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const もふとんアクリルスタンドケース: OfficialGoods = {
  slug: "もふとん🛌🍑アクリルスタンドケース",
  name: "もふとん🛌🍑アクリルスタンドケース",
  date: "2025-05-28",
  description: dedent`
    アクスタをいれたらお布団で寝てるみたいになるよっっ！！！＞ ＜ ε[＿＿＿]з

    いつもたくさん愛で包んでくれてありがとうっっ！！！

    おはもーこ🍑おやもーこ🛌🍑アクスタを入れて寝かせてねえ🫶
    `,
  priceWithTax: 3800,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-06-28_もふとん🛌🍑アクリルスタンドケース.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 橋本桃呼誕生日記念_2025年05月28日: BirthdayGoodsCollection = {
  slug: "橋本桃呼誕生日記念_2025年05月28日",
  name: "橋本桃呼誕生日記念 2025年05月28日",
  date: "2025-06-28",
  memberName: "橋本桃呼",
  lineup: [
    おはもーこおやもーこアクリルスタンド,
    もーこと未来の思い出をカレンダー,
    もふとんアクリルスタンドケース,
  ],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-06-28_橋本桃呼誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/1938937948776599847",
    },
  ],
};
