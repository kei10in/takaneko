import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@ららぽーと横浜",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-09-26",
  open: "11:40",
  start: "12:00",
  end: undefined,
  region: "神奈川",
  location: "ららぽーと横浜 1F セントラルガーデン KiLaLa",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-09-26_2nd アルバム「A World in Our Colors」リリースイベント_詳細.jpg",
      ref: "https://x.com/takanenofficial/status/2103492221261476222",
    },
    {
      path: "/events/2026/2026-09-05_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2092540116913000546",
    },
  ],
  link: { text: "イベント詳細 - 公式ニュース", url: "https://takanenonadeshiko.jp/?p=5592" },
  ticket: "",
  streamings: undefined,
  goods: { time: undefined, lineup: undefined, url: undefined },
  acts: [
    {
      title: "1部 ミニライブ",
      types: ["LIVE"],
      open: "11:40",
      start: "12:00",
      setlist: [
        "衣装: 2026 秋衣装",
        "世界は恋に落ちている",
        "花は誓いを忘れない",
        "ヒロインは平均以下。", // 撮影可能
        "僕らの青",
        "ファンサ",
      ],
      links: ["https://x.com/takanenofficial/status/2103707385076338869"],
    },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "2026 秋衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "葉月紗蘭", "日向端ひな", "松本ももな"] },
          { label: "B グループ", members: ["涼海すう", "橋本桃呼", "東山恵里沙", "籾山ひめり"] },
        ],
      },
    },
    {
      title: "2部 ミニライブ",
      types: ["LIVE"],
      open: "15:10",
      start: "15:30",
      setlist: [
        "衣装: 2026 秋衣装",
        "女の子は強い",
        "ハートブーケ",
        "推しの魔法", // 撮影可能
        "約束",
        "乙女どもよ。",
      ],
      links: ["https://x.com/takanenofficial/status/2103767782936715512"],
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "2026 秋衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "葉月紗蘭", "日向端ひな", "松本ももな"] },
          { label: "B グループ", members: ["涼海すう", "橋本桃呼", "東山恵里沙", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-09-27",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  初回限定盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループショット撮影会参加券」を 1 枚配布。

  たかねこ盤 1 枚予約で「整理番号付き優先エリア入場券」1 枚と希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: ららぽーと横浜 CD販売ブースにて

  ## リンク

  - [2部 開催報告 (ダイジェスト動画あり) - 公式 X](https://x.com/takanenofficial/status/2103767782936715512)
  - [1部 開催報告 (ダイジェスト動画あり) - 公式 X](https://x.com/takanenofficial/status/2103707385076338869)
  - [#あしたのたかねこ](https://x.com/takanenofficial/status/2103492221261476222)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5592)
  - [イベント詳細 - ビクターエンタテインメント](https://www.jvcmusic.co.jp/-/News/A028511/193.html)
  - [リリースイベントスケジュール告知 - 公式 X](https://x.com/takanenofficial/status/2092540116913000546)
`;
