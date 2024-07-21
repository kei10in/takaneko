import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeDescription, TradeState } from "~/features/TradeState";
import { HtmlTradeImage } from "./HtmlTradeImage";
import { TradeEditorDetail } from "./TradeEditorDetail";
import { TradeImagePreview } from "./TradeImagePreview";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: TradeDescription[];
  onChangeTradeDescriptions: (tradeDescriptions: TradeDescription[]) => void;
  width: number;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions, width, onChangeTradeDescriptions } = props;

  const positions = productImage.positions;

  const [preview, setPreview] = useState(false);
  const [index, setIndex] = useState<number | undefined>(undefined);

  const scale = width / productImage.width;

  const handleClickTradeState = (id: number, v: TradeState) => {
    const index = tradeDescriptions.findIndex((s) => s.id == id);
    if (index == undefined) {
      return tradeDescriptions;
    }

    const items = [...tradeDescriptions];
    items[index] = { ...items[index], state: v };

    onChangeTradeDescriptions?.(items);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {positions.length != 0 ? (
          <div className="mx-auto">
            <div className="relative select-none">
              <HtmlTradeImage
                image={{
                  url: productImage.url,
                  width: productImage.width,
                  height: productImage.height,
                }}
                width={width}
                positions={productImage.positions}
                tradeDescriptions={tradeDescriptions}
              />
              {positions.map((pos, i) => {
                return (
                  <button
                    key={pos.id}
                    style={{
                      left: pos.x * scale,
                      top: pos.y * scale,
                      width: pos.width * scale,
                      height: pos.height * scale,
                    }}
                    className="absolute select-none border border-gray-500 bg-black bg-opacity-0 hover:bg-opacity-20"
                    onClick={() => {
                      setIndex(i);
                    }}
                  />
                );
              })}
            </div>
            <p className="text-right">@INCS・TP</p>
          </div>
        ) : null}
      </div>
      <div
        className="fixed h-20 w-full border-t border-gray-300 bg-white"
        style={{ bottom: 0, left: 0 }}
      >
        <div className="mx-4 flex h-full items-center justify-end">
          <button
            className="rounded-lg border border-blue-700 bg-blue-600 px-6 py-2 text-lg font-bold text-white"
            onClick={() => {
              setPreview(true);
            }}
          >
            保存用画像
          </button>
        </div>
      </div>

      <Dialog
        open={index != undefined}
        className="relative z-50"
        onClose={() => setIndex(undefined)}
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <DialogPanel className="w-full max-w-lg border bg-white p-4">
            {index != undefined ? (
              <TradeEditorDetail
                productImage={productImage}
                tradeDescriptions={tradeDescriptions}
                index={index}
                onClickPrev={() => setIndex(index - 1)}
                onClickNext={() => setIndex(index + 1)}
                onChangeTradeState={handleClickTradeState}
              />
            ) : null}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={preview} className="relative z-50" onClose={() => setPreview(false)}>
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <DialogPanel className="max-w-lg border bg-white p-4">
            <TradeImagePreview productImage={productImage} tradeDescriptions={tradeDescriptions} />
            {/* <img alt="Preview" className="mx-auto" src={stageRef.current?.toDataURL()} /> */}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
