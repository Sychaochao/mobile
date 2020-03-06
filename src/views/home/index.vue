<template>
  <div class="container">
    <van-tabs v-model="activeChannelIndex">
      <!-- <van-tab title="标签名称">当前标签对应的内容</van-tab> -->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 使用 ，把激活频道id当参数，传递给子组件-->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 导入获得频道的api函数
import { apiChannelList } from '@/api/channel.js'
// 导入文章瀑布组件
import ComArticle from './components/com-article.vue'
export default {
  name: 'home-index',
  components: {
    // 注册
    ComArticle
  },
  data () {
    return {
      // 频道列表数据
      channelList: [],
      // 激活 频道下标标志
      activeChannelIndex: 0
    }
  },
  created () {
    // 自动 获取频道数据
    this.getChannelList()
  },
  methods: {
    // 获得频道列表数据
    async getChannelList () {
      // 通过api获得数据
      const result = await apiChannelList()
      // console.log(result)
      // data成员接收频道数据
      this.channelList = result.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    // 给上拉列表设置样式
    .scroll-wrapper {
      height: 100%;
      // 瀑布流 区域 如果垂直方向内容过多 要呈现滚动条
      overflow-y: auto;
    }
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: rgb(30, 219, 210);
  }
}
</style>
