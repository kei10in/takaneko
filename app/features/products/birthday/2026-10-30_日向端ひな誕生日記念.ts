import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product.ts";

export const あくすた大人Ver: OfficialGoods = {
  slug: "あくすた 大人Ver.",
  name: "💜あくすた 大人Ver.🤍",
  date: "2026-10-30",
  priceWithTax: 1500,
  description: /* md */ dedent`
    👉24歳になったということで<br/>
    大人っぽいひなたまになりましたっ🤍<br/>
    大人っぽいひなちゃんも愛してて〜( ˘ ³˘)💖<br/>
    24歳のひなも色んなところに<br/>
    つれてってくだしゃい！
  `,

  // 👉24歳になったということで
  // 大人っぽいひなたまになりましたっ🤍
  // 大人っぽいひなちゃんも愛してて〜( ˘ ³˘)💖
  // 24歳のひなでも色んなところに
  // つれてってください！

  images: [
    {
      path: "/takaneko/birthday-goods/2026-10-30_あくすた 大人Ver.webp",
      ref: "https://x.com/takanenofficial/status/2116145595161166334",
    },
  ],
};

export const ひなたまにあ全開Tシャツ: OfficialGoods = {
  slug: "ひなたまにあ全開Tシャツ",
  name: "💜ひなたまにあ全開Tシャツ‼️",
  date: "2026-10-30",
  priceWithTax: 7000,
  description: /* md */ dedent`
    👉前にひなﾄﾞｰﾝ!!!うしろにひなたまにあﾄﾞｰﾝ!!!<br/>
    ひなたまにあ全開のTシャツになってます💜<br/>
    これを着てひなたまにあだよ！ってアピールしてね！！！<br/>
    沢山着てくれたら嬉しぃな！🥺🪄
  `,

  // 👉前にひなたーず!!うしろにひなたまにあー!!
  // ひなたまにあ全開のTシャツになってます💜
  // これを着てひなたまにあだよ！ってアピールしてね!!!
  // 沢山着てくれたら嬉しいな！👀

  images: [
    {
      path: "/takaneko/birthday-goods/2026-10-30_ひなたまにあ全開Tシャツ.webp",
      ref: "https://x.com/takanenofficial/status/2116145595161166334",
    },
  ],
};

export const ひなたまゆらゆらあくきー: OfficialGoods = {
  slug: "ひなたまゆらゆらあくきー",
  name: "💜ひなたまゆらゆらあくきー💫",
  date: "2026-10-30",
  priceWithTax: 3000,
  description: /* md */ dedent`
    👉ひながゆらゆら動くアクリルキーホルダーだよ❤️<br/>
    動くとゆらゆらするのっっ！！！！<br/>
    生誕VerとうさぎVerの2種ですっっ🤍🐰<br/>
    バッグとかにつけて<br/>
    君のそばに置いてくれたら嬉しぃな♡！！
  `,

  // 👉ひながゆらゆら動くアクリルキーホルダーだよ❤️
  // 動くとゆらゆらするのっ！！！
  // 生誕でしか買えないの2種類ですっ🤍
  // バッグとかにつけて
  // 君のそばに置いてくれたら嬉しいな♡!!

  images: [
    {
      path: "/takaneko/birthday-goods/2026-10-30_ひなたまゆらゆらあくきー.webp",
      ref: "https://x.com/takanenofficial/status/2116145595161166334",
    },
  ],
};

export const 日向端ひな誕生日記念_2026年10月30日: BirthdayGoodsCollection = {
  slug: "日向端ひな誕生日記念_2026年10月30日",
  name: "日向端ひな誕生日記念 2026年10月30日",
  date: "2026-10-30",
  memberName: "日向端ひな",
  lineup: [あくすた大人Ver, ひなたまにあ全開Tシャツ, ひなたまゆらゆらあくきー],
  images: [
    {
      path: "/takaneko/birthday-goods/2026-10-30_日向端ひな誕生日記念グッズ.jpg",
      ref: "https://x.com/takanenofficial/status/2116145595161166334",
    },
  ],
};
