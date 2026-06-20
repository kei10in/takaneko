import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  BsBoxArrowUpRight,
  BsCalendar,
  BsChevronDown,
  BsListOl,
  BsPinMap,
  BsSearch,
} from "react-icons/bs";
import {
  Link,
  MetaFunction,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { pageBox, pageHeading } from "~/components/styles";
import { Setlist } from "~/features/events/components/Setlist";
import { Events } from "~/features/events/events";
import { liveTypeColor, liveTypeLabel } from "~/features/events/EventType";
import {
  buildSetlistEvents,
  defaultSetlistSearchFilters,
  filterSetlistEvents,
  SetlistEvent,
  SetlistLiveFilters,
  SetlistLiveFilterType,
  SetlistSearchFilters,
  SetlistSearchStatus,
  SetlistYearFilters,
} from "~/features/setlists/setlists";
import { PerformedSongs } from "~/features/songs/songsFiltered";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("セットリスト") },
    {
      name: "description",
      content:
        "高嶺のなでしこ (たかねこ) の開催済みライブのセットリストを、イベント名・楽曲名・会場・地域から横断検索できます。",
    },
  ];
};

export const loader = async () => {
  const eventModules = await Events.importAllEventModules();
  const events = buildSetlistEvents(eventModules, NaiveDate.todayInJapan());

  return { events };
};

export const shouldRevalidate = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (currentUrl.pathname == nextUrl.pathname) {
    return false;
  }

  return defaultShouldRevalidate;
};

