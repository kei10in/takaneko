import { MemberName } from "~/routes/members/members";
import { ImageDescription } from "~/utils/types/ImageDescription";

export interface SongMetaDescriptor {
  slug: string;
  name: string;
  image?: ImageDescription | undefined;
  featuredMembers?: MemberName[] | undefined;
  officialSite?: string | undefined;
  youtube?: { text: string; videoId: string }[] | undefined;
  linkcore?: string;
  linkfire?: string;
}
