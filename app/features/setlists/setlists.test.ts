import { describe, expect, it } from "vitest";
import { Act } from "~/features/events/act";
import { LiveType } from "~/features/events/EventType";
import { parseSetlist } from "~/features/events/setlist";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import {
  buildSetlistEvents,
  buildSetlistFilterOptions,
  filterSetlistEvents,
  SetlistSearchFilters,
} from "./setlists";

interface SourceEvent {
  slug: string;
  meta: {
    status?: "RESCHEDULED" | "CANCELED" | "WITHDRAWN" | undefined;
    liveType?: LiveType | undefined;
    date: string;
    summary: string;
    title: string;
    region?: string | undefined;
    location?: string | undefined;
    acts: Act[];
  };
}

const today = new NaiveDate(2026, 1, 10);

describe("buildSetlistEvents", () => {
  it("keeps past live events and excludes future, non-live, and inactive events", () => {
    const events = buildSetlistEvents(
      [
        sourceEvent({
          slug: "2026-01-01_live",
          date: "2026-01-01",
          liveType: "SOLO",
          acts: [act(["Song A"])],
        }),
        sourceEvent({
          slug: "2026-01-10_today",
          date: "2026-01-10",
          liveType: "SOLO",
          acts: [act(["Song B"])],
        }),
        sourceEvent({
          slug: "2026-01-11_future",
          date: "2026-01-11",
          liveType: "SOLO",
          acts: [act(["Song C"])],
        }),
        sourceEvent({
          slug: "2026-01-01_non_live",
          date: "2026-01-01",
          liveType: undefined,
          acts: [act(["Song D"])],
        }),
        sourceEvent({
          slug: "2026-01-01_canceled",
          date: "2026-01-01",
          liveType: "FESTIVAL",
          status: "CANCELED",
          acts: [act(["Song E"])],
        }),
      ],
      today,
    );

    expect(events.map((event) => event.slug)).toEqual(["2026-01-01_live"]);
  });

  it("keeps separated acts under the same event", () => {
    const events = buildSetlistEvents(
      [
        sourceEvent({
          slug: "2026-01-01_two_parts",
          date: "2026-01-01",
          liveType: "RELEASE_EVENT",
          acts: [
            act(["Song A"], { title: "1 部 ミニライブ" }),
            act(["Song B"], { title: "2 部 ミニライブ" }),
          ],
        }),
      ],
      today,
    );

    expect(events[0]?.acts.map((act) => act.title)).toEqual([
      "1 部 ミニライブ",
      "2 部 ミニライブ",
    ]);
    expect(events[0]?.songCount).toBe(2);
  });

  it("includes past live events without setlists", () => {
    const events = buildSetlistEvents(
      [
        sourceEvent({
          slug: "2026-01-01_missing",
          date: "2026-01-01",
          liveType: "FESTIVAL",
          acts: [],
        }),
      ],
      today,
    );

    expect(events).toMatchObject([
      {
        slug: "2026-01-01_missing",
        hasSetlist: false,
        hasMissingSetlist: true,
        acts: [{ hasSetlist: false }],
      },
    ]);
  });
});

