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
                <div slot="number" slot-scope="props"><span v-if="!props.row.number">Bez numeru</span><span v-else>{{ props.row.number }}</span></div>
                <div slot="medicines" slot-scope="props">{{ props.row.number_of_medicines }}</div>
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
      columns: ['date', 'patient', 'number', 'number_of_medicines'],
      options: {
        headings: {'date': 'Data', 'patient': 'Pacjent', 'number': 'Numer', 'number_of_medicines': 'Leki'}
      }
    }
  }
}
</script>
