import { register } from "node:module";
import { EventRecap } from "~/features/events/eventRecap";
import { NaiveDate } from "../app/utils/datetime/NaiveDate";
import { loadAllEventMeta } from "./events";

register("@mdx-js/node-loader", import.meta.url);

const main = async () => {
  const today = NaiveDate.today();
  const events = await loadAllEventMeta();
  // events: [slug, meta]
  const livesWithoutSetlist = events
    .filter(([, meta]) => {
      // ライブのないイベントはリストしなくてよい。
      if (meta.liveType == undefined) {
        return false;
      }

      // まだ開催されていないライブはリストしなくてよい。
      if (meta.date.getTimeAsUTC() >= today.getTimeAsUTC()) {
        return false;
      }

      // 出演を取りやめたライブはリストしない。
      if (meta.status == "WITHDRAWN") {
        return false;
      }

      // 全ての Recap に setlist があれば、セットリストが設定済み。
      if (meta.recaps.length > 0 && meta.recaps.every(allSetListHasAnySongs)) {
        return false;
      }

      return true;
    })
    .map(([slug]) => slug)
    .toSorted()
    .toReversed();

  for (const slug of livesWithoutSetlist) {
    console.log(slug);
  }
};

const allSetListHasAnySongs = (recap: EventRecap): boolean => {
  return recap.setlist.length > 0 && recap.setlist.every((item) => item.songs.length > 0);
};

main();
