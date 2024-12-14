export const importEventFiles = (): { filename: string; module: unknown }[] => {
  return Object.entries(import.meta.glob("./*/*/*.{mdx,tsx}", { eager: true })).map(
    ([filename, module]) => ({ filename, module }),
  );
};
