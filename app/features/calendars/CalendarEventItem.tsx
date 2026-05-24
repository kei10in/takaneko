import { clsx } from "clsx";
import { BsClock, BsPinMap } from "react-icons/bs";
import { EventType, eventTypeToColor, eventTypeToEmoji } from "../events/EventType";

interface Props {
  category: EventType;
  summary: string;
  location?: string;
  region?: string;
  thumbnail?: string;
  time?: string | undefined;
}

export const CalendarEventItem: React.FC<Props> = (props: Props) => {
  const { category, summary, location, region, thumbnail, time } = props;
  const color = eventTypeToColor(category);

  const place = location || region;

  return (
    <div className="@container overflow-hidden rounded-xl bg-white shadow-md">
      <div className="flex min-h-22 gap-2 pr-2">
        <div className={clsx("w-1 flex-none self-stretch rounded-full", color)} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 py-2">
          <p className="space-x-1">
            <span>{eventTypeToEmoji(category)}</span>
            <span>{summary}</span>
          </p>
          <div>
            {place && (
              <p className="flex items-center px-0.5 text-sm text-gray-400">
                <span className="mr-1">
                  <BsPinMap />
                </span>
                <span>{place}</span>
              </p>
            )}
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
