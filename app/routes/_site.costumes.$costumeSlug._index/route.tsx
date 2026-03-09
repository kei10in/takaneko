import { clsx } from "clsx";
import {
  BsBoxArrowUpRight,
  BsCalendar,
  BsExclamationTriangleFill,
  BsGeo,
  BsMicFill,
} from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Fragment } from "react/jsx-runtime";
import useSWR from "swr";
import { Breadcrumb } from "~/components/Breadcrumb";
import { pageHeading, sectionHeading } from "~/components/styles";
import { AllCostumes } from "~/features/costumes/costumes";
import { LivesForCostume } from "~/features/costumes/types";
import { liveTypeColor } from "~/features/events/EventType";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import type { Route } from "./+types/route";
import { LiveSkeleton } from "./LiveSkeleton";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = formatTitle(data?.costume.name ?? "衣装が見つかりません。");

  return [{ title }, { name: "description", content: "高嶺のなでしこの楽曲" }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { costumeSlug } = params;

  if (costumeSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const costume = AllCostumes.find((x) => x.slug === costumeSlug);
  if (costume) {
    return { costume };
  }

  throw new Response("", { status: 404 });
};

export default function Component({ loaderData }: Route.ComponentProps) {
  const { costume } = loaderData;

  const { data, isLoading } = useSWR(`costumes/${costume.slug}/lives.json`, async () => {
    const response = await fetch(`/data/costumes/${costume.slug}/lives.json`);
    if (!response.ok) {
      return undefined;
    }

    const json = await response.json();
    const result = LivesForCostume.safeParse(json);
    if (result.error) {
      return undefined;
    }
    return result.data;
  });

  const lives = data?.lives ?? [];

  return (
    <div>
      <div className="container mx-auto lg:max-w-5xl">
        {costume.kind == "stage" && (
          <div>
            <img
              src={costume.image.path}
              alt={costume.name}
              className="aspect-4/3 w-full object-cover"
            />
            <p className="p-1 text-right text-xs text-gray-400">
              <Link
                to={costume.image.ref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1"
              >
                <span>画像の引用元</span>
                <BsBoxArrowUpRight />
              </Link>
            </p>
          </div>
        )}

        <div className="px-4 py-4">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "衣装", to: "/costumes" },
            ]}
          />
        </div>

        <section className="space-y-8 px-4 py-8">
          <h1 className={pageHeading()}>{costume.name}</h1>

          <div className="space-y-1 rounded-lg border border-amber-400 bg-amber-50 px-4 py-2">
            <p>
              <BsExclamationTriangleFill className="inline text-amber-400" />
              <span className="ml-2">工事中</span>
            </p>
            <p>このページは作成中です。</p>
          </div>

          <section className="mt-8">
            <h2
              className={sectionHeading("sticky top-0 bg-white/90 py-2 lg:top-(--header-height)")}
            >
              <span className="flex items-center gap-2">
                <BsMicFill className="inline-block text-gray-400" />
                <span>ライブ</span>
              </span>
            </h2>

            <ul className="mt-4 space-y-2">
              {isLoading &&
                [1, 2, 3].map((x) => (
                  <li key={x}>
                    <LiveSkeleton />
                  </li>
                ))}
              {!isLoading && lives.length == 0 && (
                <li>
                  <p className="p-1 text-gray-500">
                    この衣装を着用したライブが見つかりませんでした。
                  </p>
                </li>
              )}
              {lives.map(({ event: e, acts }, i) => (
                <Fragment key={i}>
                  {acts.map((act, j) => {
                    return (
                      <li key={j}>
                        <div className="flex items-stretch gap-2 p-1">
                          <div
                            className={clsx(
                              "w-1 flex-none rounded-full",
                              liveTypeColor(e.liveType),
                            )}
                          />
                          <div className="text-xs">
                            <p className="text-sm">
                              <Link to={`/events/${e.slug}`}>
                                {act.actTitle ? `${e.title} - ${act.actTitle}` : e.title}
                              </Link>
                            </p>
                            <p className="flex items-center gap-1 text-gray-400">
                              <BsCalendar className="inline flex-none text-xs" />
                              <span className="line-clamp-1">
                                {displayDateWithDayOfWeek(e.date)}
                              </span>
                            </p>
                            <p className="flex items-center gap-1 text-gray-400">
                              <BsGeo className="inline flex-none text-xs" />
                              <span className="line-clamp-1">
                                {e.region} {e.location}
                              </span>
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </Fragment>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
