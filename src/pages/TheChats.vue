<template>
    <v-row>
        <v-col lg="4" md="4" sm="12" xs="12">
            <room-list :conversations="conversations" :connectionHandler="joinConversation"></room-list>
        </v-col>
        <v-col lg="8" md="8" sm="12" xs="12">
            <chat-list :chats="chats"></chat-list>
            <v-form v-if="sessionStarted" v-model="form" @submit.prevent="sendMessage" dir="ltr">
                <v-text-field class="my-4" auto-focus v-model="message" append-inner-icon="mdi-send" variant="filled"
                    clear-icon="mdi-close-circle" clearable label="پیام" type="text" @click:append-inner="sendMessage"
                    @click:clear="clearMessage" @input="isTyping">
                </v-text-field>
                <v-spacer></v-spacer>
                <v-chip v-if="friendIsTyping" class="ma-1" color="primary">
                    {{ typingStatusMessage }}
                </v-chip>
                <br>
            </v-form>
        </v-col>
    </v-row>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, watch, onMounted, provide } from 'vue'
import axios from "axios"
import configAxios from "@/config/axios"
import debounce from "lodash/debounce"
import RoomList from "@/components/RoomList.vue"
import ChatList from "@/components/ChatList.vue"
import useSocket from "@/hooks/useSocket"
import useChat from "@/hooks/useChat"

const { VITE_API_URL: API_URL } = import.meta.env
const router = useRouter()
const props = defineProps(["conversation_id"])
const chats = ref([])
const conversationName = ref("")
const sessionStarted = ref(false)
const conversations = ref([])
const message = ref("")
const form = ref(false)
const userIsTyping = ref(false)
const friendIsTyping = ref(false)
const typingStatusMessage = ref(null)
const token = localStorage.getItem("authToken") ?? " "
const url = ref(props.conversation_id)
const { sentByCurrentUser } = useChat()
const { currentConnection, data, connectWebSocket, refineData } = useSocket()

configAxios()

const joinConversation = (conversation) => {
    if (currentConnection.value) currentConnection.value.close()
    url.value = conversation.id
    router.push({ path: `/chats/${url.value}` })
    connectWebSocket(url, token)
    sessionStarted.value = true
}

const getConversations = async () => {
    try {
        const { data } = await axios.get(API_URL + `/chats/conversations/`)

        conversations.value.length = 0
        conversations.value = data.results
    } catch (e) {
        console.log(e)
    }
}


watch((data), () => {
    const serverResponse = refineData(data)
    if (serverResponse.type === "server_join_confirm")
        conversationName.value = serverResponse["conversation_name"]
    if (serverResponse.type === "new_chat_message")
        chats.value.push(serverResponse["message"])
    if (serverResponse.type === "server_recent_messages")
        chats.value = serverResponse["messages"]
    if (serverResponse.type === "delete_chat_message")
        chats.value = chats.value.filter(chat => chat.id !== serverResponse["id"])
    if (serverResponse.type === "chatter_is_typing")
        changeTypingStatus(serverResponse)

})

watch((userIsTyping), () => {
    currentConnection.value.send(JSON.stringify({
        type: "client_is_typing",
        user: localStorage.getItem("username"),
        typing: userIsTyping.value
    }))
})

const sendMessage = () => {
    currentConnection.value.send(JSON.stringify({
        type: "client_new_chat",
        message: message.value
    }))
    clearMessage()
}

const clearMessage = () => {
    message.value = null
}

const isTyping = () => {
    userIsTyping.value = true;
    debounceStopTyping();
}
const debounceStopTyping = debounce(() => {
    userIsTyping.value = false
}, 1000)

const changeTypingStatus = (serverResponse) => {
    if (serverResponse["typing"])
        if (serverResponse["user"] !== localStorage.getItem("username")) {
            friendIsTyping.value = true
            typingStatusMessage.value = `${serverResponse["user"]} is typing...`
        }
    if (!serverResponse["typing"])
        friendIsTyping.value = false


}

const deleteChat = (chat) => {
    if (sentByCurrentUser(chat))
        currentConnection.value.send(JSON.stringify({
            type: "client_delete_chat",
            id: chat.id
        }))
}

onMounted(async () => {
    await getConversations()

})

provide('deleteChat', deleteChat)

</script>

<style scoped>
.no-padd {
    padding: initial;
}
</style>