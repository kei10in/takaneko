import { Dialog, DialogPanel } from "@headlessui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
import { Fragment, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { MenuItem } from "~/components/MenuItem";
import { SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS } from "~/features/productImages";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ。- ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);

  const in2022 = TAKANEKO_PHOTOS.filter((p) => p.year == 2022).toReversed();
  const in2023 = TAKANEKO_PHOTOS.filter((p) => p.year == 2023).toReversed();
  const in2024 = TAKANEKO_PHOTOS.filter((p) => p.year == 2024).toReversed();
  const allPhotos = [
    { name: "2024 年", photos: in2024 },
    { name: "2023 年", photos: in2023 },
    { name: "2022 年", photos: in2022 },
  ];

  return (
    <div>
      <div className="sticky top-0 z-40 h-12 w-full border-b border-gray-300 bg-white bg-opacity-90">
        <div className="container mx-auto h-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <p className="text-base font-bold text-gray-600">
              <Link to="/trade">トレード画像をつくるやつ。</Link>
            </p>
            <div className="flex-none">
              <button
                className="rounded-full p-2 text-lg hover:bg-gray-200"
                onClick={() => setShowMenu(true)}
              >
                <HiBars3 />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Outlet />

      <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 backdrop-blur-sm">
          <DialogPanel className="relative w-80 overflow-y-auto border-l border-gray-200 bg-white">
            <div className="absolute right-4 top-1.5 flex-none">
              <button
                className="rounded-full p-2 text-xl hover:bg-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <HiXMark />
              </button>
            </div>
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
                              onClick={() => setShowMenu(false)}
                            />
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
