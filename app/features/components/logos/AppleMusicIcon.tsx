type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet">;

export const AppleMusicIcon = (props: Props) => {
  const { alt = "Apple Music", className, ...rest } = props;

  return (
    <img
      {...rest}
      src="/logos/apple-music-standard.svg"
      alt={alt}
      className={`aspect-square ${className ?? ""}`}
    />
  );
};
