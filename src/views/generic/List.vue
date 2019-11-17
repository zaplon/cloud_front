<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteInstance" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmManyModal" title="Potwierdzenie operacji" @ok="deleteSelected" ref="confirmManyModal">
            Czy na pewno chcesz usunąć te rekordy?
        </b-modal>
        <router-link v-if="editable" to="dodaj" :v-permission="addPermission" class="btn bottom-right button-add font-lg">
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
                    <button v-if="editable" @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm" :v-permission="deletePermission">usuń</button>
                    <router-link v-for="extraAction in extraActions" :key="extraAction.url"
                                 :to=extraAction.url(props.row) :class="extraAction.cls">
                        {{ extraAction.text }}
                    </router-link>
                </div>
                <div :slot="linkColumn" slot-scope="props">
                    <router-link v-if="showEditLink" :to="props.row.id + '/'">{{ props.row[linkColumn] }}</router-link>
                    <span v-else>{{ props.row[linkColumn] }}</span>
                </div>
                <div slot="color" slot-scope="props">
                    <input type="color" name="color" disabled="disabled" :value="props.row.color">
                </div>
            </v-server-table>
            <div v-if="editable">
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
      this.$refs.table.refresh()
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
    extraActions: {
      type: Array,
      required: false
    },
    showEditLink: {
      type: Boolean,
      required: false,
      default: true
    },
    headings: {
      type: Object,
      required: true
    },
    endpoint: {
      required: false
    },
    responseFormatter: {
      required: false
    },
    editable: {
      required: false,
      default: true
    }
  },
  data () {
    return {
      selectedRows: [],
      label: this.$route.meta.label,
      options: {
        headings: this.headings,
        sortable: ['name'],
        responseAdapter: (resp) => {
          var data = this.$refs.table.getResponseData(resp)
          if (this.responseFormatter) { data = this.responseFormatter(data) }
          return { data: data.results, count: data.count }
        }
      }
    }
  },
  beforeMount () {
    this.options.sortable = this.columns.filter(value => value !== 'actions' && value !== 'select')
  },
  beforeUpdate () {
    this.label = this.$route.meta.label
  },
  computed: {
    linkColumn () {
      return this.columns.filter(value => value !== 'actions' && value !== 'select')[0]
    },
    addPermission () {
      return 'can_add_' + this.resource
    },
    deletePermission () {
      return 'can_delete_' + this.resource
    },
    apiUrl () {
      if (this.endpoint) {
        if (typeof (this.endpoint) === 'function') { return this.endpoint(this) } else { return this.endpoint }
      } else {
        return 'rest/' + this.resource + 's/'
      }
    }
  }
}
</script>
