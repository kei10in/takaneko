import { clsx } from "clsx";
import { RandomGoods } from "~/features/products/product.ts";
import { RandomGoodsCardLink } from "./RandomGoodsCard.tsx";

interface Props {
  items: RandomGoods[];
  onClickLink?: () => void;
}

export const RandomGoodsList: React.FC<Props> = (props: Props) => {
  const { items, onClickLink } = props;

  return (
    <div className="@container">
      <ul
        className={clsx(
          "grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 px-2",
          "@xl:grid-cols-3 @xl:gap-x-4",
          "@3xl:grid-cols-4",
          "@5xl:grid-cols-5 @5xl:gap-x-4",
        )}
      >
        {items.map((photo) => (
          <li key={photo.slug}>
            <RandomGoodsCardLink item={photo} onClick={onClickLink} />
          </li>
        ))}
      </ul>
    </div>
  );
};
