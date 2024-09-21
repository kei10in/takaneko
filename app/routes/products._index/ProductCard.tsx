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
    <div className="overflow-hidden bg-white">
      <div className="flex-0 aspect-square w-full bg-gray-50">
        <img src={url} alt={series ?? id} className="h-full w-full object-contain object-center" />
      </div>
      <div className="space-y-1 px-1 py-2">
        <div className="w-fit border border-nadeshiko-800 px-2 py-px text-sm leading-none text-nadeshiko-800">
          {year}
        </div>
        <p className="text-sm">{name}</p>
      </div>
    </div>
  );
};
