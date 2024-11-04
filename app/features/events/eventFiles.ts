export const importEventFiles = (): { filename: string; module: unknown }[] => {
  return Object.entries(import.meta.glob("./*/*/*.mdx", { eager: true })).map(
    ([filename, module]) => ({ filename, module }),
  );
};
