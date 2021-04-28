import request from '@/utils/request'

export default {
  // 根据课程id获得章节、小节列表
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },

  // 添加章节
  addChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },

  // 根据id查询章节
  getChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },

  // 修改章节
  updateChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },

  // 根据id查询章节
  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  }
}
