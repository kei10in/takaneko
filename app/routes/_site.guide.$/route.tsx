import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { MDXContent } from "mdx/types";
import { lazy, Suspense, useState } from "react";
import { BsList } from "react-icons/bs";
import { Link, useLoaderData } from "react-router";
import { markdownComponents2 } from "~/components/MdComponents2";
import { SecondaryTopbar } from "~/components/SecondaryTopbar";
import { iconButtonPrimary } from "~/components/styles/buttons";
import { Route } from "./+types/route";

const mdxModules = import.meta.glob("../../features/guide/**/*.(mdx|md)");
const MdxDocs: Record<string, React.LazyExoticComponent<MDXContent>> = Object.fromEntries(
  Object.entries(mdxModules).map(([k, importer]) => [
    k,
    lazy(async () => {
      const mod = await importer();
      return mod as { default: MDXContent };
    }),
  ]),
);

export const loader = async (args: Route.LoaderArgs) => {
  const path = args.params["*"];

  const mdxKeys =
    path === ""
      ? [`../../features/guide/index.mdx`, `../../features/guide/index.md`]
      : [
          `../../features/guide/${path}.mdx`,
          `../../features/guide/${path}/index.mdx`,
          `../../features/guide/${path}.md`,
          `../../features/guide/${path}/index.md`,
        ];

  if (mdxKeys.some((key) => key in MdxDocs)) {
    const key = mdxKeys.find((key) => key in MdxDocs)!;
    return { key };
  }

  throw new Response("Not Found", { status: 404 });
};

export default function Component() {
  const { key } = useLoaderData<typeof loader>();
  const Mdx = MdxDocs[key];

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="main-viewport">
      <SecondaryTopbar className="lg:hidden">
        <div className="flex h-full items-center gap-2">
          <div className="flex-none">
            <button className={iconButtonPrimary()} onClick={() => setShowMenu(true)}>
              <BsList className="h-6 w-6" />
            </button>
          </div>
          <p className="text-base font-bold text-gray-800">
            <Link to="/trade">ガイド</Link>
          </p>
        </div>
      </SecondaryTopbar>

      <div className="main-viewport @container flex items-stretch">
        <aside
          className={clsx(
            "sticky top-(--header-height) hidden max-h-[calc(100svh-var(--header-height))] w-xs flex-none overflow-y-auto bg-nadeshiko-200",
            "lg:block lg:border-r lg:border-l lg:border-nadeshiko-200",
          )}
        >
          <nav className="flex flex-col"></nav>
        </aside>
        <main className="mx-auto px-4 pb-16 lg:max-w-2xl">
          <div className="wrap-break-word">
            <Suspense fallback={null}>
              <Mdx components={markdownComponents2} />
            </Suspense>
          </div>
        </main>
      </div>

      <Dialog open={showMenu} onClose={() => setShowMenu(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="items-top fixed inset-0 bg-black/50 backdrop-blur-xs transition duration-200 data-closed:opacity-0"
        />
        <div className="items-top justify-left fixed inset-0 flex">
          <DialogPanel
            transition
            className="fix-scrollbar relative mr-32 max-w-92 flex-1 overflow-y-auto bg-white duration-200 data-closed:-translate-x-full"
            // iOS でスクロールバーが sticky な要素に隠れる問題の対応
            // https://stackoverflow.com/questions/67076468/why-scrollbar-is-behind-sticky-elements-in-ios-safari
            style={{ transform: "translateZ(0)" }}
          >
            <div></div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
