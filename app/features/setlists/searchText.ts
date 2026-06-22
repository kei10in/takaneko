export const normalizeSearchText = (text: string): string => {
  return text.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, " ").trim();
};

export const searchTokens = (q: string): string[] => {
  const normalized = normalizeSearchText(q);
  if (normalized == "") {
    return [];
  }

  return normalized.split(" ").filter((token) => token != "");
};

export const containsAllTokens = (text: string, tokens: string[]): boolean => {
  return tokens.every((token) => containsToken(text, token));
};

const containsToken = (text: string, token: string): boolean => {
  if (!/^[a-z0-9]+$/.test(token)) {
    return text.includes(token);
  }

  const escaped = escapeRegExp(token);
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(text);
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const withSearchVariants = (values: (string | undefined)[]): string[] => {
  return values.filter(isNonEmptyString).flatMap((value) => [value, englishAcronym(value)]);
};

export const isNonEmptyString = (value: string | undefined): value is string => {
  return value != undefined && value != "";
};

const englishAcronym = (value: string): string => {
  const words = value.match(/[A-Za-z0-9]+/g) ?? [];
  if (words.length < 2) {
    return "";
  }

  return words.map((word) => word[0] ?? "").join("");
};
