<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteInstance" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmManyModal" title="Potwierdzenie operacji" @ok="deleteSelected" ref="confirmManyModal">
            Czy na pewno chcesz usunąć te rekordy?
        </b-modal>
        <router-link to="dodaj" :v-permission="addPermission" class="btn bottom-right button-add font-lg">
            <i class="fa fa-plus"></i>
        </router-link>
        <div class="card-header">
            {{ label }}
        </div>
        <div class="card-body">
            <slot name="filters"></slot>
            <v-server-table :url="apiUrl" :columns="columns" :options="options" ref="table" @loaded="onTableLoaded">
                <input type="checkbox" :value="props.row.id" v-model="selectedRows" slot="select" slot-scope="props" :v-permission="deletePermission">
                <div slot="actions" slot-scope="props">
                    <button @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm" :v-permission="deletePermission">usuń</button>
                </div>
                <router-link :to="props.row.id + '/'" slot="name" slot-scope="props">{{ props.row.name }}</router-link>
            </v-server-table>
            <div>
                <form class="form-inline">
                    <label class="mr-2">Zaznaczone rekordy</label>
                    <button type="button" :v-permission="deletePermission" @click="deleteSelected"
                            class="btn btn-sm btn-danger" :disabled="selectedRows.length==0">Usuń</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'list',
  methods: {
    onTableLoaded () {
      this.selectedRows = []
    },
    deleteSelected () {
      this.selectedRows.forEach((id) => {
        axios.delete(this.apiUrl + id + '/')
      })
    },
    showConfirmModal (instance) {
      this.selectedInstance = instance
      this.$refs.confirmModal.show()
    },
    deleteInstance () {
      axios.delete(this.apiUrl + this.selectedInstance.id + '/').then((response) => this.$refs.table.refresh())
    },
    addNewInstance () {
      this.$router.push('dodaj')
    },
    loadData (resource) {
      if (!resource) { return }
      this.$refs.table.refresh()
    }
  },
  props: {
    resource: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    headings: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedRows: [],
      label: this.$route.meta.label,
      options: {
        headings: this.headings
      }
    }
  },
  computed: {
    addPermission () {
      return 'can_add_' + this.resource
    },
    deletePermission () {
      return 'can_delete_' + this.resource
    },
    apiUrl () {
      return 'rest/' + this.resource + 's/'
    }
  }
}
</script>
