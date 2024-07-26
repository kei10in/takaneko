import clsx from "clsx";
import equal from "fast-deep-equal";
import { TradeStatus } from "~/features/TradeStatus";

type Props = Omit<React.ComponentProps<"button">, "value" | "onClick"> & {
  value: TradeStatus | undefined;
  forValue: TradeStatus;
  onClick?: (v: TradeStatus) => void;
};

export const TradeStateButton: React.FC<Props> = (props: Props) => {
  const { children, value, forValue, onClick, ...rest } = props;

  const selected = equal(value, forValue);

  const handleClick = () => {
    onClick?.(forValue);
  };

  return (
    <button
      className={clsx(
        "group flex-none rounded-2xl p-1 hover:bg-gray-200",
        selected && "bg-gray-200",
      )}
      onClick={handleClick}
      {...rest}
    >
      <div
        className={clsx(
          !selected && "brightness-50 hover:brightness-75",
          selected && "brightness-100",
        )}
      >
        {children}
      </div>
    </button>
  );
};
