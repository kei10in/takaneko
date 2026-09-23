import { clsx } from "clsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";

interface Props {
  image: string;
  year: number;
  content: string;
  description: string;
  selected?: boolean;
}

export const RandomGoodsCard: React.FC<Props> = (props: Props) => {
  const { image, year, content, description, selected = false } = props;

  return (
    <div
      className={clsx(
        "group overflow-hidden rounded-2xl border border-zinc-100 shadow-md outline-nadeshiko-800 data-selected:outline-2",
      )}
      data-selected={selected ? "true" : undefined}
    >
      <div className="m-2 h-48 overflow-hidden rounded-lg bg-zinc-100 p-4">
        <ThumbnailImage src={image} alt="product" className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col space-y-0.5 px-2 pt-2 pb-6">
        <p className="line-clamp-3 text-sm leading-tight">{content}</p>
        <p className="line-clamp-1 text-xs leading-tight text-gray-400">{description}</p>
        <p className="w-fit border border-nadeshiko-800 px-2 py-px text-xs leading-none text-nadeshiko-800">
          {year}
        </p>
      </div>
    </div>
  );
};
