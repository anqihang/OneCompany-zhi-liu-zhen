import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/user_login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/permission/permission_info',
    method: 'get',
  })
}

export function logout() {
  // return request({
  //   url: '/user/logout',
  //   method: 'get'
  // })
}
