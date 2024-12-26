// 路由守卫
import { useUserStore } from '~/store/user';

export default defineNuxtRouteMiddleware((to) => {
const userStore = useUserStore();
  const token = useCookie('token').value;
  if(!token && to.path !== '/login') {
    Modal.warning({
      title: '重新登录',
      content: '身份验证失效，请重新登录',
      onOk: () => navigateTo('/login')
    });
  }
  else userStore.setUserInfo(userStore)
})