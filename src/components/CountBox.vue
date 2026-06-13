<template>
    <div class="count-box">
        <button class="minus" @click="handleSub">-</button>
        <input @change="handleChange" :value="value" class="inp" type="text">
        <button class="add" @click="handleAdd">+</button>
    </div>
</template>

<script>
export default {
  name: 'CountBox',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleChange (e) {
      const num = +e.target.value
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }
}
</script>
<style lang="less" scoped>
.count-box {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    .add,.minus {
        width: 30px;
        height: 30px;
        outline: none;
        border: none;
        background-color: #efefef;
        cursor: pointer;
        z-index: 10;
        position: relative;
    }
    .inp {
        width: 40px;
        height: 30px;
        outline: none;
        border: none;
        margin: 0 5px;
        background-color: #efefef;
        text-align: center;
    }
}
</style>
