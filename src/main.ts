import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/index.scss";

import { createPinia } from "pinia";
import router from "./router";
import "./permission";
import { zhCn } from "element-plus/es/locales.mjs";
import { auth } from "./directive";
const app = createApp(App);
app.directive('auth-btn', auth)
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(createPinia());
app.use(router);

app.mount("#app");
