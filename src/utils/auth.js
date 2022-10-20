import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  console.log('in,get')
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('in,set')
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  localStorage.removeItem('adminToken')
}
