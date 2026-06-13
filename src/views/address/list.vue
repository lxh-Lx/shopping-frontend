<template>
  <div class="address-list">
    <van-nav-bar fixed title="收货地址" left-arrow @click-left="$router.back(-1)">
      <template #right>
        <span @click="goAdd" class="add-btn">新增</span>
      </template>
    </van-nav-bar>

    <div class="address-content">
      <div v-if="addressList.length === 0" class="empty">
        <van-icon name="location-o" />
        <p>暂无收货地址</p>
        <button @click="goAdd">立即添加</button>
      </div>

      <div v-else class="list">
        <div
          v-for="item in addressList"
          :key="item.address_id"
          class="address-item"
          @click="selectAddress(item)"
        >
          <div class="radio" @click.stop="toggleDefault(item)">
            <van-icon v-if="item.is_default" name="checked" color="#ff4444" />
            <van-icon v-else name="circle-o" />
          </div>
          <div class="info">
            <div class="top">
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.phone }}</span>
              <span v-if="item.is_default" class="default">默认</span>
            </div>
            <div class="address">
              {{ (item.region && item.region.province) || '' }}{{ (item.region && item.region.city) || '' }}{{ (item.region && item.region.region) || '' }}{{ item.detail || '' }}
            </div>
          </div>
          <div class="actions">
            <span @click.stop="editAddress(item)">编辑</span>
            <span @click.stop="deleteAddress(item.address_id)">删除</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddressList, setDefaultAddress, removeAddress } from '@/api/address'
import { Toast } from 'vant'

export default {
  name: 'AddressList',
  data () {
    return {
      addressList: []
    }
  },
  created () {
    this.loadAddressList()
  },
  methods: {
    async loadAddressList () {
      const { data: { list } } = await getAddressList()
      this.addressList = list
    },
    goAdd () {
      this.$router.push('/address/add')
    },
    selectAddress (item) {
      // 如果是从支付页面跳转过来的，选择地址后返回
      if (this.$route.query.from === 'pay') {
        // 通过 sessionStorage 传递选中的地址
        sessionStorage.setItem('selectedAddress', JSON.stringify(item))
        this.$router.back()
      }
    },
    async toggleDefault (item) {
      if (!item.is_default) {
        try {
          await setDefaultAddress(item.address_id)
          Toast('设置默认地址成功')
          this.loadAddressList()
        } catch (error) {
          Toast('设置失败')
        }
      }
    },
    editAddress (item) {
      this.$router.push({
        path: '/address/add',
        query: {
          addressId: item.address_id
        }
      })
    },
    async deleteAddress (addressId) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要删除这个地址吗？'
      }).then(async () => {
        try {
          await removeAddress(addressId)
          Toast('删除成功')
          this.loadAddressList()
        } catch (error) {
          Toast('删除失败')
        }
      }).catch(() => {
        // 用户取消
      })
    }
  }
}
</script>

<style lang="less" scoped>
.address-list {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-top: 46px;
}

.address-content {
  padding: 10px;
}

.add-btn {
  color: #ff4444;
  font-size: 14px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  .van-icon {
    font-size: 60px;
    color: #ccc;
    margin-bottom: 20px;
  }
  p {
    color: #999;
    margin-bottom: 20px;
  }
  button {
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    border: none;
    padding: 10px 40px;
    border-radius: 20px;
    font-size: 14px;
  }
}

.list {
  .address-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 10px;
    position: relative;
  }
}

.radio {
  margin-right: 15px;
  margin-top: 5px;
}

.info {
  flex: 1;
  .top {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .name {
      font-size: 16px;
      font-weight: bold;
      margin-right: 15px;
    }
    .phone {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }
    .default {
      font-size: 12px;
      color: #ff4444;
      background-color: #fff5f5;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
  .address {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  span {
    font-size: 12px;
    color: #999;
    padding: 5px 0;
    &:first-child {
      color: #666;
    }
  }
}
</style>
