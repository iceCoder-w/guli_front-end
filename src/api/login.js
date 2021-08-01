import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/paperservice/hello/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/paperservice/hello/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/paperservice/hello/logout',
    method: 'post'
  })
}
