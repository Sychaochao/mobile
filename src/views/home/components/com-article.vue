<template>
 <div class="scroll-wrapper">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" />
          </van-list>
        </div>
</template>

<script>
export default {
  name: 'com-article',
  data () {
    return {
      // 瀑布流
      list: [], // 接受加载好的内容
      loading: false,
      finished: false
    }
  },
  methods: {
    // 瀑布流加载方法
    onLoad () {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false // 清除

        // 数据 全部加载完成
        if (this.list.length >= 40) {
          this.finished = true // 停止瀑布流加载
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
// 给上拉列表区域设置样式
.scroll-wrapper {
  height: 100%;
  // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
  // 是瀑布实现的关键要素
  overflow-y: auto;
}
</style>
