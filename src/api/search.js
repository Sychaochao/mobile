// 导入axios
import request from '@/utils/request.js'
// 获取搜索结果
export function apiSearchList ({ q, page = 1, per_page = 10 }) {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    params: {
      q,
      page,
      per_page
    }
  })
}
// 搜索相关的api函数制作
/**
 * 根据用户输入信息，获得联想关键字
 * @param {用户输入的关键字} q
 */
export function apiSearchSuggestion (q) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    params: {
      q
    }
  })
}
