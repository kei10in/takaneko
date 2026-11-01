import { Repertoire, TakanekoVersion } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

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
      type: "dance-performance",
      text: "Dance Performance Video",
      videoId: "https://www.youtube.com/watch?v=Vlpqp4QA61Y",
      publishedAt: "2026-06-07",
    },
    {
      type: "dance-practice",
      text: "Dance Practice Video",
      videoId: "https://www.youtube.com/watch?v=TdpfOc990TA",
      publishedAt: "2026-06-16",
    },
    {
      type: "original",
      text: "HoneyWorks Guest Vocal",
      videoId: "https://www.youtube.com/watch?v=SZfI0atkrfU",
      publishedAt: "2026-06-06",
    },
    {
      type: "original",
      text: "feat. REALITY",
      videoId: "https://www.youtube.com/watch?v=2IXfjykpeP8",
      publishedAt: "2026-06-03",
    },
    {
      text: "Off Vocal",
      videoId: "https://www.youtube.com/watch?v=6hTQ8kVVLoA",
      publishedAt: "2026-06-04",
    },
  ],

  isrcs: ["QT66P2682734"],

  appleMusic: "https://music.apple.com/jp/album/6776566362?i=6776566370",
  spotify: "https://open.spotify.com/track/1xwc78VjYxZYnYf1Rzz7T3",
  youtubeMusic: "https://music.youtube.com/watch?v=UQYR7olAOyA",
};
