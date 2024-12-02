import * as cheerio from "cheerio";

export type ShortLinkResult = {
  url?: string | undefined;
  error?: "Invalid URL" | "Page Not Found" | "Shortlink Not Found" | "Unknown Error";
};

export const shortlink = async (url: string): Promise<ShortLinkResult> => {
  let host = "";
  try {
    host = new URL(url).host;
  } catch (e) {
    return { error: "Invalid URL" };
  }

  if (host != "takanenonadeshiko.jp") {
    return { error: "Invalid URL" };
  }

  const response = await fetch(url, {});

  if (400 <= response.status && response.status < 500) {
    return { error: "Page Not Found" };
  } else if (!response.ok) {
    return { error: "Unknown Error" };
  }

  const responseBuffer = await response.arrayBuffer();
  const body = new TextDecoder().decode(responseBuffer);

  const $ = cheerio.load(body);

  const shortlink = $("link[rel=shortlink]").attr("href");
  if (shortlink == undefined) {
    return { error: "Shortlink Not Found" };
  }

  return { url: shortlink };
};
