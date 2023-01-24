<template>
    <h1 class="text-center">Chat Screen</h1>
    <v-row>
        <v-col cols="6">
            <v-card class="overflow-auto mx-auto" fill-height>
                <v-list>
                    <v-list-item v-for="(chat, index) in chats" :key="index" class="ma-2" :value="chat"
                        active-color="pink-lighten-2" rounded="xl" @click="deleteChat(chat)">
                        <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                            {{ chat["content"] }}
                        </v-chip>
                        <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                            {{ chat["chatter"]["username"] }}
                        </v-chip>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
        <v-col cols="6">
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
import { ref, watch } from 'vue'
import { useWebSocket } from '@vueuse/core'
const { VITE_SOCKET_URL: SOCKET_URL } = import.meta.env
const chats = ref([])
const message = ref("")
const form = ref(false)
const props = defineProps(["room_id"])
const token = localStorage.getItem("authToken") ?? " "
const { status, data, send, open, close } = useWebSocket(`${SOCKET_URL}/${props.room_id}/?token=${token}`)

const refineData = (data) => JSON.parse(data.value.replace("\\", ''))

watch((data), () => {
    const server_response = refineData(data)
    if (server_response.type === "new_chat_message")
        chats.value.push(server_response["message"])
    if (server_response.type === "server_recent_messages")
        chats.value = chats.value.concat(server_response["messages"])
    if (server_response.type === "delete_chat_message") {
        chats.value = chats.value.filter(chat => chat.id !== server_response["id"])
    }
})


const sendMessage = () => {
    send(JSON.stringify({
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
        send(JSON.stringify({
            type: "client_delete_chat",
            id: chat.id
        }))
}

</script>