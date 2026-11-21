import { BsCardChecklist, BsGift } from "react-icons/bs";
import { Link } from "react-router";
import { pageHeading, sectionHeading } from "~/components/styles.ts";
import { DomainName, OgpSiteName } from "~/constants.ts";
import { TAKANEKO_PHOTOS, TAKANEKO_PHOTOS_FEATURED } from "~/features/products/productImages.ts";
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

      <section className="mt-12">
        <h2 className={sectionHeading("my-4 px-4")}>ランダムグッズ</h2>
        <RandomGoodsList items={TAKANEKO_PHOTOS} />
      </section>

      <TradeInstructions />
    </section>
  );
}
