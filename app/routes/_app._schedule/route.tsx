import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { BsList } from "react-icons/bs";
import { Link, Outlet } from "react-router";
import { iconButtonPrimary } from "~/components/styles/buttons";
import { XMarkButton } from "~/components/XMarkButton";

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  const close = () => setShowMenu(false);

  return (
    <div>
      <div className="border-nadeshiko-200 bg-nadeshiko-200/90 sticky top-0 z-10 h-12 w-full border-b backdrop-blur-sm lg:top-[var(--header-height)]">
        <div className="container mx-auto h-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <p className="text-base font-bold text-gray-600">
              <Link to="/calendar">スケジュール</Link>
            </p>

            <div className="hidden lg:block">
              <ul className="flex items-center gap-8 text-sm font-bold text-gray-500">
                <li>
                  <Link to="/calendar/registration" onClick={close}>
                    アプリに登録
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex-none lg:hidden">
              <button className={iconButtonPrimary()} onClick={() => setShowMenu(true)}>
                <BsList className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Outlet />

      <Dialog
        open={showMenu}
        onClose={() => {
          setShowMenu(false);
        }}
      >
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <DialogPanel className="relative top-4 right-4 h-fit w-80 overflow-y-auto rounded-xl bg-white">
            <div className="absolute top-4 right-4 flex-none">
              <CloseButton as={XMarkButton} />
            </div>
            <div className="p-6">
              <ul className="space-y-6 pr-5 font-bold text-gray-800">
                <li>
                  <Link to="/calendar/registration" onClick={close}>
                    アプリに登録
                  </Link>
                </li>
              </ul>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
