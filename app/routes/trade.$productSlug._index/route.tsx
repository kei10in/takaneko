import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ClientLoaderFunctionArgs, json, MetaFunction, useLoaderData } from "@remix-run/react";
import { TradeEditor2 } from "~/components/trade-editor/TradeEditor2";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { useTradeStore } from "~/features/trade/store";
import { descriptionForTradeImagesTool, titleForTradeImagesTool } from "./metaData";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = titleForTradeImagesTool(data);
  const description = descriptionForTradeImagesTool(data);

  return [{ title }, { name: "description", content: description }];
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

  return json(productImage);
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

  return json(productImage);
};

export default function TradeImageEditor() {
  const selectedProduct = useLoaderData<typeof loader>();

  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const tradeDescriptions = allTradeDescriptions[selectedProduct?.id] ?? {};
  const updateTradeDescriptions = useTradeStore((state) => state.updateTradeDescriptions);
  const clearTradeDescriptions = useTradeStore((state) => state.clearTradeDescriptions);

  return (
    <div className="overflow-x-clip">
      <TradeEditor2
        productImage={selectedProduct}
        tradeDescriptions={tradeDescriptions}
        width={360}
        onChangeTradeDescription={(photoId, status) =>
          updateTradeDescriptions({ id: selectedProduct.id, photoId, status })
        }
        onClearTradeDescriptions={(id) => clearTradeDescriptions(id)}
      />
    </div>
  );
}
