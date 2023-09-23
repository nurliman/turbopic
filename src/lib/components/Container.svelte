<script lang="ts">
  import { clsx } from "clsx";
  let className = "";
  export { className as class };
</script>

<div {...$$restProps} class={clsx("mx-auto max-w-3xl px-4 sm:px-6 lg:px-8", className)}>
  <slot />
</div>
