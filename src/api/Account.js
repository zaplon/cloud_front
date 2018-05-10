import axios from 'axios'
import store from '@/store'

var account = {
  logOut (vue) {
    axios.post('rest-auth/logout/').then(request => {
      delete localStorage.token
      vue.$router.push('/')
    })
  },
  getUserData () {
    return axios.get('rest/user/').then(response => {
      store.commit('setUserData', response.data)
    })
  }
}

export default account
