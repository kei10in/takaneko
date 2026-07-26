import { createContext } from "react-router";

export interface CloudflareLoadContext {
  env: Env;
  ctx: ExecutionContext;
}

export const cloudflareContext = createContext<CloudflareLoadContext>();
