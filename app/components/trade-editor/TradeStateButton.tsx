import { Switch } from "@headlessui/react";
import { clsx } from "clsx";
import equal from "fast-deep-equal";
import { TradeStatus } from "~/features/trade/TradeStatus";

type Props = Omit<React.ComponentProps<"button">, "value" | "onClick"> & {
  value: TradeStatus | undefined;
  forValue: TradeStatus;
  onClick?: (v: TradeStatus) => void;
};

export const TradeStateButton: React.FC<Props> = (props: Props) => {
  const { children, value, forValue, onClick, ref: _, ...rest } = props;

  const selected = equal(value, forValue);

  const handleClick = () => {
    onClick?.(forValue);
  };

  return (
    <Switch
      className={clsx(
        "group flex-none rounded-2xl p-1 opacity-50",
        "text-gray-600 data-[checked]:bg-gray-800 data-[checked]:bg-opacity-10 data-[checked]:opacity-100",
      )}
      checked={selected}
      {...rest}
      onChange={handleClick}
    >
      {children}
    </Switch>
  );
};
