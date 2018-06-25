<template>
<div>
    <b-dropdown id="ddown-divider" variant="light" class="m-2">
        <template slot="button-content"><i class="fa fa-user"></i></template>
        <b-dropdown-item-button><div v-b-modal.settingsModal>Ustawienia</div></b-dropdown-item-button>
        <b-dropdown-item-button><div v-b-modal.hoursModal>Godziny pracy</div></b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item-button @click="logOut">Wyloguj</b-dropdown-item-button>
    </b-dropdown>
    <b-modal id="settingsModal" title="Ustawienia" @ok="handleOk" ref="settingsModal" cancel-title="Zamknij">
        <backend-form ref="form" :klass="formClass" module="user_profile.forms"></backend-form>
    </b-modal>
    <b-modal id="hoursModal" title="Godziny pracy" @ok="saveHours" ref="hoursModal" cancel-title="Zamknij">
        <working-hours ref="workingHours"></working-hours>
    </b-modal>

</div>
</template>
<script>
import {Account} from '../api'
import BackendForm from './BackendForm'
import WorkingHours from './WorkingHours'
export default {
  name: 'settings',
  components: {WorkingHours, BackendForm},
  data: function () {
    return {
      formClass: this.$store.state.user.doctor ? 'DoctorForm' : 'UserForm'
    }
  },
  methods: {
    logOut () {
      Account.logOut(this)
    },
    saveHours () {
      this.$refs.workingHours.save()
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.$refs.form.handleSubmit(() => this.$refs.settingsModal.hide())
    }
  }
}
</script>
