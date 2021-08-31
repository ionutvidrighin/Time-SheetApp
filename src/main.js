import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import { auth } from './firebase'
import { onAuthStateChanged } from "firebase/auth";

Vue.config.productionTip = false

let app;

onAuthStateChanged(auth, () => {
  // console.log(user)
  if (!app) {
    app = new Vue({
            vuetify,
            store: store,
            router,
            render: h => h(App)
          }).$mount('#app')
  }
})
