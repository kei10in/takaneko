import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@イオンモール津田沼",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["握手会"],
  date: "2026-11-14",
  open: "11:40",
  start: "12:00",
  end: undefined,
  region: "千葉",
  location: "イオンモール津田沼South 8階 ハチステ ソラ",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-11-14_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://takanenonadeshiko.jp/?p=5758",
    },
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2110566338511225041",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5758",
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
      open: "11:40",
      start: "12:00",
      setlist: [
        "衣装: A World in Our Colors 衣装",
        "ハートブーケ",
        "乙女どもよ。",
        "推しの魔法", // 撮影可能
        "僕らの青",
        "決戦スピリット",
      ],
      links: ["https://x.com/takanenofficial/status/2121471940057874780"],
    },
    {
      title: "1部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "橋本桃呼", "東山恵里沙", "日向端ひな"] },
          { label: "B グループ", members: ["涼海すう", "葉月紗蘭", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
    {
      title: "2部 ミニライブ",
      types: ["LIVE"],
      open: "15:10",
      start: "15:30",
      setlist: [
        "衣装: A World in Our Colors 衣装",
        "センパイ。",
        "女の子は強い",
        "約束", // 撮影可能
        "LOVE ANTHEM",
        "我武者羅",
      ],
      links: ["https://x.com/takanenofficial/status/2121543669060952361"],
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "葉月紗蘭", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "東山恵里沙", "日向端ひな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-11-14",
};

export const content = /* md */ `
  ## イベント概要

  ミニライブ & グループ握手会。

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: イオンモール津田沼South ハチステ ソラ 特設販売ブース

  ## リンク

  - [2部 開催報告 (ダイジェスト動画) - 公式 X](https://x.com/takanenofficial/status/2121543669060952361)
  - [1部 開催報告 (ダイジェスト動画) - 公式 X](https://x.com/takanenofficial/status/2121471940057874780)
  - [#あしたのたかねこ](https://x.com/takanenofficial/status/2121234124774265271)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5758)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
