import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    tsconfigPaths: true,
  },

  server: {
    proxy: {
      "/api/codetrain": {
        target: "https://api.codetrain.ai",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/codetrain/,
            "/v1"
          ),
      },
    },
  },
});