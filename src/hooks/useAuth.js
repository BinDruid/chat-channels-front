import { useRouter } from "vue-router"
import useAuthStore from "@/store/authStore"

const useAuth = () => {
  const { logoutAction, loginAction } = useAuthStore()
  const router = useRouter()

  const login = (token, user) => {
    loginAction(token, user)
    router.push({ path: "/chats" })
  }

  const logout = () => {
    logoutAction()
    router.go({ path: "/auth" })
  }
  return {
    login,
    logout,
  }
}

export default useAuth
