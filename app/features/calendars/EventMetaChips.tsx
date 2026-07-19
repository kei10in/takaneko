import { LiveChip, LiveTypeChip, MeetAndGreetChip } from "~/components/IconChip";
import { EventType, eventTypeColors, LiveType, MeetAndGreetType } from "../events/EventType";

interface Props {
  className?: string;
  category: EventType;
  liveType: LiveType | undefined;
  meetAndGreetTypes: MeetAndGreetType[];
}

export const EventMetaChips: React.FC<Props> = (props: Props) => {
  const { className, category, liveType, meetAndGreetTypes } = props;

  if (category == EventType.LIVE) {
    return (
      <div className={`flex flex-wrap items-center gap-1 ${className ?? ""}`}>
        {liveType != undefined && <LiveTypeChip liveType={liveType} large />}
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
