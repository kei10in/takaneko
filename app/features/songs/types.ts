import { MemberName } from "~/routes/members/members";

export interface SongMetaDescriptor {
  slug: string;
  name: string;
  featuredMembers?: MemberName[] | undefined;
  officialSite?: string | undefined;
  youtube?: { text: string; videoId: string }[] | undefined;
}
