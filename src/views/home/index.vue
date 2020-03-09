<template>
  <div class="container">

    <van-tabs v-model="activeChannelIndex">
      <div slot="nav-right" class="channel-more" @click="showChannel=true">
        <!-- /t图标  wanp-nav 三个杠图标 -->
        <van-icon name="wap-nav" />
      </div>
      <!-- 频道操作 -->
      <com-channel v-model="showChannel"></com-channel>
      <!-- <van-tab title="标签名称">当前标签对应的内容</van-tab> -->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 使用 ，把激活频道id当参数，传递给子组件-->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ComChannel from './components/com-channel'
// 导入获得频道的api函数
import { apiChannelList } from '@/api/channel.js'
// 导入文章瀑布组件
import ComArticle from './components/com-article.vue'
export default {
  name: 'home-index',
  components: {
    // 注册
    ComChannel,
    ComArticle

  },
  data () {
    return {
      showChannel: false, // 频道弹出层显示标志
      isLoading: false,
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
/*给 更多 频道设置样式*/
.channel-more{
  position:fixed;
  right:0;
  background-color: white;
  line-height:88px;
  height:88px;
  width: 90px;
  text-align:center;
  font-size:40px;
}
/*频道列表*/
.van-tabs {
  /deep/ .van-tabs__wrap {
    width: 90%; /*设置频道列表最大宽度，可以避免最后一个频道被按钮覆盖住*/
  }
}
</style>
