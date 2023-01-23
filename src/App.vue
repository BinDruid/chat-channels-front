<template>
  <v-locale-provider rtl>
    <v-app :theme="theme">
      <v-app-bar density="compact" :title="title">
        <v-spacer></v-spacer>

        <v-btn :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changeTheme"></v-btn>
        <v-btn v-if="!logged" icon>
          <router-link to="/auth" class="no-dec">
            <v-icon>mdi-fingerprint</v-icon>
          </router-link>
        </v-btn>
        <v-btn icon v-if="logged" @click="logout">
          <v-icon>mdi-fingerprint-off</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from "pinia"
import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/store/authStore"
const { logout } = useAuth()
const { logged } = storeToRefs(useAuthStore())


const title = computed(() => {
  return localStorage.getItem("username") ?? "ناحیه کاربری"
})

const theme = ref('dark')

const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

</script>

<style scoped>
.no-dec {
  text-decoration: none;
}

a {
  color: inherit
}
</style>