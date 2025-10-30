import { dedent } from "ts-dedent";
import { BirthdayGoodsCollection, OfficialGoods } from "../product";

export const あくすた: OfficialGoods = {
  slug: "2025-10-30_あくすた！",
  name: "あくすた！",
  date: "2025-10-30",
  description: dedent`
    👉🏻ひにゃねこさんと！ひなたま！

    生誕衣装着てるひにゃねこさん可愛いﾃﾞｼｮ🖤ྀི🎀

    是非お出かけに連れて行ってくだしゃい❕❕

    (持ち運びやすいサイズ👍🏻)
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-30_あくすた！.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ひなのてぃーしゃつ: OfficialGoods = {
  slug: "2025-10-30_ひなのてぃーしゃつ！",
  name: "ひなのてぃーしゃつ！",
  date: "2025-10-30",
  description: dedent`
    👉🏻実写Tシャツですっ❕

    裏にもちょぴっとひにゃねこさんがいます^ H × H ^ฅ''

    是非女の子も男の子も一緒にオソロしよ~🫶🏻🫶🏻
    `,
  priceWithTax: 4500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-30_ひなのてぃーしゃつ！.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const ひなたまぴん: OfficialGoods = {
  slug: "2025-10-30_ひなたまぴん！",
  name: "ひなたまぴん！",
  date: "2025-10-30",
  description: dedent`
    👉🏻ひなの顔面です！笑笑

    真顔verと笑顔verです☺！

    前髪ピンとか！バッグに付けたりとか！
    
    是非愛用してね⸝⸝ʚ̴̶̷̆_ʚ̴̶̷̆⸝⸝🫶🏻
    `,
  priceWithTax: 1500,
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-30_ひなたまぴん！.webp",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};

export const 日向端ひな誕生日記念_2025年10月30日: BirthdayGoodsCollection = {
  slug: "日向端ひな誕生日記念 2025年10月30日",
  name: "日向端ひな誕生日記念 2025年10月30日",
  date: "2025-10-30",
  memberName: "日向端ひな",
  lineup: [あくすた, ひなのてぃーしゃつ, ひなたまぴん],
  images: [
    {
      path: "/takaneko/birthday-goods/2025-10-30_日向端ひな誕生日記念グッズ.jpg",
      ref: "https://takanenonadeshiko-ec.com/",
    },
  ],
};
