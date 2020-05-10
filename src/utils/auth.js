import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUserId() {
  return Cookies.get(name)
}

export function setIframeUrl(val) {
  return Cookies.set('ifame', val)
}

export function getIframeUrl() {
  return Cookies.get('ifame')
}

export function setBgcolor(val) {
  return Cookies.set('Bgcolor', val)
}

export function getBgcolor() {
  return Cookies.get('Bgcolor')
}


export function setHavedRepor(val) {
  return Cookies.set('havedRepor', val)
}

export function getHavedRepor() {
  return Cookies.get('havedRepor')
}

export function removeHavedRepor() {
  return Cookies.remove('havedRepor')
}

export function setId(name) {
  return Cookies.set(name, name)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
