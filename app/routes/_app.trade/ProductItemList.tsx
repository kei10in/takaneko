import { Link } from "react-router";
import { RandomGoods } from "~/features/products/product";
import { thumbnailSrcSet } from "~/utils/fileConventions";
import { ProductItem } from "./ProductItem";

interface Props {
  items: RandomGoods[];
}

export const ProductItemList: React.FC<Props> = (props: Props) => {
  const { items } = props;

  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-x-2 gap-y-8 px-2 @md:grid-cols-3 @md:gap-x-4 @xl:grid-cols-4 @4xl:grid-cols-5 @4xl:gap-x-6">
        {items.map((photo) => {
          const thumbs = thumbnailSrcSet(photo.url);
          return (
            <li key={photo.slug}>
              <Link to={`/trade/${photo.slug}`}>
                <ProductItem
                  image={thumbs.src}
                  imageSet={thumbs.srcset}
                  year={photo.year}
                  content={photo.name}
                  description={photo.category}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
