<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <form>
                                <h1>Weryfikacja kodu SMS</h1>
                                <p class="text-muted">Wpisz kod wpisany w wiadomości przesłanej na telefon</p>
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                        <span class="input-group-text">
                                          <i class="icon-lock"></i>
                                        </span>
                                            </div>
                                            <input maxlength="6" v-model="code" required name="code" type="text" class="form-control"
                                                   placeholder="kod weryfikacyjny">
                                        </div>
                                    </div>
                                    <div class="col-md-12 text-left">
                                        <button @click="verify" type="button" class="btn btn-primary px-4">Zaloguj się
                                        </button>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-auto">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-auto text-left">
                                        <button @click="resend" class="btn btn-link px-0" type="button">Prześlij kod ponownie</button>
                                    </div>
                                    <div class="col-auto text-left">
                                        <button @click="sendToEmail" class="btn btn-link px-0" type="button">Prześlij kod na email
                                        </button>
                                    </div>
                                    <div class="col-auto text-left">
                                        <button @click="startOver" class="btn btn-link px-0" type="button">Wróć do logowania

                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-4" v-show="error">
            <div class="col-12">
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
  name: 'Validate',
  props: {
    message: {
      type: String,
      default: '',
      required: false
    }
  },
  data: function () {
    return {
      code: '',
      error: ''
    }
  },
  methods: {
    startOver () {
      window.$cookies.remove('secret')
      this.$router.push('/konto/logowanie/')
    },
    verify () {
      if (!this.code) {
        this.error = 'Wpisz kod sms'
        return
      }
      this.$store.state.loading = true
      axios.post('rest/sms/validate_code/', {code: this.code, secret: window.$cookies.get('secret')}).then(response => {
        localStorage.token = response.data.key
        window.$cookies.remove('secret')
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
        console.log(error)
        this.$store.state.loading = false
        this.error = 'Podany kod jest nieprawidłowy lub jego ważność wygasła'
      })
    },
    resend () {
      axios.post('rest/sms/resend_code/').then(response => {
        this.$notify({group: 'nots', title: 'Kod został przesłany', text: '', type: 'success'})
      })
    },
    sendToEmail () {
      axios.post('rest/sms/send_to_email/', {code: this.code}).then(response => {
        this.$notify({group: 'nots', title: 'Kod został przesłany', text: '', type: 'success'})
      })
    }
  }
}
</script>
