export type TradeState =
  | { tag: "none" }
  | { tag: "want" }
  | { tag: "have"; count?: number | undefined };
