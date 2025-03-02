import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ogp } from "~/utils/ogp/ogp";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const source = url.searchParams.get("q");
  if (source == undefined) {
    return {};
  }

  const result = await ogp(source);

  return result;
};
