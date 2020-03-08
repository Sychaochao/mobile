<template>
  <div>
    <!-- 暂时表现弹出框效果
  v-model：设置弹出框是否显示 true显示、false不显示
  title：弹出框标题，可以不设置
  show-cancel-button：显示取消按钮
  :showConfirmButton="false" 不要显示取消按钮，false是boolean值
  showConfirmButton="false" false是字符串

  closeOnClickOverlay 是否在点击遮罩层后关闭弹窗,不要绑定内容，就是true被绑定
  :closeOnClickOverlay="true"

  closed 关闭弹窗时触发,isOneLevel=true，使得一级菜单被设置激活
    -->
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      :show-confirm-button="false"
      close-on-click-overlay
      @close="isOneLevel=true"
    >
     <van-cell-group v-if="isOneLevel">
        <!-- 一级菜单 -->
        <van-cell title="不感兴趣" icon="location-o"></van-cell>
        <van-cell title="反馈垃圾内容" icon="location-o" is-link @click="isOneLevel=false"></van-cell>
        <van-cell title="拉黑作者" icon="location-o"></van-cell>
      </van-cell-group>
     <van-cell-group v-else>
  <van-cell icon="arrow-left" @click="isReportShow=false"/>
  <van-cell
            v-for="item in reportsList"
            :key="item.value"
            :title="item.title"
            icon="location-o"
            @click="articleReport(item.value)"
            />
</van-cell-group>
    </van-dialog>
    <!-- :value+@input 是 v-model的体现
        @input="$emit('input')" $emit调用input事件，把感知到的信息
        传递给事件对应的v-model成员里边，即父组件的showDialog
        当前组件，鼠标单击对话框旁处，就可以使得value属性值为false
        这个false信息要传递给showDialog，这可以使得后续该弹出框"不断"被展示出来

        理论上代码应该为：$emit('input',$event.target.value)
        实际上不要设置$event.target.value，设置到不对，因为
        van-dialog是组件，不是普通表单域，$event.target.value不能表达出来当前组件的value属性信息
        @input="$emit('input',$event)" 在van-dialog内部会被"封装"为
        $emit('input',$event.target.value)

        组件标签都是：@input="$emit('input',$event)"
        普通表单域：$emit('input',$event.target.value)
    -->
  </div>
</template>

<script>
// 导入api模块函数
import { apiArticleDislike, apiArticleReport } from '@/api/article'
export default {
  name: 'more-action',
  props: {
    value: {
      Boolean,
      default: false
    },
    // 接收不喜欢文章id
    articleID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 举报类型：
      reportsList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ],
      isOneLevel: true // 控制一级、二级信息明细显示
    }
  },
  methods: {
    // 文章举报
    // type:举报类型
    async articleReport (type) {
      // type:是对象成员简易赋值type:type
      // 文章举报要么成功、要么失败(文章被重复举报)，所以try/catch要介入
      try {
        // 只要apiapiArticleReport 函数发生致命名错，其他语句都没有问题
        const obj = { articleID: this.articleID, type }
        await apiArticleReport(obj)
      } catch (err) {
        // return:停止catch以外的代码执行
        if (err.response.status === 409) {
          return this.$toast.fail('文章已经被举报过了')
        } else {
          return this.$toast.fail('文章举报失败')
        }
      }

      // 成功提示
      this.$toast.success('举报成功！')
      // 弹出框消失
      this.$emit('input', false)
    },
    // 文章不感兴趣处理
    async articleDislike () {
      // 调用api
      // 当前处理，正常情况成功率100%
      await apiArticleDislike(this.articleID)

      this.$toast.success('处理成功')
      // 关闭弹出框,修改父组件的showDialog的值为false，进而影响子组件关闭弹框
      this.$emit('input', false)

      // 调用自己的事件，使得父组件页面文章清除
      this.$emit('dislikeSuccess')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
