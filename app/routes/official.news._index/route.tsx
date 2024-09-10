import {
  json,
  Link,
  MetaFunction,
  unstable_defineClientLoader,
  useLoaderData,
} from "@remix-run/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";
import { validateNewsPostsList } from "./NewsPost";

export const meta: MetaFunction = ({ location }) => {
  const p = new URLSearchParams(location.search).get("page");
  const page = getPage(p);
  const title = page == 1 ? "公式ニュース" : `公式ニュース - ページ ${page}`;

  return [
    { title: formatTitle(title) },
    {
      name: "description",
      content: "高嶺のなでしこの公式サイトに掲載されているニュースです。",
    },
  ];
};

const getPage = (s: string | null) => {
  if (s == undefined) {
    return 1;
  }

  const p = parseInt(s);
  if (Number.isNaN(p)) {
    return 1;
  }

  return p;
};

export const clientLoader = unstable_defineClientLoader(async ({ request }) => {
  const url = new URL(request.url);
  const page = getPage(url.searchParams.get("page"));

  const result = await fetch(
    `https://takanenonadeshiko.jp/wp-json/wp/v2/posts?categories=2&context=embed&page=${page}`,
  );
  const posts = await result.json();
  const total = result.headers.get("X-WP-Total");
  const totalPages = result.headers.get("X-WP-TotalPages");

  const validatedPosts = validateNewsPostsList(posts);
  const parsedTotal = parseInt(total ?? "");
  const parsedTotalPages = parseInt(totalPages ?? "");

  if (
    validatedPosts == undefined ||
    Number.isNaN(parsedTotal) ||
    Number.isNaN(parsedTotalPages) ||
    !Number.isInteger(parsedTotal)
  ) {
    throw new Response("", { status: 500 });
  }

  return json({ posts: validatedPosts, page, total: parsedTotal, totalPages: parsedTotalPages });
});

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  const posts = data.posts;
  const page = data.page;
  const totalPages = data.totalPages;

  return (
    <div className="container mx-auto max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">公式ニュース</h1>
        <div className="mt-8 px-4 text-sm">
          <p>高嶺のなでしこの公式ニュースへのリンクです。</p>
          <p>
            <Link className="text-nadeshiko-800" to="https://takanenonadeshiko.jp/news/">
              公式サイトのニュースページ
            </Link>
            には最新 2 件しか表示しない問題があるため、暫定的に掲載しています。
          </p>
        </div>
        <ul className="mt-8 space-y-2">
          {posts.map((p) => {
            const nd = NaiveDate.parseUnsafe(p.date);
            const y = nd.year.toString().padStart(4, "0");
            const m = nd.month.toString().padStart(2, "0");
            const d = nd.day.toString().padStart(2, "0");
            const ds = `${y}.${m}.${d}`;
            return (
              <li key={p.id}>
                <Link to={p.link}>
                  <div className="flex gap-4 py-4">
                    <div className="flex h-20 w-20 flex-none items-center justify-center rounded border-[0.375rem] border-nadeshiko-200">
                      <p className="text-xl text-nadeshiko-500">NEW</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p
                        className="text-xl"
                        dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                      />
                      <div className="flex items-center gap-4">
                        <p className="border border-nadeshiko-500 px-4 py-0.5 text-xs leading-none text-nadeshiko-500">
                          お知らせ
                        </p>
                        <p className="text-sm">{ds}</p>
                      </div>
                      <div
                        className="text-xs"
                        dangerouslySetInnerHTML={{ __html: p.excerpt.rendered }}
                      ></div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-center justify-center gap-6 text-gray-600">
          {page == 1 ? (
            <div className="rounded border p-2">
              <HiChevronLeft />
            </div>
          ) : (
            <Link className="block" to={`/official/news?page=${page - 1}`}>
              <div className="flex items-center justify-center rounded border p-2">
                <HiChevronLeft />
              </div>
            </Link>
          )}
          <div>
            {page} of {totalPages}
          </div>
          {page == totalPages ? (
            <div className="rounded border p-2">
              <HiChevronRight />
            </div>
          ) : (
            <Link className="block" to={`/official/news?page=${page + 1}`}>
              <div className="flex items-center justify-center rounded border p-2">
                <HiChevronRight />
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
