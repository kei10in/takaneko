import { create } from "zustand";
import { ProductImage } from "../productImages";
import { TradeDescription, TradeStatus } from "../TradeStatus";

interface TradeState {
  selectedProduct: ProductImage | undefined;
  allTradeDescriptions: Record<string, TradeDescription[]>;
}

interface TradeAction {
  selectProduct: (product: ProductImage | undefined) => void;
  updateTradeDescriptions: (props: { id: string; photoId: number; status: TradeStatus }) => void;
}

export const useTradeStore = create<TradeState & TradeAction>()((set) => ({
  selectedProduct: undefined,
  allTradeDescriptions: {},
  selectProduct: (product: ProductImage | undefined) =>
    set((state) => {
      if (product == undefined) {
        return { selectedProduct: undefined };
      }

      const photos = product.photos;

      if (!(product.id in state.allTradeDescriptions)) {
        const noneState: TradeStatus = { tag: "none" };
        return {
          selectedProduct: product,
          allTradeDescriptions: {
            ...state.allTradeDescriptions,
            [product.id]: photos.map((p) => ({ id: p.id, status: noneState })),
          },
        };
      } else {
        return { selectedProduct: product };
      }
    }),

  updateTradeDescriptions: (props: { id: string; photoId: number; status: TradeStatus }) =>
    set((state) => {
      const { id, photoId, status } = props;
      const tradeDescriptions = state.allTradeDescriptions[id];

      const index = tradeDescriptions.findIndex((s) => s.id == photoId);
      if (index == undefined) {
        return {};
      }

      const items = [...tradeDescriptions];
      items[index] = { ...items[index], status };

      return {
        allTradeDescriptions: {
          ...state.allTradeDescriptions,
          [id]: items,
        },
      };
    }),
}));
