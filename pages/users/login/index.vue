<template>
  <a-flex>
    <a-flex justify="center" align="center" class="background">
      <img src="../../../public/background.png" alt="背景图片" style="height: 80vh;">
    </a-flex>

    <a-flex justify="center" align="center" class="login">
      <a-form
        v-if="isLogin"
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finish-failed="onFinishFailed"
      >
        <a-typography-title :level="4">登录</a-typography-title>
        <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名/手机号/邮箱' }]">
          <a-input
            v-model:value="formState.username"
            placeholder="用户名/手机号/邮箱"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
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
              <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
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
          <a-button type="link" @click="toggleForm">没有账号？点击注册</a-button>
        </a-flex>
      </a-form>

      <a-form
        v-else
        :model="registerFormState"
        name="register_form"
        class="register-form"
        @finish="onRegister"
        @finish-failed="onFinishFailed"
      >
        <a-typography-title :level="4">注册</a-typography-title>
        <a-form-item name="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
          <a-input
            v-model:value="registerFormState.nickname"
            placeholder="请输入昵称"
          />
        </a-form-item>
        <a-form-item name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
          <a-input
            v-model:value="registerFormState.email"
            placeholder="请输入邮箱"
          />
        </a-form-item>
        <a-form-item name="code">
          <a-flex justify="space-between">
            <a-input v-model:value="registerFormState.code" placeholder="请输入验证码" style="flex: 1; margin-right: 8px;" />
            <a-button :disabled="!canSendCode" @click="sendCode">{{ sending ? `${countdown}s` : '发送验证码' }}</a-button>
          </a-flex>
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password
            v-model:value="registerFormState.password"
            placeholder="请输入密码 "
          />
        </a-form-item>
        <a-form-item v-if="registerFormState.password" name="confirmPassword" :rules="[{ required: true, message: '请确认密码' }, { validator: validatePassword }]">
          <a-input-password
            v-model:value="registerFormState.confirmPassword"
            placeholder="确认密码 "
          />
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="registerDisabled"
            type="primary"
            html-type="submit"
            style="width: 100%"
          >
            注册
          </a-button>
        </a-form-item>
        <a-flex justify="end">
          <a-button type="link" @click="toggleForm">已有账号？点击登录</a-button>
        </a-flex>
      </a-form>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

import { reactive, computed, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { loginApi, registerApi, verifyTypeApi } from "~/composables/users";
import type { UserInfoType, VerifyType } from '~/composables/users';
import type { ResType } from '~/types'
import { useUserStore } from '~/store/users';
const router = useRouter();
const userStore = useUserStore();
const token = useCookie("token");

const isLogin = ref(true);

interface FormStateType {
  username: string;
  password: string;
  remember: boolean;
}

interface RegisterType {
  nickname: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}
const formState = reactive<FormStateType>({
  username: "",
  password: "",
  remember: true,
});

let registerFormState = reactive<RegisterType>({
  nickname: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: ""
});

const sending = ref(false);
const countdown = ref(60);
let timer: NodeJS.Timeout;

const sendCode = async () => {
  if (!registerFormState.email || !registerFormState.nickname) {
    message.error('请输入邮箱和昵称');
    return;
  }
  sending.value = true;
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(timer);
      sending.value = false;
    }
  }, 1000);
  // 发送验证码请求
  try {
    const verifyData: VerifyType = {
      email: registerFormState.email,
      nickname: registerFormState.nickname
    };
    await verifyTypeApi(verifyData);
    message.success('验证码已发送');
  } catch (error) {
    message.error('发送验证码失败');
    clearInterval(timer);
    sending.value = false;
  }
};

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

const onRegister = async (values: RegisterType) => {
  const { confirmPassword, ...registerData } = values; // 不传递 confirmPassword
  const res = await registerApi(registerData) as ResType;
  if (res.code === 200) {
    message.success("注册成功");
    isLogin.value = true;
    registerFormState = {} as RegisterType;
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

const registerDisabled = computed(() => {
  return !(registerFormState.nickname && registerFormState.email && registerFormState.code && registerFormState.password && registerFormState.confirmPassword);
});

const canSendCode = computed(() => {
  return registerFormState.email && registerFormState.nickname && !sending.value;
});

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== registerFormState.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};
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
.login-form, .register-form {
  width: 300px;
}
</style>