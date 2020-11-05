import request from './request'

interface QueryProps {
  pageNum: string | number;
  pageSize: string | number;
}

interface UpdateProps {
  id?: string | number;
  name: string;
  spaceKey: string;
}

const getAdverts = (payload?: QueryProps) => {
  return request.get('/front/ad/getAdList', {
    data: payload
  })
}

const getAdvertSpaces = (payload?: QueryProps) => {
  return request.get('/front/ad/space/getAllSpaces', {
    data: payload
  })
}

const saveOrUpdate = (payload: UpdateProps) => {
  return request.post('/front/ad/space/saveOrUpdate', payload)
}

const getAdvertById = (id: string) => {
  return request.get(`/front/ad/getAdById?id=${id}`)
}

const advertUpdateStatus = (params: { id: string; status: number }) => {
  return request.get('/front/ad/updateStatus', { params })
}

const advertSaveOrUpdate = (payload: object) => {
  return request.post('/front/ad/saveOrUpdate', payload)
}

export {
  UpdateProps,
  getAdverts,
  getAdvertSpaces,
  saveOrUpdate,
  getAdvertById,
  advertUpdateStatus,
  advertSaveOrUpdate
}
