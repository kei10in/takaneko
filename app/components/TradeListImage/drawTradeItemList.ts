import Konva from "konva";
import { ImageSource } from "~/utils/html/types";
import { loadImage } from "~/utils/loadImage";
import { Size } from "~/utils/types/Size";
import { TradingItem, TradingItemRenderProps } from "./types";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * TradingItemRect クラスは Trading Item の矩形を計算します。
 */
class TradingItemRect {
  readonly image: { width: number; height: number };
  readonly icon: { width: number; height: number };
  readonly title: { x: number; y: number; fontSize: number; lineHeight: number };
  readonly description: { x: number; y: number; fontSize: number; lineHeight: number };
  readonly textPadding: { x: number; y: number };

  constructor(width: number) {
    this.image = {
      width: width,
      height: width / 0.7,
    };
    this.icon = {
      width: this.image.width * 0.25,
      height: this.image.width * 0.25,
    };

    this.textPadding = { x: 0, y: width * 0.02 };

    this.title = {
      x: this.textPadding.x,
      y: this.image.height + this.textPadding.y,
      fontSize: this.image.height / 12,
      lineHeight: 1.2,
    };
    this.description = {
      x: this.textPadding.x,
      y: this.title.y + this.title.fontSize * this.title.lineHeight,
      fontSize: this.title.fontSize * 0.75,
      lineHeight: 1.2,
    };
  }

  public get width() {
    return this.image.width;
  }

  public get height() {
    return (
      this.image.height +
      this.textPadding.y +
      this.title.fontSize * this.title.lineHeight +
      this.description.fontSize * this.description.lineHeight +
      this.textPadding.y
    );
  }

  fitToItemRect(width: number, height: number): { image: Rect; icon: Rect } {
    const xRatio = this.image.width / width;
    const yRatio = this.image.height / height;

    if (xRatio < yRatio) {
      const fitWidth = this.image.width;
      const fitHeight = height * xRatio;
      const x = 0;
      const y = (this.image.height - fitHeight) / 2;
      return {
        image: {
          x,
          y,
          width: fitWidth,
          height: fitHeight,
        },
        icon: {
          x: x + fitWidth - this.icon.width * 1.1,
          y: y + fitHeight - this.icon.height * 1.1,
          width: this.icon.width,
          height: this.icon.height,
        },
      };
    } else {
      const fitWidth = width * yRatio;
      const fitHeight = this.image.height;
      const x = (this.image.width - fitWidth) / 2;
      const y = 0;
      return {
        image: {
          x,
          y,
          width: fitWidth,
          height: fitHeight,
        },
        icon: {
          x: x + fitWidth - this.icon.width * 1.1,
          y: y + fitHeight - this.icon.height * 1.1,
          width: this.icon.width,
          height: this.icon.height,
        },
      };
    }
  }
}

interface ItemRenderPositions {
  photo: Rect;
  icon: Rect;
  title: Rect;
  subtitle: Rect;
}

/**
 * TradingItemListImage クラスは Trading Item のリストを描画して、
 * トレードしたいものをまとめた画像を作成します。
 */
class TradingItemListImage {
  readonly fullImage: Size;
  readonly frame: Size;
  readonly banner: Size;
  readonly emblem: Rect;
  readonly xMargin: number;
  readonly yMargin: number;
  readonly xSpace: number;
  readonly ySpace: number;
  readonly itemRect: TradingItemRect;

