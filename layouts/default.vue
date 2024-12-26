<template>
  <a-layout style="min-height: 100vh;">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
      v-model:collapsed="collapsed" :theme="darkMode ? 'dark' : 'light'" collapsible>
      <div class="logo" />
      <a-menu v-model:selected-keys="selectedKeys" :theme="darkMode ? 'dark' : 'light'" mode="inline">
        <!-- 遍历菜单项 -->
        <template v-for="item in items">
          <a-tooltip :title="item.label" v-if="collapsed">
            <a-menu-item v-if="!item.children" :key="item.key" :title="collapsed ? item.label : ''">
              <NuxtLink :to="item.path">
                <!-- 显示图标 -->
                <component :is="item.icon" />
                <span v-if="!collapsed">{{ item.label }}</span>
              </NuxtLink>
            </a-menu-item>
          </a-tooltip>
          <a-menu-item v-else-if="!item.children" :key="item.key" :title="collapsed ? item.label : ''">
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
    <a-layout :style="{ marginLeft: !collapsed ? '200px' : '80px' }">
      <a-layout-header :style="darkMode ? { background: '#141414', color: '#fff' } : { background: '#fff', color: '#000' }">
        <a-flex justify="space-between" align="center" style="height: 100%">
          <!-- <text>明光，只为照亮你</text> -->
          <a-switch v-model:checked="darkMode">
            <template #checkedChildren><check-outlined /></template>
            <template #unCheckedChildren><close-outlined /></template>
          </a-switch>
          <a-dropdown arrow placement="bottom">
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <UserOutlined /> 个人中心
                </a-menu-item>
                <a-menu-item key="2">
                  <PoweroffOutlined /> 退出登录
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary">
              {{ userStore.name }}
              <template #icon>
                <SmileOutlined />
              </template>
            </a-button>
          </a-dropdown>
        </a-flex>
      </a-layout-header>
      <a-layout-content>
        <a-breadcrumb style="margin: 8px">
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

const route = useRoute();  // Nuxt3路由
const router = useRouter();  // Vue3路由

onMounted(() => {
  if(route.path === '/') router.replace('/home');
});

const darkMode = ref<boolean>(false);
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