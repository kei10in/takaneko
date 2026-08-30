import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@有明ガーデン",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-09-06",
  open: undefined,
  start: "12:30",
  end: undefined,
  region: "東京",
  location: "有明ガーデン モール棟3F みんなのテラス",
  present: ["高嶺のなでしこ2"],
  images: [
    {
      path: "/events/2026/2026-09-06_2nd アルバム「A World in Our Colors」リリースイベント@有明ガーデン.jpg",
      ref: "https://takanenonadeshiko.jp/newalbum-aworldinourcolors-0906/",
    },
    {
      path: "/events/2026/2026-09-05_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2092540116913000546",
    },
  ],
  link: {
    text: "イベント詳細 - 公式ニュース",
    url: "https://takanenonadeshiko.jp/newalbum-aworldinourcolors-0906/",
  },
  ticket: "",
  streamings: undefined,
  goods: { time: undefined, lineup: undefined, url: undefined },
  acts: [
    {
      title: "1部 ミニライブ",
      types: ["LIVE"],
      open: "12:10",
      start: "12:30",
    },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          {
            label: "A グループ",
            members: ["城月菜央", "葉月紗蘭", "松本ももな", "籾山ひめり"],
          },
          {
            label: "B グループ",
            members: ["涼海すう", "橋本桃呼", "東山恵里沙", "日向端ひな"],
          },
        ],
      },
    },
    {
      title: "2部 ミニライブ",
      types: ["LIVE"],
      open: "15:40",
      start: "16:00",
    },
    {
      title: "2部 グループ握手会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          {
            label: "A グループ",
            members: ["城月菜央", "葉月紗蘭", "松本ももな", "籾山ひめり"],
          },
          {
            label: "B グループ",
            members: ["涼海すう", "橋本桃呼", "東山恵里沙", "日向端ひな"],
          },
        ],
      },
    },
  ],
  updatedAt: "2026-08-30",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  初回限定版 1 枚購入で「整理番号付き優先エリア入場券」 1 枚と希望グループの「グループショット撮影会参加券」を 1 枚を配布。

  たかねこ版 1 枚購入で「整理番号付き優先エリア入場券」 1 枚と希望グループの「グループ握手会参加券」を 2 枚を配布。

  - CD 販売開始: 10:00 〜
  - CD 販売受付場所: 有明ガーデン モール棟 3F みんなのテラス CD販売ブースにて

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/newalbum-aworldinourcolors-0906/)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2092545563300696256)
  - [リリースイベントスケジュール告知 - 公式 X](https://x.com/takanenofficial/status/2092540116913000546)
`;
