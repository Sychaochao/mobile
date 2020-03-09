<template>
  <div class="scroll-wrapper">
      <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="downSuccessText"
      :success-duration="1000"
    >
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
                <van-image width="85" height="85" :src="item.cover.images[item2-1]" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <!--给 van-cell  的右侧设置叉号按钮
                van-icon:图标组件name="close"代表叉号
              -->
              <van-icon
                name="close"
                style="float:right;"
                @click="displayDialog(item.art_id.toString())"
              />
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate | formatTime}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 文章更多弹出层 -->
    <more-action
      v-model="showDialog"
      :articleID="nowArticleID"
      @dislikeSuccess="handleDislikeSuccess"
    ></more-action>
  </div>
</template>

<script>
// 对com-moreaction.vue弹出框组件做 导入、注册、使用
import MoreAction from './com-moreaction.vue'
// 导入获得文章的api函数
import { apiArticleList } from '@/api/article.js'
export default {
  name: 'com-article',
  components: {
    MoreAction
  },
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
      // 下拉动作完成的文字提示
      downSuccessText: '',
      nowArticleID: '', //  不感兴趣文章id
      showDialog: false, // 控制子组件弹出框是否显示
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
    handleDislikeSuccess () {
      const index = this.articleList.findIndex(item => {
        // 满足条件就return为true信息出来，那么当前项目的下标序号就获得的到了
        return item.art_id.toString() === this.nowArticleID
      })
      //  通过下标序号从列表中删除指定的文章
      // 数组.splice(下标, 长度)
      this.articleList.splice(index, 1)
      // (只是页面级删除)
    },
    // 展示更多操作的弹层
    displayDialog (artID) {
      this.showDialog = true
      // 3. 把文章id赋予给data成员
      this.nowArticleID = artID
    },
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
    // 下拉刷新
    async onRefresh () {
      await this.$sleep(800)

      // 获得文章列表数据
      const articles = await this.getArticleList()

      // 判断是否有获得到最新的文章
      if (articles.results.length > 0) {
        // 有获得到 unshift 数组前置追加元素
        this.articleList.unshift(...articles.results)
        // 更新时间戳
        this.ts = articles.pre_timestamp // 使得继续请求，可以获得下页数据
        this.downSuccessText = '文章更新成功'
      } else {
        // 没有最新的文章了，页面要给与提示
        this.downSuccessText = '文章已经是最新的'
      }
      this.isLoading = false // 下拉动画消失[加载完成了]
    },

    // 下拉执行的方法  之前的 看看这相当于index.vue 组件  方法 定义 引入看好
    /*   onRefresh () {
      // 设置延迟 1s 延迟
      setTimeout(() => {
        // 调用上拉获得数据
        this.onLoad()
        // 下拉加载完成 /结束 加载动画
        this.isLoading = false
        // 成功提示
        this.$toast.success('刷新成功')
      }, 1000)
    }, */

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
