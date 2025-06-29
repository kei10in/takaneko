import { SongMetaDescriptor } from "~/features/songs/types";

interface Props {
  song: SongMetaDescriptor;
}

export const Credit: React.FC<Props> = (props: Props) => {
  const { song } = props;

  const creditItems = [
    { label: "作詞", value: song.lyricsBy },
    { label: "作曲", value: song.composedBy },
    { label: "編曲", value: song.arrangedBy },
  ];

  if (song.choreographedBy != undefined) {
    creditItems.push({ label: "振付", value: song.choreographedBy });
  }

  return (
    <div className="">
      {creditItems.map((item, index) => (
        <p key={index} className="text-sm leading-normal text-gray-500">
          {item.label}: {item.value}
        </p>
      ))}
    </div>
  );
};
