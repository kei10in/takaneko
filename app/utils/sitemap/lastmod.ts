export interface LastmodConfig {
  path: string;
  lastmod?: string;
}

export const lastmodConfig: LastmodConfig[] = [
  { path: "/" },
  { path: "/trade" },
  { path: "/calendar" },
  { path: "/calendar/registration" },
  { path: "/products" },
  { path: "/profile" },
  { path: "/official/news" },
  { path: "/releases" },
  { path: "/setlists" },
  { path: "/terms" },
];

const validateLastmodConfig = (config: LastmodConfig[]) => {
  const errors = config.flatMap((item) => {
    const { lastmod } = item;
    if (lastmod && !isIsoDateString(lastmod)) {
      return [
        `Invalid lastmod value for path "${item.path}": "${lastmod}". It should be in ISO date format (YYYY-MM-DD).`,
      ];
    }
    return [];
  });

  if (errors.length > 0) {
    throw new Error(`LastmodConfig validation errors:\n${errors.join("\n")}`);
  }
};

const isIsoDateString = (str: string): boolean => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoDateRegex.test(str);
};

validateLastmodConfig(lastmodConfig);
