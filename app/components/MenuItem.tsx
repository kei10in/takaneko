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
        "group w-full py-2 pl-8 pr-4 text-left text-gray-700",
        disabled && !selected && "disabled:text-gray-300",
        !disabled && "hover:bg-gray-200",
        selected && "bg-gray-100 font-bold",
      )}
      disabled={disabled || selected}
      onClick={onClick}
    >
      <p className="text-xl">{content}</p>
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
