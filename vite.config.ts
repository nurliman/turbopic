import { join } from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { partytownVite } from "@builder.io/partytown/utils";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    partytownVite({
      dest: join(process.cwd(), ".svelte-kit/output/client/~partytown"),
    }),
    Icons({
      compiler: "svelte",
    }),
  ],
});
