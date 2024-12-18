// 登录类型
export interface UserType {
  username?: string;
  email?: string;
  password: string;
}

// 用户信息
export interface UserInfoType {
  name: string;
  avatar: string;
  token: string;
}