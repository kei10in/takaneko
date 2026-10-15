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
  digitalRelease: undefined,
  liveDebut: "2026-09-13",

  tags: [TakanekoVersion, Repertoire],

  coverArt: "",

  officialSite: "",
  youtube: [
    {
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
};
