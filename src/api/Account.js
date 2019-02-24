import axios from 'axios'
import store from '@/store'

var account = {
  goToStart (vue, message) {
    delete localStorage.token
    delete axios.defaults.headers.common['Authorization']
    vue.$router.push({name: 'Login', params: {message: message}})
  },
  logOut (vue, message) {
    axios.post('rest-auth/logout/').then(request => {
      this.goToStart(vue, message)
    }).catch(error => {
      console.log(error)
      this.goToStart(vue)
    })
  },
  getUserData () {
    return axios.get('rest/user/').then(response => {
      store.commit('setUserData', response.data)
    }).catch(error => {
      console.log(error)
      delete localStorage.token
    })
  }
}

export default account
