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
  repertoireSince: "2022-08-27",

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

  recordings: [
    {
      isrc: "JPVI02602818",
      appleMusic: ["https://music.apple.com/jp/album/6828699570?i=6828699584"],
      spotify: ["https://open.spotify.com/track/4dMzJ8ojGaC8KVxCsbWSBR"],
      youtubeMusic: ["https://music.youtube.com/watch?v=GXEhsLlLOes"],
      linkfire: ["https://jvcmusic.lnk.to/aworldinourcolors"],
    },
  ],
};
