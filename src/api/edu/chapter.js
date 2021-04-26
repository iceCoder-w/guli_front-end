import request from '@/utils/request'

export default {
  // 根据课程id获得章节、小节列表
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  }
}
