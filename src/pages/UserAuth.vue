<template>
    <v-row no-gutters class="pa-1 ma-2" justify="center" dir="ltr">
        <v-col lg="4" md="6" sm="8" xs="12">
            <v-alert v-if="errorMessage" prominent closable type="error" variant="outlined">
                {{ errorMessage }}
            </v-alert>
        </v-col>
    </v-row>
    <v-row no-gutters class="pa-1" justify="center">
        <v-col lg="4" md="6" sm="8" xs="12">
            <v-tabs fixed-tabs bg-color="indigo-darken-2" v-model="tab">
                <v-tab value="signin" @click="clear">
                    <h2>ورود</h2>
                </v-tab>
                <v-tab value="signup" @click="clear">
                    <h2>ثبت نام</h2>
                </v-tab>
            </v-tabs>
            <v-card class="mx-auto px-6 py-8" variant="tonal">
                <v-window v-model="tab">
                    <v-window-item value="signin">
                        <v-form v-model="form" @submit.prevent="signIn" dir="ltr">
                            <v-text-field class="mb-2" v-model="username" :readonly="loading" :rules="[required]"
                                clearable label="نام کاربری"></v-text-field>

                            <v-text-field v-model="password" :readonly="loading"
                                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPass ? 'text' : 'password'" @click:append-inner="showPass = !showPass"
                                :rules="[required]" clearable label="رمز عبور"
                                placeholder="رمز عبور را وارد نمائید"></v-text-field>

                            <br>

                            <v-btn :loading="loading" block color="indigo-darken-2" size="large" type="submit"
                                variant="elevated">
                                <strong>ورود</strong>
                            </v-btn>
                        </v-form>
                    </v-window-item>
                    <v-window-item value="signup">
                        <v-form v-model="form" @submit.prevent="signUp" dir="ltr">
                            <v-text-field class="mb-2" v-model="username" :readonly="loading" :rules="[required]"
                                clearable label="نام کاربری"></v-text-field>

                            <v-text-field class="mb-2" v-model="email" :readonly="loading" :rules="[required]" clearable
                                label="ایمیل"></v-text-field>

                            <v-text-field v-model="password" :readonly="loading"
                                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPass ? 'text' : 'password'" @click:append-inner="showPass = !showPass"
                                :rules="[required]" clearable label="رمز عبور"
                                placeholder="رمز عبور را وارد نمائید"></v-text-field>

                            <br>

                            <v-btn :loading="loading" block color="indigo-darken-2" size="large" type="submit"
                                variant="elevated">
                                <strong>ثبت نام</strong>
                            </v-btn>
                        </v-form>
                    </v-window-item>
                </v-window>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'
import axios from "axios";
import useAuth from "@/hooks/useAuth";

const { login } = useAuth()
const { VITE_API_URL: API_URL } = import.meta.env

const email = ref("")
const username = ref("")
const password = ref("")
const showPass = ref(false)
const form = ref(false)
const loading = ref(false)
const errorMessage = ref(null)
const tab = ref(null)

const clear = () => {
    email.value = null
    username.value = null
    password.value = null
    showPass.value = false
}

const signIn = async () => {
    loading.value = true
    try {
        const { data } = await axios.post(API_URL + "/auth/", {
            username: username.value,
            password: password.value
        })
        login(data.token, username.value)
    }
    catch (err) {
        errorMessage.value = err.response.data.errors[0].detail
    }
    setTimeout(() => (loading.value = false), 1000)
}

const signUp = async () => {
    loading.value = true
    try {
        await axios.post(API_URL + "/auth/users/", {
            email: email.value,
            username: username.value,
            password: password.value
        })
        signIn()
    }
    catch (err) {
        errorMessage.value = err.response.data.errors[0].detail
    }
    setTimeout(() => (loading.value = false), 1000)
}

const required = (value) => {
    return !!value || 'اطلاعات این فیلد الزامی است'
}

</script>
