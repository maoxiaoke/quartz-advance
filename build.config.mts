import { defineConfig } from "@ice/pkg"

// 使用 defineConfig 工具函数以获得更好的类型提示
export default defineConfig({
  // 配置选项
  bundle: {
    formats: ["cjs", "esm"],
    externals: {
      esbuild: "esbuild",
      fsevents: "fsevents",
      "@napi-rs/simple-git": "@napi-rs/simple-git",
      lightningcss: "lightningcss",
    },
  },
  entry: "./quartz/cli/handler.js",
})
