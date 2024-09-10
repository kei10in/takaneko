import { z } from "zod";

const NewsPost = z.object({
  id: z.number(),
  date: z.string(),
  slug: z.string(),
  type: z.string(),
  link: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  excerpt: z.object({
    rendered: z.string(),
  }),
});

const NewsPostsList = z.array(NewsPost);

export type NewsPost = z.infer<typeof NewsPost>;
export type NewsPostsList = z.infer<typeof NewsPostsList>;

export const validateNewsPost = (obj: unknown): NewsPost | undefined => {
  const r = NewsPost.safeParse(obj);

  if (r.success) {
    return r.data;
  } else {
    return undefined;
  }
};

export const validateNewsPostsList = (obj: unknown): NewsPostsList | undefined => {
  const r = NewsPostsList.safeParse(obj);

  if (r.success) {
    return r.data;
  } else {
    return undefined;
  }
};
