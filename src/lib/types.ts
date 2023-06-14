export type FileUploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "finished" | "failed";
};
