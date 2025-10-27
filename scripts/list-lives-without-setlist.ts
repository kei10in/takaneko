import { register } from "node:module";
import { Act } from "~/features/events/act";
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
      if (meta.naiveDate.getTimeAsUTC() >= today.getTimeAsUTC()) {
        return false;
      }

      // 出演を取りやめたライブはリストしない。
      if (meta.status == "WITHDRAWN" || meta.status == "CANCELED" || meta.status == "RESCHEDULED") {
        return false;
      }

      // 全ての Act に setlist があれば、セットリストが設定済み。
      if (meta.acts.length > 0 && meta.acts.every(allSetListHasAnySongs)) {
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

const allSetListHasAnySongs = (act: Act): boolean => {
  return act.setlist.filter((p) => p.kind == "song").length > 0;
};

main();
