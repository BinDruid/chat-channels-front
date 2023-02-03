import { ref } from "vue"
const { VITE_SOCKET_URL: SOCKET_URL } = import.meta.env

const useSocket = () => {
  const currentConnection = ref(null)
  const data = ref(null)

  const connetWebScoket = (url, token) => {
    currentConnection.value = new WebSocket(
      `${SOCKET_URL}/${url.value}/?token=${token}`
    )
    currentConnection.value.onmessage = (event) => {
      data.value = event.data
    }
  }

  const refineData = (data) => JSON.parse(data.value.replace("\\", ""))

  return {
    currentConnection,
    data,
    connetWebScoket,
    refineData,
  }
}

export default useSocket
