import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@アリオ橋本",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-11-08",
  open: "11:40",
  start: "12:00",
  end: undefined,
  region: "神奈川",
  location: "アリオ橋本 1F屋外イベント広場",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-11-08_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://takanenonadeshiko.jp/?p=5708",
    },
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2110566338511225041",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5708",
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
    },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "東山恵里沙"] },
          { label: "B グループ", members: ["涼海すう", "日向端ひな", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
    {
      title: "2部 ミニライブ",
      types: ["LIVE"],
      open: "15:10",
      start: "15:30",
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "東山恵里沙"] },
          { label: "B グループ", members: ["涼海すう", "日向端ひな", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-10-15",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  初回限定盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループショット撮影会参加券」を 1 枚配布。

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: アリオ橋本 1F屋外イベント広場 特設ブース

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5708)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
