import {
  CloseButton,
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Fragment, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router";
import { SITE_TITLE } from "~/constants";
import { iconButtonPrimary } from "./styles/buttons";
import { XMarkButton } from "./XMarkButton";

const LINKS = [
  {
    name: "トレード画像をつくるやつ",
    url: "/trade",
  },
  {
    name: "スケジュール",
    url: "/calendar",
  },
  {
    name: "楽曲",
    url: "/songs",
  },
  {
    name: "メディア",
    url: "/media",
  },
  {
    name: "グッズ",
    url: "/products",
  },
  {
    name: "メンバー",
    url: "/members",
  },
  {
    name: "統計",
    url: "/stats",
  },
];

const UTILS = [
  {
    name: "カレンダーをアプリに登録",
    url: "/calendar/registration",
  },
  {
    name: "短い URL を作るやつ",
    url: "/shortlink",
  },
  {
    name: "データ セット",
    url: "/dataset",
  },
  {
    name: "RSS フィード",
    url: "/takaneko-feeds",
  },
  {
    name: "ユーザー スクリプト",
    url: "/user-scripts",
  },
];

const SPECIALS = [
  {
    name: "ねこ撮写ルンです - 2024年",
    url: "/nekosatsu",
  },
];

export const Topbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const close = () => setShowMenu(false);

  return (
    <Fragment>
      <div
        className={clsx(
          "@container",
          "sticky top-0 z-10 h-(--header-height)",
          "border-b-nadeshiko-200 bg-nadeshiko-50/90 border-b backdrop-blur-sm",
        )}
      >
        <div className="h-full px-4 @lg:px-6">
          <div className="flex h-full items-center">
            <div className="text-base font-bold text-gray-900">
              <Link className="flex items-center gap-1" to="/">
                <img className="w-7" src="/icon.svg" alt="アイコン" />
                <p>{SITE_TITLE}</p>
              </Link>
            </div>
            <div className="ml-auto">
              <div className="hidden items-center gap-8 text-sm font-bold text-gray-500 lg:flex">
                {LINKS.map((link) => (
                  <Link key={link.url} className="hover:text-nadeshiko-700" to={link.url}>
                    {link.name}
                  </Link>
                ))}

                <Menu>
                  <MenuButton className="hover:text-nadeshiko-700">ツール</MenuButton>
                  <MenuItems
                    anchor={{ to: "top end", gap: "1.5rem" }}
                    className="focus-none z-50 overflow-hidden rounded-xl bg-white px-8 py-4 shadow-md"
                  >
                    <ul className="space-y-4 text-sm font-bold text-gray-500">
                      {UTILS.map((util) => (
                        <li key={util.url}>
                          <MenuItem>
                            <Link className="hover:text-nadeshiko-700" to={util.url}>
                              {util.name}
                            </Link>
                          </MenuItem>
                        </li>
                      ))}
                    </ul>
                  </MenuItems>
                </Menu>

                <Menu>
                  <MenuButton className="hover:text-nadeshiko-700">スペシャル</MenuButton>
                  <MenuItems
                    anchor={{ to: "top end", gap: "1.5rem" }}
                    className="focus-none z-50 overflow-hidden rounded-xl bg-white px-8 py-4 shadow-md"
                  >
                    <ul className="space-y-4 text-sm font-bold text-gray-500">
                      {SPECIALS.map((util) => (
                        <li key={util.url}>
                          <MenuItem>
                            <Link className="hover:text-nadeshiko-700" to={util.url}>
                              {util.name}
                            </Link>
                          </MenuItem>
                        </li>
                      ))}
                    </ul>
                  </MenuItems>
                </Menu>
              </div>
              <button className={iconButtonPrimary("lg:hidden")} onClick={() => setShowMenu(true)}>
                <BsThreeDotsVertical className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black/50 p-4 backdrop-blur-xs">
          <DialogPanel className="relative h-full w-80 overflow-y-auto rounded-xl border-l border-gray-200 bg-white">
            <div className="h-fit">
              <div className="absolute top-4 right-4 flex-none">
                <CloseButton as={XMarkButton} />
              </div>
              <div className="p-6">
                <ul className="space-y-6 pr-10 font-bold text-gray-700">
                  {LINKS.map((link) => (
                    <li key={link.url}>
                      <Link
                        className="hover:text-nadeshiko-700 block"
                        to={link.url}
                        onClick={close}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <hr className="my-6 border-gray-200" />

                <ul className="space-y-6 pr-10 font-bold text-gray-700">
                  <li>
                    <p className="text-gray-400">ツール</p>
                    <ul className="mt-4 space-y-6">
                      {UTILS.map((util) => (
                        <li key={util.url}>
                          <Link
                            className="hover:text-nadeshiko-700 block"
                            to={util.url}
                            onClick={close}
                          >
                            {util.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>

                <hr className="my-6 border-gray-200" />

                <ul className="space-y-6 pr-10 font-bold text-gray-700">
                  <li>
                    <p className="text-gray-400">スペシャル</p>
                    <ul className="mt-4 space-y-6">
                      {SPECIALS.map((util) => (
                        <li key={util.url}>
                          <Link
                            className="hover:text-nadeshiko-700 block"
                            to={util.url}
                            onClick={close}
                          >
                            {util.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};
