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
import { BsCardChecklist, BsGift } from "react-icons/bs";
import { HiChevronRight } from "react-icons/hi2";
import { Link, useLocation } from "react-router";
import {
  isOtherTakanekoRandomGoods,
  isRegularTakanekoMiniPhotoCard,
  isRegularTakanekoPhoto,
} from "~/features/products/productImages";
import { RandomGoods } from "../../features/products/product";
import { ProductItemList } from "./ProductItemList";

interface Props {
  allPhotos: {
    name: string;
    photos: RandomGoods[];
  }[];
  onClickMenuItem?: () => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "photo", label: "生写真セット" },
  { id: "mini-photo", label: "ミニフォトセット" },
  { id: "other", label: "その他" },
];

export const MenuContents: React.FC<Props> = (props: Props) => {
  const { allPhotos, onClickMenuItem } = props;

  const [filter, setFilter] = useState(filters[0].id);

  const location = useLocation();
  const filteredAllPhotos = allPhotos.map((item) => {
    if (filter == "photo") {
      return { ...item, photos: item.photos.filter(isRegularTakanekoPhoto) };
    } else if (filter == "mini-photo") {
      return { ...item, photos: item.photos.filter(isRegularTakanekoMiniPhotoCard) };
    } else if (filter == "other") {
      return { ...item, photos: item.photos.filter(isOtherTakanekoRandomGoods) };
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

      <ul>
        <li className="group hover:text-nadeshiko-900 flex h-12 w-full items-center justify-between gap-1 px-4 text-gray-900">
          <Link to="/trade/wishlist" onClick={onClickMenuItem}>
            <p className="flex items-center gap-2 py-2 text-lg font-bold">
              <BsCardChecklist className="text-nadeshiko-900 inline-block" />
              <span>欲しいやつ</span>
            </p>
          </Link>
        </li>

        <li className="group hover:text-nadeshiko-900 flex h-12 w-full items-center justify-between gap-1 px-4 text-gray-900">
          <Link to="/trade/tradelist" onClick={onClickMenuItem}>
            <p className="flex items-center gap-2 py-2 text-lg font-bold">
              <BsGift className="text-nadeshiko-900 inline-block" />
              <span>譲れるやつ</span>
            </p>
          </Link>
        </li>
      </ul>

      {filteredAllPhotos.map((item) => {
        if (item.photos.length == 0) {
          return null;
        }

        const open = item.photos.some(
          (photo) =>
            "/trade" == location.pathname ||
            `/trade/${encodeURIComponent(photo.slug)}` == location.pathname,
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
              <ProductItemList items={item.photos} onClickLink={onClickMenuItem} />
            </DisclosurePanel>
          </Disclosure>
        );
      })}
    </div>
  );
};
