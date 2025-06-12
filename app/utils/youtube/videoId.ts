// YouTube の URL から videoId を抽出する関数
export const extractYouTubeVideoId = (input: string | undefined): string | undefined => {
  if (input === undefined) {
    return undefined;
  }

  // YouTube 動画ID の正規表現 (11文字, 英数字, -, _)
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

  // 1. videoId 単体
  if (videoIdPattern.test(input)) {
    return input;
  }

  // 2. URL として parse できる場合
  const url = (() => {
    try {
      return new URL(input);
    } catch {
      return undefined;
    }
  })();

  if (url == undefined) {
    return undefined;
  }

  // 通常の YouTube URL
  if (
    (url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com" ||
      url.hostname.endsWith(".youtube.com")) &&
    url.pathname === "/watch"
  ) {
    const v = url.searchParams.get("v");
    if (v && videoIdPattern.test(v)) {
      return v;
    }
    return undefined;
  }

  // 短縮 URL
  if (url.hostname === "youtu.be") {
    const id = url.pathname.slice(1, 12);
    if (videoIdPattern.test(id)) {
      return id;
    }
    return undefined;
  }

  // 埋め込み URL
  if (
    (url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com" ||
      url.hostname.endsWith(".youtube.com")) &&
    url.pathname.startsWith("/embed/")
  ) {
    const id = url.pathname.split("/")[2];
    if (videoIdPattern.test(id)) {
      return id;
    }
    return undefined;
  }

  // shorts URL
  if (
    (url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com" ||
      url.hostname.endsWith(".youtube.com")) &&
    url.pathname.startsWith("/shorts/")
  ) {
    const id = url.pathname.split("/")[2];
    if (videoIdPattern.test(id)) {
      return id;
    }
    return undefined;
  }

  // それ以外は undefined
  return undefined;
};

export const youtubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
};
