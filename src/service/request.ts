import Cookies from 'js-cookie'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const request = axios.create({
  // baseURL: 'https://api.example.com'
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
  if (!(config.url || '').includes('login')) {
    config.headers.Authorization = Cookies.getJSON('auth')
  }

  // 在发送请求之前做些什么
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use((response) => {
  // 对响应数据做点什么
  return response
}, (error) => {
  const { response, request, message } = error
  if (response) {
    Cookies.remove('auth')
    router.push({
      name: 'login'
    })
    return Promise.reject(error)
  } else if (request) {
    Message.error('请求超时, 请刷新重试')
  } else {
    Message.error(`请求失败: ${message}`)
  }

  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
