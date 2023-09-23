<!-- TODO: use environment variables for google tag manager -->
<svelte:head>
  <script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-FK86TVQGTV"></script>
  <script type="text/partytown">
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-FK86TVQGTV");
  </script>
</svelte:head>
