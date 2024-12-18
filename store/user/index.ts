import type { UserInfoType } from '~/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    avatar: '',
    token: ''
  }),
  actions: {
    setUserInfo(userInfo: UserInfoType) {
      this.name = userInfo.name;
      this.avatar = userInfo.avatar;
      this.token = userInfo.token;
    },
    clearUserInfo() {
      this.name = '';
      this.avatar = '';
      this.token = '';
    }
  }
});