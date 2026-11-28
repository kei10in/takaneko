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
      setlist: [
        "衣装: A World in Our Colors 衣装",
        "約束",
        "I’M YOUR IDOL",
        "[撮影可能]かわいいは常識♡",
        "我武者羅",
        "花は誓いを忘れない",
        "ファンサ",
        "美しく生きろ",
      ],
      links: ["https://x.com/takanenofficial/status/2123004539062116720"],
    },
    {
      title: "グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "橋本桃呼", "葉月紗蘭", "日向端ひな"] },
          { label: "B グループ", members: ["涼海すう", "東山恵里沙", "松本ももな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-11-19",
};

export const content = /* md */ `
  ## イベント概要

  ミニライブ & グループ握手会。

  たかねこ盤 1 枚購入で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 15:00 〜
  - CD 販売受付場所: ららぽーと立川立飛 2F イベント広場 特設即売ブース

  ## リンク

  - [オフィシャルレポート](https://prtimes.jp/main/html/rd/p/000001010.000025517.html)
  - [開催報告 - 公式 X](https://x.com/takanenofficial/status/2123004539062116720)
  - [#きょうのたかねこ](https://x.com/takanenofficial/status/2122872421896352045)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5779)
  - [詳細発表 - 公式 X](https://x.com/takanenofficial/status/2117210120924942713)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2110566338511225041)
`;
