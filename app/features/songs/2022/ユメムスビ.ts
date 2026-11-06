import { Original, Repertoire } from "../tags.ts";
import { SongMetaDescriptor } from "../types.ts";

export const ユメムスビ: SongMetaDescriptor = {
  slug: "ユメムスビ",
  name: "ユメムスビ",

  lyricsBy: "shito",
  composedBy: "shito",
  arrangedBy: "HoneyWorks",

  // https://x.com/enoki_zzz0112/status/1556291349011238913
  choreographedBy: "日下このみ",

  videoRelease: "2022-10-01",
  digitalRelease: "2022-10-01",
  liveDebut: "2022-08-07",

  tags: [Original, Repertoire],

  // https://magazine.tunecore.co.jp/newrelease/249134/
  coverArt: "/takaneko/songs/2022/ユメムスビ.jpg",

  officialSite: "https://takanenonadeshiko.jp/?p=1127",
  youtube: [
    {
      type: "mv",
      text: "MV",
      videoId: "qgYnKvdcMJQ",
      publishedAt: "2022-10-01",
    },
  ],

  recordings: [
    {
      isrc: "JPZ922209408",
      appleMusic: ["https://music.apple.com/jp/album/1647497771?i=1647498359"],
      spotify: ["https://open.spotify.com/track/5qQKiRYTj8mZUAh2b14cEl"],
      youtubeMusic: ["https://music.youtube.com/watch?v=i1j3RB8tl3A"],
      tunecore: ["https://linkco.re/8NCaQgFT"],
    },
  ],
};
