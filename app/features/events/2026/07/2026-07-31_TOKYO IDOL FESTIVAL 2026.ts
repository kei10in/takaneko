import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "TOKYO IDOL FESTIVAL 2026",
  keywords: ["TIF", "TIF2026"],
  category: "LIVE",
  liveType: "FESTIVAL",
  date: "2026-07-31",
  open: undefined,
  start: undefined,
  end: undefined,
  region: "東京",
  location: "お台場・青海周辺エリア",
  present: ["高嶺のなでしこ2"],
  images: [
    {
      path: "/events/2026/2026-07-31_TOKYO IDOL FESTIVAL 2026.webp",
      ref: "https://official.idolfes.com/s/tif2026/",
    },
    {
      path: "/events/2026/2026-07-31_TOKYO IDOL FESTIVAL 2026_タイムテーブル.jpg",
      ref: "https://x.com/TIP_TIF_staff/status/2075177498573517014",
      tags: ["timetable"],
    },
    {
      path: "/events/2026/2026-07-31_TOKYO IDOL FESTIVAL 2026_スペシャルコラボステージ.jpg",
      ref: "https://x.com/takanenofficial/status/2072674247311552701",
    },
  ],
  link: {
    text: "イベントサイト",
    url: "https://official.idolfes.com/s/tif2026/",
  },
  ticket: "https://official.idolfes.com/s/tif2026/page/ticket",
  streamings: undefined,
  goods: {
    time: undefined,
    lineup: undefined,
    url: undefined,
  },
  acts: [
    {
      title: "TOROCCO PARK",
      types: ["LIVE"],
      start: "16:10",
      end: "16:30",
    },
    {
      title: "TOROCCO PARK",
      types: ["OTHER"],
      start: "16:30",
      end: "16:35",
      description: "くままちょこっと乱入コラボ",
    },
    {
      title: "SKY STAGE",
      types: ["LIVE"],
      start: "20:25",
      end: "20:40",
    },
  ],
  updatedAt: "2026-07-10",
};

export const content = /* md */ `
  ## リンク

  - [タイムテーブル公開 - 公式 X](https://x.com/takanenofficial/status/2075195766973583430)
  - [タイムテーブル公開 - TIP&TIF 公式 X](https://x.com/TIP_TIF_staff/status/2075177498573517014)
  - [くままちょこっと乱入コラボ 告知 - 公式 X](https://x.com/takanenofficial/status/2072674247311552701)
  - [出演日決定 - 公式 X](https://x.com/takanenofficial/status/2063834688842821651)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2041751260945379650)
  - [出演者情報 - イベントサイト](https://official.idolfes.com/s/tif2026/page/lineup)
`;
