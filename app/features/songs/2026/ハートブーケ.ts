import { Repertoire, TakanekoVersion } from "../tags";
import { SongMetaDescriptor } from "../types";

export const ハートブーケ: SongMetaDescriptor = {
  slug: "ハートブーケ",
  name: "ハートブーケ",

  lyricsBy: "shito",
  composedBy: "shito, 中西",
  arrangedBy: "HoneyWorks",

  choreographedBy: "NaNa",

  videoRelease: "2026-06-07",
  digitalRelease: "2026-06-07",
  liveDebut: undefined,

  tags: [TakanekoVersion, Repertoire],

  coverArt: "/takaneko/songs/2026/ハートブーケ.jpg",

  youtube: [
    {
      text: "Dance Performance Video",
      videoId: "https://www.youtube.com/watch?v=Vlpqp4QA61Y",
      publishedAt: "2026-06-07",
    },
    {
      text: "HoneyWorks Guest Vocal",
      videoId: "https://www.youtube.com/watch?v=SZfI0atkrfU",
      publishedAt: "2026-06-06",
    },
    {
      text: "feat. REALITY",
      videoId: "https://www.youtube.com/watch?v=2IXfjykpeP8",
      publishedAt: "2026-06-03",
    },
  ],
};
