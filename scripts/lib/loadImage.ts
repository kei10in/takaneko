import { Image, loadImage } from "canvas";
import sharp from "sharp";

export const loadImageFromFile = async (path: string): Promise<Image> => {
  try {
    const image = await loadImage(path);
    return image;
  } catch (error) {
    const png = await sharp(path, { failOnError: true }).png();
    const meta = await png.metadata();

    console.log(meta);

    const { data, info } = await png.rotate().toBuffer({ resolveWithObject: true });

    console.log(info);

    const image = new Image();
    image.src = data;
    return image;
  }
};
