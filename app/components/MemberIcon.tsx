import { findIdPhoto } from "~/features/profile/profile";
import { MemberIdOrAll } from "~/features/profile/types";

interface Props {
  member: MemberIdOrAll;
  className?: string;
  size?: number | string;
}

export const MemberIcon = (props: Props) => {
  const { size, member, className } = props;

  const md = findIdPhoto(member);

  return (
    <span className={className}>
      <img
        src={md.idPhoto.path}
        alt={md.name}
        width={size}
        height={size}
        className="inline aspect-square rounded-full object-cover"
      />
    </span>
  );
};
