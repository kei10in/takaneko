import { Act } from "~/features/events/act";
import { EventModule } from "~/features/events/eventModule";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { isNonEmptyString, normalizeSearchText, withSearchVariants } from "./searchText";
import { SetlistAct, SetlistEvent } from "./types";

export const buildSetlistEvents = (events: EventModule[], today: NaiveDate): SetlistEvent[] => {
  return events
    .flatMap((event): SetlistEvent[] => {
      const { meta } = event;

      if (meta.liveType == undefined || meta.status != undefined) {
        return [];
      }

      const date = NaiveDate.parseUnsafe(meta.date);
      if (date.compareTo(today) >= 0) {
        return [];
      }

      const acts =
        meta.acts.length == 0
          ? [emptySetlistAct()]
          : meta.acts
              .filter((act) => act.types.includes("LIVE") && act.status == undefined)
              .map(makeSetlistAct);
      const songCount = acts.reduce((sum, act) => sum + act.songCount, 0);
      const hasSetlist = acts.some((act) => act.hasSetlist);
      const hasMissingSetlist = acts.some((act) => !act.hasSetlist);
      const title = meta.title || meta.summary;
      const eventSearchText = normalizeSearchText(
        withSearchVariants([
          meta.summary,
          title,
          meta.date,
          meta.date.slice(0, 4),
          ...meta.keywords,
          meta.region,
          meta.location,
        ]).join(" "),
      );

      return [
        {
          slug: event.slug,
          date: meta.date,
          summary: meta.summary,
          title,
          liveType: meta.liveType,
          region: meta.region,
          location: meta.location,
          image: meta.images[0],
          acts,
          actCount: acts.length,
          songCount,
          hasSetlist,
          hasMissingSetlist,
          eventSearchText,
        },
      ];
    })
    .toSorted((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
};

const makeSetlistAct = (act: Act): SetlistAct => {
  const songTitles = act.setlist.flatMap((segment) =>
    segment.kind == "song" ? [segment.songTitle] : [],
  );
  const costumeNames = [
    ...new Set(
      act.setlist.flatMap((segment) => {
        if (segment.kind == "costume") {
          return [segment.costumeName];
        }
        if ("costumeName" in segment && segment.costumeName != undefined) {
          return [segment.costumeName];
        }
        return [];
      }),
    ),
  ];
  const songCount = songTitles.length;
  const searchableItems = withSearchVariants([
    act.title,
    act.start,
    ...songTitles,
    ...costumeNames,
    ...act.links.flatMap((link) => [link.text, link.url]),
  ]);

  return {
    title: act.title,
    start: act.start,
    setlist: act.setlist,
    links: act.links,
    songTitles,
    costumeNames,
    songCount,
    hasSetlist: songCount > 0,
    searchText: normalizeSearchText(searchableItems.filter(isNonEmptyString).join(" ")),
  };
};

const emptySetlistAct = (): SetlistAct => {
  return {
    setlist: [],
    links: [],
    songTitles: [],
    costumeNames: [],
    songCount: 0,
    hasSetlist: false,
    searchText: "",
  };
};
