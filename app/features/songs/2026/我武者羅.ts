import { Repertoire, TakanekoVersion } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const 我武者羅: SongMetaDescriptor = {
  slug: "我武者羅",
  name: "我武者羅",

  lyricsBy: "HoneyWorks",
  composedBy: "HoneyWorks",
  arrangedBy: "HoneyWorks",

  // https://x.com/NaokiGunzHUNT/status/2099077817812263086
  choreographedBy: "NAOKI",

  videoRelease: undefined,
  digitalRelease: "2026-11-18",
  liveDebut: "2026-09-13",

  tags: [TakanekoVersion, Repertoire],

  coverArt: "/takaneko/songs/2026/A World in Our Colors.jpg",

  officialSite: "",
  youtube: [
    {
      type: "original",
      text: "Official MV",
      videoId: "https://www.youtube.com/watch?v=iw557YNs6g0",
      publishedAt: "2021-10-09",
    },
    {
      text: "Off Vocal",
      videoId: "https://www.youtube.com/watch?v=tQVvfLlG7Rk",
      publishedAt: "2021-10-12",
    },
  ],

  recordings: [
    {
      isrc: "JPVI02602807",
      appleMusic: ["https://music.apple.com/jp/album/6828699570?i=6828699571"],
      spotify: ["https://open.spotify.com/track/1ayIJZRwQmaiVqt9GEH5bm"],
      youtubeMusic: ["https://music.youtube.com/watch?v=jFFFbFLlqiM"],
      linkfire: ["https://jvcmusic.lnk.to/aworldinourcolors"],
    },
  ],
};
