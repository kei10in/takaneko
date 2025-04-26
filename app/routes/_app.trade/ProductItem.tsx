import { clsx } from "clsx";

interface Props {
  image: string;
  imageSet?: string;
  year: number;
  content: string;
  description: string;
  selected?: boolean;
}

export const ProductItem: React.FC<Props> = (props: Props) => {
  const { image, imageSet, year, content, description, selected = false } = props;

  return (
    <div
      className={clsx(
        "outline-nadeshiko-800 w-40 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white data-selected:outline",
      )}
      data-selected={selected ? "true" : undefined}
    >
      <div className="h-32 w-full">
        <img src={image} srcSet={imageSet} alt="product" className="h-full w-full object-contain" />
      </div>
      <div className="flex h-20 flex-col justify-center space-y-0.5 bg-gray-50 px-2">
        <p className="border-nadeshiko-800 text-nadeshiko-800 w-fit border px-2 py-px text-xs leading-none">
          {year}
        </p>
        <p className="line-clamp-2 text-sm leading-tight">{content}</p>
        <p className="line-clamp-1 text-xs leading-tight text-gray-400">{description}</p>
      </div>
    </div>
  );
};
