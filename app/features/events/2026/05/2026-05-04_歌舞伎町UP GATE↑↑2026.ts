import { EventMetaDescriptor } from "~/features/events/eventMeta";

export const meta: EventMetaDescriptor = {
  summary: "歌舞伎町UP GATE↑↑2026",
  category: "LIVE",
  liveType: "GUEST",
  date: "2026-05-04",
  open: "12:00",
  start: "13:00",
  end: undefined,
  region: "東京",
  location: "Zepp Shinjuku",
  present: ["高嶺のなでしこ2"],
  images: [
    {
      path: "/events/2026/2026-05-04_歌舞伎町UP GATE↑↑2026.webp",
      ref: "https://kabukicho-upgate.com/",
    },
    {
      path: "/events/2026/2026-05-04_歌舞伎町UP GATE↑↑2026_1.jpg",
      ref: "https://x.com/takanenofficial/status/2042860595129815306",
    },
    {
      path: "/events/2026/2026-05-04_歌舞伎町UP GATE↑↑2026_タイムテーブル.jpg",
      ref: "https://x.com/kabuki_upgate/status/2047601455633482102",
      tags: ["timetable"],
    },
  ],
  link: {
    text: "イベント公式サイト",
    url: "https://kabukicho-upgate.com/",
  },
  ticket: "https://ticket.rakuten.co.jp/music/jpop/idle/RTZPBBP/?scid=su_16699",
  streamings: undefined,
  goods: {
    time: undefined,
    lineup: undefined,
    url: undefined,
  },
  acts: {
    start: "19:40",
    end: "20:10",
    setlist: [],
    url: "",
  },
  updatedAt: "2026-04-25",
};

export const content = /* md */ `
  ## リンク

  - [タイムテーブル公開 - 歌舞伎町UP GATE↑↑ X](https://x.com/kabuki_upgate/status/2047601455633482102)
  - [告知 - 公式 X](https://x.com/takanenofficial/status/2042860595129815306)
`;
