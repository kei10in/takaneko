import { HiSparkles, HiUser } from "react-icons/hi2";

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
