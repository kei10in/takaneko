import clsx from "clsx";
import { ComponentPropsWithRef, forwardRef } from "react";
import { BsX } from "react-icons/bs";

type Props = ComponentPropsWithRef<"button">;

export const XMarkButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <button
      ref={ref}
      className={clsx(
        "group flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200",
        className,
      )}
      {...rest}
    >
      <BsX className="h-7 w-7 text-gray-700" />
    </button>
  );
});

XMarkButton.displayName = "XMarkButton";
