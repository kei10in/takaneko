import { clsx } from "clsx";
import { FaCat, FaCrown, FaPenNib } from "react-icons/fa6";
import { GiCompactDisc, GiMicrophone } from "react-icons/gi";
import { HiSparkles, HiUser, HiUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType } from "~/features/events/EventType";

interface IconChipProps {
  icon: IconType;
  text: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
  large?: boolean;
}

export const IconChip: React.FC<IconChipProps> = (props: IconChipProps) => {
  const { icon: Icon, text, backgroundColor, iconColor, textColor, large = false } = props;

  const sizeClass = large ? "h-5 px-1.5 text-sm" : "h-4 px-1 text-xs";

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-0.5 rounded-full",
        sizeClass,
        backgroundColor,
      )}
    >
      <Icon className={iconColor} />
      <span className={clsx("text-nowrap", textColor)}>{text}</span>
    </div>
  );
};

interface LiveChipProps {
  iconColor: string;
  large?: boolean;
}

export const LiveChip: React.FC<LiveChipProps> = ({ iconColor, large = false }: LiveChipProps) => {
  const backgroundColor = "bg-zinc-100";
  const textColor = "text-zinc-800";

  return (
    <IconChip
      icon={GiMicrophone}
      text="ライブ"
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
      large={large}
    />
  );
};

export const LiveTypeChip: React.FC<{ liveType: LiveType; large?: boolean }> = ({
  liveType,
  large = false,
}: {
  liveType: LiveType;
  large?: boolean;
}) => {
  const backgroundColor = "bg-zinc-100";
  const iconColor = "text-nadeshiko-800";
  const textColor = "text-zinc-700";

  const LIVE_TYPE_METADATA = {
    [LiveType.SOLO]: { icon: FaCrown, text: "ワンマン" },
    [LiveType.HOSTED]: { icon: FaPenNib, text: "主催対バン" },
    [LiveType.FESTIVAL]: { icon: HiUsers, text: "対バン" },
    [LiveType.JOINT]: { icon: HiUsers, text: "対バン" },
    [LiveType.GUEST]: { icon: HiUsers, text: "対バン" },
    [LiveType.EVENT_LIVE]: { icon: IoDiamond, text: "イベント出演" },
    [LiveType.RELEASE_EVENT]: { icon: GiCompactDisc, text: "リリースイベント" },
  } as const;

  const liveTypeProps = LIVE_TYPE_METADATA[liveType];
  if (!liveTypeProps) {
    return null;
  }

  return (
    <IconChip
      icon={liveTypeProps.icon}
      text={liveTypeProps.text}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
      large={large}
    />
  );
};

export const FirstPerformanceBadge: React.FC = () => {
  return (
    <IconChip
      icon={HiSparkles}
      text="初披露"
      backgroundColor="bg-zinc-100"
      iconColor="text-yellow-400"
      textColor="text-zinc-700"
    />
  );
};

interface CoverBadgeProps {
  originalArtist: string;
}

export const CoverBadge: React.FC<CoverBadgeProps> = ({ originalArtist }: CoverBadgeProps) => {
  return (
    <IconChip
      icon={HiUser}
      text={originalArtist}
      backgroundColor="bg-zinc-100"
      iconColor="text-zinc-500"
      textColor="text-zinc-500"
    />
  );
};

interface MeetAndGreetChipProps {
  text: string;
  iconColor?: string;
  large?: boolean;
}

export const MeetAndGreetChip: React.FC<MeetAndGreetChipProps> = ({
  text,
  iconColor = "text-zinc-700",
  large,
}: MeetAndGreetChipProps) => {
  const backgroundColor = "bg-zinc-100";
  const textColor = "text-zinc-700";

  return (
    <IconChip
      icon={FaCat}
      text={text}
      backgroundColor={backgroundColor}
      iconColor={iconColor}
      textColor={textColor}
      large={large}
    />
  );
};
