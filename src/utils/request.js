import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0

  })
  const token = store.getters.token
  // 修复后的代码
  if (token) {
    config.headers['Access-Token'] = token
  }
  config.headers.platform = 'H5' // 移到 if 外面
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data
  if (res.status !== 200) {
    Toast.clear()
    // 处理401未授权错误
    if (res.status === 401) {
      Toast('登录已过期，请重新登录')
      // 清除无效的token
      store.commit('user/setUserInfo', {})
      store.commit('cart/setCartList', [])
      // 跳转到登录页面
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      // 返回空Promise，避免未捕获的Promise rejection错误
      return new Promise(() => {})
    }
    Toast(res.msg)
    return Promise.reject(res)
  } else {
    Toast.clear()
    return res
  }
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  Toast.clear()
  Toast('请求失败')
  return Promise.reject(error)
})

export default instance
