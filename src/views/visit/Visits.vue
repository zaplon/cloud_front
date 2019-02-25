<template>
    <div class="card">
        <div class="card-header">Wizyty</div>
        <div class="card-body">
            <v-server-table :url="apiUrl" :columns="columns" :options="options" ref="table">
                <div slot="datetime" slot-scope="props">{{props.row.datetime|formatDate('Y-MM-DD HH:mm')}}</div>
                <div slot="updated" slot-scope="props">{{props.row.updated|formatDate('Y-MM-DD HH:mm')}}</div>
                <div slot="status" slot-scope="props">
                    <span v-if="props.row.status == 'FINISHED'">Zrealizowana</span>
                    <span v-else>Zaplanowana</span>
                </div>
                <div slot="pdf" slot-scope="props">
                    <button v-if="props.row.result" class="btn btn-link">
                        <i @click="showDocument(props.row.result)" class="fa fa-file-pdf-o"></i>
                    </button>
                    <span v-else>-</span>
                </div>
                <div slot="actions" slot-scope="props">
                    <button v-if="props.row.visit" @click="edit(props.row)" class="btn btn-sm btn-info">Edytuj</button>
                    <button v-else @click="edit(props.row)" class="btn btn-sm btn-info">Rozpocznij</button>
                </div>
            </v-server-table>
        </div>
    </div>
</template>
<script>
import EventBus from '@/eventBus'
export default {
  name: 'visits',
  data () {
    return {
      apiUrl: 'rest/terms_list/',
      columns: ['patient_name', 'patient_last_name', 'datetime', 'updated', 'pdf', 'status', 'actions'],
      options: {
        headings: {'patient_name': 'Imię',
          'patient_last_name': 'Nazwisko',
          'datetime': 'Data wizyty',
          'updated': 'Data zapisu',
          'actions': '',
          'pdf': ''},
        sortable: ['patient_name', 'patient_last_name', 'datetime', 'updated', 'status'],
        filterable: ['status', 'patient_name', 'patient_last_name'],
        filterByColumn: true,
        listColumns: {
          status: [
            { id: 'finished', text: 'Zrealizowana' },
            { id: 'pending', text: 'Zaplanowana' }
          ]
        }
      }
    }
  },
  methods: {
    showDocument (document) {
      EventBus.$emit('show-document', this.$backendUrl + 'media/' + document.file, document.name)
    },
    edit (row) {
      console.log(row)
      this.$router.push({name: 'visit', params: {id: row.id}})
    }
  }
}
</script>
