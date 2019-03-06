<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteRecord" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <div class="card-header">
            <span>{{ label }}</span>
            <div class="card-toolbar">
                <router-link v-if="readonly" to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <generic-form :readonly="readonly" :fields="formFields" ref="form"></generic-form>
        </div>
        <div class="card-footer">
            <button :v-permission="deletePermission" v-if="instanceId && !readonly" class="btn btn-danger pull-left"
                    @click="showConfirmDeleteModal">Usuń</button>
            <div class="pull-right" v-if="readonly">
                <router-link to="edycja" class="btn btn-primary pull-right">Edytuj</router-link>
                <button class="btn btn-default mr-2" @click="cancel()">Powrót</button>
            </div>
            <div v-else class="pull-right">
                <button class="btn btn-primary mr-2" @click="save()">Zapisz</button>
                <button class="btn btn-default" @click="cancel()">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import GenericForm from '@/components/Forms/GenericForm'
import axios from 'axios'
export default {
  name: 'form-view',
  components: {GenericForm},
  props: {
    backUrl: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false
    },
    formFields: {
      type: Array,
      required: true
    },
    resource: {
      type: String,
      required: true
    }
  },
  computed: {
    apiUrl () {
      return 'rest/' + this.resource + 's/'
    },
    deletePermission () {
      return 'can_delete_' + this.resource
    }
  },
  data () {
    return {
      label: this.$route.meta.label,
      instanceId: 0
    }
  },
  mounted () {
    this.loadData()
  },
  watch: {
    '$route.params.id' () {
      this.loadData()
    }
  },
  methods: {
    showConfirmDeleteModal () {
      this.$refs.confirmModal.show()
    },
    deleteRecord () {
      axios.delete(this.apiUrl + this.instanceId + '/').then(response => {
        this.$router.push(this.backendUrl)
      })
    },
    loadData () {
      this.instanceId = this.$route.params.id ? parseInt(this.$route.params.id) : 0
      if (this.instanceId) {
        axios.get(this.apiUrl + this.instanceId + '/').then(response => {
          this.$refs.form.setData(response.data)
        })
      }
    },
    save () {
      let data = this.$refs.form.getData()
      if (this.instanceId) {
        axios.patch(this.apiUrl + this.instanceId + '/', data).then(response => {
          this.$router.push(this.backUrl)
        })
      }
    },
    cancel () {
      this.$router.push(this.backUrl)
    }
  }
}
</script>
