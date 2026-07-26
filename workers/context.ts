import { RouterContextProvider } from "react-router";
import { cloudflareContext, type CloudflareLoadContext } from "../app/cloudflare-context";

export const createCloudflareLoadContext = (
  env: Env,
  ctx: ExecutionContext,
): RouterContextProvider => {
  const context = new RouterContextProvider();
  context.set(cloudflareContext, { env, ctx } satisfies CloudflareLoadContext);
  return context;
};
