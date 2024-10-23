export const config = {
  basename: '',
  defaultPath: '/'
}

export const getUrl = () => {
  const userOrigin = window.location.origin
  const url = new URL(userOrigin)
  const baseUrl = `${url.protocol}//${url.hostname}:${import.meta.env.VITE_BACKEND_PORT}`
  const defaultUrl = `http://${import.meta.env.VITE_BACKEND_URI}:${import.meta.env.VITE_BACKEND_PORT}`

  return import.meta.env.VITE_SERVER_TOGGLE === 'TRUE' ? baseUrl : defaultUrl
}