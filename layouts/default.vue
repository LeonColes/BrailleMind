<template>
  <a-layout style="min-height: 100vh;">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }"
      v-model:collapsed="collapsed" :theme="darkMode ? 'dark' : 'light'" collapsible>
      <div class="logo" />
      <a-menu v-model:selected-keys="selectedKeys" :theme="darkMode ? 'dark' : 'light'" mode="inline">
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
              <NuxtLink :to="subItem.path">
                <component :is="subItem.icon" />
                <span>{{ subItem.label }}</span>
              </NuxtLink>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: !collapsed ? '200px' : '80px' }">
      <a-layout-header :style="darkMode ? { background: '#141414', color: '#fff' } : { background: '#fff', color: '#000' }">
        <a-flex justify="space-between" align="center" style="height: 100%">
          <a-dropdown arrow placement="bottom">
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <UserOutlined /> 个人中心
                </a-menu-item>
                <a-menu-item key="2" @click="logout">
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
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "~/store/users";
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from "@ant-design/icons-vue";
import type { FunctionalComponent } from 'vue';

const userStore = useUserStore();
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(["1"]);

interface itemsType {
  key: string;
  icon?: FunctionalComponent;
  label?: string;
  path?: string;
  children?: itemsType[];
}

const items: itemsType[] = [
  {
    key: 'home',
    icon: PieChartOutlined,
    label: 'Home',
    path: '/home'
  },
  {
    key: 'homework',
    icon: DesktopOutlined,
    label: '作业管理',
    path: '/homework',
    children: [
      {
        key: 'homework-information',
        label: '作业信息',
        path: '/homework',
      },
      {
        key: 'homework-correct',
        label: '作业批改',
        path: '/homework/correct',
      }
    ]
  },
  {
    key: 'info',
    icon: UserOutlined,
    label: '信息',
    path: '/info',
  },
  {
    key: 'files',
    icon: FileOutlined,
    label: '文件',
    path: '/files',
  },
  {
    key: 'class',
    icon: FileOutlined,
    label: '班级',
    path: '/class',
  },
  {
    key: 'community',
    icon: FileOutlined,
    label: '社区',
    path: '/community',
  },
  {
    key: 'settings',
    icon: TeamOutlined,
    label: '设置',
    path: '/settings',
  }
];

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
  if (route.path === '/') router.replace('/home');
});

const darkMode = ref<boolean>(false);

const logout = () => {
  userStore.clearUserInfo();
  const token = useCookie('token');
  token.value = null; // 清除 cookies 中的 token
  router.replace('/users/login');
};
</script>

<style scoped>
/* 样式定义 */
</style>