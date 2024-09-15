interface Props {
  images: { src: string; alt: string }[];
}

export const ImageSlide: React.FC<Props> = (props: Props) => {
  const { images } = props;

  return (
    <div className="space-y-2">
      {images.map((image, i) => (
        <div key={i} className="w-full bg-gray-50">
          <img className="aspect-square w-full object-contain" src={image.src} alt={image.alt} />
        </div>
      ))}
    </div>
  );
};
