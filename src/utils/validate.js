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
localize({ zhCN })
// 4. 使用具体的语言
localize('zhCN')
