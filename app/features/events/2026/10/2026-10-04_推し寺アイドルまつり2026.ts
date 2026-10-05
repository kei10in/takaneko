import { EventMetaDescriptor } from "../../eventMeta.ts";

export const meta: EventMetaDescriptor = {
  summary: "推し寺アイドルまつり2026",
  category: "LIVE",
  liveType: "FESTIVAL",
  date: "2026-10-04",
  open: "14:00",
  start: "15:00",
  end: "18:15",
  region: "愛知",
  location: "東別院テラスホール",
  present: ["高嶺のなでしこ3"],
  images: [
    {
      path: "/events/2026/2026-10-04_推し寺アイドルまつり2026.jpg",
      ref: "https://x.com/takanenofficial/status/2080493358410342527",
    },
    {
      path: "/events/2026/2026-10-04_推し寺アイドルまつり2026_タイムテーブル.jpg",
      ref: "https://x.com/event_nagoyatv/status/2105538968838394287",
      tags: ["timetable"],
    },
    {
      path: "/takaneko/goods/2026/2026-09-09_ミニフォトカード「ワンピース 2026」.jpg",
      ref: "https://x.com/takanekomanager/status/2106675741278822412",
    },
    {
      path: "/events/2026/2026-10-04_推し寺アイドルまつり2026_本日のおチェキ.jpg",
      ref: "https://x.com/takanekomanager/status/2106675741278822412",
    },
  ],
  link: {
    text: "メ〜テレ イベント情報",
    url: "https://www.nagoyatv.com/event/oshideraidolfes2026.html",
  },
  ticket: "https://fan.pia.jp/nagoyatv-event/ticket/detail/154",
  streamings: undefined,
  goods: {
    time: ["終演後"],
    lineup: ["ミニフォトカード「ワンピース 2026」 / チェキ"],
    url: "https://x.com/takanekomanager/status/2106675741278822412",
  },
  acts: [
    {
      title: "トーク収録",
      types: ["TALK"],
      start: "16:50",
      end: "17:00",
      description: `
        出演者の選抜メンバーでトーク収録。
        橋本桃呼、松本ももなが出演。
      `,
      links: ["https://x.com/MomokoHashimoto/status/2106707204011352482"],
    },
    {
      title: "ライブ",
      types: ["LIVE"],
      start: "17:50",
      end: "18:15",
      setlist: [
        "衣装: 2026 秋衣装",
        "初恋のひと。",
        "女の子は強い",
        "月曜日の憂鬱",
        "我武者羅",
        "美しく生きろ",
      ],
      links: ["https://x.com/takanenofficial/status/2106681985573818736"],
    },
  ],
  updatedAt: "2026-10-05",
};

export const content = /* md */ `
  ## リンク

  - [出演報告 - 公式 X](https://x.com/takanenofficial/status/2106681985573818736)
  - [本日のおチェキ](https://x.com/takanekomanager/status/2106675741278822412)
  - [#あしたのたかねこ](https://x.com/takanenofficial/status/2106368679961034987)
  - [タイムテーブル公開 - メ〜チケ（メ〜テレイベント）X](https://x.com/event_nagoyatv/status/2105538968838394287)
  - [メ〜テレ イベント情報](https://www.nagoyatv.com/event/oshideraidolfes2026.html)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2080493358410342527)
`;
