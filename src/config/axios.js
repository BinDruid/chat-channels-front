import axios from "axios"

export default () => {
  axios.interceptors.request.use((config) => {
    const authToken = localStorage.getItem("authToken")
    config.headers.Authorization = `Token ${authToken}`
    return config
  })
}
