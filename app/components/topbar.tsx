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

type TopBarLink = {
  title: string;
  url: string;
};

type TopBarLinkCollection = {
  title: string;
  url?: undefined;
  items: TopBarLink[];
};

type TopBarMenuItem = TopBarLink | TopBarLinkCollection;

const TopBarMenu: TopBarMenuItem[] = [
  {
    title: "トレード画像をつくるやつ",
    url: "/trade",
  },
  {
    title: "スケジュール",
    url: "/calendar",
  },
  {
    title: "メンバー",
    url: "/members",
  },
  {
    title: "データベース",
    items: [
      {
        title: "楽曲",
        url: "/songs",
      },
      {
        title: "メディア",
        url: "/media",
      },
      {
        title: "グッズ",
        url: "/products",
      },
      {
        title: "統計",
        url: "/stats",
      },
    ],
  },
  {
    title: "ツール",
    items: [
      {
        title: "カレンダーをアプリに登録",
        url: "/calendar/registration",
      },
      {
        title: "短い URL を作るやつ",
        url: "/shortlink",
      },
      {
        title: "データ セット",
        url: "/dataset",
      },
      {
        title: "RSS フィード",
        url: "/takaneko-feeds",
      },
      {
        title: "ユーザー スクリプト",
        url: "/user-scripts",
      },
    ],
  },
  {
    title: "スペシャル",
    items: [
      {
        title: "ねこ撮写ルンです - 2024年",
        url: "/nekosatsu",
      },
    ],
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
          "border-b border-b-nadeshiko-200 bg-nadeshiko-50/90 backdrop-blur-sm",
        )}
      >
        <div className="h-full px-4 @lg:px-6">
          <div className="flex h-full items-center">
            <div className="text-base text-gray-900">
              <Link className="flex items-center gap-2" to="/">
                <div className="flex w-10 items-center justify-center">
                  <img className="size-8" src="/icon.svg" alt="アイコン" />
                </div>
                <p className="font-serif text-xl text-gray-600">{SITE_TITLE}</p>
              </Link>
            </div>
            <div className="ml-auto">
              <div className="hidden items-center gap-8 text-sm font-bold text-gray-500 lg:flex">
                {TopBarMenu.map((item) => {
                  if (item.url != undefined) {
                    return (
                      <Link key={item.url} className="hover:text-nadeshiko-700" to={item.url}>
                        {item.title}
                      </Link>
                    );
                  }

                  return (
                    <Menu key={item.title}>
                      <MenuButton className="hover:text-nadeshiko-700">{item.title}</MenuButton>
                      <MenuItems
                        anchor={{ to: "top end", gap: "1.5rem" }}
                        className="focus-none z-50 overflow-hidden rounded-xl bg-white px-8 py-4 shadow-md"
                      >
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                          {item.items.map((child) => (
                            <li key={child.url}>
                              <MenuItem>
                                <Link className="hover:text-nadeshiko-700" to={child.url}>
                                  {child.title}
                                </Link>
                              </MenuItem>
                            </li>
                          ))}
                        </ul>
                      </MenuItems>
                    </Menu>
                  );
                })}
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
                <ul className="space-y-6 pr-10">
                  {TopBarMenu.map((item) => {
                    if (item.url != undefined) {
                      return (
                        <li key={item.url} className="font-bold text-gray-700">
                          <Link
                            className="block hover:text-nadeshiko-700"
                            to={item.url}
                            onClick={close}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <Fragment key={item.title}>
                        <li>
                          <hr className="my-6 border-gray-200" />
                        </li>
                        <li>
                          <ul className="space-y-6 pr-10 font-bold text-gray-700">
                            <li>
                              <p className="text-gray-400">{item.title}</p>
                              <ul className="mt-4 space-y-6">
                                {item.items.map((child) => (
                                  <li key={child.url}>
                                    <Link
                                      className="block hover:text-nadeshiko-700"
                                      to={child.url}
                                      onClick={close}
                                    >
                                      {child.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </Fragment>
                    );
                  })}
                </ul>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};
