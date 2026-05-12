import { EventMetaDescriptor } from "~/features/events/eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "テレビ朝日「イベレコ」",
  category: "TV",
  date: "2026-05-22",
  start: "26:45",
  end: "27:00",
  region: "テレビ",
  present: ["東山恵里沙", "松本ももな", "籾山ひめり"],
  images: [
    {
      path: "/events/2026/2026-05-15_テレビ朝日「イベレコ」.jpg",
      ref: "https://x.com/takanenofficial/status/2054124422244569289",
    },
  ],
  link: {
    text: "番組サイト",
    url: "https://www.tv-asahi.co.jp/pr/sphone/20260515_12065.html",
  },
  updatedAt: "2026-05-12",
};

export const content = /* md */ `
  ## 番組詳細

  > **◇番組内容**
  >
  > テレビ朝日イチオシの「イベ」ントを「レコ」メンドするエンタメ情報番組「イベレコ」。
  > 番組キャラクター“イベレコ王子"と一緒に、おすすめイベントを深掘りしちゃいます!
  > 『mirror, mirror, mirror mika ninagawa』特集では、ABEMA『今日、好きになりました。』の“しゅんゆま"カップルが、下北沢の街を歩きながら展覧会コラボの4つの店舗を巡ります!
  >
  > **◇出演者**
  >
  > 【VTR出演】倉澤俊、谷村優真
  >
  > 【マンスリーゲスト】東山恵里沙、松本ももな、籾山ひめり(高嶺のなでしこ)
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

  - [告知 (告知動画あり) - イベレコ X](https://x.com/tvasahi_event/status/2053671436796281000)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2054124422244569289)
`;
