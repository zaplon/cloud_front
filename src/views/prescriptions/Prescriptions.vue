<template>
    <div class="card">
        <div class="card-header">
            Lista recept
        </div>
        <div class="card-body">
            <div class="mb-4">
                <router-link to="/recepty/nowa/" class="btn btn-success">Nowa</router-link>
            </div>
            <v-server-table url="rest/prescriptions/" :columns="columns" :options="options">
                <router-link :to="/recepty/ + props.row.id + '/'" slot="date" slot-scope="props">{{ props.row.date|formatDate }}</router-link>
            </v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'medicines',
  methods: {
    getPrescriptionUrl (row) {
      return '/recepty/' + row.id + '/'
    }
  },
  data () {
    return {
      columns: ['date', 'patient', 'number', 'medicines'],
      options: {
        headings: {'date': 'Data', 'patient': 'Pacjent', 'number': 'Numer', 'medicines': 'Leki'}
      }
    }
  }
}
</script>
