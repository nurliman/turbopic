<script>
      import { partytownSnippet } from "@builder.io/partytown/integration";
</script>

<svelte:head>
  <script>
    partytown = {
        forward: ["dataLayer.push"],
        resolveUrl: function (url, location, type) {
            if (type === "script") {
                const pMap = {
                    "www.google-analytics.com": "/google-analytics",
                    "www.googleadservices.com": "/google-ad-services",
                    "www.googletagmanager.com": "/google-tag-manager",
                    "googleads.g.doubleclick.net": "/googleads-g-doubleclick",
                };

                if (!pMap[url.hostname]) return url;

                const pUrl = new URL(url);
                pUrl.hostname = "proxy.knitto.co.id";
                pUrl.pathname = (pMap[url.hostname] || "") + url.pathname;
                return pUrl;
            }

            return url;
        },
    };
  </script>

  {@html "<script>" + partytownSnippet() + "</script>"}
</svelte:head>