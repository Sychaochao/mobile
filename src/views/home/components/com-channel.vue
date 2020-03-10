<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{ height: '95%' }"
    close-icon-position="top-left"
    @closed="isEdit=false"
  >
    <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="titlte">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
            round
            @click="isEdit=!isEdit"
          >{{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item,k) in channelList" :key="item.id">
          <span class="text" :style="{color:k===activeChannelIndex?'red':''}">{{item.name}}</span>
          <van-icon @click="userToRest(item,k)"  v-show="isEdit && k>0" class="close-icon" name="close" />
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 频道推荐 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
// 获得所有频道的api函数
import { apiChannelAll, apiChannelAdd, apiChannelDel } from '@/api/channel.js'

export default {
  name: 'com-channel',
  data () {
    return {
      isEdit: false, // 是否是编辑状态
      // restChannels: [],
      channelAll: [] // 全部频道
    }
  },
  props: {
    // 接收父组件v-model的数据信息
    value: {
      type: Boolean,
      default: false
    },
    // 父传递过来的 我的频道数据
    channelList: {
      type: Array,
      default: () => {}
    },
    // 激活当前频道
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    restChannel () {
      const userChannelIDs = this.channelList.map(item => {
        return item.id
      })
      const rest = this.channelAll.filter(item => {
        // 我的频道  里边不包含当前项目，就给与收集
        // 判断我的频道id集合 是否包含当前项目，不包含的才收集
        // 数组.includes(元素)  判断数组中是否有出现某个元素，返回Boolean
        return !userChannelIDs.includes(item.id)
      })
      return rest
    }
  },
  created () {
    this.getChannelAll()
  },
  methods: {
    // ····························· 删除频道·································
    userToRest (channel, index) {
      this.channelList.splice(index, 1)
      apiChannelDel(channel)
    },
    // 推荐 频道 添加频道···············································
    restToUser (channel) {
      this.channelList.push(channel)
      apiChannelAdd(channel)
    },
    // 获得"全部"频道数据
    async getChannelAll () {
      const result = await apiChannelAll()
      this.channelAll = result.channels
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
