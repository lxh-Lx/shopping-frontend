import request from '@/utils/request'
export const getProList = (obj) => {
  let url = '/goods/list'
  if (obj.categoryId) url += `&categoryId=${obj.categoryId}`
  if (obj.goodsName) url += `&goodsName=${obj.goodsName}`
  if (obj.page) url += `&page=${obj.page}`
  return request.get(url)
}
export const getDetail = (goodsId) => {
  return request.get(`/goods/detail&goodsId=${goodsId}`)
}

export const getProComments = (goodsId, limit) => {
  return request.get(`/comment/listRows&goodsId=${goodsId}&limit=${limit}`)
}
