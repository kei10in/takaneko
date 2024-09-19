import clsx from "clsx";

interface Props {
  image: string;
  content: string;
  description: string;
  selected?: boolean;
}

export const ProductItem: React.FC<Props> = (props: Props) => {
  const { image, content, description, selected = false } = props;

  return (
    <div
      className={clsx(
        "w-40 divide-y overflow-hidden rounded-xl border bg-white outline-nadeshiko-800 data-[selected]:outline",
      )}
      data-selected={selected ? "true" : undefined}
    >
      <div className="h-32 w-full">
        <img src={image} alt="product" className="h-full w-full object-contain" />
      </div>
      <div className="flex h-16 flex-col justify-center bg-gray-50 px-2">
        <p className="line-clamp-2 text-sm leading-tight">{content}</p>
        <p className="line-clamp-1 text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};
