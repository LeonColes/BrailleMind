<template>
  <a-flex>
    <a-flex justify="center" align="center" class="background">
      <!-- <a-image
        :preview="false"
        height="100vh"
        src="https://introduce.mcdd.top/fmin-min-48fbc53a-login.png"
      /> -->
      <img src="../../public/background.png" alt="背景图片" style="height: 100vh;">
    </a-flex>

    <a-flex justify="center" align="center" class="login">
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finish-failed="onFinishFailed"
      >
        <a-typography-title :level="4">登录</a-typography-title>
        <a-form-item name="username">
          <a-input
            v-model:value="formState.username"
            placeholder="用户名/手机号/邮箱"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入密码 "
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-flex justify="space-between" align="center">
            <a-form-item name="remember" no-style>
              <a-checkbox v-model:checked="formState.remember"
                >记住我</a-checkbox
              >
            </a-form-item>
            <a-button type="link">忘记密码？</a-button>
          </a-flex>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            style="width: 100%"
          >
            登录
          </a-button>
        </a-form-item>
        <a-flex justify="end">
          <a-button type="link">没有账号？点击注册</a-button>
        </a-flex>
      </a-form>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

import { reactive, computed } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { loginApi } from "~/composables/user";
import type { ResType } from "~/types";
import type { UserInfoType } from '~/types/user';
import { useUserStore } from '~/store/user';
const router = useRouter();
const userStore = useUserStore();
const token = useCookie("token");

interface FormStateType {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormStateType>({
  username: "",
  password: "",
  remember: true,
});
const onFinish = async (values: FormStateType) => {
  const userInfo = {
    username: values.username,
    password: values.password
  };
  const res = await loginApi(userInfo) as ResType;
  if (res.code === 200) {
    message.success("登录成功");
    router.push("/");
    userStore.setUserInfo(res.data as UserInfoType);
    token.value = userStore.token;
  } else {
    message.error(res.msg);
  }
};

const onFinishFailed = (errorInfo: object) => {
  console.log("Failed:", errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>

<style scoped>
.background {
  width: 70vw;
  height: 100vh;
}
.login {
  width: 30vw;
  height: 100vh;
  background-color: #f6f6f6;
  border-radius: 1rem 0 0 1rem;
}
.login-form {
  width: 300px;
}
</style>