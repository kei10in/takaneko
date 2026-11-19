import { Repertoire, TakanekoVersion } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const ファンサ: SongMetaDescriptor = {
  slug: "ファンサ",
  name: "ファンサ",

  lyricsBy: "HoneyWorks",
  composedBy: "HoneyWorks",
  arrangedBy: "HoneyWorks",

  choreographedBy: "NaNa",

  videoRelease: undefined,
  digitalRelease: "2026-11-18",
  liveDebut: "2022-08-27",

  tags: [TakanekoVersion, Repertoire],

  coverArt: "/takaneko/songs/2026/A World in Our Colors.jpg",

  officialSite: undefined,
  youtube: [
    {
      type: "original",
      text: "キャラクター バージョン / mona (CV: 夏川椎菜)",
      videoId: "https://www.youtube.com/watch?v=lzyDD8bMDKs",
      publishedAt: "2019-06-22",
    },
    {
      text: "off vocal",
      videoId: "https://www.youtube.com/watch?v=F0rTxW5K0dk",
      publishedAt: "2020-05-28",
    },
  ],
};
