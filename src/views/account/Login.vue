<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <form>
                                <h1>Login</h1>
                                <p class="text-muted">Sign In to your account</p>
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
                                    <input v-model="password" required name="password" type="password" class="form-control" placeholder="Hasło">
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <button @click="login" type="button" class="btn btn-primary px-4">Zaloguj się</button>
                                    </div>
                                    <div class="col-6 text-right">
                                        <router-link :to="'Reset'" class="btn btn-link px-0">Zapomniałeś hasła?</router-link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
                        <div class="card-body text-center">
                            <div>
                                <h2>Zarejestruj się</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <router-link :to="'Register'" class="btn btn-primary active mt-3">Zarejestruj się teraz!</router-link>
                            </div>
                        </div>
                    </div>
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
  data: function () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login: function () {
      axios.post('rest-auth/login/', {username: this.username, password: this.password}).then(request => {
        localStorage.token = request.data.key
        axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token
        Account.getUserData().then(response => {
          if (response.data.setup_needed === 1) {
            this.$route.push('/setup/1')
          } else if (response.data.setup_needed === 2) {
            this.$route.push('/setup/2')
          } else { this.$router.push('/') }
        })
      }).catch(() => { this.error = 'Wystąpił błąd' })
    }
  }
}
</script>
