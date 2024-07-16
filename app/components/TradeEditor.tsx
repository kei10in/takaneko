import { useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeState } from "~/features/TradeState";
import { TradeCounter } from "./TradeCounter";
import { TradeImage } from "./TradeImage.client";

interface Props {
  productImage: ProductImage;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const { productImage } = props;

  const photos = productImage.photos;
  const positions = productImage.positions;

  const [tradeStates, setTraceStates] = useState<{ id: number; state: TradeState }[]>(() =>
    photos.map((p) => ({ id: p.id, state: { tag: "none" } })),
  );

  return (
    <div>
      <ol className="p-4">
        {photos.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2 p-1">
              <p className="flex-1">
                {item.id}. {item.name} {item.description}
              </p>

              <TradeCounter
                onChange={(v) => {
                  setTraceStates((state) => {
                    const i = state.findIndex((s) => s.id == item.id);

                    const items = [...state];
                    items[i] = { ...items[i], state: v };

                    return items;
                  });
                }}
              />
            </div>
          </li>
        ))}
      </ol>

      <div>
        {positions.length != 0 ? (
          <TradeImage
            key={productImage.name}
            url={productImage.url}
            positions={productImage.positions}
            tradeDescriptions={tradeStates}
          />
        ) : null}
      </div>
    </div>
  );
};
