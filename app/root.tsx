import {
  CloseButton,
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { XMarkButton } from "./components/XMarkButton";
import { SITE_TITLE } from "./constants";
import "./tailwind.css";

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
    name: "RSS フィード",
    url: "/takaneko-feeds",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);

  const close = () => setShowMenu(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fffcfd" />
        <Meta />
        <meta name="robots" content="noimageindex" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml " />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>
      <body className="text-gray-800">
        <div className="border-b-nadeshiko-200 bg-nadeshiko-50/90 z-10 h-(--header-height) border-b backdrop-blur-sm lg:sticky lg:top-0">
          <div className="container mx-auto h-full">
            <div className="flex h-full items-center px-4">
              <div className="text-base font-bold text-gray-900">
                <Link className="flex items-center gap-1" to="/">
                  <img className="w-7" src="/icon.svg" alt="アイコン" />
                  <p>{SITE_TITLE}</p>
                </Link>
              </div>
              <div className="ml-auto">
                <div className="hidden items-center gap-8 text-sm font-bold text-gray-500 lg:flex">
                  <Link className="hover:text-nadeshiko-700" to="/trade">
                    トレード画像をつくるやつ
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/calendar">
                    スケジュール
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/songs">
                    楽曲
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/media">
                    メディア
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/products">
                    グッズ
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/members">
                    メンバー
                  </Link>
                  <Menu>
                    <MenuButton className="hover:text-nadeshiko-700">ツール</MenuButton>
                    <MenuItems
                      anchor={{ to: "top end", gap: "1.5rem" }}
                      className="z-50 overflow-hidden rounded-xl bg-white px-8 py-4 shadow-md"
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
                </div>
                <button
                  data-primary
                  className="icon-btn lg:hidden"
                  onClick={() => setShowMenu(true)}
                >
                  <BsThreeDotsVertical className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {children}

        <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
          <div className="items-top fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            <DialogPanel className="relative top-4 right-4 h-fit w-80 overflow-y-auto rounded-xl border-l border-gray-200 bg-white">
              <div className="absolute top-4 right-4 flex-none">
                <CloseButton as={XMarkButton} />
              </div>
              <div className="p-6">
                <ul className="space-y-6 pr-5 font-bold text-gray-700">
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/trade" onClick={close}>
                      <p>トレード画像をつくるやつ</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/calendar" onClick={close}>
                      <p>スケジュール</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/songs" onClick={close}>
                      <p>楽曲</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/media" onClick={close}>
                      <p>メディア</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/products" onClick={close}>
                      <p>グッズ</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/members" onClick={close}>
                      <p>メンバー</p>
                    </Link>
                  </li>
                </ul>

                <hr className="my-6 border-gray-200" />

                <ul className="space-y-6 pr-5 font-bold text-gray-700">
                  <li>
                    <p className="text-gray-400">ツール</p>
                    <ul className="mt-4 space-y-4">
                      {UTILS.map((util) => (
                        <li key={util.url}>
                          <Link className="hover:text-nadeshiko-700" to={util.url} onClick={close}>
                            <p>{util.name}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();

  const [title, description] = isRouteErrorResponse(error)
    ? [error.status.toString(), error.status == 404 ? "ページが見つかりません。" : error.statusText]
    : ["不明なエラー", "不明なエラーが発生しました。"];

  if (isRouteErrorResponse(error)) {
    return (
      <div className="container mx-auto lg:max-w-5xl">
        <section className="py-16 text-center">
          <h1 className="text-5xl text-gray-400">{title}</h1>
          <p className="tet-gray-800 mt-4">{description}</p>
        </section>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
