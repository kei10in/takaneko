import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@汐留シオサイト",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-11-03",
  open: "12:10",
  start: "12:30",
  end: undefined,
  region: "東京",
  location: "汐留シオサイト地下歩道 特設ステージ",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://takanenonadeshiko.jp/?p=5705",
    },
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2110566338511225041",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5705",
  },
  ticket: "",
  streamings: undefined,
  goods: {
    time: undefined,
    lineup: undefined,
    url: undefined,
  },
  acts: [
    {
      title: "1部 ミニライブ",
      types: ["LIVE"],
      open: "12:10",
      start: "12:30",
      setlist: [
        "衣装: A World in Our Colors 衣装",
        "メランコリックハニー",
        "推しの魔法",
        "約束", // 撮影可能
        "乙女どもよ。",
        "ファンサ",
      ],
      links: ["https://x.com/takanenofficial/status/2117497002078753104"],
    },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["涼海すう", "日向端ひな", "松本ももな", "籾山ひめり"] },
          { label: "B グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "東山恵里沙"] },
        ],
      },
    },
    {
      title: "2部 ミニライブ",
      types: ["LIVE"],
      open: "15:40",
      start: "16:00",
      setlist: [
        "衣装: A World in Our Colors 衣装",
        "世界は恋に落ちている",
        "生きてりゃいい",
        "ハートブーケ", // 撮影可能
        "かわいいは常識♡",
        "恋を知った世界",
      ],
      links: ["https://x.com/takanenofficial/status/2117557398382780570"],
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["涼海すう", "日向端ひな", "松本ももな", "籾山ひめり"] },
          { label: "B グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "東山恵里沙"] },
        ],
      },
    },
  ],
  updatedAt: "2026-11-04",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  初回限定盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループショット撮影会参加券」を 1 枚配布。

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: 汐留シオサイト地下歩道 CD販売ブース

  ## リンク

  - [2部 開催報告 (ダイジェスト動画) - 公式 X](https://x.com/takanenofficial/status/2117557398382780570)
  - [1部 開催報告 (ダイジェスト動画) - 公式 X](https://x.com/takanenofficial/status/2117497002078753104)
  - [#きょうのたかねこ](https://x.com/takanenofficial/status/2117416467641872459)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5705)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
