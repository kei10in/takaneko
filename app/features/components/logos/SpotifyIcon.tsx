type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet">;

export const SpotifyIcon = (props: Props) => {
  const { alt = "Spotify", className, ...rest } = props;

  return (
    <img
      {...rest}
      src="/logos/spotify-icon.png"
      alt={alt}
      className={`aspect-square ${className ?? ""}`}
    />
  );
};
