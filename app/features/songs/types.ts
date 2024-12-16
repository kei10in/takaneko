import { MemberName } from "~/routes/members/members";

export interface TrackMetaDescriptor {
  slug: string;
  name: string;
  featuredMembers?: MemberName[] | undefined;
  officialSite?: string | undefined;
  youtube?: string | undefined;
  dancePractices?: string | string[] | undefined;
}
