// Vite 設定の読み込み時はアプリ用の ~ エイリアスがまだ使えない。
import { Err, Ok, type Result } from "../utils/result.ts";

export const devThumbnailPrefix = "/cdn-cgi/image/";

export interface DevThumbnailOptions {
  width: number;
  height: number;
  quality: number;
}

interface DevThumbnailRequest {
  source: URL;
  options: DevThumbnailOptions;
}

const positiveInteger = (value: string | undefined): number | undefined => {
  if (value === undefined || !/^\d+$/.test(value)) {
    return undefined;
  }
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
};

export const parseDevThumbnailRequest = (
  requestUrl: string,
  origin: URL,
): Result<DevThumbnailRequest, "invalid-request"> => {
  const path = requestUrl.slice(devThumbnailPrefix.length);
  const separator = path.indexOf("/");
  if (separator < 0) {
    return Err("invalid-request");
  }

  const entries = path
    .slice(0, separator)
    .split(",")
    .map((entry) => entry.split("="));
  if (entries.length !== 5 || entries.some((entry) => entry.length !== 2)) {
    return Err("invalid-request");
  }
  const options = new Map(entries.map(([key, value]) => [key, value]));
  const width = positiveInteger(options.get("width"));
  const height = positiveInteger(options.get("height"));
  const quality = positiveInteger(options.get("quality"));
  if (
    options.size !== 5 ||
    width === undefined ||
    height === undefined ||
    quality === undefined ||
    quality > 100 ||
    options.get("fit") !== "contain" ||
    options.get("format") !== "webp"
  ) {
    return Err("invalid-request");
  }

  const source = path.slice(separator + 1);
  if (!source || source.startsWith("//")) {
    return Err("invalid-request");
  }
  try {
    // クエリとエンコード済みの予約文字を保ったまま取得先を解決する。
    const url = new URL(source, origin);
    const pathname = decodeURIComponent(url.pathname);
    if (
      url.origin !== origin.origin ||
      url.username ||
      url.password ||
      pathname === "/cdn-cgi/image" ||
      pathname.startsWith(devThumbnailPrefix)
    ) {
      return Err("invalid-request");
    }
    return Ok({ source: url, options: { width, height, quality } });
  } catch {
    return Err("invalid-request");
  }
};
