<template>
    <v-row justify="start">
        <v-col cols="auto">
            <v-chip class="ma-1" color="primary">
                <v-icon start icon="mdi-account-circle-outline"></v-icon>
                {{ chat.chatter.username }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip size="small" variant="outlined" class="ma-1">
                {{ new Date(chat.timestamp).toLocaleTimeString() }}
            </v-chip>
        </v-col>
        <v-col cols="auto" @mouseover="enableDelete" @mouseleave="disableDelete">
            <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                {{ chat.content }}
            </v-chip>
            <v-icon v-if="enableButtons" start icon=" mdi-delete-outline" color="red" role="button"
                @click="deleteChat(chat)"></v-icon>
        </v-col>
    </v-row>


</template>


<script setup>
import { ref, inject } from 'vue'
const enableButtons = ref(false)
const props = defineProps(["chat"])
const deleteChat = inject("deleteChat")
const enableDelete = () => {
    if (localStorage.getItem("username") === props.chat.chatter.username)
        enableButtons.value = true
}

const disableDelete = () => {
    enableButtons.value = false
}
</script>