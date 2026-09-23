import { ResizeFilterType, ResizeFit, Transformer } from "@napi-rs/image";
// Vite 設定の読み込み時はアプリ用の ~ エイリアスがまだ使えない。
import { Err, Ok, type Result } from "../utils/result";
import type { DevThumbnailOptions } from "./parseDevThumbnailRequest";

type ThumbnailError = "invalid-source" | "not-found" | "fetch-failed" | "conversion-failed";

const fetchImage = async (
  url: URL,
  allowedOrigin: URL,
): Promise<Result<Buffer, "invalid-source" | "not-found" | "fetch-failed">> => {
  if (url.origin !== allowedOrigin.origin || url.username !== "" || url.password !== "") {
    return Err("invalid-source");
  }
  const requestUrl = new URL(`${url.pathname}${url.search}`, allowedOrigin);

  try {
    const response = await fetch(requestUrl, { redirect: "manual", cache: "no-store" });
    if (!response.ok) {
      await response.body?.cancel();
      return Err(response.status === 404 ? "not-found" : "fetch-failed");
    }
    return Ok(Buffer.from(await response.arrayBuffer()));
  } catch {
    return Err("fetch-failed");
  }
};

export const loadDevThumbnail = async (
  source: URL,
  options: DevThumbnailOptions,
  allowedOrigin: URL,
): Promise<Result<Buffer, ThumbnailError>> => {
  const fetched = await fetchImage(source, allowedOrigin);
  if (fetched.err) {
    return fetched;
  }

  try {
    const image = await new Transformer(fetched.value)
      .rotate()
      .resize({
        width: options.width,
        height: options.height,
        fit: ResizeFit.Inside,
        filter: ResizeFilterType.Lanczos3,
      })
      .webp(options.quality);
    return Ok(image);
  } catch {
    return Err("conversion-failed");
  }
};
