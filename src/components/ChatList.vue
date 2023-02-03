<template>
    <v-toolbar density="compact" title="پیام‌ها">

    </v-toolbar>
    <v-card class="overflow-auto mx-auto" height="350">
        <v-list>
            <v-list-item v-for="chat in chats" :key="chat.id" class="ma-2" :value="chat" active-color="pink-lighten-2"
                rounded="xl">
                <template v-if="sentByCurrentUser(chat)" v-slot:prepend>
                    <user-message :chat="chat">
                    </user-message>
                </template>
                <template v-else v-slot:append>
                    <friend-message :chat="chat">
                    </friend-message>
                </template>
            </v-list-item>
        </v-list>
    </v-card>

</template>

<script setup>
import useChat from "@/hooks/useChat"
import UserMessage from "@/components/UserMessage.vue"
import FriendMessage from "@/components/FriendMessage.vue"
const props = defineProps(["chats"])
const { sentByCurrentUser } = useChat()


</script>