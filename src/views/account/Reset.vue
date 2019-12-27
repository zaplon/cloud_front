<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body p-4">
                        <h1>Resetowanie hasła</h1>
                        <p class="text-muted">Podaj adres email, żeby otrzymać link umożliwiający zresetowanie hasła</p>
                        <div class="input-group mb-4">
                            <div class="input-group-prepend">
                                <span class="input-group-text">@</span>
                            </div>
                            <input required v-model="email" type="email" class="form-control" placeholder="Email">
                        </div>
                        <button @click="sendLink" type="button" class="btn btn-block btn-primary">Wyślij link</button>
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
  name: 'Reset',
  data: () => {
    return {
      message: null,
      error: null,
      email: ''
    }
  },
  methods: {
    sendLink () {
      if (!this.email) {
        this.error = 'Proszę wpisać adres email'
        return
      }
      axios.post('rest-auth/password/reset/', {email: this.email}).then(response => {
        this.message = 'Na podany adres email został przesłany mail z linkiem umożliwiającym ustawienie nowego hasła'
      }).catch(error => {
        this.error = error.response.data.non_field_errors[0]
      })
    }
  }
}
</script>
