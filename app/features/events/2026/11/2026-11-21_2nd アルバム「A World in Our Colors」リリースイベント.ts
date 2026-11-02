import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@ステラタウン大宮",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["握手会"],
  date: "2026-11-21",
  open: "11:40",
  start: "12:00",
  end: undefined,
  region: "埼玉",
  location: "ステラタウン大宮 メローペ広場",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-11-21_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://x.com/takanenofficial/status/2117210120924942713",
    },
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2110566338511225041",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5786",
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
      title: "1部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "東山恵里沙", "日向端ひな", "籾山ひめり"] },
          { label: "B グループ", members: ["涼海すう", "橋本桃呼", "葉月紗蘭", "松本ももな"] },
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
          { label: "A グループ", members: ["城月菜央", "涼海すう", "橋本桃呼", "日向端ひな"] },
          { label: "B グループ", members: ["葉月紗蘭", "東山恵里沙", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-11-02",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループ撮影会
  - 2 部 ミニライブ & グループ握手会

  たかねこ盤 1 枚購入で希望の部の「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: ステラタウン大宮 メローペ広場 特設販売ブース

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5786)
  - [詳細発表 - 公式 X](https://x.com/takanenofficial/status/2117210120924942713)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
