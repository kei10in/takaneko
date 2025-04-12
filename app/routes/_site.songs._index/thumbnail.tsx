import { BsMusicNoteBeamed } from "react-icons/bs";
import { SongMetaDescriptor } from "~/features/songs/types";
import { youtubeImage } from "~/utils/youtubeImage";

interface Props {
  track: SongMetaDescriptor;
}

export const Thumbnail: React.FC<Props> = (props: Props) => {
  const { track } = props;

  if (track.youtube?.[0] != undefined) {
    return (
      <img
        src={youtubeImage(track.youtube[0].videoId).mqDefault.url}
        alt={track.name}
        width={160}
        height={90}
        className="bg-nadeshiko-300 h-[5.625rem] w-40 object-contain"
      />
    );
  }

  if (track.image != undefined) {
    return (
      <img
        src={track.image.path}
        alt={track.name}
        width={160}
        height={90}
        className="bg-nadeshiko-300 h-[5.625rem] w-40 object-contain"
      />
    );
  }

  return (
    <div className="flex h-[5.625rem] w-40 items-center justify-center bg-gray-100">
      <BsMusicNoteBeamed className="h-12 w-12 text-gray-300" />
    </div>
  );
};
