import axios from 'axios'
import EventBus from '@/eventBus'
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
      vue.$forms = {}
    }).catch(() => {
      this.goToStart(vue)
    })
  },
  getAgreementsToAccept () {
    axios.get('rest/agreements/pending/').then(response => {
      EventBus.$emit('agreements-to-show', response.data)
    })
  },
  getUserData () {
    return axios.get('rest/user/').then(response => {
      store.commit('setUserData', response.data)
      this.getAgreementsToAccept()
      // if (response.data.css_theme !== 'yeti') {
      //   import('@/assets/scss/themes/' + response.data.css_theme + '/style.css')
      // }
    }).catch(error => {
      console.log(error)
      delete localStorage.token
    })
  }
}

export default account
