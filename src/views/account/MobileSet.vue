<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card-group">
                    <div class="card p-4">
                        <div class="card-body">
                            <form>
                                <h1>Podaj telefon do weryfikacji SMS</h1>
                                <p class="text-muted">Będzie on wykorzystywany jedynie do weryfikacji</p>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                        <span class="input-group-text">
                                          <i class="icon-call-end"></i>+48
                                        </span>
                                            </div>
                                            <input maxlength="9" v-model="mobile" required name="mobile" type="text"
                                                   class="form-control" pattern="[0-9]" placeholder="numer telefonu">
                                        </div>
                                    </div>
                                    <div class="col-md-12 text-left">
                                        <button @click="save" type="button" class="btn btn-primary px-4">Zapisz
                                        </button>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-auto">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-auto text-left">
                                        <button @click="startOver" class="btn btn-link px-0" type="button">Zaloguj jako inny użytkownik</button>
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
export default {
  name: 'MobileSet',
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
    save () {
      if (!this.mobile) {
        this.error = 'Wpisz numer telefonu'
        return
      }
      this.$store.state.loading = true
      axios.post('rest/sms/add_mobile/', {mobile: this.mobile, secret: window.$cookies.get('secret')}).then(response => {
        this.$router.push('/konto/weryfikacja/')
        this.$store.state.loading = false
      }).catch(error => {
        console.log(error)
        this.$store.state.loading = false
        this.error = 'Wystąpił błąd podczas zapisywania numeru'
      })
    }
  }
}
</script>
