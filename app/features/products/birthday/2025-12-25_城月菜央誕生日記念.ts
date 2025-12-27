import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const どうみても城月菜央のTシャツ: OfficialGoods = {
  slug: "どうみても城月菜央のTシャツ",
  name: "どうみても城月菜央のTシャツ",
  date: "2025-12-25",
  priceWithTax: 4500,
  description: dedent`
    城月菜央の監督ということをアピール！
    
    そして、城月菜央のこともアピール！

    ※これを着るだけで、どうみても城月菜央の監督。
    
    愛が重めの人には特におすすめ！
    `,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-12-25_どうみても城月菜央のTシャツ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-12-25_どうみても城月菜央のTシャツ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2025-12-25_どうみても城月菜央のTシャツ_3.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const バンのうダナ: OfficialGoods = {
  slug: "バンのうダナ",
  name: "バンのうダナ",
  date: "2025-12-25",
  description: dedent`
    ファッションとして色んなところに巻いて推し活するも良し！
    
    ふろしきにして荷物をまとめるも良し！
    
    ハンカチとして使うも良し！
    
    タペストリーみたいに飾るも良し！
    
    かなり、実用的。
    `,
  priceWithTax: 2900,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-12-25_バンのうダナ.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const たっちせんしゅちゃん: OfficialGoods = {
  slug: "たっちせんしゅちゃん",
  name: "たっち⭐せんしゅちゃん",
  date: "2025-12-25",
  description: dedent`
    立っちして、タッチするせんしゅちゃん。

    遠近法等を使ったり、いろんなシチュエーションでお写真を撮って思い出に残そう！
  
    君の旅のお供に「たっち⭐せんしゅちゃん」、どうですか？
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-12-25_たっちせんしゅちゃん.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 城月菜央誕生日記念_2025年12月25日: BirthdayGoodsCollection = {
  slug: "城月菜央誕生日記念 2025年12月25日",
  name: "城月菜央誕生日記念 2025年12月25日",
  date: "2025-12-25",
  memberName: "城月菜央",
  lineup: [どうみても城月菜央のTシャツ, バンのうダナ, たっちせんしゅちゃん],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-12-25_城月菜央誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2004160208214675949",
    },
  ],
};
