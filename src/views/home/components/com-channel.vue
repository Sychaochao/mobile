<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{ height: '20%' }"
    close-icon-position="top-left"
  ></van-popup>
</template>

<script>
export default {
  name: 'com-channel',
  props: {
    // 接收父组件v-model的数据信息
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
