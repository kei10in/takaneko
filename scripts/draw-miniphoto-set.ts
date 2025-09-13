import { globSync } from "glob";
import "konva/canvas-backend";
import { ProductImage } from "./lib/ProductImage.js";

const main = async () => {
  const files = globSync("public/takaneko/goods/2025/work/*.png").toSorted();

  const outputImage = "public/takaneko/goods/2025/generated.webp";
  const outputJson = "public/takaneko/goods/2025/positions.json";

  const productImage = new ProductImage(files, { size: { width: 138, height: 220 } });

  productImage.writePositions(outputJson);
  await productImage.draw(outputImage);
};

main();
