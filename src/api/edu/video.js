import request from '@/utils/request'

export default {
  // 添加小节
  addVideo(video) {
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },

  // 根据id删除小节
  deleteVideo(videoId) {
    return request({
      url: `/eduservice/video/deleteVideo/${videoId}`,
      method: 'delete'
    })
  }
  //
  // // 根据id查询章节
  // getChapter(chapterId) {
  //   return request({
  //     url: `/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
  //     method: 'get'
  //   })
  // },
  //
  // // 修改章节
  // updateChapter(chapter) {
  //   return request({
  //     url: `/eduservice/edu-chapter/updateChapter`,
  //     method: 'post',
  //     data: chapter
  //   })
  // },
  //

}
