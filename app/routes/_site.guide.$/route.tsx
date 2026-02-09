import { clsx } from "clsx";
import { MDXContent } from "mdx/types";
import { lazy, Suspense } from "react";
import { useLoaderData } from "react-router";
import { markdownComponents2 } from "~/components/MdComponents2";
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

  return (
    <div className="main-viewport container mx-auto flex items-stretch">
      <aside
        className={clsx(
          "sticky top-(--header-height) hidden max-h-[calc(100svh-var(--header-height))] w-xs flex-none overflow-y-auto bg-nadeshiko-200",
          "lg:block lg:border-r lg:border-l lg:border-nadeshiko-200",
        )}
      >
        <nav className="flex flex-col"></nav>
      </aside>
      <main className="mx-auto pb-16 lg:max-w-2xl">
        <div className="wrap-break-word">
          <Suspense fallback={null}>
            <Mdx components={markdownComponents2} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
