import type { UserType } from "~/types/user";

export const loginApi = async (userData: UserType) => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: userData
    });
    return res;
  } catch (error) {
    console.error('登录时出错:', error);
    throw error;
  }
};