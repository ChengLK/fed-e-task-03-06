import request from './request'

interface QueryProps {
  current: string | number;
  size: string | number;
}

interface RolePros {
  id: string;
  code: string;
  name: string;
  description: string;
}

const origin: QueryProps = { current: 1, size: 10 }

const getMenuSumInfo = () => {
  return request.get('/boss/menu/getAll')
}

const getMenuPages = (payload = origin) => {
  return request.post('/boss/menu/getMenuPages', payload)
}

const getRolePages = (payload = origin) => {
  return request.post('/boss/role/getRolePages', payload)
}

const getRoleContent = (id: string) => {
  return request.get(`/boss/menu/getEditMenuInfo?id=${id}`)
}

const getResourcePages = (payload = origin) => {
  return request.post('/boss/resource/getResourcePages', payload)
}

const isDeleteSource = (id: string) => {
  return request.delete(`/boss/resource/${id}`)
}

const menuSaveOrUpdate = (payload: object) => {
  return request.post('/boss/menu/saveOrUpdate', payload)
}

const isDeleteMenu = (id: string) => {
  return request.delete(`/boss/menu/${id}`)
}

const isDeleteCategory = (id: string) => {
  return request.delete(`/boss/resource/category/${id}`)
}

const sourceSaveOrUpdate = (payload: object) => {
  return request.post('/boss/resource/saveOrUpdate', payload)
}

const getCategoryPages = () => {
  return request.get('/boss/resource/category/getAll')
}

const categorySaveOrderUpdate = (payload: { name: string; sort: string }) => {
  return request.post('/boss/resource/category/saveOrderUpdate', payload)
}

const roleSaveOrUpdate = (payload: RolePros) => {
  return request.post('/boss/role/saveOrUpdate', payload)
}

const deleteRoleItem = (id: string) => {
  return request.delete(`/boss/role/${id}`)
}

const gainAccessRoles = () => {
  return request.get('/boss/role/all')
}

const getMenuNodeList = () => {
  return request.get('/boss/menu/getMenuNodeList')
}

const getResourceAll = () => {
  return request.get('/boss/resource/getAll')
}

const getRoleMenus = (roleId: string) => {
  return request.get(`/boss/menu/getRoleMenus?roleId=${roleId}`)
}

const getRoleResources = (roleId: string) => {
  return request.get(`boss/resource/getRoleResources?roleId=${roleId}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allocateRoleMenus = (payload: {menuIdList: any[]; roleId: string}) => {
  return request.post('/boss/menu/allocateRoleMenus', payload)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allocateRoleResources = (payload: {resourceIdList: any[]; roleId: string}) => {
  return request.post('/boss/resource/allocateRoleResources', payload)
}

export {
  RolePros,
  getMenuPages,
  getRolePages,
  getMenuSumInfo,
  getResourcePages,
  isDeleteSource,
  getRoleContent,
  menuSaveOrUpdate,
  isDeleteMenu,
  sourceSaveOrUpdate,
  getCategoryPages,
  categorySaveOrderUpdate,
  isDeleteCategory,
  gainAccessRoles,
  roleSaveOrUpdate,
  deleteRoleItem,
  getMenuNodeList,
  allocateRoleMenus,
  getRoleMenus,
  getRoleResources,
  getResourceAll,
  allocateRoleResources
}
