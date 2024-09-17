import ogs from "open-graph-scraper";
import { OgObject } from "open-graph-scraper/types";
import { OpenGraph, SocialCards, TwitterCard } from "./metaData";

export const ogp = async (url: string): Promise<SocialCards> => {
  const { error, result } = await ogs({ url: url });
  if (error) {
    return {};
  }

  return convertOgObjectToSocialCards(result);
};

const convertOgObjectToSocialCards = (og: OgObject): SocialCards => {
  const ogp = convertOgObjectToOgp(og);
  const twitter = convertOgObjectToTwitterCard(og);

  return { ogp, twitter };
};

const convertOgObjectToOgp = (og: OgObject): OpenGraph | undefined => {
  if (og.ogTitle === undefined) {
    return;
  }

  if (og.ogDescription === undefined) {
    return;
  }

  if (og.ogImage === undefined) {
    return;
  }

  if (og.ogImage?.length === 0) {
    return;
  }

  if (og.requestUrl === undefined) {
    return;
  }

  return {
    title: og.ogTitle,
    description: og.ogDescription,
    image: og.ogImage[0].url,
    url: og.requestUrl,
  };
};

const convertOgObjectToTwitterCard = (og: OgObject): TwitterCard | undefined => {
  if (og.twitterTitle === undefined) {
    return;
  }

  if (og.twitterDescription === undefined) {
    return;
  }

  if (og.twitterImage === undefined) {
    return;
  }

  if (og.twitterImage?.length === 0) {
    return;
  }

  if (og.requestUrl === undefined) {
    return;
  }

  return {
    title: og.twitterTitle,
    description: og.twitterDescription,
    image: og.twitterImage[0].url,
    url: og.requestUrl,
  };
};
