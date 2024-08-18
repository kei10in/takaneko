import { NavLink } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";
import { MenuItem } from "~/components/MenuItem";
import { ProductImage } from "../productImages";

interface Props {
  allPhotos: {
    name: string;
    photos: ProductImage[];
  }[];
  onClickMenuItem?: () => void;
}

export const ProductList: React.FC<Props> = (props: Props) => {
  const { allPhotos, onClickMenuItem } = props;

  return (
    <div className="">
      {allPhotos.map((item) => (
        <Fragment key={item.name}>
          <h3 className="px-4 pb-4 pt-2.5 text-xl font-bold">{item.name}</h3>
          <ul className="pb-1.5">
            {item.photos.map((photo) => (
              <li key={photo.id}>
                <NavLink to={`/trade/${photo.id}`}>
                  {({ isActive }) => (
                    <MenuItem
                      content={photo.name}
                      description={photo.kind}
                      selected={isActive}
                      disabled={photo.positions.length == 0}
                      onClick={onClickMenuItem}
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};
