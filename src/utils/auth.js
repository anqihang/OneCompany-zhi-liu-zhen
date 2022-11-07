// import Cookies from 'js-cookie'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('Token');
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem('Token',token);
}

export function removeToken(item) {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(item)
}
