import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // order matters - put react first
          react: ["react", "react-dom", "react-router-dom"],
          dropbox: ["dropbox"],
          antd_icons: ["@ant-design/icons"],
          antd: ["antd"],
        },
      },
    },
  },
});
