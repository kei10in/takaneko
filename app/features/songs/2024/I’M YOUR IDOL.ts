import { Original, Repertoire } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const IM_YOUR_IDOL: SongMetaDescriptor = {
  slug: "IM YOUR IDOL",
  name: "I’M YOUR IDOL",

  lyricsBy: "shito, Gom",
  composedBy: "shito",
  arrangedBy: "HoneyWorks",

  choreographedBy: "akane",

  videoRelease: "2024-11-27",
  digitalRelease: "2024-11-27",
  liveDebut: "2024-09-15",

  tags: [Original, Repertoire],

  coverArt: "/takaneko/songs/2024/I’M YOUR IDOL.webp",

  officialSite: "",
  youtube: [
    {
      type: "mv",
      text: "MV",
      videoId: "iz6KQup9Uys",
      publishedAt: "2024-11-27",
    },
    {
      type: "dance-practice",
      text: "Dance Practice Video",
      videoId: "https://www.youtube.com/watch?v=1SakX8WpzZc",
      publishedAt: "2026-08-03",
    },
    {
      type: "live",
      text: "LIVE",
      videoId: "7NK49pi5BFQ",
      publishedAt: "2024-11-30",
    },
  ],

  recordings: [
    {
      isrc: "JPVI02403451",
      appleMusic: ["https://music.apple.com/jp/album/1778995740?i=1778995741"],
      spotify: ["https://open.spotify.com/track/5iZ3PG8bNGWaAuY4OqpsJS"],
      youtubeMusic: ["https://music.youtube.com/watch?v=27-wRzBHGQE"],
      linkfire: ["https://jvcmusic.lnk.to/imyouridol"],
    },
  ],
};
