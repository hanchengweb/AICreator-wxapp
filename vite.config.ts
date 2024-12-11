import process from 'node:process'
import uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'

import { SetManifest } from './scripts/setManifest'

// https://vitejs.dev/config/
export default defineConfig(async ({ command: _command, mode }) => {
  // unocss 0.58 之后不再支持 cjs,但是 uni 插件只能说 cjs 这个是妥协写法
  const UnoCss = await import('unocss/vite').then(i => i.default)
  const env = loadEnv(mode, process.cwd())

  // 根据环境变量 向 manifest.json 写入 appid
  SetManifest.replace('name', `"${env.VITE_APP_NAME || ''}"`)
  SetManifest.replace('mp-weixin.appid', `"${env.VITE_WECHAT_APPID || ''}"`)
  SetManifest.write()

  return {
    plugins: [
      UniPages({
        dts: 'types/_uni-pages.d.ts',
        exclude: ['**/_*/**/*'], // pages文件下 _ 排除的页面
      }),
      UniLayouts(),
      Components({
        dts: 'types/_components.d.ts',
        resolvers: [WotResolver()],
      }),
      uni(),
      UnoCss(),
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: 'types/_auto-import.d.ts',
        dirs: ['src/hooks'], // 自动导入 hooks
        vueTemplate: true, // default false
      }),
    ],
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "@/styles/utils.scss";',
        },
      },
    },
  }
})
