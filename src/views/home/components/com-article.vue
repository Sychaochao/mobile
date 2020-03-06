<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell
          v-for="item in articleList"
          :key="item.art_id.toString()"
          :title="item.title"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入获得文章的api函数
import { apiArticleList } from '@/api/article.js'
export default {
  name: 'com-article',
  props: {
    channelID: {
      // type:类型限制String Number Array, 类型不符合，就接收不到
      // required:true, 参数必须传递
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 文章列表信息
      articleList: [],
      ts: Date.now(),
      // 下拉成员
      isLoading: false, // 是不是加载的状态
      // 瀑布流 上拉成员
      list: [], // 接受加载好的内容
      loading: false,
      finished: false
    }
  },
  created () {
    // 文章
    this.getArticleList()
  },
  methods: {
    // 获得文章列表信息
    async getArticleList () {
      // 调用api获得数据（参数:频道id、时间戳）
      const obj = {
        channel_id: this.channelID,
        timestamp: this.ts
      }
      const result = await apiArticleList(obj)
      // console.log(result)
      // data接收数据
      this.articleList = result.results
    },
    // 瀑布流加载方法
    // 下拉执行的方法
    onRefresh () {
      // 设置延迟 1s 延迟
      setTimeout(() => {
        // 调用上拉获得数据
        this.onLoad()
        // 下拉加载完成 /结束 加载动画
        this.isLoading = false
        // 成功提示
        this.$toast.success('刷新成功')
      }, 1000)
    },
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
