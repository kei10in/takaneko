import { findMemberDescription, MemberName } from "~/features/members/members";

interface Props {
  member: MemberName;
  className?: string;
  size?: number | string;
}

export const MemberIcon = (props: Props) => {
  const { size, member, className } = props;

  const md = findMemberDescription(member);

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
