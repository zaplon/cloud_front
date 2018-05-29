<template>
    <div class="card">
        <div class="card-header">
            Lista leków
        </div>
        <div class="card-body">
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
