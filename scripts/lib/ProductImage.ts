import { Transformer } from "@napi-rs/image";
import { createCanvas, loadImage } from "canvas";
import fs from "node:fs";
import type { ImagePosition } from "~/features/products/product";
import { Size } from "~/utils/types/Size";

export class ProductImage {
  readonly frame: Size;
  readonly xMargin: number;
  readonly yMargin: number;
  readonly xSpace: number;

  // 描画する各々の画像のサイズ
  readonly image: Size;

  // 写真ごとに割り当てられる矩形のサイズ。生写真やミニフォトはこの矩形内に描画される。
  // 描画する画像のサイズによって、画像全体のサイズが変わらないようにするためのもの。
  readonly box: Size;

  // 全体の画像サイズ
  readonly size: Size;

  constructor(
    private files: string[],
    option: { size?: Size },
  ) {
    this.frame = { width: 33, height: 33 };
    this.xMargin = 18;
    this.yMargin = 18;
    this.xSpace = this.xMargin;

    this.image = option.size ?? { width: 154, height: 220 };

    this.box = {
      width: 154,
      height: 220,
    };

    this.size = {
      width: this.frame.width * 2 + this.box.width * 6 + this.xSpace * 4 + this.xMargin,
      height: this.frame.height * 2 + this.box.height * 5 + this.yMargin * 4,
    };
  }

  photoRects(): ImagePosition[] {
    return this.files.map((_, index) => {
      const row = Math.floor(index / 6);
      const col = index % 6;

      const width = Math.min(this.image.width, this.box.width);
      const height = Math.min(this.image.height, this.box.height);

      const boxX =
        this.frame.width +
        col * (this.box.width + this.xSpace) +
        (col >= 3 ? this.xMargin - this.xSpace : 0);
      const boxY = this.frame.height + row * (this.box.height + this.yMargin);

      // この画像生成では必ず格子点に配置しないといけない。
      const x = boxX + Math.floor((this.box.width - width) / 2);
      const y = boxY + Math.floor((this.box.height - height) / 2);

      return { id: index + 1, x, y, width, height };
    });
  }

  writePositions(output: string) {
    const positions = this.photoRects();
    fs.writeFileSync(output, JSON.stringify(positions, null, 2));
  }

  async render(): Promise<{
    buffer: Buffer;
    positions: ImagePosition[];
    size: Size;
  }> {
    const canvas = createCanvas(this.size.width, this.size.height);
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, this.size.width, this.size.height);

    const positions = this.photoRects();

    for (const [index, file] of this.files.entries()) {
      const pos = positions[index];
      const { x, y, width, height } = pos;

      const image = await loadImage(file);
      const scale = Math.min(image.naturalWidth / width, image.naturalHeight / height);

      const crop = {
        x: (image.naturalWidth - width * scale) / 2,
        y: (image.naturalHeight - height * scale) / 2,
        width: width * scale,
        height: height * scale,
      };

      context.drawImage(image, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
    }

    const png = canvas.toBuffer("image/png");
    const buffer = await new Transformer(png).webp(95);
    return { buffer, positions, size: this.size };
  }

  async draw(output: string) {
    const { buffer } = await this.render();
    fs.writeFileSync(output, buffer);
  }
}
