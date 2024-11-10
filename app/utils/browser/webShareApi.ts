import { PARSED_UA } from "~/utils/ua";

export const shouldUseWebShareApi = () => {
  return typeof window === "undefined"
    ? false
    : window?.navigator?.share != undefined &&
        (PARSED_UA.os.name == "iOS" ||
          PARSED_UA.os.name == "Android" ||
          ["mobile", "tablet"].includes(PARSED_UA.device.type ?? ""));
};
