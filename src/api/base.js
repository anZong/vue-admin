import request from '@/utils/request'

export function getModelFields(data) {
  return request({
    url: 'getModelFields',
    method: 'post',
    data
  })
}

export function getModelList(data) {
  return request({
    url: 'getModelList',
    method: 'post',
    data
  })
}

export function delRows(data) {
  return request({
    url: 'delRows',
    method: 'post',
    data
  })
}

export function getInstance(data) {
  return request({
    url: 'getInstance',
    method: 'post',
    data
  })
}

export function saveInstance(data) {
  return request({
    url: 'saveInstance',
    method: 'post',
    data
  })
}
