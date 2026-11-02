import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@ららぽーと立川立飛",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["握手会"],
  date: "2026-11-18",
  open: "16:40",
  start: "17:00",
  end: undefined,
  region: "東京",
  location: "ららぽーと立川立飛 2F イベント広場",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-11-18_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://x.com/takanenofficial/status/2117210120924942713",
    },
    {
      path: "/events/2026/2026-11-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2110566338511225041",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5779",
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
      title: "ミニライブ",
      types: ["LIVE"],
      open: "16:40",
      start: "17:00",
    },
    {
      title: "グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "日向端ひな"] },
          { label: "B グループ", members: ["涼海すう", "東山恵里沙", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-11-02",
};

export const content = /* md */ `
  ## イベント概要

  ミニライブ & グループ握手会。

  たかねこ盤 1 枚購入で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 15:00 〜
  - CD 販売受付場所: ららぽーと立川立飛 2F イベント広場 特設即売ブース

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5779)
  - [詳細発表 - 公式 X](https://x.com/takanenofficial/status/2117210120924942713)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