  constructor(
    private items: TradingItem[],
    private options: {
      bannerTitle: string;
      bannerColor: string;
      emblemColor: string;
      backgroundColor: string;
    },
  ) {
    // this.image = { width: 960, height: 1280 };
    this.fullImage = { width: 1536, height: 2048 };
    this.banner = { width: this.fullImage.width, height: this.fullImage.width / 14 };
    const emblemSize = this.banner.height * 1.2;
    this.emblem = {
      x: emblemSize * 0.8,
      y: this.banner.height * 0.05,
      width: emblemSize,
      height: emblemSize,
    };

    this.xMargin = this.fullImage.width * 0.03;

    const photoWidth = ((this.fullImage.width - this.xMargin * 2) / 6) * 0.88;
    this.itemRect = new TradingItemRect(photoWidth);

    this.xSpace = (this.fullImage.width - this.xMargin * 2 - photoWidth * 6) / (6 - 1);
    this.ySpace = this.xSpace * 0.4;

    this.yMargin =
      (this.fullImage.height - (this.banner.height + this.itemRect.height * 5 + this.ySpace * 4)) /
      2;

    const rows = Math.floor((items.length - 1) / 6) + 1;
    const height =
      this.banner.height +
      this.yMargin +
      rows * this.itemRect.height +
      (rows - 1) * this.ySpace +
      this.yMargin;

    this.frame = { width: this.fullImage.width, height };
  }

  tradingItemRects(): ItemRenderPositions[] {
    return this.items.map((item, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      const x = this.xMargin + this.itemRect.width * col + this.xSpace * col;
      const y = this.banner.height + this.yMargin + this.itemRect.height * row + this.ySpace * row;

      const r = this.itemRect.fitToItemRect(item.image.naturalWidth, item.image.naturalHeight);

      const photo = {
        x: x + r.image.x,
        y: y + r.image.y,
        width: r.image.width,
        height: r.image.height,
      };

      const icon = {
        x: x + r.icon.x,
        y: y + r.icon.y,
        width: r.icon.width,
        height: r.icon.height,
      };

      const title = {
        x: x + this.itemRect.title.x,
        y: y + this.itemRect.title.y,
        width: this.itemRect.width,
        height: this.itemRect.title.fontSize * this.itemRect.title.lineHeight,
      };

      const subtitle = {
        x: x + this.itemRect.description.x,
        y: y + this.itemRect.description.y,
        width: this.itemRect.width,
        height: this.itemRect.description.fontSize * this.itemRect.description.lineHeight,
      };

      return { photo, icon, title, subtitle };
    });
  }

  async draw() {
    const stage = new Konva.Stage({
      container: document.createElement("div"),
      width: this.frame.width,
      height: this.frame.height,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    layer.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: this.frame.width,
        height: this.frame.height,
        fill: this.options.backgroundColor,
      }),
    );

    const banner = new Konva.Group({
      x: 0,
      y: 0,
      width: this.banner.width,
      height: this.banner.height,
      clip: {
        x: 0,
        y: 0,
        width: this.banner.width,
        height: this.banner.height,
      },
    });
    layer.add(banner);

