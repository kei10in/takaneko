import { CloseButton, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useDeferredValue, useMemo, useState } from "react";
import { HiFunnel, HiMagnifyingGlass } from "react-icons/hi2";
import { MetaFunction, ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import { dialogBackdropStyle, pageBox } from "~/components/styles";
import { XMarkButton } from "~/components/XMarkButton";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { filterSetlistEvents } from "~/features/setlists/filterSetlistEvents";
import {
  defaultSetlistSearchFilters,
  SetlistLiveFilters,
  SetlistSearchFilters,
  SetlistYearFilters,
} from "~/features/setlists/searchFilters";
import { SetlistEvents } from "~/features/setlists/types";
import { PerformedSongs } from "~/features/songs/songsFiltered";
import { formatTitle } from "~/utils/htmlHeader";
import type { Route } from "./+types/route";
import { SetlistEventCard } from "./SetlistEventCard";

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

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const origin = new URL(request.url).origin;
  const url = new URL("/data/setlists/lives.json", origin).toString();
  const response = await context.cloudflare.env.ASSETS.fetch(url);

  if (!response.ok) {
    throw new Response("Setlist index is not found.", { status: 500 });
  }

  const json = await response.json();
  const result = SetlistEvents.safeParse(json);

  if (!result.success) {
    throw new Response("Setlist index is invalid.", { status: 500 });
  }

  return { events: result.data };
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
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultSetlistSearchFilters);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const deferredQuery = useDeferredValue(filters.q);
  const searchFilters = useMemo<SetlistSearchFilters>(
    () => ({
      q: deferredQuery,
      year: filters.year,
      type: filters.type,
      song: filters.song,
      costume: filters.costume,
    }),
    [deferredQuery, filters.costume, filters.song, filters.type, filters.year],
  );
  const results = useMemo(
    () => filterSetlistEvents(events, searchFilters),
    [events, searchFilters],
  );
  const totalActCount = useMemo(
    () => results.reduce((sum, result) => sum + result.event.actCount, 0),
    [results],
  );
  const activeFilterCount = activeSetlistFilterCount(filters);

  const updateSearchQuery = (inputQuery: string) => {
    setQuery(inputQuery);
  };

  const updateFilter = (key: keyof SetlistSearchFilters, value: string) => {
    const nextValue = key == "type" && value == "all" ? "" : value;
    setFilters((filters) => ({ ...filters, [key]: nextValue }));
  };

  const resetFilters = () => {
    setQuery("");
    setFilters(defaultSetlistSearchFilters());
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
            filters={filters}
            query={query}
            onQueryChange={updateSearchQuery}
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
                  filters={filters}
                  query={query}
                  onQueryChange={updateSearchQuery}
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
          {searchFilters.q != "" && <p>検索: {searchFilters.q}</p>}
        </div>

        {results.length == 0 ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-12 text-center text-gray-500">
            条件に一致するセットリストはありません。
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {results.map(({ event, matchedActIndexes }) => (
              <li key={event.slug}>
                <SetlistEventCard
                  event={event}
                  matchedActIndexes={matchedActIndexes}
                  showMatchedAct={
                    searchFilters.q != "" || searchFilters.song != "" || searchFilters.costume != ""
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

interface SetlistFilterFormProps {
  filters: SetlistSearchFilters;
  query: string;
  onQueryChange: (query: string) => void;
  onFilterChange: (key: keyof SetlistSearchFilters, value: string) => void;
  onSubmit?: (() => void) | undefined;
}

const SetlistFilterForm: React.FC<SetlistFilterFormProps> = ({
  filters,
  query,
  onFilterChange,
  onQueryChange,
}: SetlistFilterFormProps) => {
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-gray-600">検索</span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 py-2 focus-within:border-nadeshiko-500">
          <HiMagnifyingGlass className="flex-none text-gray-400" />
          <input
            name="q"
            className="min-w-0 flex-1 outline-none"
            value={query}
            onChange={(event) => {
              const nextQuery = event.currentTarget.value;
              onQueryChange(nextQuery);
              if (!isComposing) {
                onFilterChange("q", nextQuery);
              }
            }}
            onCompositionStart={() => {
              setIsComposing(true);
            }}
            onCompositionEnd={(event) => {
              const nextQuery = event.currentTarget.value;
              setIsComposing(false);
              onQueryChange(nextQuery);
              onFilterChange("q", nextQuery);
            }}
            placeholder="イベント名、曲名、会場、地域、衣装"
          />
        </span>
      </label>

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
          label="衣装"
          value={filters.costume}
          onChange={(value) => onFilterChange("costume", value)}
          options={AllStageCostumes.map((costume) => ({
            value: costume.slug,
            label: costume.name,
          }))}
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
    filters.costume,
  ].filter((value) => value != "").length;
};