export default function Component() {
  const { events } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => searchFiltersFromParams(searchParams), [searchParams]);
  const [query, setQuery] = useState(filters.q);
  const results = useMemo(() => filterSetlistEvents(events, filters), [filters, events]);
  const totalSongCount = useMemo(
    () => results.reduce((sum, result) => sum + result.event.songCount, 0),
    [results],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(filters.q), 0);
    return () => window.clearTimeout(timeout);
  }, [filters.q]);

  const commitSearch = () => {
    const next = new URLSearchParams(searchParams);
    const q = query.trim();
    if (q == "") {
      next.delete("q");
    } else {
      next.set("q", q);
    }

    setSearchParams(next, {
      preventScrollReset: true,
      defaultShouldRevalidate: false,
    });
  };

  const updateFilter = (key: keyof SetlistSearchFilters, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value == "" || (key == "status" && value == "all")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, {
      preventScrollReset: true,
      defaultShouldRevalidate: false,
    });
  };

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <div className="px-4 py-1">
        <Breadcrumb items={[{ label: "たかねこの", to: "/" }]} />
      </div>

      <section className={pageBox("px-4")}>
        <div className="space-y-3">
          <h1 className={pageHeading()}>セットリスト</h1>
          <p className="max-w-3xl text-sm leading-7 text-gray-600">
            開催済みライブのセットリストを、イベント名・楽曲名・会場・地域から探せます。 1 部 / 2
            部や複数ステージは、イベント内の公演ごとに分けて表示します。
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              commitSearch();
            }}
          >
            <label className="block" htmlFor="setlist-search-query">
              <span className="mb-1 block text-sm font-semibold text-gray-600">検索</span>
              <span className="flex items-stretch gap-2">
                <span className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 py-2 focus-within:border-nadeshiko-500">
                  <BsSearch className="flex-none text-gray-400" />
                  <input
                    id="setlist-search-query"
                    className="min-w-0 flex-1 outline-none"
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    placeholder="イベント名、曲名、会場、地域、衣装"
                  />
                </span>
                <button
                  type="submit"
                  className="flex flex-none items-center gap-1 rounded-md bg-nadeshiko-800 px-4 text-sm font-semibold text-white"
                >
                  <BsSearch />
                  <span>検索</span>
                </button>
              </span>
            </label>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectFilter
              label="年"
              value={filters.year}
              onChange={(value) => updateFilter("year", value)}
              options={SetlistYearFilters.map((year) => ({ value: year.value, label: year.label }))}
            />
            <SelectFilter
              label="ライブ種別"
              value={filters.type}
              onChange={(value) => updateFilter("type", value)}
              options={SetlistLiveFilters.map((filter) => ({
                value: filter.name,
                label: filter.display,
              }))}
              includeAll={false}
            />
            <SelectFilter
              label="楽曲"
              value={filters.song}
              onChange={(value) => updateFilter("song", value)}
              options={PerformedSongs.map((song) => ({ value: song.slug, label: song.name }))}
            />
            <SelectFilter
              label="登録状態"
              value={filters.status}
              onChange={(value) => updateFilter("status", value)}
              options={[
                { value: "all", label: "すべて" },
                { value: "with-setlist", label: "登録済み" },
                { value: "missing", label: "未登録あり" },
              ]}
              includeAll={false}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <p>{results.length.toLocaleString()} 件</p>
          <p>{totalSongCount.toLocaleString()} 曲</p>
          {filters.q != "" && <p>検索: {filters.q}</p>}
        </div>

        {results.length == 0 ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
            条件に一致するセットリストはありません。
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {results.map(({ event, matchedActIndexes }) => (
              <SetlistEventCard
                key={event.slug}
                event={event}
                matchedActIndexes={matchedActIndexes}
                showMatchedAct={filters.q != "" || filters.song != ""}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  includeAll?: boolean | undefined;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  label,
  value,
  onChange,
  options,
  includeAll = true,
}: SelectFilterProps) => {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-600">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {includeAll && <option value="">すべて</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

interface SetlistEventCardProps {
  event: SetlistEvent;
  matchedActIndexes: number[];
  showMatchedAct: boolean;
}

const SetlistEventCard: React.FC<SetlistEventCardProps> = ({
  event,
  matchedActIndexes,
  showMatchedAct,
}: SetlistEventCardProps) => {
  const date = NaiveDate.parseUnsafe(event.date);
  const matchedActIndexSet = new Set(matchedActIndexes);
  const eventUrl = `/events/${event.slug}`;

  return (
    <Disclosure as="li">
      {({ open }) => (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <DisclosureButton className="block w-full px-4 py-4 text-left hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <BsCalendar />
                    {displayDateWithDayOfWeek(date)}
                  </span>
                  <span
                    className={clsx(
                      "inline-block rounded-full px-2 py-0.5 text-white",
                      liveTypeColor(event.liveType),
                    )}
                  >
                    {liveTypeLabel(event.liveType)}
                  </span>
                  {!event.hasSetlist && (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                      セットリスト未登録
                    </span>
                  )}
                  {event.hasSetlist && event.hasMissingSetlist && (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                      未登録あり
                    </span>
                  )}
                </div>

                <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-800">
                  {event.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  {event.location != undefined && (
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <BsPinMap className="flex-none" />
                      <span className="line-clamp-1">{event.location}</span>
                    </span>
                  )}
                  {event.region != undefined && <span>{event.region}</span>}
                  <span className="inline-flex items-center gap-1">
                    <BsListOl />
                    {event.actCount > 1 ? `${event.actCount} 公演 / ` : ""}
                    {event.songCount} 曲
                  </span>
                </div>
              </div>

              <div className="flex flex-none items-center gap-2 pt-1 text-gray-400">
                <BsChevronDown className={clsx("transition-transform", open && "rotate-180")} />
              </div>
            </div>
          </DisclosureButton>

          <DisclosurePanel className="border-t border-gray-100 px-4 py-5">
            <div className="space-y-7">
              {event.acts.map((act, index) => (
                <section key={index} className="space-y-2">
                  {(event.acts.length > 1 || act.title != undefined) && (
                    <div className="flex items-center gap-2">
                      <h3 className="line-clamp-1 min-w-0 flex-1 text-base font-semibold text-gray-700">
                        {act.title ?? `公演 ${index + 1}`}
                      </h3>
                      {showMatchedAct && matchedActIndexSet.has(index) && (
                        <span className="flex-none rounded-full bg-nadeshiko-100 px-2 py-0.5 text-xs text-nadeshiko-800">
                          該当
                        </span>
                      )}
                    </div>
                  )}

                  {act.hasSetlist ? (
                    <Setlist setlist={act.setlist} links={act.links} />
                  ) : (
                    <div className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      セットリスト未登録
                    </div>
                  )}
                </section>
              ))}

              <div className="flex justify-end">
                <Link
                  className="inline-flex items-center gap-1 text-sm font-semibold text-nadeshiko-800"
                  to={eventUrl}
                >
                  <span>イベント詳細</span>
                  <BsBoxArrowUpRight />
                </Link>
              </div>
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

const searchFiltersFromParams = (params: URLSearchParams): SetlistSearchFilters => {
  const status = parseSearchStatus(params.get("status"));
  return {
    ...defaultSetlistSearchFilters(),
    q: params.get("q") ?? "",
    year: params.get("year") ?? "",
    type: parseLiveTypeFilter(params.get("type")),
    song: params.get("song") ?? "",
    status,
  };
};

const parseLiveTypeFilter = (value: string | null): SetlistLiveFilterType | "" => {
  if (
    value == "solo" ||
    value == "hosted" ||
    value == "joint" ||
    value == "event-live" ||
    value == "release-event"
  ) {
    return value;
  }

  return "";
};

const parseSearchStatus = (value: string | null): SetlistSearchStatus => {
  if (value == "with-setlist" || value == "missing") {
    return value;
  }
  return "all";
};
