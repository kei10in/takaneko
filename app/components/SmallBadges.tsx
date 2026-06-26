import { clsx } from "clsx";
import { HiSparkles, HiUser } from "react-icons/hi2";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";

export const FirstPerformanceBadge: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-0.5 rounded-full bg-zinc-100 px-1 text-xs">
      <HiSparkles className="text-yellow-500" />
      <span className="text-nowrap text-zinc-600">初披露</span>
    </div>
  );
};

interface CoverBadgeProps {
  originalArtist: string;
}

export const CoverBadge: React.FC<CoverBadgeProps> = ({ originalArtist }: CoverBadgeProps) => {
  return (
    <div className="flex items-center justify-center gap-0.5 rounded-full bg-zinc-100 px-1 text-xs">
      <HiUser className="text-zinc-600" />
      <span className="text-nowrap text-zinc-600">{originalArtist}</span>
    </div>
  );
};

interface LiveTypeBadgeProps {
  liveType: LiveType;
}

export const LiveTypeBadge: React.FC<LiveTypeBadgeProps> = ({ liveType }: LiveTypeBadgeProps) => {
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

interface TextBadgeProps {
  text: string;
}

export const TextBadge: React.FC<TextBadgeProps> = ({ text }: TextBadgeProps) => {
  return (
    <div className="flex items-center rounded-full bg-zinc-100 px-2 text-xs text-zinc-600">
      {text}
    </div>
  );
};
