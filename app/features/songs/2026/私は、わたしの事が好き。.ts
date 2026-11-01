import { Repertoire, TakanekoVersion } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const 私はわたしの事が好き: SongMetaDescriptor = {
  slug: "私はわたしの事が好き",
  name: "私は、わたしの事が好き。",

  lyricsBy: "shito, Gom",
  composedBy: "shito, 中西",
  arrangedBy: "HoneyWorks",

  choreographedBy: "らん先生",

  videoRelease: "2026-04-14",
  digitalRelease: "2026-04-15",
  liveDebut: "2026-04-12",

  tags: [TakanekoVersion, Repertoire],

  coverArt: "/takaneko/songs/2026/私は、わたしの事が好き。.jpg",

  youtube: [
    {
      type: "dance-performance",
      text: "Dance Performance Video",
      videoId: "IoCC9aOnX-E",
      publishedAt: "2026-04-14",
    },
    {
      type: "dancing",
      text: "踊ってみた",
      videoId: "https://www.youtube.com/watch?v=G5sjPEnOZJs",
      publishedAt: "2026-04-19",
    },
    {
      text: "3D ライブ映像 (超かぐや姫！)",
      videoId: "pnb_BVChIaw",
      publishedAt: "2026-03-12",
    },
    {
      type: "original",
      text: "Official MV (超かぐや姫！)",
      videoId: "J5tRnYiHifE",
      publishedAt: "2025-12-12",
    },
  ],

  isrcs: ["QT66M2652630"],

  appleMusic: "https://music.apple.com/jp/album/1893073069?i=1893073077",
  spotify: "https://open.spotify.com/track/1ioMEMvO9GwwW2MDBj7OBO",
  youtubeMusic: "https://music.youtube.com/watch?v=wNzUGwQ30ho",
};
