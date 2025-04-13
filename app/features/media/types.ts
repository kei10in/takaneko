import { ImageDescription } from "~/utils/types/ImageDescription";
import { MemberName, MemberNameOrGroup } from "../members/members";

export interface YouTubeVideoDescriptor {
  videoId: string;
  publishedAt: string;
  presents?: MemberNameOrGroup[];
}

export interface OgpMediaDescriptor {
  mediaUrl: string;
  publishedAt: string;

  title?: string;
  siteName?: string;
  image?: ImageDescription;
  presents?: MemberName[];
}

export interface StaticMediaDescriptor {
  title: string;
  authorName: string;
  publishedAt: string;
  mediaUrl: string;
  image: ImageDescription;
  presents?: MemberName[];
}

export type MediaDescriptor =
  | ({ kind: "youtube" } & YouTubeVideoDescriptor)
  | ({ kind: "ogp" } & OgpMediaDescriptor)
  | ({ kind: "static" } & StaticMediaDescriptor);

export interface MediaMetadata {
  kind: "youtube" | "ogp" | "static";
  title: string;
  authorName: string;
  publishedAt: string;
  mediaUrl: string;
  imageUrl: string;
  presents?: MemberName[];
}
