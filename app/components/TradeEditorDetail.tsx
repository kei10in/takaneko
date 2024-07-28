import { MouseEventHandler } from "react";
import { HiChevronLeft, HiChevronRight, HiNoSymbol } from "react-icons/hi2";
import { ProductImage } from "~/features/productImages";
import { TradeDescription, TradeStatus, tradeStateToImageSrc } from "~/features/TradeStatus";
import { ClippedImage } from "./ClippedImage";
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
  const tradeState = tradeDescription?.status;
  const tradeStateImageSrc = tradeState != undefined ? tradeStateToImageSrc(tradeState) : undefined;

  const handleClickTradeState = (v: TradeStatus) => {
    onChangeTradeState?.(selPosition.id, v);
  };

  const width = 180;
  const scale = width / selPosition.width;

  return (
    <div>
      {/* Image and image selector */}
      <div className="flex w-full select-none items-stretch justify-center">
        <div className="flex-none">
          <button
            className="group h-full p-2 hover:bg-gray-100"
            disabled={index == 0}
            onClick={(e) => onClickPrev?.(e)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200">
              <HiChevronLeft className="text-xl text-gray-800" />
            </div>
          </button>
        </div>
        <div className="relative">
          <ClippedImage
            className="flex-none"
            clip={selPosition ?? { x: 0, y: 0, width: 0, height: 0 }}
            alt="Selected"
            width={width}
            src={productImage.url}
          />
          {tradeStateImageSrc != undefined ? (
            <img
              src={tradeStateImageSrc}
              alt=""
              className="absolute bottom-0 left-1/2 -translate-x-1/2 transform"
              style={{
                width: (scale * selPosition.width) / 1.5,
                height: (scale * selPosition.width) / 1.5,
              }}
            />
          ) : null}
        </div>
        <div className="flex-none">
          <button
            className="group h-full p-2 hover:bg-gray-100"
            disabled={positions.length <= index + 1}
            onClick={(e) => onClickNext?.(e)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200">
              <HiChevronRight className="text-xl text-gray-800" />
            </div>
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
            value={tradeState}
            forValue={{ tag: "none" }}
            onClick={handleClickTradeState}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <HiNoSymbol className="h-8 w-8 text-gray-400" />
            </div>
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "want" }}
            onClick={handleClickTradeState}
          >
            <img src="/求.svg" alt="求" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have" }}
            onClick={handleClickTradeState}
          >
            <img src="/譲.svg" alt="譲" className="h-10 w-10" />
          </TradeStateButton>
        </div>
        <div className="mt-0.5 flex items-center justify-center gap-0.5">
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have", count: 1 }}
            onClick={handleClickTradeState}
          >
            <img src="/1.svg" alt="1" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have", count: 2 }}
            onClick={handleClickTradeState}
          >
            <img src="/2.svg" alt="2" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have", count: 3 }}
            onClick={handleClickTradeState}
          >
            <img src="/3.svg" alt="3" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have", count: 4 }}
            onClick={handleClickTradeState}
          >
            <img src="/4.svg" alt="4" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
            forValue={{ tag: "have", count: 5 }}
            onClick={handleClickTradeState}
          >
            <img src="/5.svg" alt="5" className="h-10 w-10" />
          </TradeStateButton>
          <TradeStateButton
            value={tradeState}
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
