import { MemberName, MemberNameOrGroup } from "../members/members";

export interface YouTubeVideoDescriptor {
  videoId: string;
  publishedAt: string;
  presents?: MemberNameOrGroup[];
}

export interface YouTubeVideoMetadata {
  kind: "youtube";
  videoId: string;
  title: string;
  channelTitle: string;
  channelUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  presents: MemberName[];
}
