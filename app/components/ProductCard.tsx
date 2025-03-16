interface Props {
  id: string;
  name: string;
  series?: string;
  year: number;
  url: string;
}

export const ProductCard: React.FC<Props> = (props: Props) => {
  const { id, name, series, year, url } = props;

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="aspect-square w-full flex-0">
        <img src={url} alt={series ?? id} className="h-full w-full object-contain object-center" />
      </div>
      <div className="space-y-1 bg-gray-50 px-4 py-2">
        <div className="border-nadeshiko-800 text-nadeshiko-800 w-fit border px-2 py-px text-sm leading-none">
          {year}
        </div>
        <p className="text-sm">{name}</p>
      </div>
    </div>
  );
};
