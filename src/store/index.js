import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      logged: false,
      uid: null,
      email: null,
      avatar: null,
      hoursWorked: null
    },
    addForNow: false,
    addForLater: false,
    events: [{
      start: '2021-08-11',
      name: 'Ionut * sflsdlasjdwedasdáwdla sflsdlasjdwedasdáwdla sflsdlasjdwedasdáwdla',
      end: '2021-08-11',
      color: 'green'
    }]
  },
  mutations: {
    toggleLogin: (state) => {
      state.user = !state.user
    },
    logUserIn: (state, payload) => {
      state.user =  payload 
    },
    logUserOut: (state, payload) => {
      state.user = payload
    },
    updateAddForNow: (state) => {
      state.addForNow = !state.addForNow
    },
    updateAddForLater: (state) => {
      state.addForLater = !state.addForLater
    },
    addNewEvent: (state, payload) => {
      state.events.push(payload)
    }
  },
  actions: {
    toggleLogin({commit}) {
      commit('toggleLogin')
    },
    logUserIn({commit}, payload){
      commit('logUserIn', payload)
    },
    logUserOut({commit}, payload){
      commit('logUserOut', payload)
    }, 
    storeEvent({commit}, payload) {
      commit('addNewEvent', payload)
    }
  },
  getters: {
    getUserData: (state) => {
      return state.user
    },
    getAddForNowState: (state) => {
      return state.addForNow
    },
    getAddForLaterState: (state) => {
      return state.addForLater
    },
    getAllEvents: (state) => {
      return state.events
    }
  }

})

export default store