// vite.config.js

import { defineConfig } from 'vite'
import { html } from '@rollup/plugin-html'
// import { resolve } from 'path'
// import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  build: {
    // 指定输出目录，默认为 'dist'
    outDir: 'dist',
    // 设置为 true 时，将会在生成的构建资源中生成 source map 文件
    sourcemap: true,
    // 设置为 false 时，禁用压缩
    minify: true,
    // 设置为 'esnext' 时，将会生成现代 JavaScript 代码
    target: 'esnext',
    // 指定需要编译的入口文件
    // 这里假设入口文件为 src/main.js，如果是其他文件，需要修改路径
    entry: 'src/main.js',
  },
  server: {
    port: 3333,
  },
  // plugins: [
  //   createHtmlPlugin({
  //     minify: true,
  //     pages: [
  //       {
  //         filename: 'index.html',
  //         template: 'index.html',
  //         injectOptions: {
  //           data: {
  //             title: '博客',
  //             injectIcoLink: '',
  //             pubId: 123,
  //           },
  //         },
  //       },
  //     ],
  //   }),
  // ],
})
