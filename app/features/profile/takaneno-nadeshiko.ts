import { GroupDescription } from "./types";

const TakanenoNadeshikoBase = {
  slug: "takaneno-nadeshiko",
  name: "高嶺のなでしこ",
  kana: "たかねのなでしこ",
  romaji: "Takaneno Nadeshiko",
  nickname: "たかねこ",
  birthday: "2022年8月07日",
  nyadeshiko: "てんにゃ",
  hashTag: "#高嶺のなでしこ",
  hashTagForReply: "#高嶺のなでしこ",
  idPhoto: {
    path: "/takaneko/tennya.png",
    ref: "https://takanenonadeshiko.jp/",
  },
  image: {
    path: "/takaneko/tennya.png",
    ref: "https://takanenonadeshiko.jp/",
  },
  officialProfile: "https://takanenonadeshiko.jp/about/",
  twitter: "https://x.com/takanenofficial",
  instagram: "https://www.instagram.com/takanenofficial/",
  tiktok: "https://www.tiktok.com/@takanenofficial",
  showroom: "https://www.showroom-live.com/r/takanenonadeshiko_official",
} as const;

export const TakanenoNadeshiko: GroupDescription = {
  id: "高嶺のなでしこ",
  ...TakanenoNadeshikoBase,
  members: [
    "城月菜央",
    "涼海すう",
    "橋本桃呼",
    "葉月紗蘭",
    "春野莉々",
    "東山恵里沙",
    "日向端ひな",
    "星谷美来",
    "松本ももな",
    "籾山ひめり",
  ],
} as const;

export const TakanenoNadeshiko2: GroupDescription = {
  id: "高嶺のなでしこ2",
  ...TakanenoNadeshikoBase,
  members: [
    "城月菜央",
    "涼海すう",
    "橋本桃呼",
    "葉月紗蘭",
    "東山恵里沙",
    "日向端ひな",
    "星谷美来",
    "松本ももな",
    "籾山ひめり",
  ],
} as const;
