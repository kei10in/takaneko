import { clsx } from "clsx";
import { IconType } from "node_modules/react-icons/lib/iconBase";
import { BsCalendar3, BsPerson, BsPersonSlash } from "react-icons/bs";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineLink,
  HiOutlineMapPin,
  HiOutlineSignal,
  HiOutlineTicket,
} from "react-icons/hi2";
import {
  href,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import useSWR from "swr";
import { Breadcrumb } from "~/components/Breadcrumb";
import { ImageCarousel } from "~/components/ImageCarousel";
import { ImagePreviewDialog } from "~/components/ImagePreviewDialog";
import { Mdx } from "~/components/Mdx";
import { EventMetaChips } from "~/features/calendars/EventMetaChips";
import { EventTypeLabel } from "~/features/calendars/EventTypeLabel";
import { calendarMonthHref, dateHref } from "~/features/calendars/utils";
import { Events } from "~/features/events/events";
import { EventType } from "~/features/events/EventType";
import { makeIcs } from "~/features/events/ical";
import { twitterCard } from "~/features/events/twitterCard";
import { findMemberOrGroupDescription } from "~/features/profile/profile";
import { canonicalUrl } from "~/metadata/canonicalUrl";
import { ldJsonEventDocument } from "~/metadata/ldJsonEventDocument";
import { displayDateWithDayOfWeek, displayMonth } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";
import { LdJsonMeta } from "~/utils/jsonLd/react-router";
import { findMemberDescription } from "../../features/profile/members";
import { EventDetails } from "./EventDetails";
import { EventOverview } from "./EventOverview";
import { makePageDescription } from "./makePageDescription";
import { MeetAndGreetTimeSchedule } from "./TimeScheduleForMeetAndGreet";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const meta = loaderData?.eventMeta;

  const title = meta?.title ?? meta?.summary ?? "スケジュール";
  const description =
    meta == undefined
      ? "高嶺のなでしこの非公式スケジュールです。"
      : (meta.description ?? makePageDescription(meta));
  const formattedTitle = formatTitle(title);
  const canonical =
    loaderData == undefined
      ? undefined
      : canonicalUrl(href("/events/:eventSlug", { eventSlug: loaderData.slug }));
  const jsonLd =
    meta == undefined || canonical == undefined
      ? undefined
      : LdJsonMeta(
          ldJsonEventDocument({
            event: meta,
            canonicalUrl: canonical,
            name: formattedTitle,
            description,
          }),
        );

  return [
    { title: formattedTitle },
    { name: "description", content: description },
    ...(meta == undefined ? [] : twitterCard(meta)),
    ...(jsonLd == undefined ? [] : [jsonLd]),
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { eventSlug } = params;

  if (eventSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = await Events.importEventModuleBySlug(eventSlug);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  const ics = await makeIcs(eventSlug, event.meta);

  return { slug: eventSlug, ics, eventMeta: event.meta };
};

export default function EventPage() {
  const { slug, ics, eventMeta: meta } = useLoaderData<typeof loader>();
  const d = NaiveDate.parseUnsafe(meta.date);
  const m = d.naiveMonth();

  const location = useLocation();
  const navigate = useNavigate();

  // Content は React Component なため `loader` から渡すことができず SSR できない。
  const { data } = useSWR(slug, (x) => Events.importEventModuleBySlug(x));
  const Content = data?.Content;

  // `to` として文字列 "." だけを渡すと `?index` が付いてしまうのを防振するために、
  // `To` のオブジェクトを渡す。
  const close = () => navigate({ pathname: "." }, { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto lg:max-w-4xl">
      <div className="bg-linear-to-b from-zinc-100/80 to-white to-20% px-4 py-4">
        <Breadcrumb
          items={[
            { label: "スケジュール", to: "/calendar" },
            { label: displayMonth(m), to: calendarMonthHref(m) },
            { label: `${d.day.toString().padStart(2, "0")}日`, to: dateHref(d) },
          ]}
        />
      </div>

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

        <div className="my-8 space-y-4">
          <div className="space-y-1">
            <div className="px-4">
              <EventTypeLabel category={meta.category} />
            </div>

            <h1 className="px-4 pb-1.5 text-3xl font-bold">
              <span>{meta.title ?? meta.summary}</span>
            </h1>
          </div>

          <div className="space-y-3">
            <FieldWithIcon className="px-5" icon={HiOutlineCalendarDays}>
              <p>{displayDateWithDayOfWeek(d)}</p>
            </FieldWithIcon>

            {(meta.category == EventType.LIVE || meta.open) && (
              <FieldWithIcon className="px-5" icon={HiOutlineClock}>
                {meta.open && meta.start && (
                  <p>
                    開場: {meta.open} / 開演: {meta.start}
                  </p>
                )}
                {meta.open && !meta.start && <p>開場: {meta.open}</p>}
                {!meta.open && meta.start && <p>開演: {meta.start}</p>}

                {meta.end && <p className="text-sm">終演: {meta.end}</p>}
              </FieldWithIcon>
            )}

            {(meta.category == EventType.TV || meta.category == EventType.RADIO) && meta.start && (
              <FieldWithIcon className="px-5" icon={HiOutlineClock}>
                <p>
                  {meta.start} 〜 {meta.end}
                </p>
              </FieldWithIcon>
            )}

            {meta.location && (
              <FieldWithIcon className="px-5" icon={HiOutlineMapPin}>
                <Link
                  className="block space-x-1"
                  to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="underline">{meta.location}</span>
                  <HiOutlineArrowTopRightOnSquare className="inline-block size-4" />
                </Link>
              </FieldWithIcon>
            )}

            {meta.link && (
              <FieldWithIcon className="px-5" icon={HiOutlineLink}>
                <Link
                  className="block space-x-1"
                  to={meta.link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="underline">{meta.link.text}</span>
                  <HiOutlineArrowTopRightOnSquare className="inline-block size-4" />
                </Link>
              </FieldWithIcon>
            )}

            {meta.ticket && (
              <FieldWithIcon className="px-5" icon={HiOutlineTicket}>
                <Link className="block space-x-1" to={meta.ticket} target="_blank" rel="noreferrer">
                  <span className="underline">チケット</span>
                  <HiOutlineArrowTopRightOnSquare className="inline-block size-4" />
                </Link>
              </FieldWithIcon>
            )}

            {meta.streamings.length > 0 && (
              <FieldWithIcon className="px-5" icon={HiOutlineSignal}>
                {meta.streamings.map((streaming, i) => (
                  <Link
                    key={i}
                    className="block space-x-1"
                    to={streaming.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="underline">{streaming.text}</span>
                    <HiOutlineArrowTopRightOnSquare className="inline-block size-4" />
                  </Link>
                ))}
              </FieldWithIcon>
            )}

            {meta.present != undefined && meta.present.length != 0 && (
              <FieldWithIcon className="px-5" icon={BsPerson}>
                {meta.present.map((n) => findMemberOrGroupDescription(n).name).join(" / ")}
              </FieldWithIcon>
            )}

            {meta.absent != undefined && meta.absent.length != 0 && (
              <FieldWithIcon className="px-5" icon={BsPersonSlash}>
                {meta.absent.map((n) => findMemberDescription(n).name).join(" / ")}
              </FieldWithIcon>
            )}

            <EventMetaChips
              className="px-5"
              category={meta.category}
              liveType={meta.liveType}
              meetAndGreetTypes={meta.meetAndGreetTypes}
            />
          </div>
        </div>
      </div>

      <article className="mb-4 max-w-none px-4">
        <EventDetails acts={meta.acts} />

        <EventOverview timetables={meta.timetables} goods={meta.goods} />

        {meta.meetAndGreet != undefined && (
          <MeetAndGreetTimeSchedule
            date={d}
            title={meta.meetAndGreet?.title}
            sessions={meta.meetAndGreet.sessions}
          />
        )}

        {Content != undefined && <Mdx Content={Content} />}

        {meta.links.length > 0 && (
          <section>
            <h2 className="mt-6 mb-4 border-b border-gray-200 pb-1 text-2xl leading-tight font-semibold">
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
          className="mx-auto my-10 block w-fit rounded-md border border-nadeshiko-500 bg-nadeshiko-100 px-3 py-1"
          to={ics.dataUrl}
          download={ics.filename}
          discover="none"
        >
          <div className="flex items-center gap-1 text-nadeshiko-800">
            <span>
              <BsCalendar3 className="h-5 w-5" />
            </span>
            <span>カレンダーに登録</span>
          </div>
        </Link>
      )}

      {meta.images.map((img, i) => (
        <ImagePreviewDialog
          key={i}
          open={location.hash == `#photo-${i}`}
          onClose={close}
          imageSrc={img.path}
          imageAlt="プレビュー"
          sourceUrl={img.ref}
        />
      ))}

      {meta.timetables.map((tt, i) => {
        return (
          <ImagePreviewDialog
            key={i}
            open={location.hash == `#timetable-${i}`}
            onClose={close}
            imageSrc={tt.path}
            imageAlt="プレビュー"
            sourceUrl={tt.ref}
          />
        );
      })}
    </div>
  );
}

interface FieldWithIconProps {
  className?: string;
  icon: IconType;
  children?: React.ReactNode;
}

const FieldWithIcon: React.FC<FieldWithIconProps> = (props: FieldWithIconProps) => {
  const { className, icon: Icon, children } = props;

  return (
    <div className={clsx("flex items-start gap-2", className)}>
      <div>
        <Icon className="size-6 text-zinc-400" />
      </div>
      <div className="py-0.5 leading-tight">{children}</div>
    </div>
  );
};
