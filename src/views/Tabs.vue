<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteTab" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <div class="card-header">Zakładki</div>
        <div class="card-body">
            <table class="table table-striped table-bordered">
                <thead>
                <tr><th>Nazwa</th><th>Typ</th><th>Kolejność</th><th></th></tr>
                </thead>
                <tbody>
                <tr v-for="tab in tabs" :key="tab.id">
                    <td><button class="btn btn-link" @click="editTab(tab)">{{ tab.title }}</button></td>
                    <td>{{ tab.type }}</td>
                    <td>{{ tab.order }}</td>
                    <td>
                        <button v-if="!tab.enabled" @click="changeTabState(tab)" class="btn btn-default btn-sm">Włącz</button>
                        <button v-if="tab.enabled" @click="changeTabState(tab)" class="btn btn-default btn-sm">Wyłącz</button>
                        <button @click="showConfirmModal(tab)" class="btn btn-danger btn-sm">Usuń</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <b-modal size="sm" id="tabModal" :title="tab.title" @ok="modalOk" @cancel="modalCancel" ref="tabModal">
            <backend-form ref="tabForm" klass="TabForm" module="visit.forms" :pk="tab.id" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">{{ tab.ok }}</b-btn>
            </div>
        </b-modal>
        <button class="btn bottom-right button-add font-lg" @click="addTab"><i class="fa fa-plus"></i></button>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'tabs',
  data () {
    return {
      tabs: [],
      tab: {title: 'Nowa zakładka', id: null, ok: 'Dodaj'}
    }
  },
  methods: {
    changeTabState (tab) {
      axios.patch('rest/tabs/' + tab.id + '/', {enabled: !tab.enabled}).then((response) => {
        tab.enabled = !tab.enabled
      })
    },
    editTab (tab) {
      this.tab.title = 'Edycja zakładki'
      this.tab.ok = 'Zapisz'
      this.tab.id = tab.id
      this.$refs.tabForm.loadHtml(tab.id).then(response => { this.$refs.tabModal.show() })
    },
    addTab () {
      this.tab.title = 'Nowa zakładka'
      this.tab.ok = 'Dodaj'
      if (this.tab.id) {
        this.tab.id = null
        this.$refs.tabForm.loadHtml().then(response => { this.$refs.tabModal.show() })
      } else { this.$refs.tabModal.show() }
    },
    modalOk () {
      this.$refs.tabForm.handleSubmit(() => {
        this.$refs.tabModal.hide()
        this.loadTabs()
      })
    },
    showConfirmModal (tab) {
      this.selectedTab = tab
      this.$refs.confirmModal.show()
    },
    modalCancel () {
      this.$refs.tabModal.hide()
    },
    deleteTab () {
      axios.delete('rest/tabs/' + this.selectedTab.id + '/').then(response => {
        this.tabs.splice(this.tabs.indexOf(this.selectedTab), 1)
      })
    },
    reorder (tab, place) {

    },
    loadTabs () {
      axios.get('rest/tabs/').then(response => {
        this.tabs = response.data
      })
    }
  },
  mounted () {
    this.loadTabs()
  }
}
</script>
