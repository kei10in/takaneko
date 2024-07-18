import { Dialog, DialogPanel } from "@headlessui/react";
import Konva from "konva";
import { useRef, useState } from "react";
import { TbChevronLeft, TbChevronRight, TbCircleOff } from "react-icons/tb";
import { ProductImage } from "~/features/productImages";
import { TradeState } from "~/features/TradeState";
import { ClippedImage } from "./ClippedImage";
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

  const [selected, setSelected] = useState<number | undefined>(undefined);
  const selPosition =
    selected != undefined ? positions.find((pos) => pos.id == selected) : undefined;

  const current = positions.findIndex((pos) => pos.id == selected);
  const prev = current != undefined && current != 0 ? current - 1 : undefined;
  const next = current != undefined && current <= positions.length - 1 ? current + 1 : undefined;

  const handleClickTradeState = (v: TradeState) => {
    setTradeStates((state) => {
      const i = state.findIndex((s) => s.id == selected);
      if (i == undefined) {
        return state;
      }

      const items = [...state];
      items[i] = { ...items[i], state: v };

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
                  {positions.map((pos) => {
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
                          setSelected(pos.id);
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
        open={selected != undefined}
        className="relative z-50"
        onClose={() => setSelected(undefined)}
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <DialogPanel className="w-full max-w-lg border bg-white p-4">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="flex-none">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                  disabled={prev == undefined}
                  onClick={() => {
                    if (prev != undefined) {
                      setSelected(positions[prev].id);
                    }
                  }}
                >
                  <TbChevronLeft className="text-xl text-gray-800" />
                </button>
              </div>
              <ClippedImage
                className="flex-none"
                clip={selPosition ?? { x: 0, y: 0, width: 0, height: 0 }}
                src={productImage.url}
              />
              <div className="flex-none">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                  disabled={next == undefined}
                  onClick={() => {
                    if (next != undefined) {
                      setSelected(positions[next].id);
                    }
                  }}
                >
                  <TbChevronRight className="text-xl text-gray-800" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button
                className="flex-none p-1"
                onClick={() => handleClickTradeState({ tag: "none" })}
              >
                <TbCircleOff className="h-10 w-10 text-gray-300" />
              </button>
              <button className="flex-none" onClick={() => handleClickTradeState({ tag: "want" })}>
                <img src="/求.svg" alt="求" className="h-12 w-12" />
              </button>
              <button className="flex-none" onClick={() => handleClickTradeState({ tag: "have" })}>
                <img src="/譲.svg" alt="譲" className="h-12 w-12" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 1 })}
              >
                <img src="/1.svg" alt="1" className="h-12 w-12" />
              </button>
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 2 })}
              >
                <img src="/2.svg" alt="2" className="h-12 w-12" />
              </button>
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 3 })}
              >
                <img src="/3.svg" alt="3" className="h-12 w-12" />
              </button>
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 4 })}
              >
                <img src="/4.svg" alt="4" className="h-12 w-12" />
              </button>
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 5 })}
              >
                <img src="/5.svg" alt="5" className="h-12 w-12" />
              </button>
              <button
                className="flex-none"
                onClick={() => handleClickTradeState({ tag: "have", count: 6 })}
              >
                <img src="/6.svg" alt="6" className="h-12 w-12" />
              </button>
            </div>
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
