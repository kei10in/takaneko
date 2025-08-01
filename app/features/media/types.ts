import { ImageDescription } from "~/utils/types/ImageDescription";
import { MemberName } from "../profile/members";

export interface YouTubeVideoDescriptor {
  videoId: string;
  publishedAt: string;
  presents: MemberName[];
  officialTwitter?: string;
}

export interface OgpMediaDescriptor {
  mediaUrl: string;
  publishedAt: string;

  title?: string;
  siteName?: string;
  image?: ImageDescription;

  category: "video" | "article" | "audio";
  presents: MemberName[];
  officialTwitter?: string;
}

export interface StaticMediaDescriptor {
  title: string;
  authorName: string;
  publishedAt: string;
  mediaUrl: string;
  image: ImageDescription;
  category: "video" | "article" | "audio";
  presents: MemberName[];
  officialTwitter?: string;
}

export type MediaDescriptor =
  | ({ kind: "youtube" } & YouTubeVideoDescriptor)
  | ({ kind: "ogp" } & OgpMediaDescriptor)
  | ({ kind: "static" } & StaticMediaDescriptor);

export interface MediaDetails {
  kind: "youtube" | "ogp" | "static";
  key: string;
  title: string;
  authorName: string;
  publishedAt: string;
  mediaUrl: string;
  imageUrl: string;
  category: "video" | "article" | "audio" | "youtube";
  presents: MemberName[];
  deleted?: boolean | undefined;
}
