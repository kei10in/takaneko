import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TradeDescription, TradeStatus } from "~/features/trade/TradeStatus";
import { SelectableEmojis, StampType } from "~/features/trade/stamp";

interface TradeState {
  allTradeDescriptions: Record<string, Record<number, TradeDescription>>;
}

interface TradeAction {
  clearTradeDescriptions: (id: string) => void;
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

      clearTradeDescriptions: (id: string) =>
        set((state) => {
          return {
            allTradeDescriptions: {
              ...state.allTradeDescriptions,
              [id]: {},
            },
          };
        }),
    }),
    {
      name: "trade-image-editor",
    },
  ),
);

interface TradeEditorPanelState {
  selectedStamp: StampType;
  selectedEmoji: string;
}

interface TradeEditorPanelAction {
  setSelectedStamp: (stamp: StampType) => void;
  setSelectedEmoji: (emoji: string) => void;
}

/**
 * TradeEditorPanelStore は、トレードエディターパネルの状態を管理するために使用されます。
 * パネルで何が選択されているかを管理しています。
 * 状態はセッションストレージに保存されます。
 */
export const useTradeEditorPanelStore = create<TradeEditorPanelState & TradeEditorPanelAction>()(
  persist(
    (set) => ({
      // default values
      selectedStamp: "cog",
      selectedEmoji: SelectableEmojis[0],

      // actions
      setSelectedStamp: (stamp: StampType) => set({ selectedStamp: stamp }),
      setSelectedEmoji: (emoji: string) => set({ selectedEmoji: emoji }),
    }),
    {
      name: "trade-image-editor-panel",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
