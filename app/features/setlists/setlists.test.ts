import { describe, expect, it } from "vitest";
import { Act } from "~/features/events/act";
import { EventModule } from "~/features/events/eventModule";
import { LiveType } from "~/features/events/EventType";
import { parseSetlist } from "~/features/events/setlist";
import { makeEventMetaForTest } from "~/features/events/testUtils";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { buildSetlistEvents } from "./buildSetlistEvents";
import { filterSetlistEvents } from "./filterSetlistEvents";
import { SetlistSearchFilters } from "./searchFilters";

const today = new NaiveDate(2026, 1, 10);

describe("buildSetlistEvents", () => {
  it("keeps past live events and excludes future and non-live events", () => {
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
      ],
      today,
    );

    expect(events.map((event) => event.slug)).toEqual(["2026-01-01_live"]);
  });

  it("excludes live events by status", () => {
    const events = buildSetlistEvents(
      [
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

    expect(events.map((event) => event.slug)).toEqual([]);
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

    expect(events[0]?.acts.map((act) => act.title)).toEqual(["1 部 ミニライブ", "2 部 ミニライブ"]);
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
          act(
            [
              "衣装: アンチファン衣装",
              "Song A",
              "ファンサ (mona cover)",
              "衣装: 見上げるたびに、恋をする。衣装",
              "Song B",
            ],
            { title: "SMILE GARDEN" },
          ),
          act(["ファンサ"], { title: "HOT STAGE" }),
        ],
      }),
      sourceEvent({
        slug: "2025-12-24_solo",
        date: "2025-12-24",
        summary: "Christmas Party",
        keywords: ["クリパ"],
        liveType: "SOLO",
        region: "大阪",
        location: "なんば",
        acts: [act(["衣装: 見上げるたびに、恋をする。衣装", "初披露:Song D"])],
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
    expect(filterSetlistEvents(events, filters({ q: "クリパ" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "hot stage" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "なんば" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "東京" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "ファンサ" }))).toHaveLength(1);
    expect(filterSetlistEvents(events, filters({ q: "アンチファン衣装" }))).toHaveLength(1);
  });

  it("filters by year, live type, song, and costume", () => {
    expect(filterSetlistEvents(events, filters({ year: ["2025"] })).map(toSlug)).toEqual([
      "2025-12-24_solo",
      "2025-12-01_missing",
    ]);
    expect(filterSetlistEvents(events, filters({ year: ["2025", "2026"] })).map(toSlug)).toEqual([
      "2026-01-01_festival",
      "2025-12-24_solo",
      "2025-12-01_missing",
    ]);
    expect(filterSetlistEvents(events, filters({ type: ["solo"] })).map(toSlug)).toEqual([
      "2025-12-24_solo",
    ]);
    expect(filterSetlistEvents(events, filters({ type: ["joint"] })).map(toSlug)).toEqual([
      "2026-01-01_festival",
      "2025-12-01_missing",
    ]);
    expect(filterSetlistEvents(events, filters({ type: ["solo", "joint"] })).map(toSlug)).toEqual([
      "2026-01-01_festival",
      "2025-12-24_solo",
      "2025-12-01_missing",
    ]);
    expect(filterSetlistEvents(events, filters({ song: "ファンサ" })).map(toSlug)).toEqual([
      "2026-01-01_festival",
    ]);
    expect(
      filterSetlistEvents(events, filters({ costume: "アンチファン衣装" })).map(toSlug),
    ).toEqual(["2026-01-01_festival"]);
    expect(
      filterSetlistEvents(events, filters({ costume: "見上げるたびに恋をする衣装" })).map(toSlug),
    ).toEqual(["2026-01-01_festival", "2025-12-24_solo"]);
    expect(filterSetlistEvents(events, filters({ isFirstPerformance: true })).map(toSlug)).toEqual([
      "2025-12-24_solo",
    ]);
    expect(filterSetlistEvents(events, filters({ isCover: true })).map(toSlug)).toEqual([
      "2026-01-01_festival",
    ]);
  });

  it("matches costume and song filters against the same song segment", () => {
    expect(
      filterSetlistEvents(events, filters({ song: "ファンサ", costume: "アンチファン衣装" })).map(
        toSlug,
      ),
    ).toEqual(["2026-01-01_festival"]);
    expect(
      filterSetlistEvents(
        events,
        filters({ song: "ファンサ", costume: "見上げるたびに恋をする衣装" }),
      ).map(toSlug),
    ).toEqual([]);
  });
});

const sourceEvent = (input: {
  slug: string;
  date: string;
  summary?: string | undefined;
  status?: "RESCHEDULED" | "CANCELED" | "WITHDRAWN" | undefined;
  liveType?: LiveType | undefined;
  keywords?: string[] | undefined;
  region?: string | undefined;
  location?: string | undefined;
  acts: Act[];
}): EventModule => {
  const summary = input.summary ?? input.slug;
  const meta = makeEventMetaForTest({
    status: input.status,
    category: "LIVE",
    liveType: input.liveType,
    date: input.date,
    summary,
    title: summary,
    keywords: input.keywords,
    region: input.region,
    location: input.location,
    acts: input.acts,
  });

  return {
    slug: input.slug,
    filename: `${input.slug}.ts`,
    meta,
    Content: () => null,
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
    year: input.year ?? [],
    type: input.type ?? [],
    song: input.song ?? "",
    costume: input.costume ?? "",
    isFirstPerformance: input.isFirstPerformance ?? false,
    isCover: input.isCover ?? false,
  };
};

const toSlug = ({ event }: { event: { slug: string } }): string => {
  return event.slug;
};
