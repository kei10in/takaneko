import { LiveCategoryChip, LiveChip, MeetAndGreetChip } from "~/components/IconChip.tsx";
import { getLiveCategory } from "~/features/events/LiveCategory.ts";
import { EventType, eventTypeColors, LiveType, MeetAndGreetType } from "../events/EventType.ts";

interface Props {
  className?: string;
  category: EventType;
  liveType: LiveType | undefined;
  meetAndGreetTypes: MeetAndGreetType[];
}

export const EventMetaChips: React.FC<Props> = (props: Props) => {
  const { className, category, liveType, meetAndGreetTypes } = props;

  if (category == EventType.LIVE) {
    const liveCategory = liveType == undefined ? undefined : getLiveCategory(liveType);

    return (
      <div className={`flex flex-wrap items-center gap-1 ${className ?? ""}`}>
        {liveCategory != undefined && <LiveCategoryChip liveCategory={liveCategory} large />}
      </div>
    );
  }

  const iconColor = eventTypeColors(category).text;

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className ?? ""}`}>
      {liveType != undefined && <LiveChip iconColor={iconColor} large />}
      {meetAndGreetTypes.map((type) => (
        <MeetAndGreetChip key={type} meetAndGreetType={type} iconColor={iconColor} large />
      ))}
    </div>
  );
};