    banner.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: this.banner.width,
        height: this.banner.height,
        fill: this.options.bannerColor,
      }),
    );

    const emblem = new Konva.Group({
      x: this.emblem.x,
      y: this.emblem.y,
    });
    emblem.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: this.emblem.width,
        height: this.emblem.height,
        fill: this.options.emblemColor,
      }),
    );

    const emblemElem = new Image();
    await loadImage(emblemElem, "/takaneko/emblem.png");
    const mask = new Konva.Image({
      image: emblemElem,
      x: 0,
      y: 0,
      width: this.emblem.width,
      height: this.emblem.height,
      globalCompositeOperation: "destination-in",
    });
    emblem.add(mask);
    emblem.cache();

    banner.add(emblem);
    banner.add(
      new Konva.Text({
        text: this.options.bannerTitle,
        fontSize: this.banner.height * 0.6,
        fontStyle: "italic",
        fontFamily: "serif",
        fill: "white",
        align: "center",
        verticalAlign: "middle",
        width: this.banner.width,
        height: this.banner.height,
      }),
    );

    const positions = this.tradingItemRects();

    this.items.map((item, i) => {
      const pos = positions[i];

      // Shadow 1
      layer.add(
        new Konva.Rect({
          x: pos.photo.x,
          y: pos.photo.y,
          width: pos.photo.width,
          height: pos.photo.height,
          fill: "white",
          shadowColor: "black",
          shadowBlur: 6,
          shadowOffset: { x: 0, y: 4 },
          shadowOpacity: 0.1,
        }),
      );

      // Shadow 2 + Image
      layer.add(
        new Konva.Image({
          image: item.image,
          x: pos.photo.x,
          y: pos.photo.y,
          width: pos.photo.width,
          height: pos.photo.height,
          shadowColor: "black",
          shadowBlur: 4,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.1,
        }),
      );

      if (item.status != undefined) {
        layer.add(
          new Konva.Image({
            image: item.status,
            x: pos.icon.x,
            y: pos.icon.y,
            width: pos.icon.width,
            height: pos.icon.height,
          }),
        );
      }

      layer.add(
        new Konva.Text({
          text: item.title,
          fontSize: this.itemRect.title.fontSize,
          lineHeight: this.itemRect.title.lineHeight,
          fontFamily: "sans-serif",
          fill: "oklch(14.7% 0.004 49.25)",
          align: "center",
          wrap: "none",
          ellipsis: true,
          x: pos.title.x,
          y: pos.title.y,
          width: pos.title.width,
        }),
      );

      layer.add(
        new Konva.Text({
          text: item.subtitle,
          fontSize: this.itemRect.description.fontSize,
          lineHeight: this.itemRect.description.lineHeight,
          fontFamily: "sans-serif",
          fill: "#ed4f81",
          align: "center",
          wrap: "none",
          ellipsis: true,
          x: pos.subtitle.x,
          y: pos.subtitle.y,
          width: pos.subtitle.width,
        }),
      );
    });

    // toBlob の実装上は Promise<Blob> が返ってくるはずなのに、
    // 型が unknown になっているのでキャストしています。
    return (await layer.toBlob({ mimeType: "image/webp", quality: 0.95 })) as Blob;
  }
}

const drawTradeItemList = async (
  items: TradingItemRenderProps[],
  options: {
    bannerTitle: string;
    bannerColor: string;
    emblemColor: string;
    backgroundColor: string;
  },
): Promise<Blob> => {
  const loadedItems = await Promise.all(items.map(loadTradingImageItem));
  const renderer = new TradingItemListImage(loadedItems, options);
  return renderer.draw();
};

export const drawWithList = async (
  items: TradingItemRenderProps[][],
  bannerTitle: string,
): Promise<ImageSource[]> => {
  return await Promise.all(
    items.map(async (chunk) => {
      const blob = await drawTradeItemList(chunk, {
        bannerTitle,
        bannerColor: "#fa9dbb",
        emblemColor: "#ed4f81",
        backgroundColor: "#fffcfd",
      });

      return {
        blob,
        objectURL: URL.createObjectURL(blob),
      };
    }),
  );
};

export const drawOfferList = async (
  items: TradingItemRenderProps[][],
  bannerTitle: string,
): Promise<ImageSource[]> => {
  return await Promise.all(
    items.map(async (chunk) => {
      const blob = await drawTradeItemList(chunk, {
        bannerTitle,
        bannerColor: "oklch(21% 0.006 285.885)",
        emblemColor: "#fa9dbb",
        backgroundColor: "oklch(96.7% 0.001 286.375)",
      });

      return {
        blob,
        objectURL: URL.createObjectURL(blob),
      };
    }),
  );
};

const loadTradingImageItem = async (item: TradingItemRenderProps): Promise<TradingItem> => {
  const img = new Image();
  await loadImage(img, item.path);

  if (item.status == undefined) {
    return {
      image: img,
      status: undefined,
      title: item.title,
      subtitle: item.subtitle,
    };
  }

  const icon = new Image();
  await loadImage(icon, item.status);

  return {
    image: img,
    status: icon,
    title: item.title,
    subtitle: item.subtitle,
  };
};
