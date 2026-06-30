import { clsx } from "clsx";
import { FaCat, FaCrown, FaPenNib } from "react-icons/fa6";
import { GiCompactDisc, GiMicrophone } from "react-icons/gi";
import { HiSparkles, HiUser, HiUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";

interface BadgeProps {
  icon: IconType;
  text: string;
  color: string;
  large?: boolean;
}

interface IconChipProps {
  icon: IconType;
  text: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
}

const LightBlue = "text-blue-400";

const Nadeshiko = "text-nadeshiko-800";

const Black = "text-zinc-600";

const Amber = "text-amber-500";

const Violet = "text-violet-400";

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const { icon: Icon, text, color, large = false } = props;

  const sizeClass = large ? "h-5 text-sm px-1.5" : "h-4 text-xs px-1";

  return (
    <div
      className={clsx(
        "box-border inline-flex items-center justify-center gap-0.5 rounded-full border bg-white",
        sizeClass,
        color,
      )}
    >
      <Icon />
      <span className="text-nowrap">{text}</span>
    </div>
  );
};

const IconChip: React.FC<IconChipProps> = (props: IconChipProps) => {
  const { icon: Icon, text, backgroundColor, iconColor, textColor } = props;

  return (
    <div
      className={clsx(
        "flex h-4 items-center justify-center gap-0.5 rounded-full px-1 text-xs",
        backgroundColor,
      )}
    >
      <Icon className={iconColor} />
      <span className={clsx("text-nowrap", textColor)}>{text}</span>
    </div>
  );
};

interface LiveTypeBadgeProps {
  liveType: LiveType;
  large?: boolean;
  color?: string;
}

export const LiveTypeBadge: React.FC<LiveTypeBadgeProps> = ({
  liveType,
  large,
  color,
}: LiveTypeBadgeProps) => {
  if (liveType === LiveType.SOLO) {
    return <Badge icon={FaCrown} text="ワンマン" color={color ?? Nadeshiko} large={large} />;
  }
  if (liveType === LiveType.HOSTED) {
    return <Badge icon={FaPenNib} text="主催対バン" color={color ?? LightBlue} large={large} />;
  }
  if (liveType == LiveType.FESTIVAL || liveType == LiveType.JOINT || liveType == LiveType.GUEST) {
    return <Badge icon={HiUsers} text="対バン" color={color ?? Amber} large={large} />;
  }
  if (liveType == LiveType.EVENT_LIVE) {
    return <Badge icon={IoDiamond} text="イベント出演" color={color ?? Amber} large={large} />;
  }
  if (liveType == LiveType.RELEASE_EVENT) {
    return (
      <Badge icon={GiCompactDisc} text="リリースイベント" color={color ?? Violet} large={large} />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center rounded-full px-2 text-xs text-white",
        liveTypeColor(liveType),
      )}
    >
      {liveTypeLabel(liveType)}
    </div>
  );
};

interface LiveBadgeProps {
  large?: boolean;
  color?: string;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ large, color }: LiveBadgeProps) => {
  return <Badge icon={GiMicrophone} text="ライブ" color={color ?? Nadeshiko} large={large} />;
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

interface WithTextProps {
  text: string;
  large?: boolean;
  color?: string;
}

export const MeetAndGreetBadge: React.FC<WithTextProps> = ({
  text,
  large,
  color,
}: WithTextProps) => {
  return <Badge icon={FaCat} text={text} color={color ?? Black} large={large} />;
};

interface TextBadgeProps {
  text: string;
}

export const TextBadge: React.FC<TextBadgeProps> = ({ text }: TextBadgeProps) => {
  return (
    <div className="flex h-4 items-center rounded-full bg-zinc-100 px-2 text-xs text-zinc-600">
      {text}
    </div>
  );
};
