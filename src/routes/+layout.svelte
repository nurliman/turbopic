<script>
  import "@fontsource-variable/inter";
  import "@fontsource/racing-sans-one";
  import "toastify-js/src/toastify.css";
  import "../app.postcss";
  import { onMount } from "svelte";
  import { singleflightCheckToken } from "$lib/apis/authApi";

  onMount(() => {
    singleflightCheckToken();
  });
</script>

<main>
  <slot />
</main>
