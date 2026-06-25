import { Checkbox, CloseButton, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useDeferredValue, useMemo, useState } from "react";
import {
  HiAdjustmentsHorizontal,
  HiChevronRight,
  HiMagnifyingGlass,
  HiOutlineCalendarDays,
  HiXMark,
} from "react-icons/hi2";
import { Link, MetaFunction, ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import { dialogBackdropStyle, pageBox } from "~/components/styles";
import { XMarkButton } from "~/components/XMarkButton";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { filterSetlistEvents } from "~/features/setlists/filterSetlistEvents";
import {
  defaultSetlistSearchFilters,
  SetlistLiveFilters,
  SetlistSearchFilters,
  SetlistSelectedLiveFilterType,
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
        "高嶺のなでしこ (たかねこ) の過去のライブのセットリストを、イベント名・楽曲名・衣装名・会場名から横断検索できます。",
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
  // Worker が CPU time exceeded になるのを防止するために、Zod による validation
  // は行わず、型アサーションで SetlistEvents 型に変換します。
  // `/data/setlists/lives.json` は SetlistEvents をそのまま JSON に変換しているため、
  // Zod による validation は必須ではありません。
  const events = json as SetlistEvents;

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
  const [query, setQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
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
      isFirstPerformance: filters.isFirstPerformance,
      isCover: filters.isCover,
    }),
    [
      deferredQuery,
      filters.costume,
      filters.isCover,
      filters.isFirstPerformance,
      filters.song,
      filters.type,
      filters.year,
    ],
  );
  const results = useMemo(
    () => filterSetlistEvents(events, searchFilters),
    [events, searchFilters],
  );
  const totalActCount = useMemo(
    () => results.reduce((sum, result) => sum + result.event.actCount, 0),
    [results],
  );

  const updateFilter = <K extends keyof SetlistSearchFilters>(
    key: K,
    value: SetlistSearchFilters[K],
  ) => {
    setFilters((filters) => ({ ...filters, [key]: value }));
  };

  const resetFilters = () => {
    setQuery("");
    setFilters(defaultSetlistSearchFilters());
  };

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("my-8 px-4")}>
        <div>
          <h1 className="mb-6 text-5xl">セットリスト</h1>

          <p className="mx-2 mb-2">
            過去のライブのセットリストを、イベント名・曲名・衣装名・会場名から探せます。
          </p>

          <div className="ml-auto flex w-fit flex-wrap gap-1">
            <Link
              to="/calendar"
              className="flex h-8 items-center gap-1 rounded-full px-2 text-sm hover:bg-zinc-100"
            >
              <HiOutlineCalendarDays className="size-4.5 text-nadeshiko-600" />
              <span className="block">スケジュール</span>
              <HiChevronRight className="text-nadeshiko-600" />
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="box-border flex h-10 items-center gap-2 rounded-full border border-zinc-300 px-3 focus-within:border-zinc-400">
            <HiMagnifyingGlass className="flex-none text-zinc-400" />
            <input
              name="q"
              className="min-w-0 flex-1 outline-none"
              value={query}
              autoComplete="off"
              onChange={(event) => {
                const nextQuery = event.currentTarget.value;
                setQuery(nextQuery);
                if (!isComposing) {
                  updateFilter("q", nextQuery);
                }
              }}
              onCompositionStart={() => {
                setIsComposing(true);
              }}
              onCompositionEnd={(event) => {
                const nextQuery = event.currentTarget.value;
                setIsComposing(false);
                setQuery(nextQuery);
                updateFilter("q", nextQuery);
              }}
              placeholder="イベント・曲・衣装・会場で検索"
            />
            {query != "" && (
              <button
                className="flex size-5 items-center justify-center rounded-full"
                onClick={() => {
                  setQuery("");
                  updateFilter("q", "");
                }}
              >
                <HiXMark className="size-full text-zinc-500" />
              </button>
            )}
          </div>

          <div>
            <button
              type="button"
              className="ml-auto flex h-10 graceful-button items-center justify-center gap-1 rounded-xl px-4"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <HiAdjustmentsHorizontal className="size-5" />
              <span>フィルタ</span>
            </button>
          </div>
        </div>

        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          className="relative z-50"
        >
          <DialogBackdrop className={dialogBackdropStyle()} transition />
          <div className="fixed inset-0 flex items-end justify-end">
            <DialogPanel
              className={clsx(
                "h-dvh w-10/12 max-w-lg overflow-y-auto bg-white shadow-xl",
                "data-closed:translate-x-full",
                "transition-all duration-300 ease-in-out",
              )}
              transition
            >
              <div className="space-y-8 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-800">フィルタ</h2>
                  <CloseButton
                    as={XMarkButton}
                    onClick={() => setIsFilterDialogOpen(false)}
                    aria-label="閉じる"
                  />
                </div>

                <SetlistFilterForm filters={filters} onFilterChange={updateFilter} />

                <div className="flex flex-wrap justify-stretch gap-2 pt-4">
                  <button
                    type="button"
                    className="h-10 flex-1 rounded-xl border border-zinc-300 px-4 text-nowrap text-zinc-600 hover:bg-zinc-100"
                    onClick={resetFilters}
                  >
                    クリア
                  </button>
                  <CloseButton className="flex graceful-button w-auto flex-1 items-center justify-center gap-2 rounded-xl px-4">
                    <span className="block text-nowrap">検索する</span>
                    <span className="block rounded-full bg-white px-2 py-0.5 text-xs text-nadeshiko-800">
                      {results.length}
                    </span>
                  </CloseButton>
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
                    searchFilters.q != "" ||
                    searchFilters.song != "" ||
                    searchFilters.costume != "" ||
                    searchFilters.isFirstPerformance ||
                    searchFilters.isCover
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
  onFilterChange: <K extends keyof SetlistSearchFilters>(
    key: K,
    value: SetlistSearchFilters[K],
  ) => void;
}

