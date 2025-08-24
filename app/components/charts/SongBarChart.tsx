import { clsx } from "clsx";
import { BsChevronRight, BsMusicNoteBeamed } from "react-icons/bs";
import { Link } from "react-router";
import { SongMetaDescriptor } from "~/features/songs/types";
import { calculateChartDimensions } from "./scale";

interface Props {
  data: {
    song: SongMetaDescriptor;
    value: number;
  }[];
}

export const SongBarChart: React.FC<Props> = ({ data }: Props) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  const { limit } = calculateChartDimensions(maxValue);

  return (
    <div className="w-full space-y-2.5">
      {data.map((item) => {
        const { value, song } = item;
        const { name, slug, coverArt } = song;
        const to = `/songs/${slug}`;

        return (
          <Link to={to} key={slug} className="group block">
            <div className="flex w-full items-center gap-2 text-sm leading-tight">
              <div className="flex flex-none items-center justify-center overflow-hidden rounded shadow">
                {coverArt ? (
                  <img
                    className="h-8 w-8 bg-gray-100 object-cover text-xs text-gray-500"
                    src={coverArt}
                    alt={name}
                  />
                ) : (
                  <div
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center",
                      slug && "bg-nadeshiko-200 text-nadeshiko-600",
                      !slug && "bg-gray-100 text-gray-500",
                    )}
                  >
                    <BsMusicNoteBeamed className="h-4 w-4 flex-none" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-auto space-y-0.5">
                <p className="flex justify-between text-gray-500">
                  <span className="line-clamp-1">{name}</span>
                  <span className="text-nadeshiko-800 font-semibold">{value}</span>
                </p>
                <div className="h-3 overflow-hidden rounded-xs bg-gray-100">
                  <div
                    className="bg-nadeshiko-800 h-full rounded-xs"
                    style={{ width: `${(value / limit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-none">
                <div className="flex items-center rounded-full p-1.5 text-gray-500 group-hover:bg-gray-100">
                  <BsChevronRight className="text-gray-500" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
