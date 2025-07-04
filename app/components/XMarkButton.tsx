import { clsx } from "clsx";
import { ComponentPropsWithRef, forwardRef } from "react";
import { BsX } from "react-icons/bs";

type Props = ComponentPropsWithRef<"button">;

export const XMarkButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <button ref={ref} className={clsx("group icon-btn", className)} {...rest}>
      <BsX className="h-7 w-7" />
    </button>
  );
});

XMarkButton.displayName = "XMarkButton";
