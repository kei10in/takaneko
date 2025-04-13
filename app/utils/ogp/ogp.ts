import urlMetadata from "url-metadata";
import { OpenGraph, SocialCards, TwitterCard } from "./metaData";

export const ogp = async (url: string): Promise<SocialCards> => {
  try {
    const response = await fetch(url);
    const metadata = await urlMetadata(null, { parseResponseObject: response });
    const result = convertOgObjectToSocialCards(metadata);
    return result;
  } catch (e) {
    return {};
  }
};

const convertOgObjectToSocialCards = (metadata: urlMetadata.Result): SocialCards => {
  const ogp = convertMetadataToOgp(metadata);
  const twitter = convertMetadataToTwitterCard(metadata);

  return { ogp, twitter };
};

const convertMetadataToOgp = (metadata: urlMetadata.Result): OpenGraph | undefined => {
  return {
    title: metadata["og:title"],
    description: metadata["og:description"],
    image: metadata["og:image"],
    url: metadata["og:url"],
    siteName: metadata["og:site_name"],
  };
};

const convertMetadataToTwitterCard = (metadata: urlMetadata.Result): TwitterCard | undefined => {
  return {
    title: metadata["twitter:title"],
    description: metadata["twitter:description"],
    image: metadata["twitter:image"],
    url: metadata["twitter:url"],
    site: metadata["twitter:site"],
  };
};
