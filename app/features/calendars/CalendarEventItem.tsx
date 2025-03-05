import { clsx } from "clsx";
import { HiMapPin } from "react-icons/hi2";
import { categoryToColor, categoryToEmoji, EventType } from "../events/EventType";

interface Props {
  category: EventType;
  summary: string;
  location?: string;
  region?: string;
}

export const CalendarEventItem: React.FC<Props> = (props: Props) => {
  const { category, summary, location, region } = props;
  const color = categoryToColor(category);

  const place = location || region;

  return (
    <div className="flex min-h-12 items-center gap-2 p-2">
      <div className={clsx("w-1 flex-none self-stretch rounded-full", color)} />
      <div>
        <p className="space-x-1">
          <span>{categoryToEmoji(category)}</span>
          <span>{summary}</span>
        </p>
        {place && (
          <p className="flex items-center px-0.5 text-sm text-gray-400">
            <span className="mr-1">
              <HiMapPin />
            </span>
            <span>{place}</span>
          </p>
        )}
      </div>
    </div>
  );
};