const SetlistFilterForm: React.FC<SetlistFilterFormProps> = ({
  filters,
  onFilterChange,
}: SetlistFilterFormProps) => {
  const sortedPerformedSongs = useMemo(
    () => [...PerformedSongs].toSorted((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  return (
    <div className="space-y-6">
      <CheckboxFilter
        label="年"
        values={filters.year}
        onChange={(value) => onFilterChange("year", value)}
        options={SetlistYearFilters.map((year) => ({ value: year.value, label: year.label }))}
      />
      <CheckboxFilter
        label="ライブ種別"
        values={filters.type}
        onChange={(value) => onFilterChange("type", value)}
        options={SetlistLiveFilters.filter(isSelectedLiveFilter).map((filter) => ({
          value: filter.name,
          label: filter.display,
        }))}
      />

      <SelectFilter
        label="楽曲"
        value={filters.song}
        onChange={(value) => onFilterChange("song", value)}
        options={sortedPerformedSongs.map((song) => ({ value: song.slug, label: song.name }))}
      />
      <SelectFilter
        label="衣装"
        value={filters.costume}
        onChange={(value) => onFilterChange("costume", value)}
        optionGroups={StageCostumeFilterOptionGroups}
      />
      <BooleanFilterGroup
        label="その他"
        options={[
          {
            checked: filters.isFirstPerformance,
            onChange: (checked) => onFilterChange("isFirstPerformance", checked),
            text: "初披露あり",
          },
          {
            checked: filters.isCover,
            onChange: (checked) => onFilterChange("isCover", checked),
            text: "カバー曲あり",
          },
        ]}
      />
    </div>
  );
};

interface BooleanFilterOption {
  checked: boolean;
  onChange: (checked: boolean) => void;
  text: string;
}

interface BooleanFilterGroupProps {
  label: string;
  options: BooleanFilterOption[];
}

const BooleanFilterGroup: React.FC<BooleanFilterGroupProps> = ({
  label,
  options,
}: BooleanFilterGroupProps) => {
  return (
    <fieldset className="space-y-2">
      <legend className="block font-semibold text-gray-600">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.text}
            checked={option.checked}
            onChange={option.onChange}
            className={clsx(
              "group flex h-8 w-fit items-center justify-center rounded-full px-3 text-sm select-none",
              "bg-zinc-100 font-semibold text-zinc-500 hover:bg-zinc-200 hover:text-zinc-600",
              "data-checked:box-content data-checked:border-0 data-checked:graceful-selected-item",
            )}
          >
            {option.text}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  );
};

interface CheckboxFilterProps<T extends string> {
  label: string;
  values: T[];
  onChange: (values: T[]) => void;
  options: { value: T; label: string }[];
}

const CheckboxFilter = <T extends string>({
  label,
  values,
  onChange,
  options,
}: CheckboxFilterProps<T>) => {
  const updateValue = (value: T, checked: boolean) => {
    if (checked) {
      onChange(values.includes(value) ? values : [...values, value]);
      return;
    }

    onChange(values.filter((x) => x != value));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="block font-semibold text-gray-600">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={values.includes(option.value)}
            onChange={(checked) => updateValue(option.value, checked)}
            className={clsx(
              "group flex h-8 items-center justify-center rounded-full px-3 text-sm select-none",
              "bg-zinc-100 font-semibold text-zinc-500 hover:bg-zinc-200 hover:text-zinc-600",
              "data-checked:box-content data-checked:border-0 data-checked:graceful-selected-item",
            )}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  );
};

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: SelectFilterOption[] | undefined;
  optionGroups?: SelectFilterOptionGroup[] | undefined;
  includeAll?: boolean | undefined;
}

interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterOptionGroup {
  label: string;
  options: SelectFilterOption[];
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  label,
  value,
  onChange,
  options,
  optionGroups,
  includeAll = true,
}: SelectFilterProps) => {
  return (
    <label className="block space-y-2">
      <span className="block font-semibold text-gray-600">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {includeAll && <option value="">すべて</option>}
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {optionGroups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
};

const StageCostumeFilterOptionGroups: SelectFilterOptionGroup[] = AllStageCostumes.reduce<
  SelectFilterOptionGroup[]
>((groups, costume) => {
  const year = costume.liveDebut.slice(0, 4);
  const label = `${year} 年`;
  const option = {
    value: costume.slug,
    label: costume.name,
  };

  if (groups.some((group) => group.label == label)) {
    return groups.map((group) =>
      group.label == label ? { ...group, options: [...group.options, option] } : group,
    );
  }

  return [...groups, { label, options: [option] }];
}, []);

const isSelectedLiveFilter = (
  filter: (typeof SetlistLiveFilters)[number],
): filter is (typeof SetlistLiveFilters)[number] & { name: SetlistSelectedLiveFilterType } => {
  return filter.name != "all";
};
