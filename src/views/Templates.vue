<template>
    <div class="card">
        <div class="card-header">
            Szablony
        </div>
        <div class="card-body">
            <v-server-table url="rest/templates/" :columns="columns" :options="options"></v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'templates',
  data () {
    return {
      columns: ['name', 'text', 'tab'],
      options: {
        headings: {'name': 'Nazwa', 'text': 'Treść', 'tab': 'Zakładka'}
      }
    }
  }
}
</script>
