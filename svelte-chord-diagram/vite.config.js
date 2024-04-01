import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/svelte-chord-diagram/", // change to your repo name
  plugins: [svelte()],
})
