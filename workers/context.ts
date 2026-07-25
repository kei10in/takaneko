import { RouterContextProvider } from "react-router";

export interface CloudflareLoadContext {
  env: Env;
  ctx: ExecutionContext;
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: CloudflareLoadContext;
  }

  export interface RouterContextProvider extends AppLoadContext {
    cloudflare: CloudflareLoadContext;
  }
}

export const createCloudflareLoadContext = (
  env: Env,
  ctx: ExecutionContext,
): RouterContextProvider => {
  const context = new RouterContextProvider();
  context.cloudflare = { env, ctx };
  return context;
};
