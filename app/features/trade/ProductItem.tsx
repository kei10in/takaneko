import clsx from "clsx";

interface Props {
  content: string;
  description: string;
  selected?: boolean;
}

export const ProductItem: React.FC<Props> = (props: Props) => {
  const { content, description, selected = false } = props;

  return (
    <div
      className={clsx(
        "group w-full border-l-2 border-transparent py-1 pl-3.5 pr-4 text-left text-gray-900",
        "hover:border-gray-300 data-[selected]:border-nadeshiko-800",
      )}
      data-selected={selected ? "true" : undefined}
    >
      <p className="text-sm leading-tight">{content}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};
