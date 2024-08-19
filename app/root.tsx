import { Dialog, DialogPanel } from "@headlessui/react";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { useState } from "react";
import { HiEllipsisVertical, HiXMark } from "react-icons/hi2";
import { SITE_TITLE } from "./constants";
import "./tailwind.css";

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon180x180.png" />
        <Links />
      </head>
      <body className="text-gray-800">
        <div className="bg-nadeshiko-50 z-50 h-12 border-b border-b-nadeshiko-400 bg-opacity-90 backdrop-blur lg:sticky lg:top-0">
          <div className="container mx-auto h-full">
            <div className="flex h-full items-center px-4">
              <div className="text-base font-bold text-gray-900">
                <Link to="/">🐈‍⬛🌸{SITE_TITLE}</Link>
              </div>
              <div className="ml-auto">
                <div className="hidden items-center gap-8 text-sm font-bold text-gray-500 lg:flex">
                  <Link className="hover:text-nadeshiko-700" to="/trade">
                    トレード画像をつくるやつ
                  </Link>
                  <Link className="hover:text-nadeshiko-700" to="/calendar">
                    スケジュール
                  </Link>
                </div>
                <button
                  className="inline-flex rounded-full p-2 text-lg text-nadeshiko-600 lg:hidden"
                  onClick={() => setShowMenu(true)}
                >
                  <HiEllipsisVertical />
                </button>
              </div>
            </div>
          </div>
        </div>

        {children}

        <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
          <div className="items-top fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 backdrop-blur-sm">
            <DialogPanel className="relative right-4 top-4 h-fit w-80 overflow-y-auto rounded-xl border-l border-gray-200 bg-white">
              <div className="absolute right-4 top-4 flex-none">
                <button
                  className="rounded-full p-2 text-lg hover:text-nadeshiko-700"
                  onClick={() => setShowMenu(false)}
                >
                  <HiXMark />
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-6 font-bold text-gray-800">
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/trade" onClick={close}>
                      トレード画像をつくるやつ
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-nadeshiko-700" to="/calendar" onClick={close}>
                      スケジュール
                    </Link>
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
