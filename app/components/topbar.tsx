import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Fragment } from "react";
import {
  BsArrowLeftRight,
  BsCalendar,
  BsCart,
  BsFilm,
  BsGraphUp,
  BsListOl,
  BsMusicNote,
  BsPersonCircle,
  BsPersonStandingDress,
  BsPersonVcard,
} from "react-icons/bs";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { Link } from "react-router";
import { SiteName } from "~/constants.ts";
import { iconButton } from "./styles/buttons";

type TopBarLink = {
  title: string;
  url: string;
  Icon?: React.ComponentType<{ className?: string }>;
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
    Icon: BsArrowLeftRight,
  },
  {
    title: "スケジュール",
    url: "/calendar",
    Icon: BsCalendar,
  },
  {
    title: "プロフィール",
    url: "/profile",
    Icon: BsPersonCircle,
  },
  {
    title: "データベース",
    items: [
      {
        title: "楽曲",
        Icon: BsMusicNote,
        url: "/songs",
      },
      {
        title: "セットリスト",
        Icon: BsListOl,
        url: "/setlists",
      },
      {
        title: "衣装",
        Icon: BsPersonStandingDress,
        url: "/costumes",
      },
      {
        title: "メディア",
        Icon: BsFilm,
        url: "/media",
      },
      {
        title: "グッズ",
        Icon: BsCart,
        url: "/products",
      },
      {
        title: "メンバー",
        url: "/members",
        Icon: BsPersonVcard,
      },
      {
        title: "統計",
        Icon: BsGraphUp,
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
  return (
    <div className="@container sticky top-0 z-20 h-(--header-height) bg-white">
      <div className="h-full px-4 @lg:px-6">
        <div className="flex h-full items-center">
          <TopbarMobileMenu />
          <div className="ml-1 text-base text-gray-900">
            <Link className="flex items-center gap-2" to="/">
              <div className="flex items-center justify-center">
                <img
                  className="size-6 text-xs text-nadeshiko-500"
                  src="/icon.svg"
                  alt="「たかねこの」のロゴ アイコン"
                />
              </div>
              <p className="font-serif text-xl">{SiteName}</p>
            </Link>
          </div>
          <div className="ml-auto">
            <div className="hidden items-center gap-8 text-sm lg:flex">
              {TopBarMenu.map((item) => {
                if (item.url != undefined) {
                  return (
                    <Link key={item.url} className="hover:text-nadeshiko-700" to={item.url}>
                      {/* トップバーではアイコンを置かない。目立ちすぎるため。 */}
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
                              <Link
                                className="flex items-center gap-2 hover:text-nadeshiko-700"
                                to={child.url}
                              >
                                {child.Icon != undefined && <child.Icon className="h-4 w-4" />}
                                <span>{child.title}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

function TopbarMobileMenu() {
  return (
    <Popover className="mr-2 shrink-0 lg:hidden">
      {({ open, close }) => (
        <Fragment>
          <PopoverButton
            className={iconButton()}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          >
            {open ? <HiXMark className="size-6" /> : <HiBars3 className="size-6" />}
          </PopoverButton>
          <PopoverPanel
            as="nav"
            aria-label="サイトメニュー"
            modal
            className="fixed top-(--header-height) bottom-0 left-0 z-10 w-full overflow-y-auto overscroll-contain bg-white/90 p-8 backdrop-blur-sm lg:hidden"
          >
            <ul className="space-y-6">
              {TopBarMenu.map((item) => {
                if (item.url != undefined) {
                  return (
                    <li key={item.url} className="font-bold text-gray-700">
                      <Link
                        className="flex items-center gap-2 hover:text-nadeshiko-700"
                        to={item.url}
                        onClick={() => close()}
                      >
                        {item.Icon != undefined && <item.Icon className="h-4 w-4" />}
                        <span>{item.title}</span>
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
                      <ul className="space-y-6 font-bold text-gray-700">
                        <li>
                          <p className="text-gray-400">{item.title}</p>
                          <ul className="mt-4 space-y-6">
                            {item.items.map((child) => (
                              <li key={child.url}>
                                <Link
                                  className="flex items-center gap-2 hover:text-nadeshiko-700"
                                  to={child.url}
                                  onClick={() => close()}
                                >
                                  {child.Icon != undefined && <child.Icon className="h-4 w-4" />}
                                  <span>{child.title}</span>
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
          </PopoverPanel>
        </Fragment>
      )}
    </Popover>
  );
}
