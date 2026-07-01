import { clsx } from "clsx";
import { FaCrown, FaPenNib } from "react-icons/fa6";
import { GiCompactDisc, GiMicrophone } from "react-icons/gi";
import { HiUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";

interface BadgeProps {
  icon: IconType;
  text: string;
  color: string;
  large?: boolean;
}

const LightBlue = "text-blue-400";

const Nadeshiko = "text-nadeshiko-800";

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
