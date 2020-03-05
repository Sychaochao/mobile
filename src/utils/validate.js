//  1按需导入extend函数  相同不需要在写 from
import {
  extend,
  localize
} from 'vee-validate'
// 2导入语言包
import zhCN from 'vee-validate/dist/locale/zh_CN.json'
// 导入全部规则
import * as rules from 'vee-validate/dist/rules'
// rules: {alpha:xx,alpha_dash:xx,alpha_num:xx……}
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})
// 3 注册语言包  对象成员简易赋值
localize({
  zhCN
})
// 4. 使用具体的语言
localize('zhCN')

// 增加自定义规则
extend('phone', {
  validate: value => {
    // 校验成功 返回 true 否则返回false
    // 定义正则 匹配
    const reg = /^1[35789]\d{9}$/
    return reg.test(value)
    // return value % 2 !== 0
  },
  message: '{_field_}格式不正确哟'
})
