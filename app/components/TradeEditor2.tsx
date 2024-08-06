import { CloseButton, Dialog, DialogPanel, Switch } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { HiCog, HiNoSymbol } from "react-icons/hi2";
import { ProductImage } from "~/features/productImages";
import { Stamp, TradeDescription, TradeStatus } from "~/features/TradeStatus";
import { HtmlTradeImage } from "./HtmlTradeImage";
import { ImageLoader } from "./ImageLoader.client";
import { TradeEditorDetail } from "./TradeEditorDetail";
import { TradeImagePreview } from "./TradeImagePreview";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: Record<number, TradeDescription>;
  width: number;
  onChangeTradeDescription?: (photoId: number, status: TradeStatus) => void;
  onClearTradeDescriptions?: (id: string) => void;
}

type StampType = "clear" | "wanted" | "+1" | "-1" | "cog";

export const TradeEditor2: React.FC<Props> = (props: Props) => {
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
  const [selectedStamp, setSelectedStamp] = useState<StampType>("cog");
  const [index, setIndex] = useState<number | undefined>(undefined);
  const lastIndex = positions.length - 1;

  const scale = width / productImage.width;
  const height = productImage.height * scale;

  const handleClickTradeState = (id: number, v: TradeStatus) => {
    onChangeTradeDescription?.(id, v);
  };

  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setImageLoading(true);
  }, [productImage.url]);

  const handleLoad = () => {
    setImageLoading(false);
  };

  const handleStamp = (id: number, i: number) => {
    const v = tradeDescriptions[id];
    const status = v?.status;
    if (selectedStamp == "clear") {
      onChangeTradeDescription?.(id, Stamp.clear(status));
    } else if (selectedStamp == "wanted") {
      onChangeTradeDescription?.(id, Stamp.wanted(status));
    } else if (selectedStamp == "+1") {
      onChangeTradeDescription?.(id, Stamp.increment(status));
    } else if (selectedStamp == "-1") {
      onChangeTradeDescription?.(id, Stamp.decrement(status));
    } else if (selectedStamp == "cog") {
      setIndex(i);
    }
  };

  return (
    <div className="w-full">
      <div className="my-4 w-full pb-[6.5rem]">
        {positions.length != 0 ? (
          <div className="mx-auto">
            {imageLoading ? <ImageLoader width={width} height={height} /> : null}
            <div className={clsx("relative select-none", imageLoading && "hidden")}>
              <HtmlTradeImage
                image={{
                  url: productImage.url,
                  width: productImage.width,
                  height: productImage.height,
                }}
                width={width}
                positions={productImage.positions}
                tradeDescriptions={tradeDescriptions}
                onLoad={handleLoad}
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
                    className="absolute select-none"
                    onClick={() => {
                      handleStamp(pos.id, i);
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
        className="fixed h-fit w-full border-t border-gray-300 bg-white"
        style={{ bottom: 0, left: 0 }}
      >
        <div className="container mx-auto h-fit w-full">
          <div className="my-2">
            <div className="flex items-center justify-center gap-0.5">
              <Switch
                className="group rounded-xl p-1 data-[checked]:bg-gray-200"
                checked={selectedStamp == "wanted"}
                onClick={() => setSelectedStamp("wanted")}
              >
                <img
                  src="/求.svg"
                  alt="求"
                  className="h-8 w-8 opacity-50 group-data-[checked]:opacity-100"
                />
              </Switch>
              <Switch
                className="group rounded-xl p-1 data-[checked]:bg-gray-200"
                checked={selectedStamp == "+1"}
                onClick={() => setSelectedStamp("+1")}
              >
                <img
                  src="/increment.svg"
                  alt="+1"
                  className="h-8 w-8 opacity-50 group-data-[checked]:opacity-100"
                />
              </Switch>
              <Switch
                className="group rounded-xl p-1 data-[checked]:bg-gray-200"
                checked={selectedStamp == "-1"}
                onClick={() => setSelectedStamp("-1")}
              >
                <img
                  src="/decrement.svg"
                  alt="-1"
                  className="h-8 w-8 opacity-50 group-data-[checked]:opacity-100"
                />
              </Switch>
              <Switch
                className="group rounded-xl p-1 data-[checked]:bg-gray-200"
                checked={selectedStamp == "clear"}
                onClick={() => setSelectedStamp("clear")}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  <HiNoSymbol className="h-6 w-6 text-gray-400 group-data-[checked]:text-gray-600" />
                </div>
              </Switch>
              <Switch
                className="group rounded-xl p-1 data-[checked]:bg-gray-200"
                checked={selectedStamp == "cog"}
                onClick={() => setSelectedStamp("cog")}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  <HiCog className="h-6 w-6 text-gray-400 group-data-[checked]:text-gray-600" />
                </div>
              </Switch>
            </div>
          </div>

          <div className="mx-4 my-2 flex items-center justify-between">
            <button
              className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-1 text-lg font-bold text-white"
              onClick={() => setShowConfirmClear(true)}
            >
              クリア
            </button>
            <button
              className="rounded-lg border border-blue-700 bg-blue-600 px-4 py-1 text-lg font-bold text-white"
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
