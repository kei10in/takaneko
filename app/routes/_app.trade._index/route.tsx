import { Popover } from "@base-ui/react/popover";
import { useState } from "react";
import { BsCardChecklist, BsGift } from "react-icons/bs";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { Link } from "react-router";
import { CheckboxFilter } from "~/components/CheckboxFilter.tsx";
import { pageHeading, sectionHeading } from "~/components/styles.ts";
import { DomainName, OgpSiteName } from "~/constants.ts";
import {
  isOtherTakanekoRandomGoods,
  isRegularTakanekoMiniPhotoCard,
  isRegularTakanekoPhoto,
  TAKANEKO_PHOTOS,
  TAKANEKO_PHOTOS_FEATURED,
} from "~/features/products/productImages.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { RandomGoodsList } from "../_app.trade/RandomGoodsList.tsx";
import { Route } from "./+types/route.ts";
import { TradeInstructions } from "./TradeInstructions.tsx";

export const meta: Route.MetaFunction = ({ location }) => {
  const title = formatTitle("トレード画像つくるやつ");
  const description =
    "高嶺のなでしこ (たかねこ) の生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。";
  const image = `https://${DomainName}/takanekono-card-trading-image-generator.png`;
  const url = `https://${DomainName}${location.pathname}`;

  return [
    { title: title },
    { name: "description", content: description },

    { property: "og:site_name", content: OgpSiteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },

    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:creator", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:image", content: image },
  ];
};

export default function Index() {
  return (
    <section className="mx-auto py-12 lg:max-w-4xl">
      <h1 className={pageHeading("px-4")}>トレード画像をつくるやつ</h1>

      <div className="my-4 flex justify-between px-4">
        <p>ランダムグッズのトレード画像が作成できます。</p>
        <figure className="mx-4 flex flex-none justify-center">
          <img
            src="/takaneko/sample.webp"
            alt="トレード画像のサンプル"
            className="h-36 text-center shadow-md lg:h-64"
          />
        </figure>
      </div>

      <section className="mt-12">
        <h2 className={sectionHeading("mb-2 px-4")}>サマリー</h2>

        <ul className="space-y-4 px-4">
          <li>
            <Link className="group block" to="/trade/wishlist">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BsCardChecklist className="inline-block text-nadeshiko-900 group-hover:text-nadeshiko-950" />
                <span className="text-gray-600 group-hover:text-gray-800">欲しいやつ</span>
              </h3>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-800">
                トレード用画像を作ったついでに欲しいやつをリストアップできます。
              </p>
            </Link>
          </li>
          <li>
            <Link className="group block" to="/trade/tradelist">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BsGift className="inline-block text-nadeshiko-900 group-hover:text-nadeshiko-950" />
                <span className="text-gray-600 group-hover:text-gray-800">譲れるやつ</span>
              </h3>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-800">
                トレード用画像を作ったついでに譲れるやつをリストアップできます。
              </p>
            </Link>
          </li>
        </ul>
      </section>

      {TAKANEKO_PHOTOS_FEATURED.length > 0 && (
        <section className="mt-12">
          <h2 className={sectionHeading("my-4 px-4")}>ホットなやつ</h2>
          <RandomGoodsList items={TAKANEKO_PHOTOS_FEATURED} />
        </section>
      )}

      <FilterableRandomGoods />

      <TradeInstructions />
    </section>
  );
}

const categoryOptions = [
  { value: "photo", label: "生写真", matches: isRegularTakanekoPhoto },
  { value: "mini-photo", label: "ミニフォト", matches: isRegularTakanekoMiniPhotoCard },
  { value: "other", label: "その他", matches: isOtherTakanekoRandomGoods },
];
const yearOptions = [...new Set(TAKANEKO_PHOTOS.map((item) => item.year))]
  .toSorted((a, b) => b - a)
  .map((year) => ({ value: year, label: `${year}年` }));

function FilterableRandomGoods() {
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const selectedCategories = categoryOptions.filter((option) => categories.includes(option.value));
  const items = TAKANEKO_PHOTOS.filter(
    (item) =>
      (years.length === 0 || years.includes(item.year)) &&
      (selectedCategories.length === 0 ||
        selectedCategories.some((option) => option.matches(item))),
  );

  return (
    <section className="mt-12" aria-labelledby="random-goods-heading">
      <div className="my-4 flex flex-wrap items-center gap-2 px-4">
        <h2 id="random-goods-heading" className={sectionHeading()}>
          ランダムグッズ
        </h2>
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
                  values={categories}
                  onChange={setCategories}
                />
                <CheckboxFilter
                  label="発売年"
                  options={yearOptions}
                  values={years}
                  onChange={setYears}
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {items.length > 0 ? (
        <div className="space-y-10">
          {yearOptions.map(({ value: year, label }) => {
            const yearItems = items.filter((item) => item.year === year);
            if (yearItems.length === 0) {
              return null;
            }

            const headingId = `random-goods-${year}-heading`;
            return (
              <section key={year} aria-labelledby={headingId}>
                <h3 id={headingId} className="mb-4 px-4 text-lg font-semibold text-zinc-700">
                  {label}
                </h3>
                <RandomGoodsList items={yearItems} />
              </section>
            );
          })}
        </div>
      ) : (
        <output className="block px-4 py-4 text-sm text-zinc-600">
          条件に一致するグッズはありません。
        </output>
      )}
    </section>
  );
}
