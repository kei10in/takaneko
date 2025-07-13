import { BsMusicNoteBeamed } from "react-icons/bs";
import { SongMeta } from "~/features/songs/SongMeta";
import { SongMetaDescriptor } from "~/features/songs/types";

interface Props {
  track: SongMetaDescriptor;
}

export const Thumbnail: React.FC<Props> = (props: Props) => {
  const { track } = props;

  const youtubeImage = SongMeta.youtubeImage(track);

  if (youtubeImage != undefined) {
    return (
      <img
        src={youtubeImage.mqDefault.url}
        alt={track.name}
        width={160}
        height={90}
        className="bg-nadeshiko-100 text-nadeshiko-600 aspect-video w-full object-cover text-xs"
      />
    );
  }

  return (
    <div className="flex h-[5.625rem] w-40 items-center justify-center bg-gray-100">
      <BsMusicNoteBeamed className="h-12 w-12 text-gray-300" />
    </div>
  );
};
