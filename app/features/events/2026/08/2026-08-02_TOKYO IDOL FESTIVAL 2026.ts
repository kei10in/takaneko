import { EventMetaDescriptor } from "../../eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "TOKYO IDOL FESTIVAL 2026",
  keywords: ["TIF", "TIF2026"],
  category: "LIVE",
  liveType: "FESTIVAL",
  date: "2026-08-02",
  open: undefined,
  start: undefined,
  end: undefined,
  region: "東京",
  location: "お台場・青海周辺エリア",
  present: ["高嶺のなでしこ2"],
  images: [
    {
      path: "/events/2026/2026-08-02_TOKYO IDOL FESTIVAL 2026_高嶺のなでしこ出演タイムテーブル.jpg",
      ref: "https://x.com/takanenofficial/status/2082795873982206342",
      tags: ["timetable"],
    },
    {
      path: "/events/2026/2026-07-31_TOKYO IDOL FESTIVAL 2026.webp",
      ref: "https://official.idolfes.com/s/tif2026/",
    },
    {
      path: "/events/2026/2026-08-02_TOKYO IDOL FESTIVAL 2026_タイムテーブル.jpg",
      ref: "https://x.com/TIP_TIF_staff/status/2075177498573517014",
      tags: ["timetable"],
    },
    {
      path: "/events/2026/2026-08-02_TOKYO IDOL FESTIVAL 2026_INFO CENTRE トーク企画.jpg",
      ref: "https://x.com/TIP_TIF_staff/status/2080593845058707566",
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
      title: "UP-T HOT STAGE",
      types: ["LIVE"],
      start: "09:45",
      end: "10:15",
      description: `
        有料配信: [TIF Streaming] / [FOD]

        [TIF Streaming]: https://official.idolfes.com/s/tifst
        [FOD]: https://fod.fujitv.co.jp/ppv/8520/
      `,
    },
    {
      title: "INFO CENTRE",
      types: ["TALK"],
      start: "15:45",
      end: "16:25",
      description: /* md */ `
        歌声喫茶“みてい”

        💙籾山ひめりが出演。

        無料配信: [SHOWROOM]

        [SHOWROOM]: https://www.showroom-live.com/tif_infocentre
      `,
    },
  ],
  updatedAt: "2026-07-30",
};

export const content = /* md */ `
  ## リンク

  - [出演タイムテーブル - 公式 X](https://x.com/takanenofficial/status/2082795873982206342)
  - [放送・配信 - イベントサイト](https://official.idolfes.com/s/tif2026/page/broadcast)
  - [INFO CENTRE トーク企画 出演告知 - 公式 X](https://x.com/takanenofficial/status/2080631584475222296)
  - [INFO CENTRE トーク企画 出演者発表 - TIP&TIF X](https://x.com/TIP_TIF_staff/status/2080593845058707566)
  - [タイムテーブル公開 - 公式 X](https://x.com/takanenofficial/status/2075195766973583430)
  - [タイムテーブル公開 - TIP&TIF X](https://x.com/TIP_TIF_staff/status/2075177498573517014)
  - [出演日決定 - 公式 X](https://x.com/takanenofficial/status/2063834688842821651)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2041751260945379650)
  - [出演者情報 - イベントサイト](https://official.idolfes.com/s/tif2026/page/lineup)
`;
