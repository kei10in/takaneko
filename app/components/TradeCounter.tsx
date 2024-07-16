import clsx from "clsx";
import { useState } from "react";
import {
  TbChevronLeft,
  TbChevronRight,
  TbCircleOff,
  TbSquareNumber1Filled,
  TbSquareNumber2Filled,
  TbSquareNumber3Filled,
  TbSquareNumber4Filled,
  TbSquareNumber5Filled,
  TbSquareNumber6Filled,
} from "react-icons/tb";
import { TradeState } from "~/features/TradeState";

interface Props {
  onChange: (ts: TradeState) => void;
}

export const TradeCounter: React.FC<Props> = (props: Props) => {
  const { onChange } = props;

  const [sel, setSel] = useState(1);

  const items = [
    { content: "求" },
    { content: <TbCircleOff /> },
    { content: "譲" },
    { content: <TbSquareNumber1Filled /> },
    { content: <TbSquareNumber2Filled /> },
    { content: <TbSquareNumber3Filled /> },
    { content: <TbSquareNumber4Filled /> },
    { content: <TbSquareNumber5Filled /> },
    { content: <TbSquareNumber6Filled /> },
  ];

  return (
    <div className="flex items-center gap-1">
      <button
        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200"
        disabled={sel <= 0}
        onClick={() => {
          setSel(sel - 1);
          onChange(selToTradeState(sel - 1));
        }}
      >
        <TbChevronLeft />
      </button>

      <div className="h-6 w-12 overflow-hidden">
        <div
          className="flex transition-all"
          style={{
            translate: `${24 - 12 - sel * 24}px 0`,
          }}
        >
          {items.map((item, i) => {
            return (
              <span
                key={i}
                className={clsx(
                  "flex h-6 w-6 flex-none select-none items-center justify-center",
                  sel === i ? "text-gray-700" : "text-gray-300",
                )}
              >
                {item.content}
              </span>
            );
          })}
        </div>
      </div>

      <button
        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200"
        disabled={7 < sel}
        onClick={() => {
          setSel(sel + 1);
          onChange(selToTradeState(sel + 1));
        }}
      >
        <TbChevronRight />
      </button>
    </div>
  );
};

const selToTradeState = (sel: number): TradeState => {
  if (sel <= 0) {
    return { tag: "want" };
  } else if (sel == 1) {
    return { tag: "none" };
  } else if (sel == 2) {
    return { tag: "have" };
  } else {
    return { tag: "have", count: sel - 2 };
  }
};
