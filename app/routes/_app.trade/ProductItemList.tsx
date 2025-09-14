import { NavLink } from "react-router";
import { RandomGoods } from "~/features/products/product";
import { thumbnailSrcSet } from "~/utils/fileConventions";
import { ProductItem } from "./ProductItem";

interface Props {
  items: RandomGoods[];
  onClickLink?: () => void;
}

export const ProductItemList: React.FC<Props> = (props: Props) => {
  const { items, onClickLink } = props;

  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-x-2 gap-y-8 px-2 @md:grid-cols-3 @md:gap-x-4 @xl:grid-cols-4 @4xl:grid-cols-5 @4xl:gap-x-6">
        {items.map((photo) => {
          const thumbs = thumbnailSrcSet(photo.url);
          return (
            <li key={photo.slug}>
              <NavLink to={`/trade/${photo.slug}`} onClick={onClickLink}>
                <ProductItem
                  image={thumbs.src}
                  imageSet={thumbs.srcset}
                  year={photo.year}
                  content={photo.abbrev ?? photo.name}
                  description={photo.category}
                />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