describe("filterSetlistEvents", () => {
  const events = buildSetlistEvents(
    [
      sourceEvent({
        slug: "2026-01-01_festival",
        date: "2026-01-01",
        summary: "TOKYO IDOL FESTIVAL",
        liveType: "FESTIVAL",
        region: "東京",
        location: "お台場",
        acts: [
          act(["衣装: Blue Dress", "Song A", "Song B"], { title: "SMILE GARDEN" }),
          act(["Song C"], { title: "HOT STAGE" }),
        ],
      }),
      sourceEvent({
        slug: "2025-12-24_solo",
        date: "2025-12-24",
        summary: "Christmas Party",
        liveType: "SOLO",
        region: "大阪",
        location: "なんば",
        acts: [act(["Song D"])],
      }),
      sourceEvent({
        slug: "2025-12-01_missing",
        date: "2025-12-01",
        summary: "Missing Live",
        liveType: "JOINT",
        acts: [],
      }),
    ],
    today,
  );

  it("matches multiple normalized search tokens with AND semantics", () => {
    const result = filterSetlistEvents(events, filters({ q: "tif　song a" }));

    expect(result.map(({ event }) => event.slug)).toEqual(["2026-01-01_festival"]);
    expect(result[0]?.matchedActIndexes).toEqual([0]);
  });

  it("searches event names, act names, locations, regions, songs, and costumes", () => {
    expect(filterSetlistEvents(events, filters({ q: "christmas" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "hot stage" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "なんば" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "東京" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "song c" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "blue dress" }))).toHaveLength(1);
  });

  it("filters by year, live type, song, and setlist status", () => {
    expect(filterSetlistEvents(events, filters({ year: "2025" })).map(toSlug)).toEqual([
      "2025-12-24_solo",
      "2025-12-01_missing",
    ]);
    expect(filterSetlistEvents(events, filters({ type: "solo" })).map(toSlug)).toEqual([
      "2025-12-24_solo",
    ]);
    expect(
      filterSetlistEvents(events, filters({ type: "festival-joint-guest" })).map(toSlug),
    ).toEqual(["2026-01-01_festival", "2025-12-01_missing"]);
    expect(filterSetlistEvents(events, filters({ song: "Song C" })).map(toSlug)).toEqual([
      "2026-01-01_festival",
    ]);
    expect(filterSetlistEvents(events, filters({ status: "with-setlist" })).map(toSlug)).toEqual([
      "2026-01-01_festival",
      "2025-12-24_solo",
    ]);
    expect(filterSetlistEvents(events, filters({ status: "missing" })).map(toSlug)).toEqual([
      "2025-12-01_missing",
    ]);
  });

  it("builds live type options from source data and song options from repertoire and limited songs", () => {
    const events = buildSetlistEvents(
      [
        sourceEvent({
          slug: "2026-01-01_festival",
          date: "2026-01-01",
          liveType: "FESTIVAL",
          acts: [act(["ファンサ", "青春トレイン (ラストアイドル cover)"])],
        }),
        sourceEvent({
          slug: "2026-01-02_joint",
          date: "2026-01-02",
          liveType: "JOINT",
          acts: [act(["ハッピークリスマスパーティ"])],
        }),
        sourceEvent({
          slug: "2026-01-03_guest",
          date: "2026-01-03",
          liveType: "GUEST",
          acts: [act(["Song X"])],
        }),
        sourceEvent({
          slug: "2026-01-04_solo",
          date: "2026-01-04",
          liveType: "SOLO",
          acts: [act(["Song Y"])],
        }),
      ],
      today,
    );

    const options = buildSetlistFilterOptions(events);

    expect(options.liveTypeFilters).toEqual(["solo", "festival-joint-guest"]);
    expect(options.songs).toEqual(["ハッピークリスマスパーティ", "ファンサ"]);
  });
});

const sourceEvent = (input: {
  slug: string;
  date: string;
  summary?: string | undefined;
  status?: "RESCHEDULED" | "CANCELED" | "WITHDRAWN" | undefined;
  liveType?: LiveType | undefined;
  region?: string | undefined;
  location?: string | undefined;
  acts: Act[];
}): SourceEvent => {
  const summary = input.summary ?? input.slug;
  return {
    slug: input.slug,
    meta: {
      status: input.status,
      liveType: input.liveType,
      date: input.date,
      summary,
      title: summary,
      region: input.region,
      location: input.location,
      acts: input.acts,
    },
  };
};

const act = (
  setlist: string[],
  options?: {
    title?: string | undefined;
  },
): Act => {
  return {
    title: options?.title,
    types: ["LIVE"],
    absent: [],
    setlist: parseSetlist(setlist),
    links: [],
  };
};

const filters = (input: Partial<SetlistSearchFilters>): SetlistSearchFilters => {
  return {
    q: input.q ?? "",
    year: input.year ?? "",
    type: input.type ?? "",
    song: input.song ?? "",
    status: input.status ?? "all",
  };
};

const toSlug = ({ event }: { event: { slug: string } }): string => {
  return event.slug;
};
