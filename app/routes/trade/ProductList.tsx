import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { Link, NavLink, useLocation } from "react-router";
import { RandomGoods } from "../../features/products/product";
import { ProductItem } from "./ProductItem";

interface Props {
  allPhotos: {
    name: string;
    photos: RandomGoods[];
  }[];
  onClickMenuItem?: () => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "photo", label: "生写真" },
  { id: "mini-photo", label: "ミニフォト" },
  { id: "other", label: "その他" },
];

export const ProductList: React.FC<Props> = (props: Props) => {
  const { allPhotos, onClickMenuItem } = props;

  const [filter, setFilter] = useState(filters[0].id);

  const location = useLocation();
  const filteredAllPhotos = allPhotos.map((item) => {
    if (filter == "photo") {
      return { ...item, photos: item.photos.filter((photo) => photo.category == "生写真") };
    } else if (filter == "mini-photo") {
      return { ...item, photos: item.photos.filter((photo) => photo.category == "ミニフォト") };
    } else if (filter == "other") {
      return {
        ...item,
        photos: item.photos.filter(
          (photo) => photo.category != "生写真" && photo.category != "ミニフォト",
        ),
      };
    } else {
      return item;
    }
  });

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 bg-white px-4 py-4">
        <RadioGroup
          className="flex items-center gap-2 select-none"
          value={filter}
          onChange={setFilter}
        >
          {filters.map((item) => (
            <Field key={item.id}>
              <Radio
                className={clsx(
                  "rounded-sm bg-gray-100 px-2 py-px",
                  "text-center text-sm text-gray-500",
                  "data-checked:bg-nadeshiko-800 data-checked:text-white",
                )}
                as="button"
                value={item.id}
              >
                {item.label}
              </Radio>
            </Field>
          ))}
        </RadioGroup>
      </div>

      <div className="group hover:text-nadeshiko-900 flex h-12 w-full items-center justify-between gap-1 px-4 text-gray-900">
        <Link to="/trade/wishlist" onClick={onClickMenuItem}>
          <p className="py-2 text-lg font-bold">欲しいやつ</p>
        </Link>
      </div>

      {filteredAllPhotos.map((item) => {
        const open = item.photos.some(
          (photo) => `/trade/${encodeURIComponent(photo.slug)}` == location.pathname,
        );

        return (
          <Disclosure key={item.name} defaultOpen={open}>
            <DisclosureButton className="group hover:text-nadeshiko-900 flex h-12 w-full items-center justify-between gap-1 px-4 text-gray-900">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <div>
                <HiChevronRight className="transition-transform group-data-open:rotate-90" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <ul className="flex flex-wrap justify-center gap-3 px-4 pb-1.5">
                {item.photos.map((photo) => (
                  <li key={photo.slug}>
                    <NavLink to={`/trade/${photo.slug}`} onClick={onClickMenuItem}>
                      {({ isActive }) => (
                        <ProductItem
                          image={photo.url}
                          year={photo.year}
                          content={photo.series}
                          description={photo.category}
                          selected={isActive}
                        />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </DisclosurePanel>
          </Disclosure>
        );
      })}
    </div>
  );
};
