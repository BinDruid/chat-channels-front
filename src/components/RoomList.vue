<template>
    <v-toolbar density="compact" title="گفتگوها">

    </v-toolbar>
    <v-card class="overflow-auto mx-auto" height="350">
        <v-list>
            <v-list-item v-for="conversation in conversations" :title="conversation.name" :key="conversation.id"
                :value="conversation" @click="connectionHandler(conversation)" class="ma-2"
                :subtitle="lastMessage(conversation)" active-color="pink-lighten-2" rounded="xl">
                <template v-slot:prepend>
                    <v-avatar color="pink">
                        <v-icon icon="mdi-message-text-fast-outline"></v-icon>
                    </v-avatar>
                </template>
                <template v-slot:append>
                    <v-chip size="x-small" variant="elevated" class="ma-1" color="pink">
                        {{}}
                    </v-chip>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>
const props = defineProps(["connectionHandler", "conversations"])
const lastMessage = (conversation) => {
    return conversation.last_message.content.split(" ").slice(0, 7).join(" ") + " ..."
}
</script>