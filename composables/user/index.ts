import type { UserType } from "~/types/user";

export const loginApi = async (userData: UserType) => {
  const baseUrl = '/api/auth';
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