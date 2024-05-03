import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import init from '../../../web/ux/init.js'
// import { init } from '@sumor/ux'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory
} from 'vue-router'
import routes from '../routes.js'
import stores from '../stores.js'
import env from './env.js'
// import sumor from "./sumor/index.js";

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export async function createApp () {
  init()
  const app = createSSRApp(App)
  // sumor.init({reactive});
  // app.config.globalProperties.$sumor = sumor;
  const pinia = createPinia()
  app.use(pinia)
  const router = createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR
      ? createMemoryHistory('/')
      : createWebHistory('/'),
    routes
  })
  app.use(router)
  app.use(VueLazyload)
  app.config.globalProperties.$store = (name) => {
    return stores[name]()
  }
  app.config.globalProperties.$env = env
  return { app, router }
}
