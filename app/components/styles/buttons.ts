import { ClassValue, clsx } from "clsx";

export const iconButtonPrimary = (...args: ClassValue[]): string => {
  return clsx(
    "group flex h-10 w-10 items-center justify-center rounded-full",
    "text-nadeshiko-800 hover:bg-nadeshiko-500/10 active:bg-nadeshiko-500/20",
    ...args,
  );
};

export const iconButton = (...args: ClassValue[]): string => {
  return clsx(
    "group flex h-10 w-10 items-center justify-center rounded-full",
    "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    ...args,
  );
};
