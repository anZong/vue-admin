import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function getAuthCode(data) {
  return request({
    url: 'authsys/code',
    method: 'get',
    data
  })
}


export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: 'userInfo',
    method: 'get'
  })
}

export function saveProfile(data) {
  return request({
    url: 'saveProfile',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: 'changePassword',
    method: 'post',
    data
  })
}

export function saveRolePermissions(data) {
  return request({
    url: 'saveRolePermissions',
    method: 'post',
    data
  })
}
