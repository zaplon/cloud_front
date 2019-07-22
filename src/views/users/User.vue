<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteRecord" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <div class="card-header"><span v-if="instance.username">{{ instance.username }}</span><span v-else>Nowy użytkownik</span>
            <div class="card-toolbar">
                <router-link v-if="readonly" to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <div v-show="!instanceId">
                <div class="form-inline mb-4">
                    <label class="mr-2">Typ użytkownika</label>
                    <select class="form-control" v-model="role">
                        <option value="doctor">Lekarz</option>
                        <option value="worker">Pracownik</option>
                    </select>
                </div>
                <generic-form :fields="userInitialFields" ref="userInitialForm"></generic-form>
            </div>
            <div v-show="instanceId">
                <b-tabs>
                    <b-tab title="Dane podstawowe" active :title-link-class=" 'user' in errors ? 'text-danger' : ''">
                        <generic-form :readonly="readonly" :fields="userFields" ref="userForm"></generic-form>
                    </b-tab>
                    <b-tab :title-link-class=" 'user_permissions' in errors ? 'text-danger' : ''" title="Uprawnienia">
                        <generic-form :readonly="readonly" :fields="permissionsFields" ref="permissionsForm"></generic-form>
                    </b-tab>
                    <b-tab :disabled="role!='doctor'" title="Informacje lekarskie"
                           :title-link-class=" 'doctor' in errors ? 'text-danger' : ''">
                        <generic-form :readonly="readonly" :fields="doctorFields" ref="doctorForm"></generic-form>
                    </b-tab>
                    <b-tab :disabled="role!='doctor'" title="Godziny pracy"
                           :title-link-class=" 'working_hours' in errors ? 'text-danger' : ''">
                        <div class="mt-4"></div>
                        <working-hours ref="workingHours" :readonly="readonly" :blank="!instanceId"></working-hours>
                    </b-tab>
                </b-tabs>
            </div>
        </div>
        <div class="card-footer">
            <button v-permission="'can_delete_user'" v-if="instanceId" class="btn btn-danger pull-left" @click="showConfirmDeleteModal">Usuń</button>
            <div class="pull-right" v-if="readonly">
                <router-link class="btn btn-primary mr-2" to="edycja">Edytuj</router-link>
                <button class="btn btn-default" @click="cancel">Cofnij</button>
            </div>
            <button v-permission="'can_delete_user'" v-if="instanceId" class="btn btn-danger pull-left" @click="showConfirmDeleteModal">Usuń</button>
            <div class="pull-right" v-if="!readonly">
                <button @click="save" class="btn btn-primary mr-2">Zapisz</button>
                <button class="btn btn-default" @click="cancel">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import WorkingHours from '../../components/WorkingHours'
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'user',
  components: {GenericForm, WorkingHours},
  props: {
    readonly: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    transformPermissions (data) {
      data.forEach(d => {
        d.name = d.name.replace('Can', 'Może')
        d.name = d.name.replace('add', 'dodać')
        d.name = d.name.replace('delete', 'usunąć')
        d.name = d.name.replace('change', 'zmienić')
      })
      return data
    },
    save () {
      if (!this.instanceId) {
        let data = this.$refs.userInitialForm.values
        data.role = this.role
        axios.post('rest/users/', this.$refs.userInitialForm.values).then(response => {
          this.instanceId = response.data.id
          this.instance = response.data
          this.setData()
        }).catch(error => {
          console.log(error)
          this.$refs.userInitialForm.errors = error.response.data
        })
        return
      }
      let data = this.$refs['userForm'].getData()
      data['doctor'] = this.$refs['doctorForm'].getData()
      let permissions = this.$refs['permissionsForm'].getData()
      data['user_permissions'] = permissions['user_permissions']
      data['groups'] = permissions['groups']
      data['doctor']['working_hours'] = this.$refs['workingHours'].getData()
      console.log(data)
      axios.patch('rest/users/' + this.instanceId + '/', data).then((result) => {
        this.$router.push(this.backUrl + '/')
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel () {
      this.$router.push(this.backUrl + '/')
      // if (!this.readonly) { this.$router.push(this.backUrl + '/' + this.instanceId + '/') } else { this.$router.push(this.backUrl + '/') }
    },
    showConfirmDeleteModal () {
      this.$refs.confirmModal.show()
    },
    deleteRecord () {
      axios.delete(this.apiUrl + this.instanceId + '/').then(response => {
        this.$router.push(this.backUrl)
      })
    },
    setData () {
      this.$refs.userForm.setData(this.instance)
      this.$refs.doctorForm.setData(this.instance.doctor)
      this.$refs.permissionsForm.setData(this.instance)
      this.$refs.workingHours.setData(this.instance.doctor.working_hours)
    },
    loadData () {
      this.instanceId = this.$route.params.id ? parseInt(this.$route.params.id) : 0
      if (this.instanceId) {
        axios.get(this.apiUrl + this.instanceId + '/').then((response) => {
          this.instance = response.data
          this.label = response.data.id
          this.setData()
        })
      }
    }
  },
  data () {
    return {
      errors: [],
      role: 'doctor',
      backUrl: '/uzytkownicy',
      instanceId: 0,
      instance: {},
      userInitialFields: [
        {name: 'first_name', label: 'Imię'},
        {name: 'last_name', label: 'Nazwisko'},
        {name: 'username', label: 'Nazwa użytkownika', required: true},
        {name: 'password', label: 'Hasło', required: true, type: 'password'},
        {name: 'password2', label: 'Powtórz hasło', required: true, type: 'password'}
      ],
      userFields: [
        {name: 'first_name', label: 'Imię'},
        {name: 'last_name', label: 'Nazwisko'},
        {name: 'username', label: 'Nazwa użytkownika', required: true}
      ],
      doctorFields: [
        {name: 'pwz', label: 'Numer PWZ'},
        {name: 'mobile', label: 'Numer telefonu', required: true},
        {name: 'title', label: 'Tytuł'},
        { name: 'visit_duration',
          label: 'Czas trwania wizyty (min)',
          required: true,
          type: 'number',
          attributes: {'min': 1, 'max': 180} },
        {name: 'specializations', label: 'Specializacje', type: 'multiselect', choicesUrl: 'rest/specializations/'}
      ],
      permissionsFields: [
        {name: 'groups', label: 'Grupy', type: 'multiselect', choicesUrl: 'rest/groups/'},
        {name: 'user_permissions',
          label: 'Uprawnienia',
          type: 'multiselect',
          choicesUrl: 'rest/permissions/',
          transformChoicesFunction: this.transformPermissions}
      ]
    }
  },
  computed: {
    apiUrl () {
      return 'rest/users/'
    }
  },
  mounted () {
    this.loadData()
  },
  watch: {
    '$route.path' () {
      this.loadData()
    }
  }
}
</script>
