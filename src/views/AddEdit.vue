<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteRecord" ref="confirmModal">
            Czy na pewno chcesz usunąć tegn rekord?
        </b-modal>
        <div class="card-header">{{ label }}
            <div class="card-toolbar">
            </div>
        </div>
        <div class="card-body">
            <backend-form :pk="instanceId" :autoload="false" ref="form" :klass="klass" :module="module"></backend-form>
        </div>
        <div class="card-footer">
            <button v-if="instanceId" class="btn btn-danger pull-left" @click="showConfirmDeleteModal">Usuń</button>
            <div class="pull-right">
                <button @click="save" class="btn btn-primary mr-1">Zapisz</button>
                <button class="btn btn-default" @click="cancel">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'add-edit',
  props: {
    klass: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    backUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      instanceId: this.$route.params.id ? parseInt(this.$route.params.id) : 0,
      label: this.$route.meta.label
    }
  },
  methods: {
    cancel () {
      if (this.instanceId) { this.$router.push(this.backUrl + '/' + this.instanceId) } else { this.$router.push(this.backUrl + '/') }
    },
    save () {
      this.$refs.form.handleSubmit().then(response => this.$router.push(this.backUrl))
    },
    showConfirmDeleteModal () {
      this.$refs.confirmModal.show()
    },
    deleteRecord () {
      axios.delete('rest/' + this.resource + '/' + this.instanceId + '/').then(response => {
        this.$router.push(this.backUrl)
      })
    }
  },
  mounted () {
    if (this.instanceId) {
      axios.get('rest/' + this.resource + '/' + this.instanceId + '/').then(response => {
        this.instance = response.data
        this.label = response.data.id
      })
      this.$refs.form.loadHtml(this.instanceId)
    } else {
      this.$refs.form.loadHtml()
    }
  }
}
</script>
