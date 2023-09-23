export type ResponseServer<T = any> = {
  status: boolean;
  message: string;
  data?: T | null;
};

export type ShrinkedImage = {
  id: string;
  url: string;
  size: number;
  originalSize: number;
  reductionPercentage: number;
};

export type FileUploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "finished" | "failed";
  result?: ShrinkedImage | null;
};

export type Credentials = {
  accessToken: string;
  refreshToken: string;
};
