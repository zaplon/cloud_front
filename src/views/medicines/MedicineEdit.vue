<template>
    <div class="card">
        <div class="card-header">{{ label }}</div>
        <div class="card-body">
            <medicine ref="form"></medicine>
        </div>
        <div class="card-footer">
            <button v-if="$route.params.id" class="btn btn-danger" v-permission="'delete_medicine'">Usuń</button>
            <div class="pull-right">
                <button class="btn btn-primary mr-1" @click="save">Zapisz</button>
                <button class="btn btn-default" @click="cancel">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Medicine from '@/components/Forms/Medicine'
export default {
  name: 'medicine-edit',
  components: {Medicine},
  data () {
    return {
      label: 'Nowy lek',
      endpointUrl: 'rest/medicine_parents/'
    }
  },
  watch: {
    '$route.params.id' () {
      this.loadData()
    }
  },
  methods: {
    cancel () {
      this.$router.push({name: 'medicinesList'})
    },
    loaData () {
      if (this.$route.params.id) {
        axios.get(this.endpointUrl + this.$route.params.id).then(response => {
          this.$refs.form.setData(response.data)
          this.label = response.data.name
        })
        axios.get('rest/medicines/', {params: { parent: this.$route.params.id }}).then(response => {
          this.$refs.form.setChildren(response.data.results)
        })
      }
    },
    save () {
      this.$refs.form.save()
    }
  }
}
</script>
