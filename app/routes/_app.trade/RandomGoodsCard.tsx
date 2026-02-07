import { clsx } from "clsx";

interface Props {
  image: string;
  imageSet?: string;
  year: number;
  content: string;
  description: string;
  selected?: boolean;
}

export const RandomGoodsCard: React.FC<Props> = (props: Props) => {
  const { image, imageSet, year, content, description, selected = false } = props;

  return (
    <div
      className={clsx("group rounded-lg outline-nadeshiko-800 data-selected:outline-2")}
      data-selected={selected ? "true" : undefined}
    >
      <div className="aspect-square w-full">
        <img src={image} srcSet={imageSet} alt="product" className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col space-y-0.5 px-1 py-1">
        <p className="line-clamp-3 text-sm leading-tight">{content}</p>
        <p className="line-clamp-1 text-xs leading-tight text-gray-400">{description}</p>
        <p className="w-fit border border-nadeshiko-800 px-2 py-px text-xs leading-none text-nadeshiko-800">
          {year}
        </p>
      </div>
    </div>
  );
};
