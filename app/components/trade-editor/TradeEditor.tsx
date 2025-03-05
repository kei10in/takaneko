import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useState } from "react";
import { RandomGoods } from "~/features/products/product";
import { TradeDescription, TradeStatus } from "~/features/trade/TradeStatus";
import { HtmlTradeImage } from "./HtmlTradeImage";
import { TradeEditorDetail } from "./TradeEditorDetail";
import { TradeImagePreview } from "./TradeImagePreview";

interface Props {
  productImage: RandomGoods;
  tradeDescriptions: Record<number, TradeDescription>;
  width: number;
  onChangeTradeDescription?: (photoId: number, status: TradeStatus) => void;
  onClearTradeDescriptions?: (id: string) => void;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const {
    productImage,
    tradeDescriptions,
    width,
    onClearTradeDescriptions,
    onChangeTradeDescription,
  } = props;

  const positions = productImage.positions;

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [preview, setPreview] = useState(false);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const lastIndex = positions.length - 1;

  const scale = width / productImage.width;

  const handleClickTradeState = (id: number, v: TradeStatus) => {
    onChangeTradeDescription?.(id, v);
  };

  return (
    <div className="w-full">
      <div className="my-4 w-full pb-20">
        {positions.length != 0 ? (
          <div className="mx-auto">
            <div className={clsx("relative select-none")}>
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
            <p className="text-right">©INCS・TP</p>
          </div>
        ) : null}
      </div>
      <div
        className="fixed h-20 w-full border-t border-gray-300 bg-white"
        style={{ bottom: 0, left: 0 }}
      >
        <div className="container mx-auto h-full w-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <button
              className="rounded-lg border border-blue-700 bg-blue-600 px-6 py-2 text-lg font-bold text-white"
              onClick={() => setShowConfirmClear(true)}
            >
              クリア
            </button>
            <button
              className="rounded-lg border border-blue-700 bg-blue-600 px-6 py-2 text-lg font-bold text-white"
              onClick={() => {
                setPreview(true);
              }}
            >
              トレード画像
            </button>
          </div>
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
                onClickPrev={() => setIndex(index <= 0 ? lastIndex : index - 1)}
                onClickNext={() => setIndex(lastIndex <= index ? 0 : index + 1)}
                onChangeTradeState={handleClickTradeState}
              />
            ) : null}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Confirm to clear */}
      <Dialog
        open={showConfirmClear}
        className="relative z-50"
        onClose={() => setShowConfirmClear(false)}
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <DialogPanel className="min-w-64 max-w-lg border bg-white text-lg text-gray-700">
            <div className="flex w-full items-center justify-between p-4">
              <p className="text-center">トレード設定をクリアしますか？</p>
            </div>

            <hr />

            <CloseButton
              className="block w-full p-2 text-center font-bold text-red-500 hover:bg-gray-100"
              onClick={() => onClearTradeDescriptions?.(productImage.id)}
            >
              クリアする
            </CloseButton>

            <hr />

            <CloseButton className="block w-full p-2 text-center font-bold text-blue-500 hover:bg-gray-100">
              キャンセル
            </CloseButton>
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
