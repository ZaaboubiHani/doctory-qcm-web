import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/doctory-qcm-web/",
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
});
