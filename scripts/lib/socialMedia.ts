import twitter from "twitter-text";
import { compareEventMeta, EventMeta } from "~/features/events/eventMeta";
import { EventType, eventTypeToEmoji } from "~/features/events/EventType";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

/**
 * Social Media にポストするようのテキストを生成します。
 */
export const formatEventForSocialMedia = (event: EventMeta) => {
  if (event.category == EventType.LIVE) {
    const r: string[] = [`🎤${event.summary}`];

    if (event.location != undefined) {
      r.push(`📍${event.location}`);
    }

    return r.join("\n");
  } else if (event.category == EventType.RADIO || event.category == EventType.TV) {
    const r: string[] = [`${eventTypeToEmoji(event.category)}${event.summary}`];

    if (event.start != undefined) {
      r.push(`⏰${event.start}〜${event.end ?? ""}`);
    }

    return r.join("\n");
  } else if (event.category == EventType.MAGAZINE || event.category == EventType.BOOK) {
    const r: string[] = [`${eventTypeToEmoji(event.category)}${event.summary}`];

    r.push(`🛒本日発売`);

    return r.join("\n");
  } else {
    return `${eventTypeToEmoji(event.category)}${event.summary}`;
  }
};

const HEADER = "🌸きょうの #たかねこの予定🐈‍⬛";

export const createAnnouncePost = async (
  events: EventMeta[],
  today: NaiveDate,
): Promise<string[]> => {
  const url = detailUrl(today);

  const filteredEvents = events.filter((e) => e.status !== "CANCELED");
  if (filteredEvents.length === 0) {
    return [];
  }

  filteredEvents.sort(compareEventMeta);
  const items = filteredEvents.map(formatEventForSocialMedia);
  const postItems = splitEventContents(items, url);

  if (postItems.length == 1) {
    const posts = postItems.map((contents) => [HEADER, ...contents, url].join("\n\n"));
    return posts;
  }

  const posts = postItems.map((contents, index) =>
    [`${HEADER} ${index + 1}`, ...contents, url].join("\n\n"),
  );

  return posts;
};

/**
 * イベントのテキストを `CONTENT_LENGTH` を超えないブロックに分割します。
 */
const splitEventContents = (contents: string[], url: string): string[][] => {
  const result: string[][] = [];
  let currentBlock: string[] = [];

  contents.forEach((content) => {
    // 実装簡略化のために分割するときは、投稿番号をつけてツイート全体の長さをチェックする。
    const post = [`${HEADER} 1`, ...currentBlock, content, url].join("\n\n");
    const v = twitter.parseTweet(post);

    if (v.valid) {
      currentBlock.push(content);
    } else {
      result.push(currentBlock);
      currentBlock = [content];
    }
  });

  if (currentBlock.length > 0) {
    result.push(currentBlock);
  }

  return result;
};

const detailUrl = (today: NaiveDate): string => {
  const year = today.year.toString().padStart(4, "0");
  const month = today.month.toString().padStart(2, "0");
  const day = today.day.toString().padStart(2, "0");
  return `https://takanekofan.app/calendar/${year}/${month}/${day}`;
};
