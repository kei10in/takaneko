import { ClassValue, clsx } from "clsx";

export const pageBox = (...args: ClassValue[]) => {
  return clsx("py-12", ...args);
};

export const pageColumnBox = (...args: ClassValue[]) => {
  return clsx("py-8", ...args);
};

export const pageHeading = (...args: ClassValue[]) => {
  return clsx("text-nadeshiko-800 text-3xl font-semibold", ...args);
};

export const sectionHeading = (...args: ClassValue[]) => {
  return clsx("text-2xl text-gray-600", ...args);
};

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
