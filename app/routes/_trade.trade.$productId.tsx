import type { MetaFunction } from "@remix-run/node";
import { unstable_defineClientLoader as defineClientLoader, useLoaderData } from "@remix-run/react";
import { TradeEditor } from "~/components/TradeEditor";
import { ProductImage, TAKANEKO_PHOTOS } from "~/features/productImages";
import { useTradeStore } from "~/features/trade/store";

export const meta: MetaFunction = () => {
  return [
    { title: "トレード画像つくるやつ。- 高嶺のなでしこの" },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export const clientLoader = defineClientLoader(({ params }): ProductImage => {
  const productId = params.productId;
  if (productId == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const productImage = TAKANEKO_PHOTOS.find((p) => p.id == productId);
  if (productImage == undefined) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  return productImage;
});

export default function TradeImageEditor() {
  const selectedProduct = useLoaderData<ProductImage>();

  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const tradeDescriptions = allTradeDescriptions[selectedProduct?.id] ?? {};
  const updateTradeDescriptions = useTradeStore((state) => state.updateTradeDescriptions);

  return (
    <div className="container mx-auto">
      <div className="mx-auto w-[22.5rem]">
        <TradeEditor
          productImage={selectedProduct}
          tradeDescriptions={tradeDescriptions}
          onChangeTradeDescription={(photoId, status) => {
            updateTradeDescriptions({ id: selectedProduct.id, photoId, status });
          }}
          width={360}
        />
      </div>
    </div>
  );
}
