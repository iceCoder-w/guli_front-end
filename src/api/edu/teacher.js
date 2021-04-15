import request from '@/utils/request'

export default {
  // 讲师列表（条件查询分页）
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },
  removeById(id) {
    return request({
      url: `/eduservice/edu-teacher/deleteByID/${id}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: `/eduservice/edu-teacher/addTeacher/`,
      method: 'post',
      data: teacher
    })
  },
  getTeacherInfoById(id) {
    return request({
      url: `/eduservice/edu-teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  updateTeacherInfo(id, teacher) {
    return request({
      url: `/eduservice/edu-teacher/updateTeacher/${id}`,
      method: 'post',
      data: teacher
    })
  }

}
