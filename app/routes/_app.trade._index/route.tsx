import { clsx } from "clsx";
import { BsCardChecklist } from "react-icons/bs";
import { Link } from "react-router";
import { pageHeading, sectionHeading } from "~/components/styles.ts";
import { DomainName, OgpSiteName } from "~/constants.ts";
import { TAKANEKO_PHOTOS, TAKANEKO_PHOTOS_FEATURED } from "~/features/products/productImages.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { RandomGoodsFilter, useRandomGoodsFilter } from "../_app.trade/RandomGoodsFilter.tsx";
import { RandomGoodsList } from "../_app.trade/RandomGoodsList.tsx";
import { Route } from "./+types/route.ts";
import { RandomGoodsCarousel } from "./RandomGoodsCarousel.tsx";
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
      <p className="page-description mt-2 px-4">ランダムグッズのトレード画像が作成できます。</p>

      <div className="mt-4 px-4" aria-labelledby="trade-lists-heading">
        <Link
          className={clsx(
            "ml-auto box-border flex h-10 w-fit items-center gap-2 rounded-xl border border-zinc-300 px-3 text-zinc-500",
            "bg-zinc-50 transition-colors",
          )}
          to="/trade/wishlist"
        >
          <BsCardChecklist className="size-4" />
          <span>求・譲 まとめ</span>
        </Link>
      </div>

      {TAKANEKO_PHOTOS_FEATURED.length > 0 && (
        <section className="mt-12" aria-labelledby="featured-goods-heading">
          <h2 id="featured-goods-heading" className={sectionHeading("my-4 px-4")}>
            ホットなやつ
          </h2>
          <RandomGoodsCarousel items={TAKANEKO_PHOTOS_FEATURED} />
        </section>
      )}

      <FilterableRandomGoods />

      <TradeInstructions />
    </section>
  );
}

function FilterableRandomGoods() {
  const { filterProps, matches } = useRandomGoodsFilter(TAKANEKO_PHOTOS);
  const items = TAKANEKO_PHOTOS.filter(matches);

  return (
    <section className="mt-12" aria-labelledby="random-goods-heading">
      <div className="my-4 flex flex-wrap items-center gap-2 px-4">
        <h2 id="random-goods-heading" className={sectionHeading()}>
          ランダムグッズ
        </h2>
        <RandomGoodsFilter {...filterProps} />
      </div>
      {items.length > 0 ? (
        <div className="space-y-10">
          {filterProps.yearOptions.map(({ value: year, label }) => {
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
