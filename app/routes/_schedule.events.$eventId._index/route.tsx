import { Dialog, DialogPanel } from "@headlessui/react";
import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Link,
  MetaDescriptor,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useMemo } from "react";
import { BsPersonFill, BsPersonFillSlash } from "react-icons/bs";
import {
  HiArrowTopRightOnSquare,
  HiCalendar,
  HiCalendarDays,
  HiLink,
  HiMapPin,
} from "react-icons/hi2";
import { loadEventContent, loadEventModule } from "~/features/events/events";
import { categoryToEmoji } from "~/features/events/EventType";
import { makeIcs } from "~/features/events/ical";
import { twitterCard } from "~/features/events/twitterCard";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import { findMemberDescription } from "../members/members";
import { EventRecap } from "./EventRecap";
import { makePageDescription } from "./makePageDescription";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data == undefined ? undefined : loadEventModule(data.eventId);
  const title = event?.meta.title ?? event?.meta.summary ?? "スケジュール";
  const description =
    event == undefined
      ? "高嶺のなでしこの非公式スケジュールです。"
      : (event.meta.description ?? makePageDescription(event.meta));

  const result: MetaDescriptor[] = [
    { title: formatTitle(title) },
    { name: "description", content: description },
  ];

  if (event != undefined) {
    result.push(...twitterCard(event.meta));
  }

  return result;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { eventId } = params;

  if (eventId == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = loadEventModule(eventId);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  const ics = await makeIcs(eventId, event.meta);

  return json({ eventId, ics });
};

export default function EventPage() {
  const data = useLoaderData<typeof loader>();
  const eventId = data.eventId;
  const ics = data.ics;
  const event = useMemo(() => loadEventContent(eventId), [eventId]);

  const location = useLocation();
  const navigate = useNavigate();

  if (event == undefined) {
    return null;
  }

  const Content = event.Content;
  const meta = event.meta;
  const d = meta.date;

  return (
    <div className="container mx-auto lg:max-w-4xl">
      <div>
        {meta.image && meta.image.path != "" && (
          <Link to="#photo" replace={true}>
            <div
              className="relative h-64 bg-cover bg-center lg:h-[30rem]"
              style={{
                backgroundImage: `url("${meta.image.path}")`,
              }}
            >
              <div className="absolute inset-0 bg-opacity-20 backdrop-blur-xl" />
              <img
                src={meta.image.path}
                alt="アイキャッチ"
                className="relative mx-auto h-full w-full object-contain"
              />
            </div>
          </Link>
        )}
        <div className="space-y-2 pb-4">
          <h1 className="px-4 pb-1.5 pt-8 text-2xl font-bold">
            <span>{categoryToEmoji(meta.category)}</span>
            <span>{meta.title ?? meta.summary}</span>
          </h1>
          <div className="flex items-center gap-1 px-5">
            <HiCalendar className="text-gray-400" />
            <p>{displayDateWithDayOfWeek(d)}</p>
          </div>
          {meta.location && (
            <Link
              className="block"
              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-1 px-5">
                <span>
                  <HiMapPin className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.location}</span>
                <span>
                  <HiArrowTopRightOnSquare />
                </span>
              </div>
            </Link>
          )}

          {meta.link && (
            <Link className="block" to={meta.link.url} target="_blank" rel="noreferrer">
              <div className="flex items-center gap-1 px-5">
                <span>
                  <HiLink className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.link.text}</span>
                <span>
                  <HiArrowTopRightOnSquare />
                </span>
              </div>
            </Link>
          )}

          {meta.present != undefined && meta.present.length != 0 && (
            <div className="flex items-center gap-1 px-5">
              <span>
                <BsPersonFill className="text-gray-400" />
              </span>
              <span className="text-gray-600">
                {meta.present
                  .map((n) => {
                    if (n == "高嶺のなでしこ") {
                      return n;
                    }
                    return findMemberDescription(n).name;
                  })
                  .join(" / ")}
              </span>
            </div>
          )}

          {meta.absent != undefined && meta.absent.length != 0 && (
            <div className="flex items-center gap-1 px-5">
              <span>
                <BsPersonFillSlash className="text-gray-400" />
              </span>
              <span className="text-gray-600">
                {meta.absent.map((n) => findMemberDescription(n).name).join(" / ")}
              </span>
            </div>
          )}
        </div>
      </div>

      <article className="markdown mb-4 max-w-none px-4">
        <EventRecap recaps={meta.recaps} />
        <Content />
      </article>

      {ics != undefined && (
        <Link
          className="mx-auto my-10 block w-fit rounded-md border border-nadeshiko-500 bg-nadeshiko-100 px-3 py-1"
          to={ics.dataUrl}
          download={ics.filename}
          discover="none"
        >
          <div className="flex items-center gap-1 text-nadeshiko-800">
            <span>
              <HiCalendarDays className="h-5 w-5" />
            </span>
            <span>カレンダーに登録</span>
          </div>
        </Link>
      )}

      {meta.image && (
        <p className="my-4 px-4 text-right text-xs text-gray-400">
          <Link
            to={meta.image?.ref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            <span>画像の引用元</span>
            <HiArrowTopRightOnSquare />
          </Link>
        </p>
      )}

      {meta.image && (
        <Dialog
          open={location.hash == "#photo"}
          className="relative z-50"
          onClose={() => navigate(".", { replace: true })}
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <DialogPanel
              className="h-fit w-fit overflow-hidden"
              onClick={() => navigate(".", { replace: true })}
            >
              <img
                alt="プレビュー"
                className="h-full max-h-[80svh] w-full object-contain"
                src={meta.image.path}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
