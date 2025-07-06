import { clsx } from "clsx";

export const dialogBackdropStyle = () => {
  return clsx(
    "fixed inset-0 bg-black/50 backdrop-blur-xs",
    "transition duration-300 ease-in-out",
    "data-closed:opacity-0 data-closed:backdrop-blur-none",
  );
};

export const dialogBaseStyle = () => {
  return clsx("fixed inset-0 flex w-screen items-center justify-center");
};

export const dialogPanelStyle = () => {
  return clsx(
    "transition-all duration-300 ease-in-out",
    "data-closed:scale-50 data-closed:opacity-0",
  );
};
