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
                    <button v-if="editable && !props.row.deleted" @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm" :v-permission="deletePermission">usuń</button>
                    <span v-if="props.row.deleted">usunięto {{ props.row.deleted | formatDate('Y-MM-DD HH:mm') }}</span>
                    <template v-for="extraAction in extraActions.filter(a => (a.forDeleted ? true : false) === (props.row.deleted ? true : false))">
                        <router-link :key="extraAction.text" v-if="extraAction.url" :to=extraAction.url(props.row) :class="extraAction.cls">
                            {{ extraAction.text }}
                        </router-link>
                        <button :key="extraAction.text" @click="extraAction.clb(props.row, $refs.table)"
                                :class="[extraAction.cls ? extraAction.cls : 'btn-primary', 'btn btn-sm']" v-if="extraAction.clb">
                            {{ extraAction.text }}
                        </button>
                    </template>
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
                    <button type="button" :v-permission="deletePermission" @click="showConfirmManyModal"
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
      var counter = this.selectedRows.length
      this.selectedRows.forEach((id) => {
        axios.delete(this.apiUrl + id + '/').then(r => {
          counter -= 1
          if (counter === 0) {
            this.$refs.table.refresh()
          }
        })
      })
    },
    showConfirmModal (instance) {
      this.selectedInstance = instance
      this.$refs.confirmModal.show()
    },
    showConfirmManyModal () {
      this.$refs.confirmManyModal.show()
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
      required: false,
      default: () => []
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
