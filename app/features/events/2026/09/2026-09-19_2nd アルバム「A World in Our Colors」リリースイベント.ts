import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@ららぽーと TOKYO-BAY",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["握手会"],
  date: "2026-09-19",
  open: "11:40",
  start: "12:00",
  end: undefined,
  region: "千葉",
  location: "ららぽーと TOKYO-BAY North Gate みどりの広場",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-09-19_2nd アルバム「A World in Our Colors」リリースイベント_詳細.jpg",
      ref: "https://takanenonadeshiko.jp/?p=5547",
    },
    {
      path: "/events/2026/2026-09-19_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://x.com/takanenofficial/status/2097250147088662976",
    },
    {
      path: "/events/2026/2026-09-05_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2092540116913000546",
    },
  ],
  link: { text: "イベント詳細 - 公式ニュース", url: "https://takanenonadeshiko.jp/?p=5547" },
  ticket: "",
  streamings: undefined,
  goods: { time: undefined, lineup: undefined, url: undefined },
  acts: [
    { title: "1部 ミニライブ", types: ["LIVE"], open: "11:40", start: "12:00" },
    {
      title: "1部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "日向端ひな", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "東山恵里沙", "籾山ひめり"] },
        ],
      },
    },
    { title: "2部 ミニライブ", types: ["LIVE"], open: "15:10", start: "15:30" },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "橋本桃呼", "東山恵里沙"] },
          { label: "B グループ", members: ["葉月紗蘭", "日向端ひな", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-09-16",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループ握手会
  - 2 部 ミニライブ & グループ握手会

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: ららぽーとTOKYO-BAY North Gate みどりの広場 CD販売ブースにて

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5547)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2097250147088662976)
  - [リリースイベントスケジュール告知 - 公式 X](https://x.com/takanenofficial/status/2092540116913000546)
`;
