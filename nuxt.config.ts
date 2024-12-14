// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['ant-design-vue'],
  },
  modules: [
    '@ant-design-vue/nuxt'
  ],
  dir: {
    layouts: 'layouts', // 自定义布局文件夹
  },
  runtimeConfig: {
    public: {
      colorPrimary: '#1890ff', // 主题色
    },
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
  }
})
