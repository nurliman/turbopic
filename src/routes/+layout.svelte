<script>
  import "@fontsource-variable/inter";
  import "@fontsource/racing-sans-one";
  import "toastify-js/src/toastify.css";
  import "../app.postcss";
  import { onMount } from "svelte";
  import { singleflightCheckToken } from "$lib/apis/authApi";
  import Partytown from "$lib/components/Partytown.svelte";
  import GoogleAnalytics from "$lib/components/GoogleAnalytics.svelte";

  onMount(() => {
    singleflightCheckToken();
  });
</script>

<Partytown />
<GoogleAnalytics />

<main>
  <slot />
</main>
