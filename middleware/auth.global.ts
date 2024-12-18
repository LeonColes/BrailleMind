// 路由守卫
import { useUserStore } from '~/store/user';

export default defineNuxtRouteMiddleware((to) => {
const userStore = useUserStore();
  const token = useCookie('token').value;
  if(!token && to.path !== '/login') {
    message.warning('登录已过期，请重新登录');
    return navigateTo('/login');
  }
  else userStore.setUserInfo(userStore)
})