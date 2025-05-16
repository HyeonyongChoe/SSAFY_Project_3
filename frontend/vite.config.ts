// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vexflow: path.resolve(
        __dirname,
        "node_modules/opensheetmusicdisplay/node_modules/vexflow"
      ),
    },
  },
  optimizeDeps: {
    include: ["verovio/esm", "verovio/wasm"],
  },
  build: {
    rollupOptions: {
      external: ["verovio/esm", "verovio/wasm"],
    },
  },
});
