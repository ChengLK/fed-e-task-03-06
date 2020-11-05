import request from './request'
import qs from 'qs'

interface PayloadProps {
  phone: string;
  password: string;
}

interface QueryProps {
  currentPage: string | number;
  pageSize: string | number;
}

const origin = { currentPage: 1, pageSize: 20 }

const login = (payload: PayloadProps) => {
  return request.post('/front/user/login', qs.stringify(payload))
}

const getUserInfo = () => {
  return request.get('/front/user/getInfo')
}

const getUserPages = (payload: QueryProps = origin) => {
  return request.post('/boss//user/getUserPages', payload)
}

const forbidUser = (payload: { userId: string }) => {
  return request.post('/boss/user/forbidUser', payload)
}

const gainAccessByUser = (userId: string) => {
  return request.get(`/boss/role/user/${userId}`)
}

export {
  login,
  getUserInfo,
  getUserPages,
  forbidUser,
  gainAccessByUser
}
