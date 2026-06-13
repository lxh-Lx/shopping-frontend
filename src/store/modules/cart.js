import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      const item = state.cartList.find(item => item.goods_id === goodsId)
      if (item) {
        item.isChecked = !item.isChecked
      }
    },
    toggleAllCheck (state, isChecked) {
      state.cartList.forEach(item => {
        item.isChecked = isChecked
      })
    },
    changeCount (state, obj) {
      const item = state.cartList.find(item => item.goods_id === obj.goodsId)
      if (item) {
        item.goods_num = obj.goodsNum
      }
    }
  },
  actions: {
    async getCartAction (context) {
      const { data } = await getCartList()
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      await changeCount(obj.goodsId, obj.goodsNum, obj.goodsSkuId)
      context.commit('changeCount', obj)
    },
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      await delSelect(selCartList.map(item => item.id))
      Toast('删除成功')
      context.dispatch('getCartAction')
    }
  },
  getters: {
    cartTotal (state) {
      return state.cartList.reduce((pre, cur) => pre + cur.goods_num, 0)
    },
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    selCount (state, getters) {
      return getters.selCartList.reduce((pre, cur) => pre + cur.goods_num, 0)
    },
    selPrice (state, getters) {
      return getters.selCartList.reduce((pre, cur) => pre + cur.goods.goods_price_min * cur.goods_num, 0).toFixed(2)
    },
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
