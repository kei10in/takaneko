import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@イオンレイクタウン mori",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["握手会"],
  date: "2026-09-22",
  open: "14:40",
  start: "15:00",
  end: undefined,
  region: "埼玉",
  location: "イオンレイクタウン mori TREE STAGE (1F 木の広場)",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-09-22_2nd アルバム「A World in Our Colors」リリースイベント_詳細.jpg",
      ref: "https://takanenonadeshiko.jp/?p=5552",
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
  link: { text: "イベント詳細 - 公式ニュース", url: "https://takanenonadeshiko.jp/?p=5552" },
  ticket: "",
  streamings: undefined,
  goods: { time: undefined, lineup: undefined, url: undefined },
  acts: [
    {
      title: "ミニライブ",
      types: ["LIVE"],
      open: "14:40",
      start: "15:00",
      setlist: [
        "衣装: 2026 秋衣装",
        "初恋のひと。",
        "初恋のこたえ。",
        "可愛くてごめん", // 撮影可能
        "ファンサ",
        "美しく生きろ",
      ],
      links: ["https://x.com/takanenofficial/status/2102329556120334507"],
    },
    {
      title: "グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "2026 秋衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "葉月紗蘭", "東山恵里沙", "松本ももな"] },
          { label: "B グループ", members: ["涼海すう", "橋本桃呼", "日向端ひな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-09-22",
};

export const content = /* md */ `
  ## イベント概要

  - ミニライブ & グループ握手会

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 12:00 〜
  - CD 販売受付場所: イオンレイクタウンmori TREE STAGE (木の広場) CD販売ブースにて

  ## リンク

  - [開催報告 - 公式 X](https://x.com/takanenofficial/status/2102329556120334507)
  - [#あしたのたかねこ](https://x.com/takanenofficial/status/2102047699415503072)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5552)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2097250147088662976)
  - [リリースイベントスケジュール告知 - 公式 X](https://x.com/takanenofficial/status/2092540116913000546)
`;
