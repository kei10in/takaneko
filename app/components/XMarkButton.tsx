import { ComponentPropsWithRef, forwardRef } from "react";
import { BsX } from "react-icons/bs";
import { iconButton } from "./styles/buttons";

type Props = ComponentPropsWithRef<"button">;

export const XMarkButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <button ref={ref} className={iconButton(className)} {...rest}>
      <BsX className="h-7 w-7" />
    </button>
  );
});

XMarkButton.displayName = "XMarkButton";
