const useConfig = () => {
  const { VITE_API_URL: API_URL, VITE_SOCKET_URL: SOCKET_URL } = import.meta.env

  return {
    API_URL,
    SOCKET_URL,
  }
}

export default useConfig
