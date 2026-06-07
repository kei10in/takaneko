export type TradeStatus =
  | { tag: "none" }
  | { tag: "want" }
  | { tag: "have"; count?: number | undefined }
  | { tag: "emoji"; emoji: string };

export type TradeDescription = { id: number; status: TradeStatus };

export const TradeStatusImages = [
  { match: (ts: TradeStatus) => ts.tag == "want", src: "/求.svg", alt: "求" },
  {
    match: (ts: TradeStatus) => ts.tag == "have" && (ts.count == undefined || ts.count < 1),
    src: "/譲.svg",
    alt: "譲",
  },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 1, src: "/1.svg", alt: "1" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 2, src: "/2.svg", alt: "2" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 3, src: "/3.svg", alt: "3" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 4, src: "/4.svg", alt: "4" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 5, src: "/5.svg", alt: "5" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 6, src: "/6.svg", alt: "6" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 7, src: "/7.svg", alt: "7" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 8, src: "/8.svg", alt: "8" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 9, src: "/9.svg", alt: "9" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 10, src: "/10.svg", alt: "10" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 11, src: "/11.svg", alt: "11" },
  { match: (ts: TradeStatus) => ts.tag == "have" && ts.count == 12, src: "/12.svg", alt: "12" },
];

export const tradeStateToImageSrc = (trade: TradeStatus): string | undefined => {
  const img = TradeStatusImages.find((item) => item.match(trade));
  return img?.src;
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
      count = count > 12 ? 12 : count;
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
