import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { MouseEventHandler, useState } from "react";
import { BsBan } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ProductImage } from "~/features/products/product";
import { stampPosition } from "~/features/trade/stampPosition";
import { TradeDescription, TradeStatus, tradeStateToImageSrc } from "~/features/TradeStatus";
import { ClippedImage } from "./ClippedImage";
import { SelectableEmojis } from "./EmojiPanel";
import { TradeStateButton } from "./TradeStateButton";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: Record<number, TradeDescription>;
  index: number;
  onClickPrev?: MouseEventHandler<HTMLButtonElement>;
  onClickNext?: MouseEventHandler<HTMLButtonElement>;
  onChangeTradeState?: (id: number, ts: TradeStatus) => void;
}

export const TradeEditorDetail: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions, index, onClickPrev, onClickNext, onChangeTradeState } =
    props;

  const photos = productImage.photos;
  const selPhoto = photos[index];
  const positions = productImage.positions;
  const selPosition = positions[index];
  const tradeDescription = tradeDescriptions[selPosition.id];
  const tradeStatus = tradeDescription?.status ?? { tag: "none" };
  const tradeStateImageSrc = tradeStateToImageSrc(tradeStatus);

  const [selectedEmoji, setSelectedEmoji] = useState<string>(() => {
    if (tradeStatus.tag === "emoji") {
      return tradeStatus.emoji;
    }
    return SelectableEmojis[0];
  });

  const handleClickTradeState = (v: TradeStatus) => {
    onChangeTradeState?.(selPosition.id, v);
  };

  const width = 180;
  const scale = width / selPosition.width;

  const stampPos = stampPosition({
    x: 0,
    y: 0,
    width: selPosition.width,
    height: selPosition.height,
  });

  return (
    <div>
      {/* Image and image selector */}
      <div className="flex w-full select-none items-stretch justify-center">
        <div className="flex-1">
          <button
            className="group flex h-full w-full items-center justify-center p-2 active:bg-gray-100"
            onClick={(e) => onClickPrev?.(e)}
          >
            <HiChevronLeft className="text-xl text-gray-800" />
          </button>
        </div>
        <div className="relative flex-none">
          <ClippedImage
            clip={selPosition ?? { x: 0, y: 0, width: 0, height: 0 }}
            alt="Selected"
            width={width}
            src={productImage.url}
          />
          {tradeStateImageSrc != undefined ? (
            <img
              src={tradeStateImageSrc}
              alt="トレード設定"
              className="absolute"
              style={{
                left: stampPos.x * scale,
                top: stampPos.y * scale,
                width: stampPos.width * scale,
                height: stampPos.height * scale,
              }}
            />
          ) : tradeStatus.tag === "emoji" ? (
            <div
              className="absolute flex items-center justify-center text-center leading-none"
              style={{
                left: stampPos.x * scale,
                top: stampPos.y * scale,
                width: stampPos.width * scale,
                height: stampPos.height * scale,
                fontSize: stampPos.height * scale * 0.9,
              }}
            >
              {tradeStatus.emoji}
            </div>
          ) : null}
        </div>
        <div className="flex-1">
          <button
            className="group flex h-full w-full items-center justify-center p-2 active:bg-gray-50"
            onClick={(e) => onClickNext?.(e)}
          >
            <HiChevronRight className="text-xl text-gray-800" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="mx-auto mt-4 flex w-60 items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-400">
          <div>
            <p className="text-[0.625rem] leading-none text-white">No.</p>
            <p className="text-lg leading-none text-white">
              {selPhoto.id.toString().padStart(3, "0")}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xl">{selPhoto.name}</p>
          <p className="text-md text-gray-500">{selPhoto.description}</p>
        </div>
      </div>

      {/* Trade state selector */}
      <div className="select-none">
        <div className="mt-4 flex items-center justify-center gap-0.5">
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "none" }}
            onClick={handleClickTradeState}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <BsBan className="h-8 w-8 text-gray-400" />
            </div>
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "want" }}
            onClick={handleClickTradeState}
          >
            <img src="/求.svg" alt="求" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have" }}
            onClick={handleClickTradeState}
          >
            <img src="/譲.svg" alt="譲" className="h-10 w-10" />
          </TradeStateButton>

          {/* Emoji */}
          <Popover className="relative">
            <PopoverButton
              className="group w-fit flex-none rounded-2xl p-1 hover:bg-gray-200 data-[selected]:bg-gray-200"
              data-selected={tradeStatus.tag == "emoji" || undefined}
            >
              <div className="flex h-10 w-10 items-center justify-center text-3xl leading-none">
                {selectedEmoji}
              </div>
            </PopoverButton>

            <PopoverPanel anchor={{ to: "bottom", gap: "1rem", padding: "2rem" }}>
              {({ close }) => (
                <div className="rounded-xl border bg-white p-2">
                  <div className="mx-auto mt-0.5 grid w-64 grid-cols-5 place-items-center items-center justify-center gap-0.5">
                    {SelectableEmojis.map((emoji) => (
                      <TradeStateButton
                        key={emoji}
                        value={tradeStatus}
                        forValue={{ tag: "emoji", emoji }}
                        onClick={(v) => {
                          setSelectedEmoji(emoji);
                          handleClickTradeState(v);
                          close();
                        }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center text-3xl leading-none">
                          {emoji}
                        </div>
                      </TradeStateButton>
                    ))}
                  </div>
                </div>
              )}
            </PopoverPanel>
          </Popover>
        </div>
        <div className="mt-0.5 flex items-center justify-center gap-0.5">
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 1 }}
            onClick={handleClickTradeState}
          >
            <img src="/1.svg" alt="1" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 2 }}
            onClick={handleClickTradeState}
          >
            <img src="/2.svg" alt="2" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 3 }}
            onClick={handleClickTradeState}
          >
            <img src="/3.svg" alt="3" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 4 }}
            onClick={handleClickTradeState}
          >
            <img src="/4.svg" alt="4" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 5 }}
            onClick={handleClickTradeState}
          >
            <img src="/5.svg" alt="5" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeStatus}
            forValue={{ tag: "have", count: 6 }}
            onClick={handleClickTradeState}
          >
            <img src="/6.svg" alt="6" className="h-10 w-10" />
          </TradeStateButton>
        </div>
      </div>
    </div>
  );
};
