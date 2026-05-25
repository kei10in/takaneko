import { ClassValue, clsx } from "clsx";

export const iconButtonPrimary = (...args: ClassValue[]): string => {
  return clsx(
    "group flex size-10 items-center justify-center rounded-full focus:outline-none",
    "text-nadeshiko-800 hover:bg-nadeshiko-500/10 active:bg-nadeshiko-500/20",
    ...args,
  );
};

export const iconButton = (...args: ClassValue[]): string => {
  return clsx(
    "group flex size-10 items-center justify-center rounded-full focus:outline-none",
    "hover:bg-zinc-100 active:bg-zinc-200",
    ...args,
  );
};
