import { LinkDescription } from "~/utils/types/LinkDescription";

/**
 * テキストをリンクに変換します。
 * URL だけの場合は、テキストと参照先が同じリンクにします。
 * URL 以外では、Markdown 形式のリンク記法が利用できます。
 */
export const normalizeLink = (link: string | LinkDescription): LinkDescription | undefined => {
  if (typeof link !== "string") {
    return link;
  }

  try {
    new URL(link);
    return { text: link, url: link };
  } catch {
    // ignore
  }

  const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (match == null) {
    return undefined;
  }

  const text = match[1];
  const url = match[2];

  try {
    new URL(url);
  } catch {
    return undefined;
  }

  return { text, url };
};
