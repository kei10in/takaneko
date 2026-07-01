import { clsx } from "clsx";
import { BsClock } from "react-icons/bs";
import { GiBowTieRibbon, GiCompactDisc, GiMicrophone, GiPopcorn } from "react-icons/gi";
import {
  HiBeaker,
  HiBookOpen,
  HiCake,
  HiCurrencyYen,
  HiOutlineMapPin,
  HiRadio,
  HiTv,
  HiUsers,
  HiVideoCamera,
} from "react-icons/hi2";
import { IconType } from "react-icons/lib";
import { LiveChip, LiveTypeChip, MeetAndGreetChip } from "~/components/IconChip";
import { assertNever } from "~/utils/assertNever";
import { UiColors } from "~/utils/uiColors";
import { EventType, eventTypeBackgroundColor, eventTypeColors } from "../events/EventType";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  event: CalendarEvent;
}

export const CalendarEventItem: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { category, summary } = event;
  const backgroundColor = eventTypeBackgroundColor(category);
  const thumbnail = event.images?.[0]?.path;

  return (
    <div className="@container overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="flex min-h-22 items-stretch gap-2 pr-2">
        <div className="w-1 flex-none">
          <div className={clsx("mt-7.25 h-7 w-full rounded-r-3xl", backgroundColor)} />
        </div>
        <div className="min-w-0 flex-1">
          {category == EventType.LIVE ? (
            <Live event={event} />
          ) : category == EventType.MEET_AND_GREET ? (
            <OfflineEvent event={event} />
          ) : category == EventType.RELEASE_EVENT ? (
            <ReleaseEvent event={event} />
          ) : category == EventType.STREAMING ? (
            <SimpleEvent event={event} />
          ) : category == EventType.VARIETY ? (
            <OfflineEvent event={event} />
          ) : category == EventType.FASHION ? (
            <OfflineEvent event={event} />
          ) : category == EventType.SALES_OPEN ? (
            <SimpleEvent event={event} />
          ) : category == EventType.CD ? (
            <SimpleEvent event={event} />
          ) : category == EventType.BIRTHDAY ? (
            <SimpleEvent event={event} />
          ) : category == EventType.TV ? (
            <MediaAppearance event={event} />
          ) : category == EventType.RADIO ? (
            <MediaAppearance event={event} />
          ) : category == EventType.ON_DEMAND ? (
            <SimpleEvent event={event} />
          ) : category == EventType.BOOK ? (
            <SimpleEvent event={event} />
          ) : category == EventType.MAGAZINE ? (
            <SimpleEvent event={event} />
          ) : category == EventType.OTHER ? (
            <OfflineEvent event={event} />
          ) : (
            <></>
          )}
        </div>
        {thumbnail && (
          <div className="relative my-2 min-h-24 w-24 flex-none self-stretch overflow-hidden rounded-2xl">
            <div className="absolute inset-0 h-full w-full bg-zinc-100 p-2">
              <img src={thumbnail} className="h-full w-full object-contain text-xs" alt={summary} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Live: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { liveType, summary, location, region } = event;
  const place = location || region;

  return (
    <div className="flex flex-col gap-1 py-2">
      <EventTypeLabel event={event} />
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {place && (
          <p className="flex items-center text-sm text-gray-400">
            <span className="mr-1 text-base">
              <HiOutlineMapPin />
            </span>
            <span>{place}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {liveType != undefined && <LiveTypeChip liveType={liveType} large />}
      </div>
    </div>
  );
};

const ReleaseEvent: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { liveType, meetAndGreetTypes, summary, location, region } = event;
  const place = location || region;
  const chipColor = eventTypeColors(event.category).text;

  return (
    <div className="flex flex-col gap-1 py-2">
      <EventTypeLabel event={event} />
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {place && (
          <p className="flex items-center text-sm text-gray-400">
            <span className="mr-1 text-base">
              <HiOutlineMapPin />
            </span>
            <span>{place}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {liveType != undefined && <LiveChip iconColor={chipColor} large />}
        {meetAndGreetTypes.map((type) => (
          <MeetAndGreetChip key={type} text={type} iconColor={chipColor} large />
        ))}
      </div>
    </div>
  );
};

const OfflineEvent: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { liveType, meetAndGreetTypes, summary, location, region } = event;
  const place = location || region;
  const badgeColor = eventTypeColors(event.category).text;

  return (
    <div className="flex flex-col gap-1 py-2">
      <EventTypeLabel event={event} />
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {place && (
          <p className="flex items-center px-0.5 text-sm text-gray-400">
            <span className="mr-1 text-base">
              <HiOutlineMapPin />
            </span>
            <span>{place}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {meetAndGreetTypes.map((type) => (
          <MeetAndGreetChip key={type} text={type} iconColor={badgeColor} large />
        ))}
        {liveType != undefined && <LiveChip iconColor={badgeColor} large />}
      </div>
    </div>
  );
};

const MediaAppearance: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { category, summary } = event;
  const time =
    category == (EventType.TV || category == EventType.RADIO) &&
    event.start != undefined &&
    event.end != undefined
      ? `${event.start} ～ ${event.end}`
      : undefined;

  return (
    <div className="flex flex-col gap-1 py-2">
      <EventTypeLabel event={event} />
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {time && (
          <p className="flex items-center px-0.5 text-sm text-gray-400">
            <span className="mr-1">
              <BsClock />
            </span>
            <span>{time}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const SimpleEvent: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { summary } = event;

  return (
    <div className="flex flex-col gap-1 py-2">
      <EventTypeLabel event={event} />
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
    </div>
  );
};

const EventTypeLabel: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { category } = event;
  const colors = eventTypeColors(category);

  switch (category) {
    case EventType.LIVE:
      return <IconLabel icon={GiMicrophone} text="ライブ" colors={colors} />;
    case EventType.MEET_AND_GREET:
      return <IconLabel icon={HiUsers} text="対面イベント" colors={colors} />;
    case EventType.RELEASE_EVENT:
      return <IconLabel icon={GiCompactDisc} text="リリースイベント" colors={colors} />;
    case EventType.STREAMING:
      return <IconLabel icon={HiVideoCamera} text="配信" colors={colors} />;
    case EventType.VARIETY:
      return <IconLabel icon={GiPopcorn} text="バラエティ" colors={colors} />;
    case EventType.FASHION:
      return <IconLabel icon={GiBowTieRibbon} text="ファッション" colors={colors} />;
    case EventType.SALES_OPEN:
      return <IconLabel icon={HiCurrencyYen} text="販売開始" colors={colors} />;
    case EventType.CD:
      return <IconLabel icon={GiCompactDisc} text="CD" colors={colors} />;
    case EventType.BIRTHDAY:
      return <IconLabel icon={HiCake} text="誕生日" colors={colors} />;
    case EventType.TV:
      return <IconLabel icon={HiTv} text="テレビ" colors={colors} />;
    case EventType.RADIO:
      return <IconLabel icon={HiRadio} text="ラジオ" colors={colors} />;
    case EventType.ON_DEMAND:
      return <IconLabel icon={HiVideoCamera} text="オンデマンド" colors={colors} />;
    case EventType.BOOK:
      return <IconLabel icon={HiBookOpen} text="書籍" colors={colors} />;
    case EventType.MAGAZINE:
      return <IconLabel icon={HiBookOpen} text="雑誌" colors={colors} />;
    case EventType.OTHER:
      return <IconLabel icon={HiBeaker} text="その他" colors={colors} />;
    default:
      assertNever(category);
  }
};

interface IconLabelProps {
  icon: IconType;
  text: string;
  colors: UiColors;
}

const IconLabel: React.FC<IconLabelProps> = (props: IconLabelProps) => {
  const { icon: Icon, text, colors } = props;

  return (
    <div className={clsx("inline-flex items-center gap-1.5 bg-white", "h-5 text-sm", colors.text)}>
      <Icon className="text-base" />
      <span className="font-semibold text-nowrap">{text}</span>
    </div>
  );
};
