export const stem = (path: string): string => {
  const basename = path.split("/").pop() as string;
  const i = basename.lastIndexOf(".");
  if (i < 0) {
    return basename;
  }
  return basename.slice(0, i);
};
