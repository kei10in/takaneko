import { useMemo } from "react";
import useSWR from "swr";
import { drawOfferList } from "~/components/TradeListImage/drawTradeItemList";
import { useAutoRevokeImageSource } from "~/components/TradeListImage/useAutoRevokeImageSource";
import { croppedImagePath } from "~/features/products/croppedProductImage";
import { RandomGoods } from "~/features/products/product";
import { tradeStateToImageSrc } from "~/features/trade/TradeStatus";
import { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";
import { ArrayUtils } from "~/utils/array";
import { ImageSource } from "~/utils/html/types";
import { TradeItemRenderProps } from "./types";

const transformOfferToRenderProps = (details: TradingItemDetail): TradeItemRenderProps => {
  return {
    path: croppedImagePath(details.product.url, details.position.id),
    status: tradeStateToImageSrc(details.status),
    name: details.item.name,
    id: details.item.id,
    series: details.product.series,
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
      x.tradingItemDetails.map((x) => transformOfferToRenderProps(x)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`photo-offer-list`, items], async ([_, items]) => {
    return await drawOfferList(items, "出せる生写真");
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
      x.tradingItemDetails.map((x) => transformOfferToRenderProps(x)),
    );
    return ArrayUtils.chunks(xs, 30);
  }, [wishList]);

  const { data, isLoading } = useSWR([`mini-photo-offer-list`, items], async ([_, items]) => {
    return await drawOfferList(items, "出せるミニフォトカード");
  });

  useAutoRevokeImageSource(data);

  if (isLoading || data == undefined) {
    return Array.from({ length: items.length }, () => undefined);
  }

  return data;
};
