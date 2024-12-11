<template>
  <div>
    这是主页
    <a-button type="primary" @click="test">api</a-button>
  </div>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import request from '@/utils/request';
import { message } from 'ant-design-vue';

// 中间件
definePageMeta({
  middleware: 'auth'
})

const test = () => {
  console.log('test')
  message.success('test')
}
</script>