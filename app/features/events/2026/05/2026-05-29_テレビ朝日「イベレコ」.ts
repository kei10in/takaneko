import { EventMetaDescriptor } from "~/features/events/eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "テレビ朝日「イベレコ」",
  category: "TV",
  date: "2026-05-29",
  start: "26:45",
  end: "27:00",
  region: "テレビ",
  present: ["東山恵里沙", "松本ももな", "籾山ひめり"],
  images: [
    {
      path: "/events/2026/2026-05-29_テレビ朝日「イベレコ」.jpg",
      ref: "https://x.com/takanenofficial/status/2060270121529254159",
    },
    {
      path: "/events/2026/2026-05-29_テレビ朝日「イベレコ」_1.jpg",
      ref: "https://x.com/tvasahi_event/status/2060285017260253334",
    },
  ],
  link: {
    text: "番組サイト",
    url: "https://www.tv-asahi.co.jp/pr/sphone/20260529_15646.html",
  },
  updatedAt: "2026-05-29",
};

export const content = /* md */ `
  ## 番組詳細

  > **◇番組内容**
  >
  > テレビ朝日イチオシの「イベ」ントを「レコ」メンドするエンタメ情報番組「イベレコ」。
  > 番組キャラクター“イベレコ王子"と一緒に、おすすめイベントを深掘りしちゃいます!
  > 5月後半のゲストは、高嶺のなでしこのメンバーから、東山恵里沙さん、松本ももなさん、籾山ひめりさん!
  >
  > **◇出演者**
  >
  > 【5月後半ゲスト】東山恵里沙、松本ももな、籾山ひめり(高嶺のなでしこ)
  >
  > 【声の出演】佐々木亮太(テレビ朝日アナウンサー)
  >
  > **◇おしらせ**
  >
  > ☆『テレビ朝日イベントウェブ』
  >
  > https://www.tv-asahi.co.jp/event/
  >
  > ☆『イベレコ』
  >
  > 公式X(旧Twitter)<br/>
  > https://x.com/tvasahi_event
  >
  > 公式Instagram<br/>
  > https://www.instagram.com/tvasahi_ibereco/

  ## リンク

  - [当日告知 - イベレコ X](https://x.com/tvasahi_event/status/2060285017260253334)
  - [当日告知 - 公式 X](https://x.com/takanenofficial/status/2060270121529254159)
  - [告知 (告知動画あり) - イベレコ X](https://x.com/tvasahi_event/status/2053671436796281000)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2054124422244569289)
`;
