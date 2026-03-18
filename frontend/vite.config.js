import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // vite.config.js
  server: {
    proxy: {
      "/api": {
        target: "https://pingster-tone.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
