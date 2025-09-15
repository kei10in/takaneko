import { useMemo } from "react";
import useSWR from "swr";
import { drawWishList } from "~/components/TradeListImage/drawTradeItemList";
import { useAutoRevokeImageSource } from "~/components/TradeListImage/useAutoRevokeImageSource";
import { croppedImagePath } from "~/features/products/croppedProductImage";
import { RandomGoods } from "~/features/products/product";
import { TradeListImage } from "~/features/products/productImages";
import { tradeStateToImageSrc } from "~/features/trade/TradeStatus";
import { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";
import { ArrayUtils } from "~/utils/array";
import { ImageSource } from "~/utils/html/types";
import { TradingItemRenderProps } from "./types";

const transformWishToRenderProps = (details: TradingItemDetail): TradingItemRenderProps => {
  return {
    path: croppedImagePath(details.product.url, details.position.id),
    status: tradeStateToImageSrc(details.status),
    title: TradeListImage.title(details.product, details.item),
    subtitle: TradeListImage.subtitle(details.product),
  };
};

export const usePhotoWishListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((x) => transformWishToRenderProps(x)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`/wishlist/photos`, items], async ([_, items]) => {
    return await drawWishList(items, "ほしい 生写真");
  });

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};

export const useMiniPhotoCardWishListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((x) => transformWishToRenderProps(x)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`/wishlist/mini-photo-cards`, items], async ([_, items]) => {
    return await drawWishList(items, "ほしい ミニフォトカード");
  });

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};

export const useOtherGoodsWishListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(() => {
    const xs = wishList.flatMap((x) =>
      x.tradingItemDetails.map((x) => transformWishToRenderProps(x)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`/wishlist/other-goods`, items], async ([_, items]) => {
    return await drawWishList(items, "ほしい その他のランダムグッズ");
  });

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};
