import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import client from './pocketbase';
import { pocketBaseSymbol } from "./symbols/injectionSymbols";

const app = createApp(App)

app.provide(pocketBaseSymbol, client)

app.mount('#app')