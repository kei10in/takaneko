import { Dialog, DialogPanel } from "@headlessui/react";
import Konva from "konva";
import { useRef, useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeState } from "~/features/TradeState";
import { TradeEditorDetail } from "./TradeEditorDetail";
import { TradeImage } from "./TradeImage.client";

interface Props {
  productImage: ProductImage;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const { productImage } = props;

  const stageRef = useRef<Konva.Stage>(null);

  const photos = productImage.photos;
  const positions = productImage.positions;

  const [tradeStates, setTradeStates] = useState<{ id: number; state: TradeState }[]>(() =>
    photos.map((p) => ({ id: p.id, state: { tag: "none" } })),
  );

  const [preview, setPreview] = useState(false);
  const [index, setIndex] = useState<number | undefined>(undefined);

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

  return (
    <div>
      <div>
        {positions.length != 0 ? (
          <TradeImage
            key={productImage.name}
            url={productImage.url}
            positions={productImage.positions}
            tradeDescriptions={tradeStates}
            ref={stageRef}
          >
            {(scale) => {
              return (
                <div className="relative">
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
              );
            }}
          </TradeImage>
        ) : null}
      </div>
      <button
        className="mt-4 rounded-lg border border-gray-400 bg-gray-300 px-4 py-1"
        onClick={() => {
          if (stageRef.current == undefined) {
            return;
          }

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
            <img alt="Preview" className="mx-auto" src={stageRef.current?.toDataURL()} />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
