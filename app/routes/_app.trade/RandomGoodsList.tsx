import { clsx } from "clsx";
import { NavLink } from "react-router";
import { RandomGoods } from "~/features/products/product";
import { RandomGoodsCardTexts } from "~/features/products/productImages";
import { thumbnailSrcSet } from "~/utils/fileConventions";
import { RandomGoodsCard } from "./RandomGoodsCard";

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
        {items.map((photo) => {
          const thumbs = thumbnailSrcSet(photo.url);
          return (
            <li key={photo.slug}>
              <NavLink to={`/trade/${photo.slug}`} onClick={onClickLink} className="block">
                <RandomGoodsCard
                  image={thumbs.src}
                  imageSet={thumbs.srcset}
                  year={photo.year}
                  content={RandomGoodsCardTexts.title(photo)}
                  description={RandomGoodsCardTexts.subtitle(photo)}
                />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
