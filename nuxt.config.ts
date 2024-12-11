import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  vite: {
    build: {
      sourcemap: false // 禁用 sourcemap 以提高构建速度
    },
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver({
          importStyle: 'less'
        })]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#00B96B',
          },
          javascriptEnabled: true,
        }
      }
    },
    optimizeDeps: {
      include: ['ant-design-vue'],
      exclude: [
        'ant-design-vue/es/button/style',
        'ant-design-vue/es/layout/style',
        'ant-design-vue/es/breadcrumb/style',
        'ant-design-vue/es/menu/style',
        '@ant-design/icons-vue'
      ]
    },
    server: {
      hmr: {
        overlay: false, // 禁用 HMR 覆盖层以加快热更新速度
        port: 3000
      },
      watch: {
        usePolling: true, // 使用轮询来检测文件变化
        interval: 100, // 轮询间隔时间（毫秒）
        ignored: ['**/node_modules/**', '**/.git/**']
      }
    }
  },
  ssr: true,
  compatibilityDate: '2024-12-10',
  dir: {
    layouts: 'layouts', // 自定义布局文件夹
  },
  runtimeConfig: {
    public: {
      colorPrimary: process.env.VITE_COLOR_PRIMARY
    }
  }
})