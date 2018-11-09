import axios from 'axios'
import store from '@/store'

var account = {
  logOut (vue) {
    axios.post('rest-auth/logout/').then(request => {
      delete localStorage.token
      delete axios.defaults.headers.common['Authorization']
      vue.$router.push({name: 'Login'})
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
