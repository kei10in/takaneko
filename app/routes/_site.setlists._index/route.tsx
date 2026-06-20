import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useMemo, useState } from "react";
import {
  HiChevronDown,
  HiFunnel,
  HiMagnifyingGlass,
  HiMusicalNote,
  HiOutlineMapPin,
} from "react-icons/hi2";
import {
  Link,
  MetaFunction,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { dialogBackdropStyle, pageBox } from "~/components/styles";
import { XMarkButton } from "~/components/XMarkButton";
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
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const results = useMemo(() => filterSetlistEvents(events, filters), [filters, events]);
  const totalActCount = useMemo(
    () => results.reduce((sum, result) => sum + result.event.actCount, 0),
    [results],
  );
  const activeFilterCount = activeSetlistFilterCount(filters);

  const commitSearch = (inputQuery: string) => {
    const next = new URLSearchParams(searchParams);
    const q = inputQuery.trim();
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

    if (value == "" || (key == "status" && value == "all") || (key == "type" && value == "all")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, {
      preventScrollReset: true,
      defaultShouldRevalidate: false,
    });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), {
      preventScrollReset: true,
      defaultShouldRevalidate: false,
    });
  };

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("my-8 px-4")}>
        <div className="space-y-12">
          <h1 className={"text-5xl"}>セットリスト</h1>
          {/* 見た目だけの調整 */}
          <p className="ml-2">
            開催済みライブのセットリストを、イベント名・楽曲名・会場・地域から探せます。 1 部 / 2
            部や複数ステージは、イベント内の公演ごとに分けて表示します。
          </p>
        </div>

        <div className="mt-8 sm:hidden">
          <button
            type="button"
            className="ml-auto flex h-10 graceful-button w-56 items-center justify-center gap-2 px-4"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <HiFunnel className="" />
            <span>絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-nadeshiko-800">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="mt-8 hidden rounded-lg border border-gray-200 bg-white p-4 sm:block">
          <SetlistFilterForm
            searchFormId="setlist-search-form"
            searchInputId="setlist-search-query"
            filters={filters}
            onSearch={commitSearch}
            onFilterChange={updateFilter}
          />
        </div>

        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          className="relative z-50 sm:hidden"
        >
          <DialogBackdrop className={dialogBackdropStyle()} transition />
          <div className="fixed inset-0 flex flex-col items-center justify-end">
            <DialogPanel
              className={clsx(
                "max-h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto bg-white shadow-xl",
                "data-closed:translate-y-full",
                "transition-all duration-300 ease-in-out",
              )}
              transition
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-800">絞り込み</h2>
                  <CloseButton
                    as={XMarkButton}
                    onClick={() => setIsFilterDialogOpen(false)}
                    aria-label="閉じる"
                  />
                </div>

                <SetlistFilterForm
                  searchFormId="setlist-search-form-mobile"
                  searchInputId="setlist-search-query-mobile"
                  filters={filters}
                  onSearch={(q) => {
                    commitSearch(q);
                    setIsFilterDialogOpen(false);
                  }}
                  onFilterChange={updateFilter}
                />

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="h-10 rounded-full border border-zinc-300 text-zinc-600"
                    onClick={resetFilters}
                  >
                    クリア
                  </button>
                  <button
                    type="submit"
                    form="setlist-search-form-mobile"
                    className="graceful-button w-auto"
                  >
                    結果を見る
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="mt-6 ml-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600">
          <p>
            {results.length} 件 / {totalActCount} ステージ
          </p>
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

interface SetlistFilterFormProps {
  searchFormId: string;
  searchInputId: string;
  filters: SetlistSearchFilters;
  onSearch: (query: string) => void;
  onFilterChange: (key: keyof SetlistSearchFilters, value: string) => void;
}

const SetlistFilterForm: React.FC<SetlistFilterFormProps> = ({
  searchFormId,
  searchInputId,
  filters,
  onSearch,
  onFilterChange,
}: SetlistFilterFormProps) => {
  return (
    <div className="space-y-4">
      <form
        id={searchFormId}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const q = formData.get("q");
          onSearch(typeof q == "string" ? q : "");
        }}
      >
        <label className="block" htmlFor={searchInputId}>
          <span className="mb-1 block text-sm font-semibold text-gray-600">検索</span>
          <span className="flex items-stretch gap-2">
            <span className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 py-2 focus-within:border-nadeshiko-500">
              <HiMagnifyingGlass className="flex-none text-gray-400" />
              <input
                key={`${searchInputId}:${filters.q}`}
                id={searchInputId}
                name="q"
                className="min-w-0 flex-1 outline-none"
                defaultValue={filters.q}
                placeholder="イベント名、曲名、会場、地域、衣装"
              />
            </span>
            <button
              type="submit"
              className="flex graceful-button flex-none items-center gap-1 rounded-full px-4 text-sm font-semibold"
            >
              <HiMagnifyingGlass />
              <span>検索</span>
            </button>
          </span>
        </label>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectFilter
          label="年"
          value={filters.year}
          onChange={(value) => onFilterChange("year", value)}
          options={SetlistYearFilters.map((year) => ({ value: year.value, label: year.label }))}
        />
        <SelectFilter
          label="ライブ種別"
          value={filters.type == "" ? "all" : filters.type}
          onChange={(value) => onFilterChange("type", value)}
          options={SetlistLiveFilters.map((filter) => ({
            value: filter.name,
            label: filter.display,
          }))}
          includeAll={false}
        />
        <SelectFilter
          label="楽曲"
          value={filters.song}
          onChange={(value) => onFilterChange("song", value)}
          options={PerformedSongs.map((song) => ({ value: song.slug, label: song.name }))}
        />
        <SelectFilter
          label="登録状態"
          value={filters.status}
          onChange={(value) => onFilterChange("status", value)}
          options={[
            { value: "all", label: "すべて" },
            { value: "with-setlist", label: "登録済み" },
            { value: "missing", label: "未登録あり" },
          ]}
          includeAll={false}
        />
      </div>
    </div>
  );
};

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

const activeSetlistFilterCount = (filters: SetlistSearchFilters): number => {
  return [
    filters.q,
    filters.year,
    filters.type == "all" ? "" : filters.type,
    filters.song,
    filters.status == "all" ? "" : filters.status,
  ].filter((value) => value != "").length;
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
                  <span className="inline-flex items-center">{displayDateWithDayOfWeek(date)}</span>
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
                      <HiOutlineMapPin className="flex-none" />
                      <span className="line-clamp-1">{event.location}</span>
                    </span>
                  )}
                  {event.region != undefined && <span>{event.region}</span>}
                  <span className="inline-flex items-center gap-1">
                    <HiMusicalNote />
                    {event.actCount > 1 ? `${event.actCount} 公演 / ` : ""}
                    {event.songCount} 曲
                  </span>
                </div>
              </div>

              <div className="flex flex-none items-center gap-2 pt-1">
                <HiChevronDown className={clsx("transition-transform", open && "rotate-180")} />
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
    value == "all" ||
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
