import { MouseEventHandler } from "react";
import { TbChevronLeft, TbChevronRight, TbCircleOff } from "react-icons/tb";
import { ProductImage } from "~/features/productImages";
import { TradeDescription, TradeState } from "~/features/TradeState";
import { ClippedImage } from "./ClippedImage";
import { TradeStateButton } from "./TradeStateButton";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: TradeDescription[];
  index: number;
  onClickPrev?: MouseEventHandler<HTMLButtonElement>;
  onClickNext?: MouseEventHandler<HTMLButtonElement>;
  onChangeTradeState?: (id: number, ts: TradeState) => void;
}

export const TradeEditorDetail: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions, index, onClickPrev, onClickNext, onChangeTradeState } =
    props;

  const positions = productImage.positions;
  const selPosition = positions[index];
  const tradeDescription = tradeDescriptions.find((td) => td.id == selPosition.id);
  const tradeState = tradeDescription?.state;

  const handleClickTradeState = (v: TradeState) => {
    onChangeTradeState?.(selPosition.id, v);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex-none">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
            disabled={index == 0}
            onClick={(e) => onClickPrev?.(e)}
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
            disabled={positions.length <= index + 1}
            onClick={(e) => onClickNext?.(e)}
          >
            <TbChevronRight className="text-xl text-gray-800" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-0.5">
        <TradeStateButton
          value={tradeState}
          forValue={{ tag: "none" }}
          onClick={handleClickTradeState}
        >
          <div className="flex h-10 w-10 items-center justify-center">
            <TbCircleOff className="h-8 w-8 text-gray-400" />
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
    </>
  );
};
