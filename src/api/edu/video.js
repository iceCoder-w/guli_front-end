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
  },

  // 根据id查询章节
  getVideo(videoId) {
    return request({
      url: `/eduservice/video/getVideoInfo/${videoId}`,
      method: 'get'
    })
  },

  // 修改章节
  updateVideo(video) {
    return request({
      url: `/eduservice/video/updateVideo`,
      method: 'post',
      data: video
    })
  },

  // 根据视频id删除视频
  deleteAliyunVod(videoId) {
    return request({
      url: `/eduvod/video/removeAliyunVideo/${videoId}`,
      method: 'delete'
    })
  }
}
