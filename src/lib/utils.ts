import type { ResponseServer } from "$lib/types";

export const isFile = (value: FormDataEntryValue): value is File => {
  return typeof value !== "string";
};

export const responseServer = <T = any>(data: T, message = "Success"): ResponseServer<T> => ({
  status: true,
  message,
  data,
});

export const responseServerError = <T = any>(message = "Error"): ResponseServer<T> => ({
  status: false,
  message,
  data: null,
});

export const changeFileExtension = (filename: string, newExtension: string): string => {
  if (typeof filename !== "string") return filename;
  if (filename.length === 0) return filename;

  const dotIndex = filename.lastIndexOf(".");

  if (dotIndex === -1) return `${filename}.${newExtension}`;
  return `${filename.substring(0, dotIndex)}.${newExtension}`;
};
