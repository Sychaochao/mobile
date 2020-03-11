<template>
  <div class="container">
    <!-- 自己的导航栏
    left-arrow：左侧有箭头
    @click-left：单击左侧箭头的事件处理
    $router.back() 执行路由的后退操作
    -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()"/>
    <!-- 搜索输入框 -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词"
      @search="onSearch(searchText)"/>
    <van-cell-group>
     <van-cell

             icon="search"
            v-for="(item,k) in suggestionList"
            :key="k"
            @click="onSearch(item)"
            >
            <div slot="title" v-html="highLightCell(item,searchText)"></div>
     </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入api 函数
import { apiSearchSuggestion } from '@/api/search'
export default {
  name: 'search-index',
  watch: {
    // 2. 对关键字做监听，有变化就要获取联想数据
    searchText: async function (newV) {
      // 该监听器 每次进来 时候 首先清除 this.timer 就是setTimout 停
      clearTimeout(this.timer)
      // 用户没有输入信息不要联想
      if (!newV) {
        // 去除旧的联想数据
        this.suggestionList = []
        return false
      }
      this.timer = setTimeout(async () => {
        // 正常联想
        const result = await apiSearchSuggestion(newV)
        // console.log(result)
        // data接收
        this.suggestionList = result.options
      }, 1000)
    }
  },
  data () {
    return {
      suggestionList: [], // 3. 联想建议数据
      searchText: '' // 搜索关键字
    }
  },
  methods: {
    // 跳转搜索结果
    onSearch (keywords) {
      // luyou 跳转
      this.$router.push({ name: 'result', params: { q: keywords } })
    },
    highLightCell (content, keywords) {
      //  1. 创建正则，i修饰符，表示忽略大小写
      const reg = new RegExp(keywords, 'i')
      //  2. 正则与目标内容进行匹配
      const rst = content.match(reg)

      // 如果目标内容没有匹配到关键字，就不要做高亮了，原样输出即可
      if (rst === null) {
        return content
      }
      // 3. 对目标内容的关键字做替换，把"普通"的关键字变为"高亮"的关键字
      return content.replace(reg, `<span style="color:red;">${rst[0]}</span>`)
    }
  }
}
</script>

<style scoped lang='less'></style>
