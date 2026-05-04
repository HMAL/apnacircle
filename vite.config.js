import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const manualChunks = {
  "react-vendor": ["react", "react-dom", "react-router-dom"],
  "supabase":     ["@supabase/supabase-js"],
  "helmet":       ["react-helmet-async"],
};

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : { manualChunks },
    },
  },
}));
