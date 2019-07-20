<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <form>
                                <h1>Logowanie</h1>
                                <p class="text-muted">Zaloguj się na swoje konto</p>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                            <span class="input-group-text">
                              <i class="icon-user"></i>
                            </span>
                                    </div>
                                    <input v-model="username" required name="username" type="text" class="form-control" placeholder="Nazwa użytkownika">
                                </div>
                                <div class="input-group mb-4">
                                    <div class="input-group-prepend">
                            <span class="input-group-text">
                              <i class="icon-lock"></i>
                            </span>
                                    </div>
                                    <input v-on:keyup.enter="login" v-model="password" autocomplete="current-password" required name="password" type="password" class="form-control" placeholder="Hasło">
                                </div>
                                <div class="row">
                                    <div class="col-auto">
                                        <button @click="login" type="button" class="btn btn-primary px-4">Zaloguj się</button>
                                    </div>
                                    <div class="col-auto text-right">
                                        <router-link :to="'/konto/reset'" class="btn btn-link px-0">Zapomniałeś hasła?</router-link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
                        <div class="card-body text-center">
                            <div style="opacity: 0">
                                <h2>Rejestracja</h2>
                                <p>Utworzenie konta w systemie zajmie ci jedynie kilka minut i wymaga podania jedynie podstawowych danych. 60 dni za darmo.</p>
                                <router-link :to="'Register'" class="btn btn-primary active mt-3">Zarejestruj się teraz!</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4" v-show="message">
            <div class="col-8">
                <div class="alert alert-info" role="alert">
                    {{ message }}
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4" v-show="error">
            <div class="col-8">
                <div class="alert alert-danger" role="alert">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {Account} from '@/api'
export default {
  name: 'login',
  props: {
    message: {
      type: String,
      default: '',
      required: false
    }
  },
  data: function () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login: function () {
      if (!this.password || !this.username) {
        this.error = 'Wpisz login i hasło'
        return
      }
      this.$store.state.loading = true
      axios.post('rest-auth/login/', {username: this.username, password: this.password}).then(response => {
        localStorage.token = response.data.key
        axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token
        Account.getUserData().then(response => {
          this.$store.state.loading = false
          let user = this.$store.state.user

          // mobile devices
          if (this.$isMobileDevice()) {
            this.$router.push('/m/zdjecia/')
          }

          if (user.setup_needed === 1) {
            this.$router.push('/setup/1')
          } else if (user.setup_needed === 2) {
            this.$router.push('/setup/2')
          } else {
            this.$router.push('/')
          }
        })
      }).catch(error => {
        this.$store.state.loading = false
        this.error = error.response.data.non_field_errors[0]
      })
    }
  }
}
</script>
