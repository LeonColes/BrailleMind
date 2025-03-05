// 路由守卫
import { useUserStore } from '~/store/users';

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value;
  if(!token && to.path.startsWith('/users')) {
    Modal.warning({
      title: '重新登录',
      content: '身份验证失效，请重新登录',
      onOk: () => navigateTo('/users/login')
    });
  }
})