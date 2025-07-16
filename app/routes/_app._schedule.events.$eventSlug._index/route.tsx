import { Dialog, DialogPanel } from "@headlessui/react";
import { useMemo } from "react";
import {
  BsBoxArrowUpRight,
  BsBroadcast,
  BsCalendar,
  BsCalendar3,
  BsDoorOpen,
  BsLink45Deg,
  BsPersonFill,
  BsPersonFillSlash,
  BsPinMap,
  BsTicketPerforated,
} from "react-icons/bs";
import {
  Link,
  LoaderFunctionArgs,
  MetaDescriptor,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { ImageCarousel } from "~/components/ImageCarousel";
import { Mdx } from "~/components/Mdx";
import { calendarMonthHref, dateHref } from "~/features/calendars/utils";
import { loadEventModule } from "~/features/events/events";
import { categoryToEmoji } from "~/features/events/EventType";
import { makeIcs } from "~/features/events/ical";
import { twitterCard } from "~/features/events/twitterCard";
import { displayDateWithDayOfWeek, displayMonth } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import { findMemberDescription } from "../../features/profile/members";
import { EventDetails } from "./EventOverview";
import { EventRecap } from "./EventRecap";
import { makePageDescription } from "./makePageDescription";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data == undefined ? undefined : loadEventModule(data.slug);
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
  const { eventSlug } = params;

  if (eventSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = loadEventModule(eventSlug);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  const ics = await makeIcs(eventSlug, event.meta);

  return { slug: eventSlug, ics };
};

export default function EventPage() {
  const data = useLoaderData<typeof loader>();
  const eventId = data.slug;
  const ics = data.ics;
  const event = useMemo(() => loadEventModule(eventId), [eventId]);

  const location = useLocation();
  const navigate = useNavigate();

  if (event == undefined) {
    return null;
  }

  const Content = event.Content;
  const meta = event.meta;
  const d = meta.date;
  const m = d.naiveMonth();

  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto lg:max-w-4xl">
      <div>
        {meta.images.length > 0 && (
          <ImageCarousel
            images={meta.images.map((img, i) => ({
              src: img.path,
              alt: `アイキャッチ ${i + 1}`,
              to: `#photo-${i}`,
              replace: true,
              preventScrollReset: true,
            }))}
          />
        )}

        <div className="px-4 py-2">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "スケジュール", to: "/calendar" },
              { label: displayMonth(m), to: calendarMonthHref(m) },
              { label: `${d.day.toString().padStart(2, "0")}日`, to: dateHref(d) },
            ]}
          />
        </div>

        <div className="my-4 space-y-2">
          <h1 className="px-4 pb-1.5 text-2xl font-bold">
            <span>{categoryToEmoji(meta.category)}</span>
            <span>{meta.title ?? meta.summary}</span>
          </h1>
          <div className="flex items-center gap-1 px-5">
            <BsCalendar className="text-gray-400" />
            <p>
              {displayDateWithDayOfWeek(d)}
              {meta.start != undefined && ` ${meta.start} 〜`}
              {meta.end != undefined && ` ${meta.end}`}
            </p>
          </div>
          {meta.open && (
            <div className="flex items-center gap-1 px-5">
              <BsDoorOpen className="text-gray-400" />
              <p>開場 {meta.open} 〜</p>
            </div>
          )}
          {meta.location && (
            <Link
              className="block"
              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsPinMap className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.location}</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
                </span>
              </div>
            </Link>
          )}

          {meta.link && (
            <Link className="block" to={meta.link.url} target="_blank" rel="noreferrer">
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsLink45Deg className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.link.text}</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
                </span>
              </div>
            </Link>
          )}
          {meta.overview?.ticket && (
            <Link className="block" to={meta.overview.ticket} target="_blank" rel="noreferrer">
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsTicketPerforated className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">チケット</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
                </span>
              </div>
            </Link>
          )}
          {meta.overview?.streaming && (
            <Link
              className="block"
              to={meta.overview.streaming.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsBroadcast className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.overview.streaming.text}</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
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

      <article className="mb-4 max-w-none px-4">
        <EventRecap recaps={meta.recaps} />

        <EventDetails timetable={meta.overview?.timetable} goods={meta.overview?.goods} />

        <Mdx Content={Content} />

        {meta.links.length > 0 && (
          <section>
            <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-xl leading-tight font-semibold">
              リンク
            </h2>
            <ul className="mt-1 mb-3 list-disc space-y-1 pl-8 text-base leading-snug">
              {meta.links.map((link, i) => (
                <li key={i} className="my-0 marker:text-gray-400">
                  <Link
                    className="text-nadeshiko-950"
                    to={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {ics != undefined && (
        <Link
          className="border-nadeshiko-500 bg-nadeshiko-100 mx-auto my-10 block w-fit rounded-md border px-3 py-1"
          to={ics.dataUrl}
          download={ics.filename}
          discover="none"
        >
          <div className="text-nadeshiko-800 flex items-center gap-1">
            <span>
              <BsCalendar3 className="h-5 w-5" />
            </span>
            <span>カレンダーに登録</span>
          </div>
        </Link>
      )}

      {meta.images.map((img, i) => (
        <Dialog
          key={i}
          open={location.hash == `#photo-${i}`}
          className="relative z-50"
          onClose={close}
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 backdrop-blur-xs">
            <DialogPanel className="h-fit w-fit overflow-hidden" onClick={close}>
              <img
                alt="プレビュー"
                className="block h-full max-h-[80svh] w-full object-contain"
                src={img.path}
              />

              <p className="p-1 text-right text-xs font-semibold text-white/80">
                <Link
                  to={img.ref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <span>画像の引用元</span>
                  <BsBoxArrowUpRight />
                </Link>
              </p>
            </DialogPanel>
          </div>
        </Dialog>
      ))}

      {meta.overview?.timetable != undefined && (
        <Dialog open={location.hash == `#timetable`} className="relative z-50" onClose={close}>
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 backdrop-blur-xs">
            <DialogPanel className="h-fit w-fit overflow-hidden" onClick={close}>
              <img
                alt="プレビュー"
                className="block h-full max-h-[80svh] w-full object-contain"
                src={meta.overview.timetable.path}
              />

              <p className="p-1 text-right text-xs font-semibold text-white/80">
                <Link
                  to={meta.overview.timetable.ref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <span>画像の引用元</span>
                  <BsBoxArrowUpRight />
                </Link>
              </p>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
