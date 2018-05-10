<template>
    <div class="card">
        <div class="card-header">
            <h1>Lista kodów ICD-10</h1>
        </div>
        <div class="card-body">
            <v-server-table url="rest/icd/" :columns="columns" :options="options"></v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'icd',
  data () {
    return {
      columns: ['code', 'desc'],
      options: {
        headings: {'code': 'Kod', 'desc': 'Opis'}
      }
    }
  }
}
</script>
