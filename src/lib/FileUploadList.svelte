<script lang="ts">
  import prettyBytes from "pretty-bytes";
  import ImageDuotone from "virtual:icons/ph/image-duotone";
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
        <div>
          {item.file.name}
        </div>
        <div class="text-xs">
          {prettyBytes(item.file.size)}
        </div>
        <div class="text-xs">
          {renderStatus(item)}
        </div>
      </div>
    </li>
  {/each}
</ol>

<style>
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
</style>
