<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      class="scroll sider-scroll"
      v-model:collapsed="collapsed"
      theme="light"
      collapsible
    >
      <div class="logo" />
      <a-menu v-model:selected-keys="selectedKeys" theme="light" mode="inline">
        <!-- 遍历菜单项 -->
        <template v-for="item in items">
          <a-tooltip :title="item.label" v-if="collapsed">
            <a-menu-item
              v-if="!item.children"
              :key="item.key"
              :title="collapsed ? item.label : ''"
            >
              <NuxtLink :to="item.path">
                <!-- 显示图标 -->
                <component :is="item.icon" />
                <span v-if="!collapsed">{{ item.label }}</span>
              </NuxtLink>
            </a-menu-item>
          </a-tooltip>
          <a-menu-item
            v-else-if="!item.children"
            :key="item.key"
            :title="collapsed ? item.label : ''"
          >
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
              <NuxtLink :to="subItem.path">
                <component :is="subItem.icon" />
                <span v-if="!collapsed">{{ subItem.label }}</span>
              </NuxtLink>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout class="scroll content-scroll">
      <a-layout-header style="background-color: #fff">
        <a-flex justify="space-between" align="center" style="height: 100%">
          <a-typography-text :level="4">明光，只为照亮你</a-typography-text>
          <a-popover>
            <template #content>
              <a-button type="text">
                退出登录
                <template #icon><PoweroffOutlined /></template>
              </a-button>
            </template>
            <a-button type="primary">
              {{ userStore.name }}
              <template v-if="userStore.name" #icon><SmileOutlined /></template>
            </a-button>
          </a-popover>
        </a-flex>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin-top: 18px">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', minHeight: '360px' }">
          <NuxtPage />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2024 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import items from "../routes";
import { useUserStore } from "~/store/user";
import "../styles/scroll.css"; // 引用 scroll.css 文件

const userStore = useUserStore();

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(["1"]);

// 监听 collapsed 状态变化以调整菜单行为
watch(collapsed, (newVal) => {
  if (newVal) {
    selectedKeys.value = [];
  } else {
    selectedKeys.value = ["1"];
  }
});

definePageMeta({
  middleware: ['auth'],
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

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

a-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>