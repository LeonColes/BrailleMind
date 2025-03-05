// 发送验证码类型
export interface VerifyType {
  email: string;
  nickname: string;
}

// 注册类型
export interface RegisterType {
  nickname: string;
  email: string;
  code: string;
  password: string;
}

// 登录类型
export interface UserType {
  username?: string;
  email?: string;
  password: string;
}

// 用户信息类型
export interface UserInfoType {
  name: string;
  avatar: string;
  token: string;
}

export const verifyTypeApi = async (verifyData: VerifyType) => {
  try {
    const res = await $fetch("/api/auth/verify", {
      method: "POST",
      body: verifyData,
    });
    return res;
  } catch (error) {
    console.error("发送验证码时出错:", error);
    throw error;
  }
};

export const registerApi = async (userData: RegisterType) => {
  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: userData,
    });
    return res;
  } catch (error) {
    console.error("注册时出错:", error);
    throw error;
  }
};

export const loginApi = async (userData: UserType) => {
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: userData,
    });
    return res;
  } catch (error) {
    console.error("登录时出错:", error);
    throw error;
  }
};