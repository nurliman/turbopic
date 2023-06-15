<script lang="ts">
  import { nanoid } from "nanoid";
  import axios from "axios";
  import Toastify from "toastify-js";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import Container from "$lib/Container.svelte";
  import FileUploadList from "$lib/FileUploadList.svelte";
  import CloudArrowUpDuotone from "virtual:icons/ph/cloud-arrow-up-duotone";
  import type { FileUploadItem, ResponseServer, ShrinkedImage } from "$lib/types";

  let fileUploadList: FileUploadItem[] = [];

  const updateFileUploadById = (id: string, update: Partial<FileUploadItem>) => {
    fileUploadList = fileUploadList.map((file) => (file.id === id ? { ...file, ...update } : file));
  };

  const showErrorMessage = (message: string) => {
    const toast = Toastify({
      text: message,
      duration: 5000,
      onClick: () => toast.hideToast(),
      gravity: "bottom",
      className: "toast-error",
    });
    toast.showToast();
    return toast;
  };

  const handleFilesSelect = (e: CustomEvent<any>) => {
    const { acceptedFiles, fileRejections } = e.detail;

    if (Array.isArray(fileRejections) && fileRejections.length) {
      showErrorMessage("Only images are allowed!");
      return;
    }

    if (!Array.isArray(acceptedFiles) || !acceptedFiles.length) {
      return;
    }

    const newList = acceptedFiles.map(
      (file: File) =>
        ({
          id: nanoid(),
          file,
          status: "pending",
          progress: 0,
        } satisfies FileUploadItem),
    );

    fileUploadList = [...fileUploadList, ...newList];

    Promise.all(newList.map(uploadFile));
  };

  const uploadFile = async (fileInfo: FileUploadItem) => {
    const data = new FormData();
    data.append("file", fileInfo.file);

    try {
      const response = await axios.put<ResponseServer<ShrinkedImage>>("/api/shrink", data, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          updateFileUploadById(fileInfo.id, {
            progress,
            status: progress >= 100 ? "processing" : "uploading",
          });
        },
      });

      if (!response.data.status) {
        showErrorMessage(response.data.message || "Something went wrong!");
        updateFileUploadById(fileInfo.id, { progress: 0, status: "failed" });
        return;
      }

      updateFileUploadById(fileInfo.id, {
        progress: 100,
        status: "finished",
        result: response.data.data,
      });
    } catch (error) {
      console.error(error);
      showErrorMessage("Something went wrong!");
      updateFileUploadById(fileInfo.id, { progress: 0, status: "failed" });
    }
  };
</script>

<Container class="col-span-full py-8">
  <h1 class="tp-title text-center">Turbopic.</h1>
  <div class="h-4 md:h-6" />
  <p class="tp-text text-center">
    ⚠️ Caution: Proceed Only if You Dare to Witness Unbelievably Compressed Images!
  </p>
  <div class="h-4" />
  <div class="tp-dnd-container">
    <Dropzone
      accept="image/*"
      disableDefaultStyles
      containerClasses="flex flex-col items-center justify-center text-center px-6 py-10"
      on:drop={handleFilesSelect}
    >
      <CloudArrowUpDuotone width="4em" height="4em" />
      <div class="tp-text mt-4 flex leading-6 text-gray-600">
        <p class="tp-upload-btn">Upload a file</p>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-xs leading-5 text-gray-600">PNG, JPG, WEBP up to 10MB</p>
    </Dropzone>
  </div>
  <div class="h-4" />
  <FileUploadList {fileUploadList} />
</Container>

<style lang="scss">
  .tp-title {
    font-family: "Racing Sans One", sans-serif;
    @apply text-7xl;

    @media (min-width: 640px) {
      @apply text-8xl;
    }
  }

  .tp-text {
    @apply text-xs;

    @media (min-width: 640px) {
      @apply text-sm;
    }

    @media (min-width: 768px) {
      @apply text-base;
    }
  }

  .tp-dnd-container {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='5' stroke-dasharray='9%2c 9%2c 1' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  }

  .tp-upload-btn {
    position: relative;
    cursor: pointer;
    color: inherit;
    font-weight: 700;
    transition: color 0.2s ease-in-out;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 1px;
      height: 12%;
      width: 105%;
      left: -2.5%;
      background-color: #ffc0cb;
      z-index: -1;
      transition: height 0.2s ease-in-out;

      @media (min-width: 640px) {
        bottom: 2px;
      }
    }

    &:hover {
      color: #000;

      &::after {
        height: 88%;
      }
    }
  }

  :global(.toast-error) {
    color: #fff;
    background: #ff2626;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0px #000000;
  }
</style>
