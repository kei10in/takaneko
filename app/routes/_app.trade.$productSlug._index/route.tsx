import { ClientLoaderFunctionArgs, LoaderFunctionArgs, useLoaderData } from "react-router";
import { TradeEditor2 } from "~/components/trade-editor/TradeEditor2";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { relativeProductImages } from "~/features/products/relativeProductImages";
import { useTradeStore } from "~/features/trade/store";
import { TradeDescription } from "~/features/trade/TradeStatus";
import { Route } from "./+types/route";
import { descriptionForTradeImagesTool, titleForTradeImagesTool } from "./metaData";

export const meta: Route.MetaFunction = ({ data, location }) => {
  const title = titleForTradeImagesTool(data);
  const description = descriptionForTradeImagesTool(data);
  const image = `https://${DOMAIN}/takanekono-card-trading-image-generator.png`;
  const url = `https://${DOMAIN}${location.pathname}`;

  return [
    { title },
    { name: "description", content: description },

    { property: "og:site_name", content: SITE_TITLE },
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
    <div className="overflow-x-clip">
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
  );
}
