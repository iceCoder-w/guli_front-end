import request from '@/utils/request'

export default {
  // 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },
  // 查询所有讲师
  getListTeacher() {
    return request({
      url: '/eduservice/edu-teacher/findAll',
      method: 'get'
    })
  },

  // 根据课程id查询课程基本信息
  getCourseInfoById(id) {
    return request({
      url: `/eduservice/course/getCourseInfo/${id}`,
      method: 'get'
    })
  }
}
