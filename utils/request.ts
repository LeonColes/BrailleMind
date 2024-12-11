interface FetchType {
  headers?: Record<string, string>;
  [key: string]: any;
}

import { message } from 'ant-design-vue';

const router = useRouter();

const request = (url: string, opt: FetchType) => {
  // token
  const token = useCookie('token');
  // 添加token和请求头
  const headers = {
    ...opt.headers,
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
  };
  opt.headers = headers;
  return useFetch(url, {
    ...opt,
    baseURL: '', // 基本url配置
    onRequest({ request, options }) {
      // 请求拦截器
      console.log('request', request);
    },
    onRequestError({ request, options, error }) {
      // 处理请求错误
    },
    onResponse({ request, response, options }) {
      // 处理响应数据
      console.log('response', response);
      return response;
    },
    onResponseError({ request, response, options }) {
      // 处理响应错误
      // 判断状态，如401时，返回未登录
      if (response.status === 401) router.push('/login');
    }
  });
};

export default request;