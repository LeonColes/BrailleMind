import type { UserType } from "~/types/user";

export const loginApi = async (userData: UserType) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl + '/auth';
  try {
    const res = await $fetch(baseUrl + '/login', {
      method: 'POST',
      body: userData
    });
    return res;
  } catch (error) {
    console.error('登录时出错:', error);
    throw error;
  }
};