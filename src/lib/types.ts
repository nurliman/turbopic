export type FileUploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "finished" | "failed";
};
