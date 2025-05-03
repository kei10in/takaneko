import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { MouseEventHandler, useMemo, useState } from "react";
import { BsBan } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { RandomGoods } from "~/features/products/product";
import { SelectableEmojis } from "~/features/trade/stamp";
import { stampPositions } from "~/features/trade/stampPosition";
import { TradeDescription, TradeStatus, tradeStateToImageSrc } from "~/features/trade/TradeStatus";
import { ClippedImage } from "../ClippedImage";
import { TradeStateButton } from "./TradeStateButton";

interface Props {
  productImage: RandomGoods;
  tradeDescriptions: Record<number, TradeDescription>;
  index: number;
  onClickPrev?: MouseEventHandler<HTMLButtonElement>;
  onClickNext?: MouseEventHandler<HTMLButtonElement>;
  onChangeTradeState?: (id: number, ts: TradeStatus) => void;
}

export const TradeEditorDetail: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions, index, onClickPrev, onClickNext, onChangeTradeState } =
    props;

  const photos = productImage.lineup;
  const selPhoto = photos[index];
  const positions = productImage.positions;
  const maxWidth = useMemo(() => Math.max(...positions.map((p) => p.width)), [positions]);
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
  const scale = width / maxWidth;
  const height = selPosition.height * scale;

  const stamps = useMemo(() => stampPositions(positions), [positions]);
  const stamp = stamps[index];
  // TradeEditorDetails では画像をクリップした部分だけで表示するため、クリップ部分の座標系に合わせる。
  const stampPos = {
    left: (stamp.x - selPosition.x + (maxWidth - selPosition.width) / 2) * scale,
    top: (stamp.y - selPosition.y) * scale,
    width: stamp.width * scale,
    height: stamp.height * scale,
  };

  return (
    <div className="bg-nadeshiko-50 p-4">
      {/* Image and image selector */}
      <div className="flex w-full items-stretch justify-center select-none">
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
            className="object-contain"
            style={{ width, height }}
            src={productImage.url}
            alt="Selected"
          />
          {tradeStateImageSrc != undefined ? (
            <img
              src={tradeStateImageSrc}
              alt="トレード設定"
              className="absolute"
              style={{ ...stampPos }}
            />
          ) : tradeStatus.tag === "emoji" ? (
            <div
              className="absolute flex items-center justify-center text-center leading-none"
              style={{ ...stampPos, fontSize: stampPos.height * 0.9 }}
            >
              {tradeStatus.emoji}
            </div>
          ) : null}
        </div>
        <div className="flex-1">
          <button
            className="group flex h-full w-full items-center justify-center p-2 active:bg-gray-100"
            onClick={(e) => onClickNext?.(e)}
          >
            <HiChevronRight className="text-xl text-gray-800" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="relative mx-auto mt-4 h-16 w-80 items-center gap-4 overflow-hidden rounded-tr-[2rem] rounded-bl-[2rem] bg-white shadow-sm">
        <div className="bg-nadeshiko-500 absolute -top-9 -left-5 h-20 w-20 rounded-full" />
        <div className="absolute rounded-full p-2">
          <p className="text-[0.625rem] leading-none text-white">No.</p>
          <p className="px-1 text-sm leading-none text-white">
            {selPhoto.id.toString().padStart(3, "0")}
          </p>
        </div>
        <div className="flex h-full items-center justify-center">
          <div>
            <p className="text-center text-xl text-gray-800">{selPhoto.name}</p>
            <p className="text-md text-nadeshiko-800 text-center">{selPhoto.description}</p>
          </div>
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
              <BsBan className="h-8 w-8" />
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
              className={clsx(
                "group w-fit flex-none rounded-2xl p-1 opacity-50",
                "data-selected:bg-gray-800/10 data-selected:opacity-100",
              )}
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
