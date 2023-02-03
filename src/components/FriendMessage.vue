<template>
    <v-row justify="start">
        <v-col cols="auto">
            <v-chip class="ma-1" color="pink" size="large" label text-color="white">
                {{ chat.content }}
            </v-chip>
        </v-col>
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
    </v-row>
</template>


<script setup>
const props = defineProps(["chat"])

</script>