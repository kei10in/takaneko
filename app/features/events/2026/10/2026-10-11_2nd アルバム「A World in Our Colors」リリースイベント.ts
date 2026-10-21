import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@イオンモール幕張新都心",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-10-11",
  open: "12:10",
  start: "12:30",
  end: undefined,
  region: "千葉",
  location: "イオンモール幕張新都心 グランドモール1F グランドスクエア",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-10-11_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://x.com/takanenofficial/status/2105243759730467001",
    },
    {
      path: "/events/2026/2026-10-03_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2100148938305155396",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/?p=5623",
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
        "初恋のひと。",
        "小悪魔だってかまわない！",
        "可愛くてごめん", // 撮影可能
        "初披露: かわいいは常識♡",
        "ファンサ",
      ],
      links: ["https://x.com/takanenofficial/status/2109162083053109567"],
    },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "籾山ひめり"] },
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
        "乙女どもよ。",
        "ハートブーケ",
        "ヒロインは平均以下。", // 撮影可能
        "我武者羅",
        "恋を知った世界",
      ],
      links: ["https://x.com/takanenofficial/status/2109233800207327344"],
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "A World in Our Colors 衣装",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-10-14",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  ミニライブは観覧フリー。対象 CD 1 枚予約で、希望する部の「整理番号付き優先エリア入場券」を 1 会計につき 1 枚配布。

  初回限定盤 1 枚予約で、希望グループの「グループショット撮影会参加券」を 1 枚配布。
  たかねこ盤 1 枚予約で、希望グループの「グループ握手会参加券」を 2 枚配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: グランドモール1F グランドスクエア

  ## リンク

  - [ももなんコール - たかねこまねーじゃー X](https://x.com/takanekomanager/status/2109641486350643345)
  - [2部 開催報告 (ダイジェスト動画あり) - 公式 X](https://x.com/takanenofficial/status/2109233800207327344)
  - [1部 開催報告 (ダイジェスト動画あり) - 公式 X](https://x.com/takanenofficial/status/2109162083053109567)
  - [#あしたのたかねこ](https://x.com/takanenofficial/status/2108920486755467611)
  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5623)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2105243759730467001)
  - [告知 - 公式ニュース](https://takanenonadeshiko.jp/?p=5580)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2100148938305155396)
`;
