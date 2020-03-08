<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title">
          <template slot="label">
            <van-grid
              :column-num="item.cover.type"
              :gutter="10"
              :border="false"
              v-if="item.cover.type>0"
            >
              <!-- 封面图片类型：没有type=0、 1个type=1、 3个type=3 -->
              <!-- v-for可以对数字做遍历 -->
              <!-- v-for="xx in 3" //xx: 1、2、3  -->
              <van-grid-item v-for="item2 in item.cover.type" :key="item2">
                <!-- van-image是表现图片的组件，图片下标是从0开始，自然item2-1操作 -->
               <!-- lazy-load懒加载 -->
                <van-image
                width="85" height="85"
                 :src="item.cover.images[item2-1]"
                  lazy-load
                  />
              </van-grid-item>
            </van-grid>
            <p>
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
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
      return result
      // this.articleList = result.results
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
    /*   onLoad () { // 之前的操作
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
    } */
    // 瀑布流上拉执行的动作
    async onLoad () {
      // 每次执行给延迟0.8秒
      await this.$sleep(800)
      // 瀑布 与 真实文章 结合
      // 1. 获得真实文章数据
      const articles = await this.getArticleList()
      // articles:{results:文章列表，pre_timestamp:分页时间戳}
      // console.log(articles)
      // 2. 对数据做处理
      if (articles.results.length > 0) {
        // data接收数据，要设置"追加"，不要直接赋值
        // 直接赋值会使得瀑布的数据区域填充不满，会造成瀑布不断加载效果
        this.articleList.push(...articles.results)
        // ... 展开运算符，是要把[]数组标志给去除，使得内部各个小元素暴露出来，进而被push追加使用
        // this.articleList.push({id,title,xx},{id,title,xx},{id,title,}……)
        // 更新时间戳，方便获取"下一页"数据
        this.ts = articles.pre_timestamp
      } else {
        // 没有获得到数据，要停止瀑布流
        this.finished = true
      }

      // 3. 停止瀑布加载动画
      this.loading = false
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
