// axios导入
import request from '@/utils/request.js'

// [举报]
export function apiArticleReport ({ articleID, type, remark = '' }) {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target: articleID,
      // 对象成员简易赋值，完整写法：type:type
      type,
      remark // 其他问题 的附加说明
    }
  })
}

/**
 * 对文章不感兴趣处理
 * @param {目标文章id} articleID
 */
export function apiArticleDislike (articleID) {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: articleID
    }
  })
}

// 文章相关api函数制作

export function apiArticleList ({
  channel_id,
  timestamp
}) {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id,
      timestamp,
      with_top: 1
    }
  })
}
