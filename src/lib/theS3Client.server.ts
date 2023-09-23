import { S3Client } from "@aws-sdk/client-s3";
import { env } from "$lib/env.server";

export const theS3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "auto",
});
