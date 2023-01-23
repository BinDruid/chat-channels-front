import { ref } from "vue"
import { defineStore } from "pinia"

const useAuthStore = defineStore("users", () => {
  const logged = ref(localStorage.getItem("authToken") !== null)

  const loginAction = (token, user) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("username", user)
    logged.value = true
  }

  const logoutAction = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    logged.value = false
  }

  return { logged, loginAction, logoutAction }
})

export default useAuthStore
