// 导入axios对象
import request from '@/utils/request.js'
import store from '@/store' // 导入vuex模块，以便知道当前用户是否登录系统

// 本地持久化存储频道设置的key(游客 和 登录用户 分别设置)
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key

// 删除频道
export async function apiChannelDel (channel) {
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL

  const cacheChannels = JSON.parse(localStorage.getItem(key))
  const tmpChannels = cacheChannels.filter(item => {
    return channel.id !== item.id
  })
  localStorage.setItem(key, JSON.stringify(tmpChannels))
  return null
}

// 添加频道
export function apiChannelAdd (channel) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
    const localChannels = localStorage.getItem(key)
    if (localChannels) {
      const channels = JSON.parse(localChannels)
      channels.push(channel)
      // 重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels))
      // 成功执行
      resolve()
    }
  })
}

// 获得全部 获取所有频道数据
export function apiChannelAll () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}

// 频道相关api函数配置文件

/*
 * 获取用户的频道列表数据
 * 一般数据获取请求方式都是get
 * 当前函数不要传递参数(从【接口文档】可知)
 下面是之前的  */
/* export function apiChannelList () {
  // return：返回axios执行的结果
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
} */

export function apiChannelList () {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
    // 获取本地频道数据
    const localChannels = localStorage.getItem(key)

    if (localChannels) {
      // 输出频道数据给外部
      resolve({
        channels: JSON.parse(localChannels)
      })
    } else {
      // 频道还没被缓存
      const result = await request({
        url: '/app/v1_0/user/channels',
        method: 'get'

      })
      // 本地存储频道数据
      localStorage.setItem(key, JSON.stringify(result.channels))
      // 输出给外部
      resolve(result)
    }
  })
}
