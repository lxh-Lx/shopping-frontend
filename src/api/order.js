import request from '@/utils/request'
export const checkOrder = (mode, obj) => {
  let url = `/checkout/order&mode=${mode}&delivery=10&couponId=0&isUsePoints=0`
  if (obj.cartIds) url += `&cartIds=${obj.cartIds}`
  if (obj.goodsId) url += `&goodsId=${obj.goodsId}`
  if (obj.buyNum) url += `&buyNum=${obj.buyNum}`
  return request.get(url)
}
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10,
    couponId: 0,
    isUsePoints: 0,
    payType: 10,
    ...obj
  })
}
export const getMyOrderList = (dataType, page) => {
  return request.get(`/order/list&dataType=${dataType}&page=${page}`)
}

// 获取订单状态数量（待支付/待发货/待收货/退款）
export const getOrderTodoCounts = () => {
  return request.get('/order/todoCounts')
}

// 获取订单详情
export const getOrderDetail = (orderId) => {
  return request.get(`/order/detail?orderId=${orderId}`)
}

// 取消订单
export const cancelOrder = (orderId) => {
  return request.post('/order/cancel', { orderId })
}

// 订单支付
export const payOrder = (orderId, payType) => {
  return request.get(`/order/pay?orderId=${orderId}&payType=${payType}`)
}

// 确认收货
export const confirmReceipt = (orderId) => {
  return request.post('/order/receipt', { orderId })
}

// 获取订单评价商品列表
export const getCommentGoodsList = (orderId) => {
  return request.get(`/order/comment/list?orderId=${orderId}`)
}

// 提交商品评价
export const submitComment = (orderId, form) => {
  return request.post('/order/comment/submit', { orderId, form })
}

// 申请售后
export const applyRefund = (orderGoodsId, form) => {
  return request.post('/refund/goods', { orderGoodsId, form })
}
