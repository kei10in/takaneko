import UAParser from "ua-parser-js";

const init = () => {
  const parser = new UAParser();
  return parser.getResult();
};

export const PARSED_UA = init();
