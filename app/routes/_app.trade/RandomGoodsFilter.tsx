import { Popover } from "@base-ui/react/popover";
import { useState } from "react";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { CheckboxFilter } from "~/components/CheckboxFilter.tsx";
import { RandomGoods } from "~/features/products/product.ts";
import {
  isOtherTakanekoRandomGoods,
  isRegularTakanekoMiniPhotoCard,
  isRegularTakanekoPhoto,
} from "~/features/products/productImages.ts";

const categoryOptions = [
  { value: "photo", label: "生写真", matches: isRegularTakanekoPhoto },
  { value: "mini-photo", label: "ミニフォト", matches: isRegularTakanekoMiniPhotoCard },
  { value: "other", label: "その他", matches: isOtherTakanekoRandomGoods },
];

interface Filters {
  categories: string[];
  years: number[];
}

export function useRandomGoodsFilter(items: readonly RandomGoods[]) {
  const [filters, setFilters] = useState<Filters>({ categories: [], years: [] });
  const { categories, years } = filters;
  const yearOptions = [...new Set(items.map((item) => item.year))]
    .toSorted((a, b) => b - a)
    .map((year) => ({ value: year, label: `${year}年` }));
  const selectedCategories = categoryOptions.filter((option) => categories.includes(option.value));

  const matches = (item: RandomGoods) =>
    (years.length === 0 || years.includes(item.year)) &&
    (selectedCategories.length === 0 || selectedCategories.some((option) => option.matches(item)));

  return {
    filterProps: { filters, onChange: setFilters, yearOptions },
    matches,
  };
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  yearOptions: { value: number; label: string }[];
}

export function RandomGoodsFilter({ filters, onChange, yearOptions }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger className="ml-auto flex h-10 graceful-button items-center justify-center gap-1 rounded-xl px-4">
        <HiAdjustmentsHorizontal aria-hidden="true" className="size-5" />
        <span>フィルタ</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end" sideOffset={8} collisionPadding={16} className="z-30">
          <Popover.Popup
            aria-label="フィルタ"
            className="max-h-(--available-height) w-84 max-w-(--available-width) space-y-4 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-md"
          >
            <CheckboxFilter
              label="種類"
              options={categoryOptions}
              values={filters.categories}
              onChange={(categories) => onChange({ ...filters, categories })}
            />
            <CheckboxFilter
              label="発売年"
              options={yearOptions}
              values={filters.years}
              onChange={(years) => onChange({ ...filters, years })}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
