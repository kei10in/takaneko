interface Props {
  width: number;
  height: number;
}

export const ImageLoader: React.FC<Props> = (props: Props) => {
  const { width, height } = props;

  return <div className="animate-pulse rounded-sm bg-gray-200" style={{ width, height }} />;
};
