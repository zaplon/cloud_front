<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteInstance" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <router-link to="dodaj" :v-permission="addPermission" class="btn bottom-right button-add font-lg">
            <i class="fa fa-plus"></i>
        </router-link>
        <div class="card-header">
            {{ label }}
        </div>
        <div class="card-body">
            <v-server-table :url="apiUrl" :columns="columns" :options="options" ref="table" @loaded="onTableLoaded">
                <input type="checkbox" :value="props.row.id" v-model="selectedRows" slot="select" slot-scope="props" :v-permission="deletePermission">
                <div slot="actions" slot-scope="props">
                    <button @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm" :v-permission="deletePermission">usuń</button>
                </div>
                <router-link :to="props.row.id + '/'" slot="username" slot-scope="props">{{ props.row.username }}</router-link>
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
import List from '@/views/generic/List'
export default {
  name: 'users-list',
  mixins: [List],
  data () {
    return {
      options: {
        filterByColumn: true,
        filterable: ['type', 'first_name', 'last_name'],
        sortable: ['type', 'first_name', 'last_name'],
        listColumns: {
          type: [
            { id: 'doctor', text: 'Lekarz' },
            { id: 'admin', text: 'Administrator' }
          ]
        }
      }
    }
  }
}
</script>
