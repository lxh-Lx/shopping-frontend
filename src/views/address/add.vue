<template>
  <div class="address-add">
    <van-nav-bar fixed :title="isEdit ? '编辑地址' : '新增地址'" left-arrow @click-left="$router.go(-1)" />

    <div class="form-content">
      <div class="form-item">
        <label>收货人</label>
        <input v-model="form.name" type="text" placeholder="请输入收货人姓名" />
      </div>

      <div class="form-item">
        <label>手机号码</label>
        <input v-model="form.phone" type="tel" placeholder="请输入手机号码" />
      </div>

      <div class="form-item">
        <label>所在地区</label>
        <div class="region-picker" @click="openRegionPicker">
          <span v-if="regionText">{{ regionText }}</span>
          <span v-else class="placeholder">请选择省市区</span>
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="form-item">
        <label>详细地址</label>
        <textarea v-model="form.detail" placeholder="请输入详细地址"></textarea>
      </div>

      <div class="form-item">
        <label>设为默认地址</label>
        <van-switch v-model="form.is_default" size="24" />
      </div>
    </div>

    <div class="submit-btn">
      <button @click="submitForm">{{ isEdit ? '保存修改' : '保存地址' }}</button>
    </div>

    <!-- 省市区选择器 -->
    <van-popup v-model="showRegionPicker" position="bottom" height="60%">
      <van-picker
        v-if="showRegionPicker"
        show-toolbar
        :columns="regionColumns"
        :value="pickerValue"
        @confirm="onRegionConfirm"
        @cancel="showRegionPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { addAddress, getAddressList, editAddress, getRegionTree } from '@/api/address'
import { Toast } from 'vant'

export default {
  name: 'AddressAdd',
  data () {
    return {
      form: {
        name: '',
        phone: '',
        region: [],
        detail: '',
        is_default: false
      },
      showRegionPicker: false,
      regionColumns: [],
      pickerValue: [],
      isEdit: false,
      editId: ''
    }
  },
  computed: {
    regionText () {
      if (!this.form.region || this.form.region.length === 0) return ''
      return this.form.region.map(item => item.label).join(' ')
    }
  },
  created () {
    this.loadRegionData()
    // 检查是否是编辑模式
    const addressId = this.$route.query.addressId
    if (addressId) {
      this.isEdit = true
      this.editId = addressId
      this.loadAddressDetail(addressId)
    }
  },
  methods: {
    // 将后端嵌套对象转为 Vant Picker 级联格式
    transformRegionData (obj) {
      if (!obj || typeof obj !== 'object') return []
      return Object.values(obj).map(item => {
        // 结构化拷贝，避免直接 mutate 原始数据
        const node = {
          text: item.name || '',
          value: String(item.id) || '',
          id: item.id,
          name: item.name || ''
        }
        // 处理三级数据结构：省->city->region
        const children = item.city || item.region || null
        if (children) {
          const childData = this.transformRegionData(children)
          // 对空 children 做兜底
          if (childData.length > 0) {
            node.children = childData
          }
        }
        return node
      })
    },
    async loadRegionData () {
      try {
        const res = await getRegionTree()
        if (!res || !res.data) {
          Toast('地区数据获取失败')
          return
        }
        const data = res.data
        const list = data.list || {}
        // 使用深拷贝避免污染原始数据
        const listCopy = JSON.parse(JSON.stringify(list))
        this.regionColumns = this.transformRegionData(listCopy)
      } catch (error) {
        console.error('加载地区数据失败:', error)
        Toast('加载地区数据失败')
      }
    },
    async loadAddressDetail (addressId) {
      try {
        const response = await getAddressList()
        const data = response.data || response
        const list = data.data && data.data.list ? data.data.list : (data.list || [])
        const address = list.find(item => String(item.address_id) === String(addressId))
        if (address) {
          // 确保 region 是数组类型
          let regionData = address.region
          if (!Array.isArray(regionData)) {
            regionData = []
          }
          this.form = {
            name: address.name,
            phone: address.phone,
            region: regionData,
            detail: address.detail || '',
            is_default: address.is_default === 1
          }
        } else {
          Toast('未找到地址信息')
        }
      } catch (error) {
        console.error('获取地址详情失败:', error)
        Toast('获取地址详情失败')
      }
    },
    // 计算选择器的默认值（文本数组）
    calcPickerValue () {
      if (!this.form.region || !Array.isArray(this.form.region) ||
          this.form.region.length === 0 || this.regionColumns.length === 0) {
        return []
      }
      let current = this.regionColumns
      const values = []
      for (let i = 0; i < this.form.region.length && current.length > 0; i++) {
        const regionItem = this.form.region[i]
        if (!regionItem) break
        const selectedId = regionItem.id || regionItem.value
        if (!selectedId) break
        const item = current.find(item => String(item.id) === String(selectedId))
        if (!item) break
        values.push(item.text)
        current = (item.children) || []
      }
      return values
    },
    openRegionPicker () {
      this.pickerValue = this.calcPickerValue()
      this.showRegionPicker = true
    },
    onRegionConfirm (value) {
      // value 是各级选中的 text 数组，如 ['北京', '北京市', '东城区']
      // 从单一数据源 regionColumns 推导，确保数据一致性
      let current = this.regionColumns
      const selected = []
      for (let i = 0; i < value.length && current.length > 0; i++) {
        const item = current.find(item => item.text === value[i])
        if (item) {
          // 结构化拷贝，避免引用原始数据
          selected.push({
            value: String(item.id),
            label: item.name,
            id: item.id,
            name: item.name
          })
          // 从同一数据源派生下一级数据
          current = item.children || []
        }
      }
      this.form.region = selected
      this.showRegionPicker = false
    },
    async submitForm () {
      // 表单验证
      if (!this.form.name.trim()) {
        Toast('请输入收货人姓名')
        return
      }
      if (!this.form.phone.trim()) {
        Toast('请输入手机号码')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        Toast('请输入正确的手机号码')
        return
      }
      if (!this.form.region || this.form.region.length === 0) {
        Toast('请选择省市区')
        return
      }
      if (!this.form.detail.trim()) {
        Toast('请输入详细地址')
        return
      }

      // 构建提交数据 - region需要三级数据（省、市、区）
      const regionData = this.form.region
      const submitData = {
        name: this.form.name,
        phone: this.form.phone,
        region: regionData,
        detail: this.form.detail,
        is_default: this.form.is_default ? 1 : 0
      }

      try {
        if (this.isEdit) {
          await editAddress(this.editId, submitData)
          Toast('修改成功')
        } else {
          await addAddress(submitData)
          Toast('添加成功')
        }
        this.$router.push('/address/list')
      } catch (error) {
        Toast(this.isEdit ? '修改失败' : '添加失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.address-add {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-top: 46px;
}

.form-content {
  background-color: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 15px;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  label {
    width: 70px;
    font-size: 14px;
    color: #333;
  }
  input {
    flex: 1;
    font-size: 14px;
    border: none;
    outline: none;
    text-align: right;
  }
  textarea {
    flex: 1;
    font-size: 14px;
    border: none;
    outline: none;
    min-height: 80px;
    resize: none;
  }
}

.region-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .placeholder {
    color: #999;
  }
}

.submit-btn {
  padding: 20px 10px;
  button {
    width: 100%;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    border: none;
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
  }
}
</style>
