import {
  json,
  Link,
  MetaFunction,
  unstable_defineClientLoader,
  useLoaderData,
} from "@remix-run/react";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";
import { validateNewsPostsList } from "./NewsPost";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("公式ニュース") },
    {
      name: "description",
      content: "高嶺のなでしこの公式サイトに掲載されているニュースです。",
    },
  ];
};

export const clientLoader = unstable_defineClientLoader(async () => {
  const result = await fetch(
    "https://takanenonadeshiko.jp/wp-json/wp/v2/posts?categories=2&context=embed",
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
    return undefined;
  }

  return json({ posts: validatedPosts, total: parsedTotal, totalPages: parsedTotalPages });
});

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  const posts = data.posts;
  // const totalPages = data.totalPages;

  return (
    <div className="container mx-auto">
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl">公式ニュース</h1>
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
                  <div className="space-y-2 py-4">
                    <p className="text-xl">{p.title.rendered}</p>
                    <div className="flex items-center gap-4">
                      <p className="border border-nadeshiko-500 px-4 py-0.5 text-sm leading-none text-nadeshiko-500">
                        お知らせ
                      </p>
                      <p className="text-sm">{ds}</p>
                    </div>
                    <div
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: p.excerpt.rendered }}
                    ></div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
