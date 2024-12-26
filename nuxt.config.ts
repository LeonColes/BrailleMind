// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // devtools: { enabled: true },
  ssr: true,
  build: {
    transpile: ['ant-design-vue'],
  },

  modules: [
    '@ant-design-vue/nuxt',
    [ '@pinia/nuxt', {
      autoImports: [
        'defineStore',  // 自动引入 `defineStore()`
        ['defineStore', 'definePiniaStore'], // 别名
      ],
    }],
  ],

  nitro: {
    devProxy: process.env.BASE_MODE != 'local' ? {
      '/api': {
        target: process.env.BASE_URL,  // 代理地址
        changeOrigin: true,  // 将请求的源更改为代理的 URL
        prependPath: true  // 削掉重复的/api
      }
    } : {}
  },

  dir: {
    layouts: 'layouts', // 自定义布局文件夹
  },

  vite: {
    build: {
      sourcemap: false
    }
  },

  runtimeConfig: {
    // SMTP配置
    smtp: {
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },

    // Mysql配置
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },

    // Redis配置
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS,
    }
  },

  compatibilityDate: '2024-12-26'
})