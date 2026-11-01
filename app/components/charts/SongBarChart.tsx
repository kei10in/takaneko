import { clsx } from "clsx";
import { BsChevronRight, BsMusicNoteBeamed } from "react-icons/bs";
import { Link } from "react-router";
import { calculateChartDimensions } from "./scale.ts";

interface Props {
  songs: {
    slug: string;
    title: string;
    coverArt?: string;
    value: number;
  }[];
}

export const SongBarChart: React.FC<Props> = ({ songs }: Props) => {
  const maxValue = Math.max(...songs.map((item) => item.value));

  const { limit } = calculateChartDimensions(maxValue);

  return (
    <div className="w-full space-y-2.5">
      {songs.map((item) => {
        const { value, title, slug, coverArt } = item;
        const to = `/songs/${slug}/stats`;

        return (
          <Link to={to} key={slug} className="group block rounded">
            <div className="flex w-full items-center gap-2 text-sm leading-tight">
              <div className="flex flex-none items-center justify-center overflow-hidden rounded shadow">
                {coverArt ? (
                  <img
                    className="h-8 w-8 bg-zinc-100 object-cover text-xs text-zinc-500"
                    src={coverArt}
                    alt={title}
                  />
                ) : (
                  <div
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center",
                      slug && "bg-nadeshiko-200 text-nadeshiko-600",
                      !slug && "bg-zinc-100 text-zinc-500",
                    )}
                  >
                    <BsMusicNoteBeamed className="h-4 w-4 flex-none" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-auto space-y-0.5">
                <p className="flex justify-between">
                  <span className="line-clamp-1 text-zinc-500">{title}</span>
                  <span className="text-zinc-900">{value}</span>
                </p>
                <div className="h-3 overflow-hidden rounded-xs bg-zinc-100">
                  <div
                    className="h-full rounded-xs bg-nadeshiko-900"
                    style={{ width: `${(value / limit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-none">
                <div className="flex items-center rounded-full p-1.5 text-zinc-500 group-hover:bg-zinc-100">
                  <BsChevronRight className="text-zinc-500" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
