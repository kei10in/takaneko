export const LdJsonIds = {
  webPage: (canonicalUrl: string): string => {
    return `${canonicalUrl}#web-page`;
  },
  musicEvent: (canonicalEventUrl: string): string => {
    return `${canonicalEventUrl}#music-event`;
  },
};
