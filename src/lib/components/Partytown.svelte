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
                    "www.google-analytics.com": "/proxy/google-analytics",
                    "www.googleadservices.com": "/proxy/google-ad-services",
                    "www.googletagmanager.com": "/proxy/google-tag-manager",
                    "googleads.g.doubleclick.net": "/proxy/googleads-g-doubleclick",
                };

                if (!pMap[url.hostname]) return url;

                const pUrl = new URL(url);
                pUrl.hostname = "turbopic.vercel.app";
                pUrl.pathname = (pMap[url.hostname] || "") + url.pathname;
                return pUrl;
            }

            return url;
        },
    };
  </script>

  {@html "<script>" + partytownSnippet() + "</script>"}
</svelte:head>