import { renderToStaticMarkup } from "react-dom/server";
import { assert, describe, expect, it } from "vitest";
import { YouTubeEmbedPlayer } from "./YouTubeEmbedPlayer.tsx";

const playerUrl = (element: React.ReactElement): URL => {
  const template = document.createElement("template");
  template.innerHTML = renderToStaticMarkup(element);
  const src = template.content.querySelector("iframe")?.getAttribute("src");
  assert(src);
  return new URL(src);
};

describe("YouTubeEmbedPlayer", () => {
  it.each([
    "ABCDEFGHIJK",
    "ABCDEFGHIJK?start=30&autoplay=1#t=45",
    "https://www.youtube.com/watch?v=ABCDEFGHIJK&t=30&autoplay=1&list=PL123#t=45",
    "https://youtu.be/ABCDEFGHIJK?si=share&start=30",
    "https://www.youtube.com/shorts/ABCDEFGHIJK?start=30",
    "https://www.youtube.com/embed/ABCDEFGHIJK?start=30&controls=0",
    "https://www.youtube-nocookie.com/embed/ABCDEFGHIJK?start=30&controls=0",
  ])("%s から動画 ID だけを使ってプレイヤーを表示する", (videoId) => {
    expect(playerUrl(<YouTubeEmbedPlayer videoId={videoId} />).href).toBe(
      "https://www.youtube-nocookie.com/embed/ABCDEFGHIJK",
    );
  });

  it("入力 URL のクエリを無視して Props の再生設定だけを使う", () => {
    const url = playerUrl(
      <YouTubeEmbedPlayer
        videoId="https://www.youtube.com/watch?v=ABCDEFGHIJK&start=99&autoplay=1&rel=1"
        start={0}
        autoplay={false}
        cc_load_policy={false}
        controls={false}
        disablekb={false}
        enablejsapi={false}
        fs={false}
        loop={false}
        playsinline={false}
        end={60}
        rel={false}
        hl={undefined}
      />,
    );

    expect(Object.fromEntries(url.searchParams)).toEqual({
      start: "0",
      autoplay: "0",
      cc_load_policy: "0",
      controls: "0",
      disablekb: "0",
      enablejsapi: "0",
      fs: "0",
      loop: "0",
      playsinline: "0",
      end: "60",
      rel: "0",
    });
  });

  it("公式のプレイヤーパラメーターをクエリに設定する", () => {
    const url = playerUrl(
      <YouTubeEmbedPlayer
        videoId="ABCDEFGHIJK"
        autoplay
        cc_lang_pref="ja"
        cc_load_policy
        color="white"
        controls
        disablekb
        enablejsapi
        end={120}
        fs
        hl="ja"
        iv_load_policy={3}
        list="PL123"
        listType="playlist"
        loop
        origin="https://example.com"
        playlist="ABCDEFGHIJK,LMNOPQRSTUV"
        playsinline
        rel
        start={10}
        widget_referrer="https://example.com/page?a=1&b=2"
      />,
    );

    expect(Object.fromEntries(url.searchParams)).toEqual({
      autoplay: "1",
      cc_lang_pref: "ja",
      cc_load_policy: "1",
      color: "white",
      controls: "1",
      disablekb: "1",
      enablejsapi: "1",
      end: "120",
      fs: "1",
      hl: "ja",
      iv_load_policy: "3",
      list: "PL123",
      listType: "playlist",
      loop: "1",
      origin: "https://example.com",
      playlist: "ABCDEFGHIJK,LMNOPQRSTUV",
      playsinline: "1",
      rel: "1",
      start: "10",
      widget_referrer: "https://example.com/page?a=1&b=2",
    });
  });

  it.each(["", "invalid", "https://example.com/watch?v=ABCDEFGHIJK"])(
    "不正な入力 %s ではプレイヤーを表示しない",
    (videoId) => {
      expect(renderToStaticMarkup(<YouTubeEmbedPlayer videoId={videoId} />)).toBe("");
    },
  );
});
