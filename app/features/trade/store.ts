import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TradeDescription, TradeStatus } from "../TradeStatus";

interface TradeState {
  allTradeDescriptions: Record<string, Record<number, TradeDescription>>;
}

interface TradeAction {
  updateTradeDescriptions: (props: { id: string; photoId: number; status: TradeStatus }) => void;
}

export const useTradeStore = create<TradeState & TradeAction>()(
  persist(
    (set) => ({
      allTradeDescriptions: {},

      updateTradeDescriptions: (props: { id: string; photoId: number; status: TradeStatus }) =>
        set((state) => {
          const { id, photoId, status } = props;
          const tradeDescriptions = state.allTradeDescriptions[id] ?? {};
          const tradeDescription = tradeDescriptions[photoId] ?? {
            id: photoId,
            status: { tag: "none" },
          };

          const items = {
            ...tradeDescriptions,
            [photoId]: { ...tradeDescription, status },
          };

          return {
            allTradeDescriptions: {
              ...state.allTradeDescriptions,
              [id]: items,
            },
          };
        }),
    }),
    {
      name: "trade-image-editor",
    },
  ),
);
