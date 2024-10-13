import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { BsList } from "react-icons/bs";
import { HiXMark } from "react-icons/hi2";

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  const close = () => setShowMenu(false);

  return (
    <div>
      <div className="sticky top-0 z-10 h-12 w-full border-b border-nadeshiko-200 bg-nadeshiko-200 bg-opacity-90 backdrop-blur lg:top-[var(--header-height)]">
        <div className="container mx-auto h-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <p className="text-base font-bold text-gray-600">
              <Link to="/calendar">スケジュール</Link>
            </p>
            <div className="flex-none">
              <button
                className="p-2 text-nadeshiko-800 hover:text-nadeshiko-950"
                onClick={() => setShowMenu(true)}
              >
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
          console.log("closing");
          setShowMenu(false);
        }}
      >
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 backdrop-blur-sm">
          <DialogPanel className="relative right-4 top-4 h-fit w-80 overflow-y-auto rounded-xl bg-white">
            <div className="absolute right-2 top-2 flex-none">
              <CloseButton className="rounded-full p-2 text-xl hover:bg-gray-200">
                <HiXMark />
              </CloseButton>
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
