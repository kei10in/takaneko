import type { MetaFunction } from "@remix-run/node";
import { ReadMe } from "~/components/ReadMe";
import { TradeEditor } from "~/components/TradeEditor";
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

export default function Index() {
  const selectedProduct = useTradeStore((state) => state.selectedProduct);
  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const updateTradeDescriptions = useTradeStore((state) => state.updateTradeDescriptions);

  return (
    <div className="container mx-auto">
      {selectedProduct == undefined ? (
        <ReadMe />
      ) : (
        <div className="mx-auto w-[22.5rem]">
          <TradeEditor
            productImage={selectedProduct}
            tradeDescriptions={allTradeDescriptions[selectedProduct.id]}
            onChangeTradeDescription={(photoId, status) => {
              updateTradeDescriptions({ id: selectedProduct.id, photoId, status });
            }}
            width={360}
          />
        </div>
      )}
    </div>
  );
}
