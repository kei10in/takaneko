interface Props {
  image: string;
  imageSet?: string;
  title: string;
  description?: string | undefined;
}

export const SquareCard: React.FC<Props> = (props: Props) => {
  const { image, imageSet, title, description } = props;

  return (
    <div className="w-full space-y-2">
      <div className="aspect-square w-full">
        <img src={image} srcSet={imageSet} alt={title} className="h-full w-full object-contain" />
      </div>
      <div>
        <p className="line-clamp-3 text-center text-sm leading-tight text-neutral-600">{title}</p>
        {description && (
          <p className="line-clamp-3 text-center text-xs leading-tight text-neutral-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
