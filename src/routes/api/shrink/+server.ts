import { Buffer } from "node:buffer";
import { json } from "@sveltejs/kit";
import sharp from "sharp";
import type { RequestHandler } from "./$types";

export const PUT = (async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // check if `file` is present
  if (!file) {
    return json({ message: "File not found" }, { status: 400 });
  }

  // check if `file` is file
  if (!isFile(file)) {
    return json({ message: "Currently only support file" }, { status: 400 });
  }

  // check if `file` is image
  if (!file.type.startsWith("image")) {
    return json({ message: "File is not an image" }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer().then((buffer) => Buffer.from(buffer));

  // compress image
  const compressedImageBuffer = await sharp(fileBuffer).webp({ quality: 69 }).toBuffer();

  return new Response(compressedImageBuffer, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}) satisfies RequestHandler;

const isFile = (value: FormDataEntryValue): value is File => typeof value !== "string";
