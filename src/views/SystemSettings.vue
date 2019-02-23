<template>
    <div class="card">
        <div class="card-header">Ustawienia systemowe</div>
        <div class="card-body">
            <generic-form :readonly="readonly" :fields="formFields" ref="form"></generic-form>
        </div>
        <div class="card-footer">
            <div class="pull-right" v-if="readonly">
                <router-link :to="{ name: 'systemSettingsEdit'}" class="btn btn-primary mr-2">Edytuj</router-link>
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
  name: 'systemSettings',
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
      formFields: [
        {name: 'nip', label: 'Numer NIP'},
        {name: 'regon', label: 'Numer REGON'},
        {name: 'documents_header_left', label: 'Nagłówek dokumentów (strona lewa)', type: 'textarea'},
        {name: 'documents_header_right', label: 'Nagłówek dokumentów (strona prawa)', type: 'textarea'}
      ]
    }
  },
  methods: {
    cancel () {
      this.$router.push({name: 'systemSettings'})
    },
    save () {
      let data = this.$refs.form.getData()
      axios.patch('rest/settings/1/', data).then(response => {
        this.$router.push({name: 'systemSettings'})
      }).catch(errors => {
        this.$refs.form.errors = errors.response.data
      })
    }
  },
  mounted () {
    axios.get('rest/settings/1/').then(response => {
      this.$refs.form.setData(response.data)
    })
  }
}
</script>
