import { env as serverEnv } from "$env/dynamic/private";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_BUCKET_URL: z.string(),
    ACCESS_TOKEN_EXPIRATION: z.string().min(1),
    ACCESS_TOKEN_SECRET_KEY: z.string().min(1),
    ACCESS_TOKEN_PUBLIC_KEY: z.string().min(1),
    REFRESH_TOKEN_EXPIRATION: z.string().min(1),
    REFRESH_TOKEN_SECRET_KEY: z.string().min(1),
    REFRESH_TOKEN_PUBLIC_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: serverEnv,
});
