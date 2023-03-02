/*
 * @Description: 
 * @Author: wsy
 * @Date: 2023-02-28 10:33:35
 * @LastEditTime: 2023-03-02 09:42:22
 * @LastEditors: wsy
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'
import autoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'
import commonjs from '@rollup/plugin-commonjs'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),

    //添加jsx/tsx支持
    vueJsx({}),
    viteSvgIcons({
      // Specify the icon folder to be cached
      iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),

    autoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: ['vue'],
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.vue', '.json', '.ts'], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },

  optimizeDeps: {
    include: ['@/../lib/vuedraggable/dist/vuedraggable.umd.js', 'quill'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        /* 自动引入全局scss文件 */
        additionalData: '@import "./src/styles/global.scss";',
      },
    },
  },

  build: {
    outDir: 'lowcode',
    commonjsOptions: {
      exclude: [
        'lib/vuedraggable/dist/vuedraggable.umd.js,', //引号前的逗号不能删，不知何故？？
        'dayjs'
      ],
      include: [],
    },
    rollupOptions: {
      // 指定生产打包入口文件为index.htm
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
