import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: Cookies.getJSON('auth')
  },
  mutations: {
    setAuth (state, payload) {
      const { access_token, refresh_token } = JSON.parse(payload || '{}')
      if (access_token) {
        Cookies.set('auth', access_token, { expires: 1 })
        Cookies.set('refresh_token', refresh_token)
      } else {
        Cookies.remove('auth')
        Cookies.remove('refresh_token')
      }
      state.auth = access_token
    }
  },
  actions: {
  },
  modules: {
  }
})
