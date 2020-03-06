// axios导入
import request from '@/utils/request.js'

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
