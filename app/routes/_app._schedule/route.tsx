import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link, Outlet } from "react-router";
import { XMarkButton } from "~/components/XMarkButton";

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  const close = () => setShowMenu(false);

  return (
    <Fragment>
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
    </Fragment>
  );
}
