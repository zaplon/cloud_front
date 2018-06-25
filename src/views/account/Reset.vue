<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card mx-6">
                <div class="card-body p-4">
                    <h1>Resetowanie hasła</h1>
                    <p class="text-muted">Podaj adres email, żeby otrzymać link umożliwiający zresetowanie hasła</p>
                    <div class="input-group mb-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input v-model="email" type="email" class="form-control" placeholder="Email">
                    </div>
                    <button @click="sendLink" type="button" class="btn btn-block btn-primary">Wyślij link</button>
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
      email: ''
    }
  },
  methods: {
    sendLink: () => {
      axios.post('rest-auth/password/reset/ ', {email: this.email})
    }
  }
}
</script>
