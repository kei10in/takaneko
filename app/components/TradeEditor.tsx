import { useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeCounter } from "./TradeCounter";
import { TradeImage } from "./TradeImage.client";

interface Props {
  productImage: ProductImage;
}

export const TradeEditor: React.FC<Props> = (props: Props) => {
  const { productImage } = props;

  const photos = productImage.photos;
  const positions = productImage.positions;

  const [, setCounts] = useState<number[]>(() => {
    return Array(photos.length).fill(0);
  });

  return (
    <div>
      <ol className="p-4">
        {photos.map((item, i) => (
          <li key={item.id}>
            <div className="flex items-center gap-2 p-1">
              <p className="flex-1">
                {item.id}. {item.name} {item.description}
              </p>

              <TradeCounter
                onChange={(v) => {
                  setCounts((state) => {
                    const items = [...state];
                    items[i] = v;
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
            tradeDescriptions={[
              { id: 1, state: { tag: "want" } },
              { id: 2, state: { tag: "have" } },
              { id: 3, state: { tag: "have", count: 1 } },
            ]}
          />
        ) : null}
      </div>
    </div>
  );
};
