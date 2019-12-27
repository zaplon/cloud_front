<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body p-4">
                        <h1>Nowe hasło</h1>
                        <p class="text-muted">Proszę zdefiniować nowe hasło</p>
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <input required v-model="password1" type="password" class="form-control"
                                       placeholder="Nowe hasło">
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <input required v-model="password2" type="password" class="form-control"
                                       placeholder="Powtórz nowe hasło">
                            </div>
                        </div>
                        <button @click="confirm" type="button" class="btn btn-block btn-primary">Utwórz nowe hasło</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4" v-show="message">
            <div class="col-md-6">
                <div class="alert alert-info" role="info">
                    {{ message }}
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4" v-show="error">
            <div class="col-md-6">
                <div class="alert alert-danger" role="alert">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'ResetConfirm',
  data: () => {
    return {
      message: null,
      error: null,
      uid: '',
      token: '',
      password1: '',
      password2: ''
    }
  },
  methods: {
    confirm () {
      axios.post('rest-auth/password/reset/confirm/', {uid: this.uid,
        token: this.token,
        new_password1: this.password1,
        new_password2: this.password2}).then(response => {
        this.message = 'Hasło zostało zresetowane'
      }).catch(error => {
        this.error = error.response.data
      })
    }
  },
  mounted () {
    var parts = window.origin.split('/')
    this.uid = parts[parts.length - 1]
    this.token = parts[parts.length - 2]
  }
}
</script>
