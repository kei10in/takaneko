import { extractYouTubeVideoId, youtubeEmbedUrl } from "~/utils/youtube/videoId.ts";

/** https://developers.google.com/youtube/player_parameters */
interface Props {
  /** 動画 ID または動画 URL。クエリパラメーターは無視します。 */
  videoId: string;
  autoplay?: boolean;
  cc_lang_pref?: string;
  cc_load_policy?: boolean;
  color?: "red" | "white";
  controls?: boolean;
  disablekb?: boolean;
  enablejsapi?: boolean;
  end?: number;
  fs?: boolean;
  hl?: string;
  iv_load_policy?: 1 | 3;
  list?: string;
  listType?: "playlist" | "user_uploads";
  loop?: boolean;
  origin?: string;
  playlist?: string;
  playsinline?: boolean;
  rel?: boolean;
  start?: number;
  widget_referrer?: string;
}

export const YouTubeEmbedPlayer: React.FC<Props> = ({ videoId, ...parameters }: Props) => {
  const id = extractYouTubeVideoId(videoId);
  if (id == undefined) {
    return null;
  }

  const src = new URL(youtubeEmbedUrl(id));
  src.search = new URLSearchParams(
    Object.entries(parameters).flatMap(([key, value]) =>
      value == undefined ? [] : [[key, String(typeof value === "boolean" ? Number(value) : value)]],
    ),
  ).toString();

  const fullscreen = parameters.fs !== false;
  const allow = [
    "accelerometer",
    parameters.autoplay === true ? "autoplay" : undefined,
    "clipboard-write",
    "encrypted-media",
    fullscreen ? "fullscreen" : "fullscreen 'none'",
    "gyroscope",
    "picture-in-picture",
    "web-share",
  ]
    .filter((value) => value != undefined)
    .join("; ");

  return (
    // YouTube の公式プレイヤーの再生・認証機能を維持するため sandbox は指定しません。
    // oxlint-disable-next-line react/iframe-missing-sandbox
    <iframe
      className="aspect-video w-full"
      src={src.href}
      title="YouTube video player"
      allow={allow}
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen={fullscreen}
    />
  );
};
