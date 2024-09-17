import { z } from "zod";

const OpenGraph = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
});

export type OpenGraph = z.infer<typeof OpenGraph>;

export const validateOpenGraph = (data: unknown): OpenGraph | undefined => {
  const v = OpenGraph.safeParse(data);
  if (!v.success) {
    return undefined;
  }

  return v.data;
};

const TwitterCard = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  url: z.string(),
});

export type TwitterCard = z.infer<typeof TwitterCard>;

export const validateTwitterCard = (data: unknown): TwitterCard | undefined => {
  const v = TwitterCard.safeParse(data);
  if (!v.success) {
    return undefined;
  }

  return v.data;
};

const SocialCards = z.object({
  ogp: OpenGraph.optional(),
  twitter: TwitterCard.optional(),
});

export type SocialCards = z.infer<typeof SocialCards>;

export const validateSocialCards = (data: unknown): SocialCards | undefined => {
  const v = SocialCards.safeParse(data);
  if (!v.success) {
    return undefined;
  }

  return v.data;
};
