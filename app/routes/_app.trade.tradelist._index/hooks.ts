import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { croppedImagePath } from "~/features/products/croppedProductImage";
import { RandomGoods } from "~/features/products/product";
import { drawTradeList } from "~/features/trade/drawTradeItemList";
import { tradeStateToImageSrc } from "~/features/trade/TradeStatus";
import { TradingItemDetail } from "~/features/tradeSummaries/tradingItemDetails";
import { ImageSource } from "~/utils/html/types";

export const usePhotoOfferListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(
    () =>
      wishList.flatMap((x) =>
        x.tradingItemDetails.map((x) => ({
          path: croppedImagePath(x.product.url, x.position.id),
          status: tradeStateToImageSrc(x.status) ?? "/譲.svg",
          name: x.item.name,
          id: x.item.id,
          series: x.product.series,
        })),
      ),
    [wishList],
  );

  const chunks = Math.floor((items.length + 29) / 30);

  const { data, isLoading } = useSWR([`photo-offer-list`, items], async ([_, items]) => {
    const chunkedItems = [];
    for (let i = 0; i < items.length; i += 30) {
      chunkedItems.push(items.slice(i, i + 30));
    }

    return await Promise.all(
      chunkedItems.map(async (chunk) => {
        const blob = await drawTradeList(chunk, "出せる生写真");
        return {
          blob,
          objectURL: URL.createObjectURL(blob),
        };
      }),
    );
  });

  const [current, setCurrent] = useState<{ blob: Blob; objectURL: string }[]>([]);

  useEffect(() => {
    if (current == data) {
      return;
    }

    current.forEach((v) => URL.revokeObjectURL(v.objectURL));
    setCurrent(data ?? []);
    return () => current.forEach((v) => URL.revokeObjectURL(v.objectURL));
  }, [current, data]);

  if (isLoading || data == undefined) {
    return Array.from({ length: chunks }, () => undefined);
  }

  return data;
};

export const useMiniPhotoCardOfferListImages = (
  wishList: {
    productImage: RandomGoods;
    tradingItemDetails: TradingItemDetail[];
  }[],
): (ImageSource | undefined)[] => {
  const items = useMemo(
    () =>
      wishList.flatMap((x) =>
        x.tradingItemDetails.map((x) => ({
          path: croppedImagePath(x.product.url, x.position.id),
          status: tradeStateToImageSrc(x.status) ?? "/譲.svg",
          name: x.item.name,
          id: x.item.id,
          series: x.product.series,
        })),
      ),
    [wishList],
  );

  const chunks = Math.floor((items.length + 29) / 30);

  const { data, isLoading } = useSWR([`mini-photo-offer-list`, items], async ([_, items]) => {
    const chunkedItems = [];
    for (let i = 0; i < items.length; i += 30) {
      chunkedItems.push(items.slice(i, i + 30));
    }

    return await Promise.all(
      chunkedItems.map(async (chunk) => {
        const blob = await drawTradeList(chunk, "出せるミニフォトカード");
        return {
          blob,
          objectURL: URL.createObjectURL(blob),
        };
      }),
    );
  });

  const [current, setCurrent] = useState<{ blob: Blob; objectURL: string }[]>([]);

  useEffect(() => {
    if (current == data) {
      return;
    }

    current.forEach((v) => URL.revokeObjectURL(v.objectURL));
    setCurrent(data ?? []);
    return () => current.forEach((v) => URL.revokeObjectURL(v.objectURL));
  }, [current, data]);

  if (isLoading || data == undefined) {
    return Array.from({ length: chunks }, () => undefined);
  }

  return data;
};
