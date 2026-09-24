import { useMemo } from "react";
import useSWR from "swr";
import { drawOfferList } from "~/components/TradeListImage/drawTradeItemList.ts";
import { useAutoRevokeImageSource } from "~/components/TradeListImage/useAutoRevokeImageSource.ts";
import { croppedImagePath } from "~/features/products/croppedProductImage.ts";
import { RandomGoods } from "~/features/products/product.ts";
import { TradeListImage } from "~/features/products/productImages.ts";
import { tradeStateToImageSrc } from "~/features/trade/TradeStatus.ts";
import { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails.ts";
import { ArrayUtils } from "~/utils/array/index.ts";
import { ImageSource } from "~/utils/html/types.ts";
import { TradingItemRenderProps } from "./types.ts";

const transformOfferToRenderProps = (details: TradingItemDetail): TradingItemRenderProps => {
  return {
    path: croppedImagePath(details.product.url, details.position.id),
    status: tradeStateToImageSrc(details.status),
    title: TradeListImage.title(details.product, details.item),
    subtitle: TradeListImage.subtitle(details.product),
  };
};

export const usePhotoOfferListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((detail) => transformOfferToRenderProps(detail)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`/offer-list/photos`, items], async ([_, itemChunks]) => {
    return await drawOfferList(itemChunks, "出せる 生写真");
  });

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};

export const useMiniPhotoCardOfferListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((detail) => transformOfferToRenderProps(detail)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR(
    [`/offer-list/mini-photo-cards`, items],
    async ([_, itemChunks]) => {
      return await drawOfferList(itemChunks, "出せる ミニフォトカード");
    },
  );

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};

export const useOtherGoodsOfferListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((detail) => transformOfferToRenderProps(detail)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR(
    [`/offer-list/mini-photo-cards`, items],
    async ([_, itemChunks]) => {
      return await drawOfferList(itemChunks, "出せる その他のランダムグッズ");
    },
  );

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};
