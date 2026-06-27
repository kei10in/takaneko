import { clsx } from "clsx";
import { BsClock } from "react-icons/bs";
import { HiOutlineMapPin } from "react-icons/hi2";
import {
  BookBadge,
  CdBadge,
  FashionShowBadge,
  LiveBadge,
  LiveTypeBadge,
  MagazineBadge,
  MeetAndGreetBadge,
  OtherBadge,
  RadioAppearanceBadge,
  ReleaseEventBadge,
  SalesOpenBadge,
  StreamingBadge,
  TvAppearanceBadge,
  VarietyEventBadge,
} from "~/components/SmallBadges";
import { EventType, eventTypeToColor, LiveType, MeetAndGreetType } from "../events/EventType";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  event: CalendarEvent;
}

export const CalendarEventItem: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const { category, liveType, summary, location, region } = event;
  const color = eventTypeToColor(category);
  const thumbnail = event.images?.[0]?.path;
  const time =
    category == EventType.TV || category == EventType.RADIO
      ? `${event.start} ～ ${event.end}`
      : undefined;

  return (
    <div className="@container overflow-hidden rounded-xl bg-white shadow-md">
      <div className="flex min-h-22 gap-2 pr-2">
        <div className={clsx("w-1 flex-none self-stretch rounded-full", color)} />
        {category == EventType.LIVE ? (
          <Live liveType={liveType} summary={summary} location={location} region={region} />
        ) : category == EventType.RELEASE_EVENT ? (
          <ReleaseEvent
            liveType={liveType}
            meetAndGreetTypes={event.meetAndGreetTypes}
            summary={summary}
            location={location}
            region={region}
          />
        ) : category == EventType.STREAMING || category == EventType.SALES_OPEN ? (
          <SimpleEvent category={category} summary={summary} />
        ) : category == EventType.TV || category == EventType.RADIO ? (
          <MediaAppearance category={category} summary={summary} time={time} />
        ) : category == EventType.CD ||
          category == EventType.BOOK ||
          category == EventType.MAGAZINE ? (
          <PublicationRelease category={category} summary={summary} />
        ) : (
          <OfflineEvent
            category={category}
            liveType={liveType}
            meetAndGreetTypes={event.meetAndGreetTypes}
            summary={summary}
            location={location}
            region={region}
          />
        )}
        {thumbnail && (
          <div className="py-2">
            <img
              className="aspect-4/3 h-20 overflow-hidden rounded-md object-cover"
              src={thumbnail}
              alt={summary}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface LiveProps {
  liveType: LiveType | undefined;
  summary: string;
  location?: string;
  region?: string;
}

const Live: React.FC<LiveProps> = (props: LiveProps) => {
  const { liveType, summary, location, region } = props;
  const place = location || region;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
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
      <div className="flex flex-wrap items-center gap-1">
        <LiveBadge large />
        {liveType != undefined && <LiveTypeBadge liveType={liveType} large />}
      </div>
    </div>
  );
};

interface ReleaseEventProps {
  liveType: LiveType | undefined;
  meetAndGreetTypes: MeetAndGreetType[];
  summary: string;
  location?: string;
  region?: string;
}

const ReleaseEvent: React.FC<ReleaseEventProps> = (props: ReleaseEventProps) => {
  const { liveType, meetAndGreetTypes, summary, location, region } = props;
  const place = location || region;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
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
      <div className="flex flex-wrap items-center gap-1">
        <ReleaseEventBadge large />
        {liveType != undefined && <LiveBadge large />}
        {meetAndGreetTypes.map((type) => (
          <MeetAndGreetBadge key={type} text={type} large />
        ))}
      </div>
    </div>
  );
};

interface OfflineEventProps {
  category: EventType;
  liveType: LiveType | undefined;
  meetAndGreetTypes: MeetAndGreetType[];
  summary: string;
  location?: string;
  region?: string;
}

const OfflineEvent: React.FC<OfflineEventProps> = (props: OfflineEventProps) => {
  const { category, liveType, meetAndGreetTypes, summary, location, region } = props;
  const place = location || region;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
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
      <div className="flex flex-wrap items-center gap-1">
        {category === EventType.VARIETY && <VarietyEventBadge large />}
        {category === EventType.FASHION && <FashionShowBadge large />}
        {category === EventType.OTHER && <OtherBadge text="その他" large />}
        {meetAndGreetTypes.map((type) => (
          <MeetAndGreetBadge key={type} text={type} large />
        ))}
        {liveType != undefined && <LiveBadge large />}
      </div>
    </div>
  );
};

interface MediaAppearanceProps {
  category: "TV" | "RADIO";
  summary: string;
  time?: string | undefined;
}

const MediaAppearance: React.FC<MediaAppearanceProps> = (props: MediaAppearanceProps) => {
  const { category, summary, time } = props;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
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
      <div>
        {category == "TV" && <TvAppearanceBadge large />}
        {category == "RADIO" && <RadioAppearanceBadge large />}
      </div>
    </div>
  );
};

interface PublicationReleaseProps {
  category: "CD" | "BOOK" | "MAGAZINE";
  summary: string;
}

const PublicationRelease: React.FC<PublicationReleaseProps> = (props: PublicationReleaseProps) => {
  const { category, summary } = props;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {category == "CD" && <CdBadge large />}
        {category == "BOOK" && <BookBadge large />}
        {category == "MAGAZINE" && <MagazineBadge large />}
      </div>
    </div>
  );
};

interface SimpleEventProps {
  category: EventType;
  summary: string;
}

const SimpleEvent: React.FC<SimpleEventProps> = (props: SimpleEventProps) => {
  const { category, summary } = props;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
      <p className="line-clamp-2 leading-snug font-semibold">{summary}</p>
      <div>
        {category == EventType.STREAMING && <StreamingBadge large />}
        {category == EventType.SALES_OPEN && <SalesOpenBadge large />}
        {category == EventType.CD && <CdBadge large />}
        {category == EventType.BOOK && <BookBadge large />}
        {category == EventType.MAGAZINE && <MagazineBadge large />}
        {category == EventType.TV && <TvAppearanceBadge large />}
        {category == EventType.RADIO && <RadioAppearanceBadge large />}
        {category == EventType.FASHION && <FashionShowBadge large />}
        {category == EventType.VARIETY && <VarietyEventBadge large />}
        {category == EventType.OTHER && <OtherBadge text="その他" large />}
      </div>
    </div>
  );
};
