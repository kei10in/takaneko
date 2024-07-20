import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeState } from "~/features/TradeState";
import { HtmlTradeImage } from "./HtmlTradeImage";
import { TradeEditorDetail } from "./TradeEditorDetail";
import { TradeImagePreview } from "./TradeImagePreview";

interface Props {
  productImage: ProductImage;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const { productImage } = props;

  const photos = productImage.photos;
  const positions = productImage.positions;

  const [tradeStates, setTradeStates] = useState<{ id: number; state: TradeState }[]>(() =>
    photos.map((p) => ({ id: p.id, state: { tag: "none" } })),
  );

  const [preview, setPreview] = useState(false);
  const [index, setIndex] = useState<number | undefined>(undefined);

  const scale = 390 / productImage.width;

  const handleClickTradeState = (id: number, v: TradeState) => {
    setTradeStates((state) => {
      const index = state.findIndex((s) => s.id == id);
      if (index == undefined) {
        return state;
      }

      const items = [...state];
      items[index] = { ...items[index], state: v };

      return items;
    });
  };

  console.log({ preview });

  return (
    <div>
      <div>
        {positions.length != 0 ? (
          <div className="relative">
            <HtmlTradeImage
              image={{
                url: productImage.url,
                width: productImage.width,
                height: productImage.height,
              }}
              width={390}
              positions={productImage.positions}
              tradeDescriptions={tradeStates}
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
                  className="absolute border border-gray-400 bg-white opacity-30 hover:opacity-40 active:opacity-50"
                  onClick={() => {
                    setIndex(i);
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </div>
      <button
        className="mt-4 rounded-lg border border-gray-400 bg-gray-300 px-4 py-1"
        onClick={() => {
          setPreview(true);
        }}
      >
        プレビュー
      </button>

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
            <TradeImagePreview productImage={productImage} tradeDescriptions={tradeStates} />
            {/* <img alt="Preview" className="mx-auto" src={stageRef.current?.toDataURL()} /> */}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
