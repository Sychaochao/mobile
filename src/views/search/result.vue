<template>
  <div class='container'>
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
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
      // 搜索结果
      searchList: []
    }
  },
  created () {
    this.getSearchList()
  },
  methods: {
    async getSearchList () {
      const res = await apiSearchList({ q: this.q })
      this.searchList = res.results
    }
  }
}
</script>

<style scoped lang='less'></style>
