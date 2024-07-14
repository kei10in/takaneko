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

interface Props {
  onChange: (i: number) => void;
}

export const TradeCounter: React.FC<Props> = (props: Props) => {
  const { onChange } = props;

  const [sel, setSel] = useState(1);

  const items = [
    { content: "求" },
    { content: <TbCircleOff /> },
    { content: "出" },
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
        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full"
        disabled={sel <= 0}
        onClick={() => {
          setSel(sel - 1);
          onChange(sel - 1);
        }}
      >
        <TbChevronLeft />
      </button>

      <div className="overflow-hidden w-12 h-6">
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
                  "w-6 h-6 flex-none flex items-center justify-center select-none",
                  sel === i ? "text-gray-700" : "text-gray-300"
                )}
              >
                {item.content}
              </span>
            );
          })}
        </div>
      </div>

      <button
        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full"
        disabled={7 < sel}
        onClick={() => {
          setSel(sel + 1);
          onChange(sel - 1);
        }}
      >
        <TbChevronRight />
      </button>
    </div>
  );
};
