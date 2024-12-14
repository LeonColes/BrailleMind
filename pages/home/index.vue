<template>
  <div>
    这是主页
    <a-button type="primary" @click="test">api</a-button>
  </div>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import { message } from 'ant-design-vue';

const test = () => {
  console.log('test')
  message.success('test')
}
</script>