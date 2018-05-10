<template>
    <div class="card">
        <div class="card-header">
        </div>
        <div class="card-body">
            <div class="card-title"><h3>Lista leków</h3></div>
            <v-server-table url="rest/medicine_parents/" :columns="columns" :options="options"></v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'medicines',
  data () {
    return {
      columns: ['name', 'composition', 'form', 'dosage'],
      options: {
        headings: {'name': 'Nazwa', 'composition': 'Skład', 'form': 'Postać', 'dosage': 'Dawka'}
      }
    }
  }
}
</script>
