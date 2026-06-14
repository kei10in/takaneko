export const LdJsonIds = {
  webPage: (canonicalUrl: string): string => {
    return `${canonicalUrl}#web-page`;
  },
  breadcrumbList: (canonicalUrl: string): string => {
    return `${canonicalUrl}#breadcrumb-list`;
  },
  musicEvent: (canonicalEventUrl: string): string => {
    return `${canonicalEventUrl}#music-event`;
  },
};
