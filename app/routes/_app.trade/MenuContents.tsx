import { RandomGoods } from "~/features/products/product.ts";
import { RandomGoodsFilter, useRandomGoodsFilter } from "./RandomGoodsFilter.tsx";
import { RandomGoodsList } from "./RandomGoodsList.tsx";

interface Props {
  items: readonly RandomGoods[];
}

export function MenuContents({ items }: Props) {
  const { filterProps, matches } = useRandomGoodsFilter(items);
  const filteredItems = items.filter(matches);
  const groups = filterProps.yearOptions
    .map(({ value: year, label }) => ({
      name: label,
      photos: filteredItems.filter((item) => item.year === year),
    }))
    .filter(({ photos }) => photos.length > 0);

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white px-4 py-2">
        <h2 className="text-lg font-semibold text-zinc-700">ランダムグッズ</h2>
        <RandomGoodsFilter {...filterProps} />
      </div>

      {groups.length === 0 && (
        <output className="block px-4 py-4 text-sm text-zinc-600">
          条件に一致するグッズはありません。
        </output>
      )}

      {groups.map(({ name, photos }) => (
        <section key={name} className="pb-8">
          <h3 className="mb-4 px-4 text-lg font-bold text-gray-900">{name}</h3>
          <RandomGoodsList items={photos} />
        </section>
      ))}
    </div>
  );
}
