import React from "react";

interface Props {
  image?: string | undefined;
  imageSet?: string;
  fallback?: React.ReactNode;
  title: string;
  description?: string | undefined;
}

export const SquareCard: React.FC<Props> = (props: Props) => {
  const {
    image,
    imageSet,
    fallback = <img src="icon.svg" alt="サムネイルがありません" />,
    title,
    description,
  } = props;

  return (
    <div className="w-full space-y-2">
      <div className="aspect-square w-full">
        {image == undefined && (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 *:h-1/3 *:w-1/3">
            {fallback}
          </div>
        )}
        {image && (
          <img src={image} srcSet={imageSet} alt={title} className="h-full w-full object-contain" />
        )}
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
