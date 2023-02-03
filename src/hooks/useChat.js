import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import configAxios from "@/config/axios"
import useSocket from "@/hooks/useSocket"

const useChat = () => {
  const sentByCurrentUser = (chat) => {
    return chat.chatter.username === localStorage.getItem("username")
  }

  return {
    sentByCurrentUser,
  }
}

export default useChat
