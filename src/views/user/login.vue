<template>
  <div class="user-login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分
      vant里边没有form相关组件，只有普通表单域组件
      van-cell-group是对普通表单域组件做封装
    -->
    <van-cell-group>
      <!--van-field 输入框表单域组件
        label="手机号" 表单域前边的名字设置
        required：不进行校验，设置表单域前边有"红星"
        clearable：表单域内容可以通过右侧“叉号”清除
      -->
      <ValidationProvider rules="required" name="手机号" v-slot="{errors}">
        <van-field
          v-model="loginForm.mobile"
          type="tel"
          placeholder="请输入手机号码"
          label="手机号"
          required
          clearable
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider rules="required" name="验证码" v-slot="{errors }">
        <van-field
          v-model="loginForm.code"
          type="password"
          placeholder="请输入验证码"
          label="验证码"
          required
          clearable
          :error-message="errors[0]"
        >
          <!-- "命名插槽"应用，提示相关按钮，是要给van-field组件内部的slot去填充的
        size="small" 设置按钮大小的
        type="primary" 设置按钮背景颜色
          -->
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
      </ValidationProvider>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type:按钮背景颜色,info是蓝色
        size:按钮大小的
        round：圆边效果
        block：块级样式设置，占据一行
      -->
      <van-button type="info" size="small" round block @click="login()">登录</van-button>
    </div>
  </div>
</template>

<script>
// 验证校验相关导入
import { ValidationProvider } from 'vee-validate'
import { apiUserLogin } from '@/api/user.js'

export default {
  name: 'user-login',
  components: {
    // 注册
    ValidationProvider
  },
  data () {
    return {
      // 登录表单数据对象
      // mobile和code是"api数据接口"告诉的，不是自定义的
      loginForm: {
        mobile: '13911111111', // 手机号码
        code: '246810' // 验证码
      }
    }
  },
  methods: {
    // 登录系统
    async login () {
      try {
        const result = await apiUserLogin(this.loginForm)
        this.$store.commit('updateUser', result)
      } catch (err) {
        // 错误提示
        return this.$toast.fail('亲 用户或密码错误了哟' + err)
      }
      this.$toast.success('登录成功咯!')
      this.$router.push('/') // 跳转到首页 页面
    }
  }
}
</script>

<style scoped lang='less'>
// 登录按钮样式
.login-btn {
  margin: 40px;
}
</style>
