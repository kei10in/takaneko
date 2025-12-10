import type { Config } from "@react-router/dev/config";

export const config: Config = {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },
};

export default config;
