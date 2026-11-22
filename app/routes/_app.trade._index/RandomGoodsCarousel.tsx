import { RandomGoods } from "~/features/products/product.ts";
import { RandomGoodsCardLink } from "../_app.trade/RandomGoodsCard.tsx";

interface Props {
  items: readonly RandomGoods[];
}

export function RandomGoodsCarousel({ items }: Props) {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <ul className="flex w-max gap-4 px-4 pt-1 pb-4">
        {items.map((item) => (
          <li key={item.slug} className="w-40 flex-none sm:w-48">
            <RandomGoodsCardLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
