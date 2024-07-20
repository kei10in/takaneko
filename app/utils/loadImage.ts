export const loadImage = (image: HTMLImageElement, src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    image.onload = () => {
      resolve(image);
    };
    image.src = src;
  });
};
