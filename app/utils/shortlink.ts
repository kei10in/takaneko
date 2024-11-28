import * as cheerio from "cheerio";

export const shortlink = async (url: string): Promise<string | undefined> => {
  try {
    const response = await fetch(url);
    const responseBuffer = await response.arrayBuffer();
    const body = new TextDecoder().decode(responseBuffer);

    const $ = cheerio.load(body);

    return $("link[rel=shortlink]").attr("href");
  } catch (e) {
    return undefined;
  }
};
