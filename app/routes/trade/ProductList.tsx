import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { NavLink, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { ProductImage } from "../../features/products/product";
import { ProductItem } from "./ProductItem";

interface Props {
  allPhotos: {
    name: string;
    photos: ProductImage[];
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
      return { ...item, photos: item.photos.filter((photo) => photo.kind == "生写真") };
    } else if (filter == "mini-photo") {
      return { ...item, photos: item.photos.filter((photo) => photo.kind == "ミニフォト") };
    } else if (filter == "other") {
      return {
        ...item,
        photos: item.photos.filter((photo) => photo.kind != "生写真" && photo.kind != "ミニフォト"),
      };
    } else {
      return item;
    }
  });

  return (
    <div className="">
      <div className="sticky top-0 z-10 bg-white px-4 py-4">
        <RadioGroup
          className="flex select-none items-center gap-2"
          value={filter}
          onChange={setFilter}
        >
          {filters.map((item) => (
            <Field key={item.id}>
              <Radio
                className={clsx(
                  "rounded bg-gray-100 px-2 py-px",
                  "text-center text-sm text-gray-500",
                  "data-[checked]:bg-nadeshiko-800 data-[checked]:text-white",
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

      {filteredAllPhotos.map((item) => {
        const open = item.photos.some(
          (photo) => `/trade/${encodeURIComponent(photo.id)}` == location.pathname,
        );

        return (
          <Disclosure key={item.name} defaultOpen={open}>
            <DisclosureButton className="group flex h-12 w-full items-center justify-between gap-1 px-4 text-gray-900 hover:text-nadeshiko-900">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <div>
                <HiChevronRight className="transition-transform group-data-[open]:rotate-90" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <ul className="flex flex-wrap justify-center gap-4 px-4 pb-1.5">
                {item.photos.map((photo) => (
                  <li key={photo.id}>
                    <NavLink to={`/trade/${photo.id}`} onClick={onClickMenuItem}>
                      {({ isActive }) => (
                        <ProductItem
                          image={photo.url}
                          content={photo.series}
                          description={photo.kind}
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