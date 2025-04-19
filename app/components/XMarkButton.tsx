import clsx from "clsx";
import { ComponentPropsWithRef, forwardRef } from "react";
import { BsX } from "react-icons/bs";

type Props = ComponentPropsWithRef<"button">;

export const XMarkButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <button ref={ref} className={clsx("rounded-full p-2 hover:bg-gray-200", className)} {...rest}>
      <BsX className="h-6 w-6 text-gray-800" />
    </button>
  );
});

XMarkButton.displayName = "XMarkButton";
