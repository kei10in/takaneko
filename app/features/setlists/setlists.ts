import { Act } from "~/features/events/act";
import { EventStatus } from "~/features/events/eventMeta";
import { EventModule } from "~/features/events/eventModule";
import { LiveType } from "~/features/events/EventType";
import { Segment } from "~/features/events/setlist";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { LinkDescription } from "~/utils/types/LinkDescription";

export type SetlistSearchStatus = "all" | "with-setlist" | "missing";

export interface SetlistSearchFilters {
  q: string;
  year: string;
  type: string;
  song: string;
  status: SetlistSearchStatus;
}

export interface SetlistAct {
  title?: string | undefined;
  start?: string | undefined;
  setlist: Segment[];
  links: LinkDescription[];
  songTitles: string[];
  costumeNames: string[];
  songCount: number;
  hasSetlist: boolean;
  searchText: string;
}

export interface SetlistEvent {
  slug: string;
  date: string;
  summary: string;
  title: string;
  liveType: LiveType;
  region?: string | undefined;
  location?: string | undefined;
  acts: SetlistAct[];
  actCount: number;
  songCount: number;
  hasSetlist: boolean;
  hasMissingSetlist: boolean;
  eventSearchText: string;
}

export interface SetlistSearchResult {
  event: SetlistEvent;
  matchedActIndexes: number[];
}

export interface SetlistFilterOptions {
  years: string[];
  liveTypes: LiveType[];
  songs: string[];
}

interface SetlistEventSource {
  slug: string;
  meta: {
    status?: EventStatus | undefined;
    liveType?: LiveType | undefined;
    date: string;
    summary: string;
    title: string;
    region?: string | undefined;
    location?: string | undefined;
    acts: Act[];
  };
}

const ExcludedStatuses: EventStatus[] = ["CANCELED", "WITHDRAWN", "RESCHEDULED"];

export const buildSetlistEvents = (
  events: SetlistEventSource[] | EventModule[],
  today: NaiveDate,
): SetlistEvent[] => {
  return events
    .flatMap((event): SetlistEvent[] => {
      const { meta } = event;

      if (meta.liveType == undefined) {
        return [];
      }

      if (meta.status != undefined && ExcludedStatuses.includes(meta.status)) {
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
          meta.region,
          meta.location,
          meta.liveType,
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

export const filterSetlistEvents = (
  events: SetlistEvent[],
  filters: SetlistSearchFilters,
): SetlistSearchResult[] => {
  const tokens = searchTokens(filters.q);

  return events.flatMap((event): SetlistSearchResult[] => {
    if (filters.year != "" && !event.date.startsWith(`${filters.year}-`)) {
      return [];
    }

    if (filters.type != "" && event.liveType != filters.type) {
      return [];
    }

    if (filters.status == "with-setlist" && !event.hasSetlist) {
      return [];
    }

    if (filters.status == "missing" && !event.hasMissingSetlist) {
      return [];
    }

    const eventMatchesQuery =
      tokens.length == 0 || containsAllTokens(event.eventSearchText, tokens);
    const matchedActIndexes = event.acts.flatMap((act, index) => {
      const songMatches = filters.song == "" || act.songTitles.includes(filters.song);
      if (!songMatches) {
        return [];
      }

      const combinedSearchText = `${event.eventSearchText} ${act.searchText}`;
      const actMatchesQuery = eventMatchesQuery || containsAllTokens(combinedSearchText, tokens);
      if (!actMatchesQuery) {
        return [];
      }

      return [index];
    });

    if (matchedActIndexes.length == 0) {
      return [];
    }

    return [{ event, matchedActIndexes }];
  });
};

export const buildSetlistFilterOptions = (events: SetlistEvent[]): SetlistFilterOptions => {
  const years = [...new Set(events.map((event) => event.date.slice(0, 4)))].toSorted().toReversed();
  const liveTypes = [...new Set(events.map((event) => event.liveType))].toSorted();
  const songs = [
    ...new Set(events.flatMap((event) => event.acts.flatMap((act) => act.songTitles))),
  ].toSorted((a, b) => a.localeCompare(b, "ja"));

  return { years, liveTypes, songs };
};

export const defaultSetlistSearchFilters = (): SetlistSearchFilters => {
  return {
    q: "",
    year: "",
    type: "",
    song: "",
    status: "all",
  };
};

export const liveTypeLabel = (liveType: LiveType): string => {
  switch (liveType) {
    case "SOLO":
      return "ワンマン";
    case "HOSTED":
      return "主催";
    case "JOINT":
      return "対バン";
    case "GUEST":
      return "ゲスト";
    case "FESTIVAL":
      return "フェス";
    case "EVENT_LIVE":
      return "イベント出演";
    case "RELEASE_EVENT":
      return "リリースイベント";
  }
};

export const normalizeSearchText = (text: string): string => {
  return text.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, " ").trim();
};

const searchTokens = (q: string): string[] => {
  const normalized = normalizeSearchText(q);
  if (normalized == "") {
    return [];
  }

  return normalized.split(" ").filter((token) => token != "");
};

const containsAllTokens = (text: string, tokens: string[]): boolean => {
  return tokens.every((token) => containsToken(text, token));
};

const containsToken = (text: string, token: string): boolean => {
  if (!/^[a-z0-9]+$/.test(token)) {
    return text.includes(token);
  }

  const escaped = escapeRegExp(token);
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(text);
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

const isNonEmptyString = (value: string | undefined): value is string => {
  return value != undefined && value != "";
};

const withSearchVariants = (values: (string | undefined)[]): string[] => {
  return values.filter(isNonEmptyString).flatMap((value) => [value, englishAcronym(value)]);
};

const englishAcronym = (value: string): string => {
  const words = value.match(/[A-Za-z0-9]+/g) ?? [];
  if (words.length < 2) {
    return "";
  }

  return words.map((word) => word[0] ?? "").join("");
};
