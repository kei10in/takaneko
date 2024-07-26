export type TradeStatus =
  | { tag: "none" }
  | { tag: "want" }
  | { tag: "have"; count?: number | undefined };

export type TradeDescription = { id: number; status: TradeStatus };

export const tradeStateToImageSrc = (trade: TradeStatus): string | undefined => {
  if (trade.tag == "want") {
    return "/求.svg";
  } else if (trade.tag == "have") {
    if (trade.count == undefined) {
      return "/譲.svg";
    } else if (trade.count < 1) {
      return "/譲.svg";
    } else if (trade.count == 1) {
      return "/1.svg";
    } else if (trade.count == 2) {
      return "/2.svg";
    } else if (trade.count == 3) {
      return "/3.svg";
    } else if (trade.count == 4) {
      return "/4.svg";
    } else if (trade.count == 5) {
      return "/5.svg";
    } else if (trade.count >= 6) {
      return "/6.svg";
    }
  }

  return undefined;
};
