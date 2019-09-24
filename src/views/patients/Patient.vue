<template>
    <div class="card">
        <div class="card-header">{{ label }}
            <div class="card-toolbar">
                <router-link to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <b-tabs pills fill>
                <b-tab title="Informacje ogólne" active>
                        <backend-form :autoload="false" :readonly="true" ref="patientForm"
                                      klass="PatientModelForm" module="user_profile.forms"></backend-form>
                </b-tab>
                <b-tab title="Archiwum">
                        <v-server-table ref="table" url="rest/results/" :columns="columns" :options="options">
                            <span slot="uploaded" slot-scope="props">
                                {{props.row.uploaded | formatDate('Y-MM-DD HH:mm')}}
                            </span>
                            <button class="btn btn-link" slot="file"
                                    @click="showDocument(props.row)" slot-scope="props">
                                <i class="fa fa-file-pdf-o"></i>
                            </button>
                        </v-server-table>
                </b-tab>
            </b-tabs>
        </div>
        <div class="card-footer">
            <router-link to="edycja" class="btn btn-primary pull-right">Edytuj</router-link>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import EventBus from '@/eventBus'
export default {
  name: 'patient',
  data () {
    return {
      patientId: 0,
      patient: {},
      label: this.patientId,
      archiveLink: '',
      columns: ['name', 'file', 'uploaded'],
      options: {
        headings: {'name': 'Nazwa', 'file': 'Plik', 'uploaded': 'Data utworzenia'},
        params: {patient: this.$route.params.id},
        sortable: ['name', 'uploaded']
      }
    }
  },
  watch: {
    '$route.params.id' () {
      this.loadData()
    }
  },
  methods: {
    loadData () {
      if (!this.$route.params.id) {
        return
      }
      this.patientId = parseInt(this.$route.params.id)
      this.archiveLink = '/archiwum/' + this.patientId
      axios.get('rest/patients/' + this.patientId + '/').then(response => {
        this.patient = response.data
        this.label = response.data.name_with_pesel
      })
      this.$refs.patientForm.loadHtml(this.patientId)
    },
    showDocument (document) {
      EventBus.$emit('show-document', document.file, document.name)
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
