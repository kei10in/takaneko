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
    { title: "1部 ミニライブ", types: ["LIVE"], open: "12:10", start: "12:30" },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "籾山ひめり"] },
        ],
      },
    },
    { title: "2部 ミニライブ", types: ["LIVE"], open: "15:40", start: "16:00" },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "松本ももな"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "籾山ひめり"] },
        ],
      },
    },
  ],
  updatedAt: "2026-10-01",
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

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5623)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2105243759730467001)
  - [告知 - 公式ニュース](https://takanenonadeshiko.jp/?p=5580)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2100148938305155396)
`;
