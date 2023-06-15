<script lang="ts">
  import prettyBytes from "pretty-bytes";
  import ImageDuotone from "virtual:icons/ph/image-duotone";
  import DownloadDuotone from "virtual:icons/ph/download-duotone";
  import type { FileUploadItem } from "$lib/types";

  const renderStatus = (item: FileUploadItem) => {
    switch (item.status) {
      case "pending":
        return "Pending";
      case "uploading":
        return `${item.progress}%`;
      case "processing":
        return "Processing";
      case "finished":
        return "Finished";
      case "failed":
        return "Failed";
    }
  };

  export let fileUploadList: FileUploadItem[] = [];
  let className = "";

  export { className as class };
</script>

<ol class={className}>
  {#each fileUploadList as item (item.id)}
    <li class="flex flex-row items-center p-2 mb-2.5 last:mb-0">
      <ImageDuotone width={32} height={32} />
      <div class="w-2" />
      <div class="flex flex-col flex-1">
        <div class="font-bold">
          {item.file.name}
        </div>
        <div class="text-xs">
          {#if item.status === "finished"}
            {prettyBytes(item.file.size)} ⇒ {prettyBytes(item.result?.size || 0)}
            <span class="font-semibold text-green-800">
              (-{item.result?.reductionPercentage}%)
            </span>
          {:else}
            {prettyBytes(item.file.size)}
          {/if}
        </div>
        <div class="text-xs">
          {renderStatus(item)}
        </div>
      </div>
      {#if item.status === "finished"}
        <a href={item.result?.url} class="button-container p-2">
          <DownloadDuotone width={32} height={32} />
        </a>
      {:else if item.status === "failed"}
        <div />
      {:else}
        <div class="button-container p-2">
          <div class="spinner">
            <DownloadDuotone width={32} height={32} />
          </div>
        </div>
      {/if}
    </li>
  {/each}
</ol>

<style lang="scss">
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    background: #fff066;
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #000000;
  }

  .button-container {
    background: #fff;
    border: 2px solid #000000;
    border-radius: 50%;
    box-shadow: 2px 2px 0px #000000;

    &:hover {
      background: #ffc0cb;
    }
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
