import { Link, MetaFunction } from "@remix-run/react";
import { ALL_SONGS } from "~/features/songs/songs";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲一覧") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の一覧です。",
    },
  ];
};

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="my-2 text-5xl font-semibold text-nadeshiko-800 lg:mt-12">楽曲一覧</h1>
        <ul>
          {ALL_SONGS.map((track) => (
            <li key={track.slug}>
              <Link to={`/songs/${track.slug}`}>{track.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
