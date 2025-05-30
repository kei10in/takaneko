export type TradeStatus =
  | { tag: "none" }
  | { tag: "want" }
  | { tag: "have"; count?: number | undefined }
  | { tag: "emoji"; emoji: string };

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

export const totalWant = (tradeDescriptions: Record<number, TradeDescription>): number => {
  return Object.values(tradeDescriptions).filter((td) => td.status.tag === "want").length;
};

export const totalHaveCount = (tradeDescriptions: Record<number, TradeDescription>): number => {
  return Object.values(tradeDescriptions)
    .map((td) => (td.status.tag === "have" ? (td.status.count ?? 0) : 0))
    .reduce((a, b) => a + b, 0);
};

export const Stamp = {
  clear: (_status: TradeStatus | undefined): TradeStatus => ({ tag: "none" }),

  wanted: (status: TradeStatus | undefined): TradeStatus => {
    if (status?.tag == "want") {
      return { tag: "none" };
    } else {
      return { tag: "want" };
    }
  },

  increment: (status: TradeStatus | undefined): TradeStatus => {
    if (status?.tag == "have") {
      let count = (status.count ?? 0) + 1;
      count = count > 6 ? 6 : count;
      return { tag: "have", count };
    } else {
      return { tag: "have", count: 1 };
    }
  },

  decrement: (status: TradeStatus | undefined): TradeStatus => {
    if (status?.tag == "have") {
      const count = (status.count ?? 0) - 1;
      if (count <= 0) {
        return { tag: "none" };
      } else {
        return { tag: "have", count };
      }
    } else {
      return status ?? { tag: "none" };
    }
  },

  emoji: (status: TradeStatus | undefined, emoji: string): TradeStatus => {
    if (status?.tag == "emoji" && status?.emoji == emoji) {
      return { tag: "none" };
    } else {
      return { tag: "emoji", emoji };
    }
  },
} as const;
