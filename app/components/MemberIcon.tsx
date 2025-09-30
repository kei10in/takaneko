import { findMemberDescription } from "~/features/profile/members";
import { TakanenoNadeshikoBase } from "~/features/profile/takaneno-nadeshiko";
import { MemberIdOrAll } from "~/features/profile/types";

interface Props {
  member: MemberIdOrAll;
  className?: string;
  size?: number | string;
}

export const MemberIcon = (props: Props) => {
  const { size, member, className } = props;

  const md = member === "all" ? TakanenoNadeshikoBase : findMemberDescription(member);

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
