<template>
    <div class="card">
        <div class="card-header">Wizyty</div>
        <div class="card-body">
            <v-server-table :url="apiUrl" :columns="columns" :options="options" ref="table">
                <div slot="date" slot-scope="props">{{props.row.date|formatDate('Y-MM-DD HH:mm')}}</div>
                <div slot="updated" slot-scope="props">{{props.row.updated|formatDate('Y-MM-DD HH:mm')}}</div>
                <div slot="pdf" slot-scope="props">
                    <button v-if="props.row.results.length > 0" class="btn btn-link">
                        <i @click="showDocument(props.row.results[0])" class="fa fa-file-pdf-o">{{props.row.result}}</i>
                    </button>
                    <span v-else>-</span>
                </div>
                <div slot="actions" slot-scope="props">
                    <button @click="edit(props.row)" class="btn btn-info">Edytuj</button>
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
      apiUrl: 'rest/visits/',
      columns: ['patient', 'date', 'updated', 'pdf', 'actions'],
      options: {
        headings: {'patient': 'Pacjent', 'date': 'Data wizyty', 'updated': 'Data zapisu', 'actions': '', 'pdf': ''},
        sortable: ['patient', 'date', 'updated']
      }
    }
  },
  methods: {
    showDocument (document) {
      EventBus.$emit('show-document', document.file, document.name)
    },
    edit (row) {
      console.log(row)
      this.$router.push({name: 'visit', params: {id: row.term_id}})
    }
  }
}
</script>
