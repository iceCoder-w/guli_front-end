import request from '@/utils/request'

export default {
  // 获取一篇论文
  getPaperById(paperId) {
    return request({
      url: `/paperservice/paper-baseinfo/getOnePaper/${paperId}`,
      method: 'get'
    })
  }
}
