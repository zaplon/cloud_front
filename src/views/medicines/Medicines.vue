<template>
    <div class="card">
        <div class="card-header">
            Lista leków
        </div>
        <div class="card-body">
            <v-server-table url="rest/medicine_parents/" :columns="columns" :options="options">
                <router-link slot="name" :to="getMedicineUrl(props.row)" slot-scope="props">{{ props.row.name }}</router-link>
            </v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'medicines',
  methods: {
    getMedicineUrl (row) {
      return '/leki/' + row.id + '/'
    }
  },
  data () {
    return {
      columns: ['name', 'composition', 'form', 'dose'],
      options: {
        headings: {'name': 'Nazwa', 'composition': 'Skład', 'form': 'Postać', 'dose': 'Dawka'}
      }
    }
  }
}
</script>
