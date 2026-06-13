
import request from '@/utils/request'

// 获取收货地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}

// 获取默认收货地址ID
export const getDefaultAddressId = () => {
  return request.get('/address/defaultId')
}

// 获取省市区树形数据（用于添加地址时选择地区）
export const getRegionTree = () => {
  return request.get('/region/tree')
}

// 添加收货地址
export const addAddress = (form) => {
  return request.post('/address/add', { form })
}

// 设置默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('/address/setDefault', { addressId })
}

// 删除收货地址
export const removeAddress = (addressId) => {
  return request.post('/address/remove', { addressId })
}

// 获取收货地址详情
export const getAddressDetail = (addressId) => {
  return request.get('/address/detail', {
    params: { addressId }
  })
}

// 编辑收货地址
export const editAddress = (addressId, form) => {
  return request.post('/address/edit', {
    addressId,
    form
  })
}
