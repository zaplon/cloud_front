<template>
    <div>
        <form :class="{ 'was-validated': validated, 'needs-validation': true }">
            <div class="form-group row">
                <label for="oldPassword" class="col-sm-3 col-form-label">Obecne hasło</label>
                <div class="col-sm-9">
                    <input :class="{'form-control': true, 'is-invalid': 'old_password' in errors}" required v-model="old_password" type="password" id="oldPassword">
                    <div class="invalid-feedback"><span :key="error" v-for="error in errors.old_password">{{ error }}</span></div>
                </div>
            </div>
            <div class="form-group row">
                <label for="newPassword1" class="col-sm-3 col-form-label">Nowe hasło</label>
                <div class="col-sm-9">
                    <input required v-model="new_password1" type="password"
                           :class="{'form-control': true, 'is-invalid': 'new_password1' in errors}" id="newPassword1">
                    <div class="invalid-feedback"><span :key="error" v-for="error in errors.new_password1">{{ error }}</span></div>
                </div>
            </div>
            <div class="form-group row">
                <label for="newPassword2" class="col-sm-3 col-form-label">Powtórz nowe hasło</label>
                <div class="col-sm-9">
                    <input required v-model="new_password2" type="password"
                           :class="{'form-control': true, 'is-invalid': 'new_password2' in errors}" id="newPassword2">
                    <div class="invalid-feedback"><span :key="error" v-for="error in errors.new_password2">{{ error }}</span></div>
                </div>
            </div>
            <div v-if="errors.all" class="text-danger">
                {{ errors.all }}
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'change-password',
  data () {
    return {
      new_password1: '',
      new_password2: '',
      old_password: '',
      errors: {},
      validated: false,
      hasErrors: false
    }
  },
  components: {
  },
  methods: {
    changePassword (evt, callback) {
      this.errors = {}
      this.hasErrors = false
      evt.preventDefault()
      if (!this.new_password1 || !this.new_password2 || !this.old_password) {
        this.errors.all = 'Uzupełnij wszystkie pola'
        this.hasErrors = true
      }
      if (this.hasErrors) {
        this.validated = true
        return
      }
      axios.post('rest-auth/password/change/',
        {new_password1: this.new_password1, new_password2: this.new_password2, old_password: this.old_password}).then(response => {
        this.new_password1 = ''
        this.new_password2 = ''
        this.old_password = ''
        this.validated = false
        callback(response)
      }).catch(error => {
        this.validated = false
        this.errors = error.response.data
      })
    }
  }
}
</script>
<style>
    .working-day .vue-slider-component{
    }
</style>
