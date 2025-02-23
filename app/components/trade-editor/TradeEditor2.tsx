import {
  CloseButton,
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
} from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import {
  BsBoxArrowUp,
  BsEraserFill,
  BsImageFill,
  BsPencilSquare,
  BsTrashFill,
} from "react-icons/bs";
import { RandomGoods } from "~/features/products/product";
import {
  Stamp,
  totalHaveCount,
  totalWant,
  TradeDescription,
  TradeStatus,
} from "~/features/trade/TradeStatus";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { EmojiPanel, SelectableEmojis } from "./EmojiPanel";
import { HtmlTradeImage } from "./HtmlTradeImage";
import { shareTradeImage } from "./shareTradeImage";
import { TradeEditorDetail2 } from "./TradeEditorDetail2";
import { TradeImagePreview } from "./TradeImagePreview";

interface Props {
  productImage: RandomGoods;
  tradeDescriptions: Record<number, TradeDescription>;
  width: number;
  onChangeTradeDescription?: (photoId: number, status: TradeStatus) => void;
  onClearTradeDescriptions?: (id: string) => void;
}

type StampType = "clear" | "wanted" | "+1" | "-1" | "cog" | "emoji";

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
  const [selectedEmoji, setSelectedEmoji] = useState<string>(SelectableEmojis[0]);
  const [detailDialogState, setDetailDialogState] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const scale = width / productImage.width;

  const handleClickTradeState = (id: number, v: TradeStatus) => {
    onChangeTradeDescription?.(id, v);
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
    } else if (selectedStamp == "emoji") {
      onChangeTradeDescription?.(id, Stamp.emoji(status, selectedEmoji));
    } else if (selectedStamp == "cog") {
      setDetailDialogState({ open: true, index: i });
    }
  };

  const showShareButton = shouldUseWebShareApi();

  return (
    <div className="w-full">
      {/* 
        アートボード 
        パネルが画面の一番下に固定されるように最小の高さを指定しています。
        画面全体 (100svh) からヘッダーとパネル を引いた高さです。
        ヘッダーやパネルはモバイルとデスクトップで異なります。
      */}
      <div className="min-h-[calc(100lvh-3rem-3.5rem)] w-full lg:min-h-[calc(100vh-var(--header-height)-4rem)]">
        {positions.length != 0 ? (
          <div className="mx-auto w-fit py-4">
            <div className={clsx("relative mx-auto select-none")}>
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
                    className="absolute select-none"
                    onClick={() => {
                      handleStamp(pos.id, i);
                    }}
                  />
                );
              })}
            </div>

            <p className="px-1 text-right">©INCS・TP</p>

            <div className="mt-4 px-1 py-2">
              <p className="text-2xl text-gray-800">{productImage.series}</p>
              <p className="text-lg text-gray-400">{productImage.category}</p>

              <div className="mt-2">
                <p className="flex items-center gap-1">
                  <img src="/譲.svg" alt="譲" className="inline w-6" />
                  <span>{totalHaveCount(tradeDescriptions)}</span>
                </p>
                <p className="flex items-center gap-1">
                  <img src="/求.svg" alt="求" className="inline w-6" />
                  <span>{totalWant(tradeDescriptions)}</span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* パネル */}
      <div className="sticky h-14 lg:h-16" style={{ bottom: 0 }}>
        <div className="h-full border-t border-gray-300 bg-white px-4 lg:mx-4 lg:px-0">
          <div className="flex h-full items-center justify-center gap-4">
            <div className="flex items-center justify-center">
              <Switch
                className={toolButton()}
                checked={selectedStamp == "wanted"}
                onClick={() => setSelectedStamp("wanted")}
              >
                <img src="/求.svg" alt="求" className={stamp()} />
              </Switch>
              <Switch
                className={toolButton()}
                checked={selectedStamp == "+1"}
                onClick={() => setSelectedStamp("+1")}
              >
                <img src="/increment.svg" alt="+1" className={stamp()} />
              </Switch>
              <Switch
                className={toolButton()}
                checked={selectedStamp == "-1"}
                onClick={() => setSelectedStamp("-1")}
              >
                <img src="/decrement.svg" alt="-1" className={stamp()} />
              </Switch>
              <Popover className="relative">
                <PopoverButton
                  className={clsx(toolButton())}
                  data-checked={selectedStamp == "emoji" ? "true" : undefined}
                  onClick={() => setSelectedStamp("emoji")}
                >
                  <div className={clsx("flex items-center justify-center text-2xl", stamp())}>
                    {selectedEmoji}
                  </div>
                </PopoverButton>
                <PopoverPanel
                  anchor={{ to: "top", gap: "1.5rem" }}
                  className="overflow-hidden rounded-xl bg-white shadow-md"
                >
                  {({ close }) => (
                    <EmojiPanel
                      selected={selectedEmoji}
                      onChange={(e) => {
                        setSelectedEmoji(e);
                        close();
                      }}
                    />
                  )}
                </PopoverPanel>
              </Popover>
              <Switch
                className={toolButton()}
                checked={selectedStamp == "clear"}
                onClick={() => setSelectedStamp("clear")}
              >
                <div className="flex items-center justify-center">
                  <BsEraserFill className={toolIcon()} />
                </div>
              </Switch>
              <Switch
                className={toolButton()}
                checked={selectedStamp == "cog"}
                onClick={() => setSelectedStamp("cog")}
              >
                <div className="flex items-center justify-center">
                  <BsPencilSquare className={toolIcon()} />
                </div>
              </Switch>
            </div>

            <div className="flex items-center justify-center gap-0.5">
              {!showShareButton && (
                <button className={toolButton()} onClick={async () => setPreview(true)}>
                  <div className="flex items-center justify-center">
                    <BsImageFill className="h-6 w-6 text-gray-600" />
                  </div>
                </button>
              )}

              {showShareButton && (
                <button
                  className={toolButton()}
                  onClick={() => shareTradeImage(productImage, tradeDescriptions)}
                >
                  <div className="flex items-center justify-center">
                    <BsBoxArrowUp className="h-6 w-6 text-gray-600" />
                  </div>
                </button>
              )}

              <button className={toolButton()} onClick={() => setShowConfirmClear(true)}>
                <div className="flex items-center justify-center">
                  <BsTrashFill className="h-6 w-6 text-gray-600" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={detailDialogState.open}
        className="relative z-50"
        onClose={() => {
          console.log("on close");
          setDetailDialogState({ ...detailDialogState, open: false });
        }}
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <DialogPanel className="w-full max-w-lg bg-white">
            <TradeEditorDetail2
              productImage={productImage}
              tradeDescriptions={tradeDescriptions}
              index={detailDialogState.index}
              onChangeItem={(newIndex) =>
                setDetailDialogState({ ...detailDialogState, index: newIndex })
              }
              onChangeTradeState={handleClickTradeState}
            />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Confirm to clear */}
      <Dialog
        open={showConfirmClear}
        className="relative z-50"
        onClose={() => setShowConfirmClear(false)}
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
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
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <DialogPanel className="max-w-lg border bg-white p-4">
            <TradeImagePreview productImage={productImage} tradeDescriptions={tradeDescriptions} />
            {/* <img alt="Preview" className="mx-auto" src={stageRef.current?.toDataURL()} /> */}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

const toolButton = () =>
  clsx("h-10 w-10 group rounded-xl p-1 transition-colors data-[checked]:bg-gray-200");
const stamp = () => clsx("opacity-50 transition-opacity group-data-[checked]:opacity-100");
const toolIcon = () =>
  clsx("h-6 w-6 text-gray-400 transition-colors group-data-[checked]:text-gray-600");
