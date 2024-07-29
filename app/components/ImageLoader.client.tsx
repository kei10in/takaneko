import ContentLoader from "react-content-loader";

interface Props {
  width: number;
  height: number;
}

export const ImageLoader: React.FC<Props> = (props: Props) => {
  const { width, height } = props;

  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width={width} height={height} />
    </ContentLoader>
  );
};
