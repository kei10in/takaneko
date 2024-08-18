import clsx from "clsx";
import { MouseEventHandler } from "react";

interface Props {
  content: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const MenuItem: React.FC<Props> = (props: Props) => {
  const { content, description, selected = false, disabled, onClick } = props;

  return (
    <button
      className={clsx(
        "group w-full py-1.5 pl-9 pr-4 text-left text-gray-700",
        disabled && !selected && "disabled:text-gray-300",
        !disabled && "hover:bg-gray-100",
        selected && "bg-gray-100 font-bold",
      )}
      disabled={disabled || selected}
      onClick={onClick}
    >
      <p className="text-base leading-tight">{content}</p>
      {description == undefined ? null : (
        <p
          className={clsx(
            "text-xs font-bold text-gray-400",
            disabled && !selected && "font-normal text-gray-300",
          )}
        >
          {description}
        </p>
      )}
    </button>
  );
};
