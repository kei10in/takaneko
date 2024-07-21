import clsx from "clsx";
import { MouseEventHandler } from "react";

interface Props {
  selected?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const MenuItem: React.FC<Props> = (props: Props) => {
  const { selected = false, disabled, children, onClick } = props;

  return (
    <button
      className={clsx(
        "w-full py-4 pl-8 pr-4 text-left text-xl text-gray-700",
        disabled && !selected && "disabled:text-gray-300",
        !disabled && "hover:bg-gray-200 active:bg-gray-300",
        selected && "bg-gray-100 font-bold",
      )}
      disabled={disabled || selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
