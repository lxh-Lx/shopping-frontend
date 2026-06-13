import request from '@/utils/request'

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('/user/info')
}

// 获取用户资产（余额、积分、优惠券）
export const getUserAssets = () => {
  return request.get('/user/assets')
}
