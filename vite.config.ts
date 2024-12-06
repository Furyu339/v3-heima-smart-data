import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), 
    AutoImport({
      imports: ['vue','vue-router','pinia'], // 自动引入 'vue' 中的 API，例如 ref、reactive 等
      dts: 'src/auto-imports.d.ts', // 生成的自动引入类型声明文件
    }),
    vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
