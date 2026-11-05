interface Props {
  src: string;
}

export const YouTubeEmbedPlayer: React.FC<Props> = ({ src }: Props) => {
  return (
    // YouTube の公式プレイヤーの再生・認証機能を維持するため sandbox は指定しません。
    // oxlint-disable-next-line react/iframe-missing-sandbox
    <iframe
      className="aspect-video w-full"
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
};
