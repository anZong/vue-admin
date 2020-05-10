import request from '@/utils/request'

export function getSiteConfig(data) {
  return request({
    url: 'getSiteConfig',
    method: 'get',
    data
  })
}

export function getSettings(data) {
  return request({
    url: 'getSettings',
    method: 'post',
    data
  })
}

export function saveSettings(data) {
  return request({
    url: 'saveSettings',
    method: 'post',
    data
  })
}
