import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { BsList } from "react-icons/bs";
import { Link, MetaFunction, Outlet } from "react-router";
import { iconButtonPrimary } from "~/components/styles/buttons";
import { XMarkButton } from "~/components/XMarkButton";
import { SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS, TAKANEKO_PHOTOS_FEATURED } from "~/features/products/productImages";
import { MenuContents } from "./MenuContents";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);

  const in2022 = TAKANEKO_PHOTOS.filter((p) => p.year == 2022);
  const in2023 = TAKANEKO_PHOTOS.filter((p) => p.year == 2023);
  const in2024 = TAKANEKO_PHOTOS.filter((p) => p.year == 2024);
  const in2025 = TAKANEKO_PHOTOS.filter((p) => p.year == 2025);
  const allPhotos = [
    { name: "ホットなやつ", photos: TAKANEKO_PHOTOS_FEATURED },
    { name: "2025 年", photos: in2025 },
    { name: "2024 年", photos: in2024 },
    { name: "2023 年", photos: in2023 },
    { name: "2022 年", photos: in2022 },
  ];

  return (
    <div>
      {/* トレード画像を作るやつ用のトップバー。デスクトップでは非表示。 */}
      <div className="border-nadeshiko-200 bg-nadeshiko-200/90 sticky top-(--header-height) z-10 h-(--secondary-header-height) w-full border-b backdrop-blur-sm lg:hidden">
        <div className="container mx-auto h-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <p className="text-base font-bold text-gray-800">
              <Link to="/trade">トレード画像をつくるやつ</Link>
            </p>
            <div className="flex-none">
              <button className={iconButtonPrimary()} onClick={() => setShowMenu(true)}>
                <BsList className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex w-full">
          {/* サイドバー。モバイルでは非表示 */}
          <nav className="sticky top-(--header-height) hidden max-h-[calc(100svh-var(--header-height))] w-96 flex-none overflow-y-auto lg:block">
            <MenuContents allPhotos={allPhotos} onClickMenuItem={() => setShowMenu(false)} />
          </nav>

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <DialogPanel
            className="fix-scrollbar relative w-96 overflow-y-auto bg-white"
            // iOS でスクロールバーが sticky な要素に隠れる問題の対応
            // https://stackoverflow.com/questions/67076468/why-scrollbar-is-behind-sticky-elements-in-ios-safari
            style={{ transform: "translateZ(0)" }}
          >
            <div className="sticky top-0 z-50 ml-auto h-14 w-fit flex-none p-2">
              <CloseButton as={XMarkButton} />
            </div>

            <div>
              <MenuContents allPhotos={allPhotos} onClickMenuItem={() => setShowMenu(false)} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
