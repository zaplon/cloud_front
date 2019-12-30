<template>
    <div class="card">
        <div class="card-header">
            <span>Ustawienia NFZ</span>
            <div class="card-toolbar">
                <router-link :to="{ name: 'NFZSettingsEdit'}" v-if="readonly">
                    <i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i>
                </router-link>
            </div>
        </div>
        <div class="card-body">
            <generic-form :readonly="readonly" :fields="formFields" ref="form"></generic-form>
            <div v-if="readonly">
                <button v-if="alreadyFilled" @click="verify" class="btn btn-primary">Zweryfikuj dane</button>
                <button v-else class="btn btn-primary" disabled
                        title="Uzupełnij wszystkie pola, żeby sprawdzić połączenie">Zweryfikuj dane</button>
                <div :class="{ alert: true, 'mt-2': true, 'alert-danger': !verificationStatus, 'alert-success': verificationStatus }"
                     role="alert" v-if="verificationMessage">{{ verificationMessage }}
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="pull-right" v-if="readonly">
                <router-link :to="{ name: 'NFZSettingsEdit'}" class="btn btn-primary mr-2">Edytuj</router-link>
            </div>
            <div class="pull-right" v-if="!readonly">
                <button @click="save" class="btn btn-primary mr-2">Zapisz</button>
                <button class="btn btn-default" @click="cancel">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'NFZSettings',
  components: {GenericForm},
  props: {
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      alreadyFilled: false,
      verificationStatus: false,
      verificationMessage: '',
      formFields: [
        {name: 'certificate_tls', label: 'Certyfikat TLS', type: 'file'},
        {name: 'certificate_tls_password', label: 'Hasło certyfikatu TLS', type: 'password'},
        {name: 'certificate_wsse', label: 'Certyfikat WSSE', type: 'file'},
        {name: 'certificate_wsse_password', label: 'Hasło certyfikatu WSSE', type: 'password'},
        {name: 'certificate_user', label: 'Certyfikat użytkownika', type: 'file'},
        {name: 'certificate_user_password', label: 'Hasło certyfikatu użytkownika', type: 'password'},
        {name: 'rola_biznesowa',
          label: 'Rola biznesowa',
          type: 'select',
          choices: [
            {id: 'LEKARZ_LEK_DENTYSTA_FELCZER', name: 'LEKARZ_LEK_DENTYSTA_FELCZER'},
            {id: 'PIELEGNIARKA_POLOZNA', name: 'PIELEGNIARKA_POLOZNA'}
          ]
        },
        {name: 'typ_podmiotu',
          label: 'Typ podmiotu',
          type: 'select',
          choices: [
            {id: 'PRAKTYKA_LEKARSKA', name: 'Praktyka lekarska'},
            {id: 'PODMIOT_LECZNICZY', name: 'Podmiot leczniczy'}
          ]
        },
        {name: 'id_podmiotu_oid_root', label: 'Identyfikator biznesowy root'},
        {name: 'id_podmiotu_oid_ext', label: 'Identyfikator biznesowy extension'},
        {name: 'id_podmiotu_lokalne', label: 'Identyfikator podmiotu lokalny'},
        {name: 'id_pracownika_oid_ext',
          label: 'Identyfikator pracownika (numer PWZ)',
          readonly: true,
          helpText: 'Możliwość edycji w profilu użytkownika'},
        {name: 'id_miejsca_pracy_oid_ext', label: 'Identyfikator miejsca pracy'}
      ]
    }
  },
  methods: {
    verify () {
      axios.get('/profile/test_p1_settings/').then(response => {
        this.verificationMessage = 'Dane dostępowe zweryfikowano poprawnie.'
        this.verificationStatus = true
      }).catch(error => {
        console.log(error)
        this.verificationMessage = 'Nie udało się nawiązać połączenia. Sprawdź dane i spróbuj ponownie.'
        this.verificationStatus = false
      })
    },
    cancel () {
      this.$router.push({name: 'NFZSettings'})
    },
    save () {
      let formData = new FormData()
      let config = { headers: {'Content-Type': 'multipart/form-data'} }
      let values = this.$refs['form'].getData()
      for (let field in values) { formData.append(field, values[field]) }
      axios.patch('rest/nfz-settings/' + this.$store.state.user.id + '/', formData, config).then(response => {
        this.$refs.form.setData(response.data)
        this.$router.push({name: 'NFZSettings'})
      }).catch(errors => {
        this.$refs.form.errors = errors.response.data
      })
    }
  },
  mounted () {
    axios.get('rest/nfz-settings/' + this.$store.state.user.id + '/').then(response => {
      this.alreadyFilled = true
      this.$refs.form.setData(response.data)
    })
  }
}
</script>
