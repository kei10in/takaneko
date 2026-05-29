import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const _2_0歳と20歳アクスタ: OfficialGoods = {
  slug: "2.0歳と20歳アクスタ",
  name: "2.0歳と20歳アクスタ",
  date: "2026-05-28",
  priceWithTax: 1500,
  description: /* md */ dedent`
    20歳の記念で、2歳の自分も一緒にアクスタにしちゃいました👶🏻<br/>
    可愛がってくれたら嬉しいな🍼<br/>
  `,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-05-28_2.0歳と20歳アクスタ_1.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
    {
      path: "/takaneko/birthday-goods/2026-05-28_2.0歳と20歳アクスタ_2.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 生写真: OfficialGoods = {
  slug: "生写真",
  name: "生写真",
  date: "2026-05-28",
  description: /* md */ dedent`
    20歳なので全20種の生写真です🐱<br/>
    1セット5枚入りです！<br/>
    ランダムでサインもカキカキするよ～✍🏻<br/>
    振袖のお写真17種とシークレット(2歳)の3種です🐾
  `,
  priceWithTax: 1000,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-05-28_生写真.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ペンライトポーチ: OfficialGoods = {
  slug: "ペンライトポーチ",
  name: "ペンライトポーチ",
  date: "2026-05-28",
  description: dedent`
    ライブ参戦に使えるペンライトポーチ🪄<br/>
    にゃん熟たまごのイラストを描きました✏️

    アクキーは好きなところに付けてね👜♡<br/>
    カラビナがあるストラップでバッグなどに付けやすくしたよ☺️<br/>
    電池や小物を入れる用の巾着付きです👀<br/>
    ペンライトでいっぱい応援してくれたら嬉しいな🪄
    `,
  priceWithTax: 2800,
  images: [
    {
      path: "/takaneko/birthday-goods/2026-05-28_ペンライトポーチ.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 東山恵里沙誕生日記念_2026年05月28日: BirthdayGoodsCollection = {
  slug: "東山恵里沙誕生日記念_2026年05月28日",
  name: "東山恵里沙誕生日記念 2026年05月28日",
  date: "2026-05-28",
  memberName: "東山恵里沙",
  lineup: [_2_0歳と20歳アクスタ, 生写真, ペンライトポーチ],
  images: [
    {
      path: "/takaneko/birthday-goods/2026-05-28_東山恵里沙誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2059967929093943781",
    },
  ],
};
