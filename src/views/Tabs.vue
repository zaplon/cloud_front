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
                <draggable v-model="tabs" tag="tbody" @change="changeOrder">
                <tr v-for="tab in tabs" :key="tab.id">
                    <td><button class="btn btn-link" @click="editTab(tab)">{{ tab.title }}</button></td>
                    <td>{{ tab.type_name }}</td>
                    <td>{{ tab.order }}</td>
                    <td>
                        <button v-if="!tab.enabled" @click="changeTabState(tab)" class="btn btn-default btn-sm">Włącz</button>
                        <button v-if="tab.enabled" @click="changeTabState(tab)" class="btn btn-default btn-sm">Wyłącz</button>
                        <button @click="showConfirmModal(tab)" class="btn btn-danger btn-sm">Usuń</button>
                    </td>
                </tr>
                </draggable>
            </table>
        </div>
        <b-modal :static="true" size="sm" id="tabModal" :title="tab.title" @ok="modalOk" @cancel="modalCancel" ref="tabModal">
            <generic-form :fields="tabFormFields" ref="tabForm"></generic-form>
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
import draggable from 'vuedraggable'
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'tabs',
  data () {
    return {
      tabs: [],
      oldIndex: null,
      tabFormFields: [
        {name: 'title', label: 'Nazwa'},
        {name: 'order', label: 'Kolejność', type: 'number', attributes: {'min': 1}},
        {name: 'enabled', label: 'Włączona', type: 'checkbox'},
        {name: 'type',
          type: 'select',
          label: 'Typ',
          choices: [
            {id: 'DEFAULT', name: 'Pole tekstowe'},
            {id: 'ICD10', name: 'Rozpoznanie'},
            {id: 'MEDICINES', name: 'Recepty'},
            {id: 'EXAMINATIONS', name: 'Badania dodatkowe'},
            {id: 'OCULIST', name: 'Okulista'},
            {id: 'NOTES', name: 'Notatki'}
          ]}
      ],
      tab: {title: '', ok: ''}
    }
  },
  methods: {
    changeTabState (tab) {
      axios.patch('rest/tabs/' + tab.id + '/', {enabled: !tab.enabled}).then((response) => {
        tab.enabled = !tab.enabled
      })
    },
    changeOrder (ev) {
      axios.patch('rest/tabs/' + ev.moved.element.id + '/', {order: ev.moved.newIndex + 1})
      ev.moved.element.order = ev.moved.newIndex + 1
      if (ev.moved.newIndex > ev.moved.oldIndex) {
        this.reorderFields(ev.moved.oldIndex, ev.moved.newIndex - 1, -1)
      } else {
        this.reorderFields(ev.moved.newIndex + 1, ev.moved.oldIndex, 1)
      }
    },
    reorderFields (startIndex, endIndex, direction) {
      this.tabs.forEach((tab, index) => {
        if (startIndex <= index && endIndex >= index) {
          var newIndex = tab.order + direction
          axios.patch('rest/tabs/' + tab.id + '/', {order: newIndex}).then((response) => {
            tab.order = newIndex
          })
        }
      })
    },
    editTab (tab) {
      this.oldIndex = tab.order - 1
      this.tabFormFields[1].attributes.max = this.tabs.length
      this.tab.title = 'Edycja zakładki'
      this.tab.ok = 'Zapisz'
      this.$refs.tabForm.setData(tab)
      this.$refs.tabModal.show()
    },
    addTab () {
      this.oldIndex = this.tabs.length
      this.tabFormFields[1].attributes.max = this.tabs.length + 1
      this.tab.title = 'Nowa zakładka'
      this.tab.ok = 'Dodaj'
      this.$refs.tabModal.show()
      this.$refs.tabForm.reset()
      this.$refs.tabForm.setData({'enabled': true})
    },
    modalOk () {
      var data = this.$refs.tabForm.getData()
      data.doctor = this.$store.state.user.doctor.id
      var promise = null
      if (data.id) {
        promise = axios.put('/rest/tabs/' + data.id + '/', data)
      } else {
        promise = axios.post('/rest/tabs/', data)
      }
      promise.then(response => {
        this.$refs.tabModal.hide()
        var insertAtIndex = response.data.order - 1
        if (data.id) {
          this.tabs.splice(this.oldIndex, 1)
          this.tabs.splice(insertAtIndex, 0, response.data)
        } else {
          this.tabs.splice(insertAtIndex, 0, response.data)
        }
        if (insertAtIndex > this.oldIndex) {
          this.reorderFields(this.oldIndex - 1, insertAtIndex + 1, 1)
        } else if (insertAtIndex < this.oldIndex) {
          this.reorderFields(insertAtIndex + 1, this.oldIndex + 1, 1)
        }
      }).catch(error => {
        this.$refs.tabForm.errors = error.response.data
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
        let indexToRemove = this.tabs.indexOf(this.selectedTab)
        this.tabs.splice(indexToRemove, 1)
        this.reorderFields(indexToRemove, this.tabs.length, -1)
      })
    },
    loadTabs () {
      axios.get('rest/tabs/').then(response => {
        this.tabs = response.data
      })
    }
  },
  mounted () {
    this.loadTabs()
  },
  components: {
    draggable,
    GenericForm
  }
}
</script>
