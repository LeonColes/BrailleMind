<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo"></div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <!-- 遍历菜单项 -->
        <template v-for="item in items">
          <a-menu-item v-if="!item.children" :key="item.key" :title="collapsed ? item.label : ''">
            <NuxtLink :to="item.path">
              <!-- 显示图标 -->
              <component :is="item.icon" />
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </a-menu-item>
          <a-sub-menu v-else :key="item.key + '-sub'">
            <template #title>
              <span>
                <!-- 显示图标 -->
                <component :is="item.icon" />
                <span>{{ item.label }}</span>
              </span>
            </template>
            <!-- 遍历子菜单项 -->
            <a-menu-item v-for="subItem in item.children" :key="subItem.key">
              <NuxtLink :to="subItem.path">{{ subItem.label }}</NuxtLink>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <NuxtPage />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import items from '../routes';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);

// 监听 collapsed 状态变化以调整菜单行为
watch(collapsed, (newVal) => {
  if (newVal) {
    selectedKeys.value = [];
  } else {
    selectedKeys.value = ['1'];
  }
});
</script>
<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

a-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>