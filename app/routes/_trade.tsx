import { Dialog, DialogPanel } from "@headlessui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { MenuItem } from "~/components/MenuItem";
import { TAKANEKO_PHOTOS } from "~/features/productImages";

export const meta: MetaFunction = () => {
  return [
    { title: "トレード画像つくるやつ。- 高嶺のなでしこの" },
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
      <div className="sticky top-0 z-40 h-20 w-full border-b border-gray-300 bg-white p-4">
        <div className="container mx-auto flex h-full items-center justify-between">
          <p className="text-2xl font-bold text-gray-600">
            <Link to="/">トレード画像をつくるやつ。</Link>
          </p>
          <div className="flex-none">
            <button
              className="rounded-full p-2 text-2xl hover:bg-gray-200"
              onClick={() => setShowMenu(true)}
            >
              <HiBars3 />
            </button>
          </div>
        </div>
      </div>

      <Outlet />

      <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <DialogPanel className="relative w-80 overflow-y-auto border-l border-gray-200 bg-white">
            <div className="absolute right-4 top-5 flex-none">
              <button
                className="rounded-full p-2 text-2xl hover:bg-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <HiXMark />
              </button>
            </div>
            <div className="mt-3">
              {allPhotos.map((item) => (
                <Fragment key={item.name}>
                  <h3 className="px-4 py-4 text-xl font-bold">{item.name}</h3>
                  <ul>
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

            <hr className="my-2" />

            <NavLink
              className={({ isActive }) =>
                clsx(
                  "block w-full px-4 py-2 text-xl hover:bg-gray-200",
                  isActive && "bg-gray-100 font-bold",
                )
              }
              to="/releases"
            >
              リリース ノート
            </NavLink>

            <div className="mt-8 p-4 text-sm text-gray-800">
              <p>「トレード画像をつくるやつ。」は非公式のファンコンテンツです。</p>
              <p>使用されている高嶺のなでしこの画像は INCS・TP に帰属します。©INCS・TP</p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
