import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "2nd アルバム「A World in Our Colors」リリースイベント@エミテラス所沢",
  category: "RELEASE_EVENT",
  liveType: "RELEASE_EVENT",
  meetAndGreetTypes: ["撮影会", "握手会"],
  date: "2026-09-12",
  open: undefined,
  start: "12:30",
  end: undefined,
  region: "埼玉",
  location: "エミテラス所沢 2F TOKOROZAWA e-CUBE",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-09-12_2nd アルバム「A World in Our Colors」リリースイベント.jpg",
      ref: "https://x.com/takanenofficial/status/2097250147088662976",
    },
    {
      path: "/events/2026/2026-09-05_2nd アルバム「A World in Our Colors」リリースイベントスケジュール.jpg",
      ref: "https://x.com/takanenofficial/status/2092540116913000546",
    },
  ],
  link: { text: "イベント詳細 - 公式ニュース", url: "https://takanenonadeshiko.jp/?p=5542" },
  ticket: "",
  streamings: undefined,
  goods: { time: undefined, lineup: undefined, url: undefined },
  acts: [
    { title: "1部 ミニライブ", types: ["LIVE"], open: "12:10", start: "12:30" },
    {
      title: "1部 グループショット撮影会",
      types: ["MEET_AND_GREET"],
      meetAndGreet: {
        costume: "",
        lanes: [
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "籾山ひめり"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "松本ももな"] },
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
          { label: "A グループ", members: ["城月菜央", "涼海すう", "東山恵里沙", "籾山ひめり"] },
          { label: "B グループ", members: ["橋本桃呼", "葉月紗蘭", "日向端ひな", "松本ももな"] },
        ],
      },
    },
  ],
  updatedAt: "2026-09-09",
};

export const content = /* md */ `
  ## イベント概要

  - 1 部 ミニライブ & グループショット撮影会
  - 2 部 ミニライブ & グループ握手会

  初回限定版 1 枚購入で「整理番号付き優先エリア入場券」 1 枚と希望グループの「グループショット撮影会参加券」を 1 枚を配布。

  たかねこ版 1 枚購入で「整理番号付き優先エリア入場券」 1 枚と希望グループの「グループ握手会参加券」を 2 枚を配布。

  - CD 販売開始: 10:10 〜
  - CD 販売受付場所: エミテラス所沢 2F TOKOROZAWA e-CUBE イベント会場特設ブース

  ## リンク

  - [イベント詳細 - 公式ニュース](https://takanenonadeshiko.jp/?p=5542)
  - [詳細告知 - 公式 X](https://x.com/takanenofficial/status/2097250147088662976)
  - [リリースイベントスケジュール告知 - 公式 X](https://x.com/takanenofficial/status/2092540116913000546)
`;
