<template>
  <div class="container">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 瀑布流加载 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script>
import { apiSearchList } from '@/api/search'
export default {
  name: 'search-result',
  computed: {
    // 路由参数
    q () {
      return this.$route.params.q
    }
  },
  data () {
    return {
      // 瀑布相关
      list: [],
      loading: false,
      finished: false,
      // 搜索结果
      searchList: []
    }
  },
  created () {
    // 调用方法
    this.getSearchList()
  },
  methods: {
    onLoad () {
      // 瀑布加载
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    // 获得搜索结果
    async getSearchList () {
      const res = await apiSearchList({ q: this.q })
      this.searchList = res.results
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
