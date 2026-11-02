import { Original, Repertoire } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const アイドル衣装: SongMetaDescriptor = {
  slug: "アイドル衣装",
  name: "アイドル衣装",

  lyricsBy: "shito, Gom",
  composedBy: "shito",
  arrangedBy: "HoneyWorks",

  choreographedBy: "RINO HONDA",

  videoRelease: "2025-05-28",
  digitalRelease: "2025-05-28",
  liveDebut: "2025-05-06",

  tags: [Original, Repertoire],

  coverArt: "/takaneko/songs/2025/アイドル衣装.jpg",
  // https://x.com/takanenofficial/status/1922616277085856235

  officialSite: "https://takanenonadeshiko.jp/?p=3841",
  youtube: [
    {
      type: "mv",
      text: "MV",
      videoId: "a7CAn_FIfSk",
      publishedAt: "2025-05-28",
    },
    {
      type: "mv-making",
      text: "Making",
      videoId: "https://www.youtube.com/watch?v=Zy8zFOHL8_s",
      publishedAt: "2025-06-06",
    },
    {
      type: "live",
      text: "Live (東名阪ツアー 2025 - Spring Ride -)",
      videoId: "https://www.youtube.com/watch?v=srRzKsh_lMY",
      publishedAt: "2025-09-03",
    },
  ],

  recordings: [
    {
      isrc: "JPVI02501229",
      appleMusic: ["https://music.apple.com/jp/album/1813335324?i=1813335325"],
      spotify: ["https://open.spotify.com/track/08rX0Cds4ojQy6ZGdehBYM"],
      youtubeMusic: ["https://music.youtube.com/watch?v=AMO4-UTPmpY"],
    },
  ],
};
