type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet">;

export const YouTubeMusicIcon = (props: Props) => {
  const { alt = "YouTube Music", className, ...rest } = props;

  return (
    <img
      {...rest}
      src="/logos/youtube-music-icon.svg"
      alt={alt}
      className={`aspect-square ${className ?? ""}`}
    />
  );
};
