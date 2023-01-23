import { createApp } from "vue"
import App from "./App.vue"

import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

import pinia from "@/store/init"
import router from "./routes"
import "@mdi/font/css/materialdesignicons.css"
import "./assets/styles/rtl.css"

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount("#app")
