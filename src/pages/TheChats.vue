<template>
    <h1 class="text-center">{{ conversation_name }}</h1>
    <v-row>

        <v-col lg="4" md="4" sm="12" xs="12">
            <room-list :conversations="conversations" :connectionHandler="joinConversation"></room-list>
        </v-col>

        <v-col lg="8" md="8" sm="12" xs="12">
            <chat-list :chats="chats"></chat-list>
        </v-col>

        <v-col lg="12" md="12" sm="12" xs="12" class="no-padd">
            <v-form v-model="form" @submit.prevent="sendMessage" dir="ltr">
                <v-text-field class="my-4" v-model="message" append-inner-icon="mdi-send" variant="filled"
                    clear-icon="mdi-close-circle" clearable label="پیام" type="text" @click:append-inner="sendMessage"
                    @click:clear="clearMessage">
                </v-text-field>
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
import RoomList from "@/components/RoomList.vue"
import ChatList from "@/components/ChatList.vue"

const { VITE_SOCKET_URL: SOCKET_URL } = import.meta.env
const { VITE_API_URL: API_URL } = import.meta.env
const router = useRouter()
const props = defineProps(["conversation_id"])
const chats = ref([])
const conversation_name = ref("")
const conversations = ref([])
const message = ref("")
const form = ref(false)
const token = localStorage.getItem("authToken") ?? " "
const url = ref(props.conversation_id)
const currentConnection = ref(null)
const data = ref(null)

configAxios()

const connetWebScoket = () => {
    currentConnection.value = new WebSocket(`${SOCKET_URL}/${url.value}/?token=${token}`)
    currentConnection.value.onmessage = (event) => {
        data.value = event.data;
    }
}
const joinConversation = (conversation) => {
    currentConnection.value.close()
    url.value = conversation.id
    router.push({ path: `/chats/${url.value}` })
    connetWebScoket()
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

const refineData = (data) => JSON.parse(data.value.replace("\\", ''))

watch((data), () => {
    const server_response = refineData(data)
    if (server_response.type === "server_join_confirm")
        conversation_name.value = server_response["conversation_name"]
    if (server_response.type === "new_chat_message")
        chats.value.push(server_response["message"])
    if (server_response.type === "server_recent_messages")
        chats.value = server_response["messages"]
    if (server_response.type === "delete_chat_message") {
        chats.value = chats.value.filter(chat => chat.id !== server_response["id"])
    }
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

const sentByCurrentUser = (chat) => { return chat.chatter.username === localStorage.getItem("username") }

const deleteChat = (chat) => {
    if (sentByCurrentUser(chat))
        currentConnection.value.send(JSON.stringify({
            type: "client_delete_chat",
            id: chat.id
        }))
}

onMounted(async () => {
    connetWebScoket()
    await getConversations()

})

provide('deleteChat', deleteChat)

</script>

<style scoped>
.no-padd {
    padding: initial;
}
</style>