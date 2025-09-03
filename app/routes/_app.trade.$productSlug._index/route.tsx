import {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
} from "react-router";
import { TradeEditor2 } from "~/components/trade-editor/TradeEditor2";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { relativeProductImages } from "~/features/products/relativeProductImages";
import { useTradeStore } from "~/features/trade/store";
import { TradeDescription } from "~/features/trade/TradeStatus";
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
  const lineup = selectedProduct.lineup ?? [];
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
