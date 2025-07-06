import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useState } from "react";
import {
  BsBoxArrowUp,
  BsEraserFill,
  BsImageFill,
  BsPencilSquare,
  BsTrashFill,
} from "react-icons/bs";
import { RandomGoods } from "~/features/products/product";
import { useTradeEditorPanelStore } from "~/features/trade/store";
import {
  Stamp,
  totalHaveCount,
  totalWant,
  TradeDescription,
  TradeStatus,
} from "~/features/trade/TradeStatus";
import { convertToTradeText } from "~/features/tradeSummaries/tradeText";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { CopyButton } from "../CopyButton";
import { dialogBackdropStyle, dialogBaseStyle, dialogPanelStyle } from "../styles";
import { XMarkButton } from "../XMarkButton";
import { EmojiPanel } from "./EmojiPanel";
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

  const selectedStamp = useTradeEditorPanelStore((state) => state.selectedStamp);
  const setSelectedStamp = useTradeEditorPanelStore((state) => state.setSelectedStamp);
  const selectedEmoji = useTradeEditorPanelStore((state) => state.selectedEmoji);
  const setSelectedEmoji = useTradeEditorPanelStore((state) => state.setSelectedEmoji);

  const [detailDialogState, setDetailDialogState] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });
  const tradeText = convertToTradeText(productImage, tradeDescriptions);

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
                alt={productImage.name}
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
          </div>
        ) : null}

        <div className="mx-auto max-w-lg px-4">
          <section className="my-4 px-1 py-2">
            <h1>
              <span className="block text-2xl text-gray-800">{productImage.series}</span>
              <span className="block text-lg text-gray-400">{productImage.category}</span>
            </h1>

            <div className="mt-2 flex max-w-lg gap-12 text-2xl">
              <p className="flex items-center gap-2">
                <img src="/求.svg" alt="求" className="inline w-7" />
                <span>{totalWant(tradeDescriptions)}</span>
              </p>
              <p className="flex items-center gap-2">
                <img src="/譲.svg" alt="譲" className="inline w-7" />
                <span>{totalHaveCount(tradeDescriptions)}</span>
              </p>
            </div>

            {tradeText != undefined && tradeText.length != 0 && (
              <section className="my-8">
                <h2 className="text-lg font-semibold text-gray-800">トレード用テキスト</h2>
                <p className="my-1 text-sm text-gray-500">
                  トレード用のテキストです。右側のボタンでコピーできます。
                </p>
                <div className="my-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="ml-auto w-fit p-1">
                    <CopyButton data={tradeText} text />
                  </div>
                  <pre className="px-2 pb-2 font-sans text-wrap">{tradeText}</pre>
                </div>
              </section>
            )}
          </section>
        </div>
      </div>

      {/* パネル */}
      <div className="sticky h-14 lg:h-16" style={{ bottom: 0 }}>
        <div className="h-full border-t border-gray-300 bg-white lg:mx-4 lg:px-0">
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
          setDetailDialogState({ ...detailDialogState, open: false });
        }}
      >
        <DialogBackdrop className={dialogBackdropStyle()} transition />
        <div className={dialogBaseStyle()}>
          <DialogPanel
            className={clsx(dialogPanelStyle(), "bg-nadeshiko-50 mx-2 w-full max-w-lg")}
            transition
          >
            <div className="ml-auto w-fit p-2">
              <CloseButton as={XMarkButton} />
            </div>
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
        <DialogBackdrop transition className={dialogBackdropStyle()} />
        <div className={dialogBaseStyle()}>
          <DialogPanel
            transition
            className={clsx(
              dialogPanelStyle(),
              "m-12 w-full max-w-80 grow text-gray-700 select-none",
            )}
          >
            <div className="w-full space-y-2 rounded-2xl border-gray-200 bg-gray-100 py-4">
              <div className="py-4">
                <BsTrashFill className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-4 px-6 text-center font-semibold text-gray-600">
                  トレード設定をクリアしますか？
                </p>
                <p className="mt-2 px-6 text-center text-gray-600">
                  このグッズのトレード設定をクリアします。
                </p>
              </div>

              <div className="px-4">
                <CloseButton
                  className="bg-nadeshiko-800 hover:bg-nadeshiko-900 active:bg-nadeshiko-600 block w-full rounded-full px-8 py-2 text-center text-lg font-bold text-white"
                  onClick={() => onClearTradeDescriptions?.(productImage.id)}
                >
                  クリアする
                </CloseButton>
              </div>

              <div className="px-4">
                <CloseButton className="text-nadeshiko-800 hover:text-nadeshiko-900 active:text-nadeshiko-600 block w-full rounded-full p-2 px-8 py-2 text-center text-lg font-bold">
                  キャンセル
                </CloseButton>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={preview} className="relative z-50" onClose={() => setPreview(false)}>
        <DialogBackdrop transition className={dialogBackdropStyle()} />
        <div className={dialogBaseStyle()}>
          <DialogPanel
            className={clsx(
              dialogPanelStyle(),
              "m-4 max-h-svh overflow-y-auto border border-gray-200 bg-white pb-4",
            )}
            transition
          >
            <div className="sticky top-0 bg-white/90 p-2">
              <CloseButton className="ml-auto" as={XMarkButton} />
            </div>
            <div className="px-4 pb-4">
              <TradeImagePreview
                productImage={productImage}
                tradeDescriptions={tradeDescriptions}
              />
              {/* <img alt="Preview" className="mx-auto" src={stageRef.current?.toDataURL()} /> */}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

const toolButton = () =>
  clsx("h-10 w-10 group rounded-xl p-1 transition-colors data-checked:bg-gray-200");
const stamp = () => clsx("opacity-50 transition-opacity group-data-checked:opacity-100");
const toolIcon = () =>
  clsx("h-6 w-6 text-gray-400 transition-colors group-data-checked:text-gray-600");
