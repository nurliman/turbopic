import sharp from "sharp";
import { Buffer } from "node:buffer";
import { nanoid } from "nanoid";
import { json } from "@sveltejs/kit";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "$lib/env.server";
import { theS3Client } from "$lib/theS3Client.server";
import { changeFileExtension, isFile, responseServer, responseServerError } from "$lib/utils";
import type { Config } from "@sveltejs/adapter-vercel";
import type { RequestHandler } from "./$types";
import type { ShrinkedImage } from "$lib/types";

export const config: Config = {
  runtime: "nodejs18.x",
};

export const PUT = (async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const id = nanoid();

    // check if `file` is present
    if (!file) {
      return json(responseServerError("file is required"), { status: 400 });
    }

    // check if `file` is file
    if (!isFile(file)) {
      return json(responseServerError("file is not valid"), { status: 400 });
    }

    // check if `file` is image
    if (!file.type.startsWith("image")) {
      return json(responseServerError("File is not an image"), { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer().then((buffer) => Buffer.from(buffer));

    // compress image
    const compressedImageBuffer = await sharp(fileBuffer).webp({ quality: 69 }).toBuffer();

    // upload to s3
    const newFilename = changeFileExtension(file.name, "webp");

    await theS3Client
      .send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: `${id}/${newFilename}`,
          Body: compressedImageBuffer,
          ContentType: "image/webp",
          ContentDisposition: `attachment; filename="${newFilename}"`,
        }),
      )
      .catch((err) => {
        console.error("Failed to upload to S3");
        throw err;
      });

    const url = `${env.S3_BUCKET_URL}/${id}/${newFilename}`;

    const reductionPercentage = Math.round(
      (1 - compressedImageBuffer.length / fileBuffer.length) * 100,
    );

    return json(
      responseServer<ShrinkedImage>({
        id,
        url,
        size: compressedImageBuffer.length,
        originalSize: fileBuffer.length,
        reductionPercentage,
      }),
    );
  } catch (error: any) {
    console.error(error);
    return json(responseServerError(error.message || "Something went wrong"), { status: 500 });
  }
}) satisfies RequestHandler;
