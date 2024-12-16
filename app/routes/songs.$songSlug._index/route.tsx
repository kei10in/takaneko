import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { trackSlug: songSlug } = params;

  if (songSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const meta = ALL_SONGS.find((x) => x.slug === songSlug);

  return json(meta);
};

export default function Component() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube-nocookie.com/embed/${data.youtube}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <section className="px-4 py-8">
        <h1 className="my-2 text-5xl font-semibold text-nadeshiko-800 lg:mt-12">{data.name}</h1>
      </section>
    </div>
  );
}
