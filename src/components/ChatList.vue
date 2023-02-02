<template>
    <v-toolbar density="compact" title="پیام‌ها">

    </v-toolbar>
    <v-card class="overflow-auto mx-auto" fill-height>
        <v-list>
            <v-list-item v-for="chat in chats" :key="chat.id" class="ma-2" :value="chat" active-color="pink-lighten-2"
                rounded="xl" @click="deleteChat(chat)">
                <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                    {{ chat["content"] }}
                </v-chip>
                <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                    {{ chat["chatter"]["username"] }}
                </v-chip>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>
import { inject } from 'vue'
const props = defineProps(["chats"])
const deleteChat = inject("deleteChat")

</script>