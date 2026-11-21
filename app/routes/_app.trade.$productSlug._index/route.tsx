import { BsChevronLeft } from "react-icons/bs";
import { ClientLoaderFunctionArgs, Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { TradeEditor2 } from "~/components/trade-editor/TradeEditor2.tsx";
import { DomainName, OgpSiteName } from "~/constants.ts";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages.ts";
import { relativeProductImages } from "~/features/products/relativeProductImages.ts";
import { useTradeStore } from "~/features/trade/store.ts";
import { TradeDescription } from "~/features/trade/TradeStatus.ts";
import { MenuContents } from "../_app.trade/MenuContents.tsx";
import { Route } from "./+types/route.ts";
import { descriptionForTradeImagesTool, titleForTradeImagesTool } from "./metaData.ts";

export const meta: Route.MetaFunction = ({ loaderData, location }) => {
  const title = titleForTradeImagesTool(loaderData);
  const description = descriptionForTradeImagesTool(loaderData);
  const image = `https://${DomainName}/takanekono-card-trading-image-generator.png`;
  const url = `https://${DomainName}${location.pathname}`;

  return [
    { title },
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

export const loader = ({ params }: LoaderFunctionArgs) => {
  const productSlug = params.productSlug;
  if (productSlug == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const productImage = TAKANEKO_PHOTOS.find((p) => p.slug == productSlug);
  if (productImage == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return productImage;
};

export const clientLoader = ({ params }: ClientLoaderFunctionArgs) => {
  const productSlug = params.productSlug;
  if (productSlug == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const productImage = TAKANEKO_PHOTOS.find((p) => p.slug == productSlug);
  if (productImage == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return productImage;
};

export default function TradeImageEditor() {
  const selectedProduct = useLoaderData<typeof loader>();
  const lineup = selectedProduct.variants ?? [];
  const lineupIds = lineup.map((p) => p.id);

  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const tradeDescriptions = allTradeDescriptions[selectedProduct?.id] ?? {};
  const tradeDescriptionsInLineup = Object.fromEntries(
    lineupIds
      .filter((id) => id in tradeDescriptions)
      .map((id): [number, TradeDescription] => [id, tradeDescriptions[id]]),
  );

  const updateTradeDescriptions = useTradeStore((state) => state.updateTradeDescriptions);
  const clearTradeDescriptions = useTradeStore((state) => state.clearTradeDescriptions);

  const relativeItems = relativeProductImages(selectedProduct);

  return (
    <div className="flex">
      <aside className="sticky top-(--header-height) hidden max-h-[calc(100svh-var(--header-height))] w-104 shrink-0 self-start overflow-y-auto lg:block">
        <nav aria-label="トレードメニュー">
          <MenuContents items={TAKANEKO_PHOTOS} />
        </nav>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-clip">
        <div className="mx-auto max-w-lg px-4 pt-2">
          <Link
            to="/trade"
            className="inline-flex min-h-8 items-center gap-1 text-base text-zinc-600 hover:underline"
          >
            <BsChevronLeft aria-hidden="true" />
            グッズ一覧
          </Link>
        </div>
        <TradeEditor2
          productImage={selectedProduct}
          tradeDescriptions={tradeDescriptionsInLineup}
          relativeItems={relativeItems}
          width={360}
          onChangeTradeDescription={(photoId, status) =>
            updateTradeDescriptions({ id: selectedProduct.id, photoId, status })
          }
          onClearTradeDescriptions={(id) => clearTradeDescriptions(id)}
        />
      </div>
    </div>
  );
}
