<template>
<div>
    <b-dropdown id="ddown-divider" variant="link" class="m-2">
        <template slot="button-content"><i class="fa fa-user"></i></template>
        <b-dropdown-item-button><div v-b-modal.profileModal>Profil</div></b-dropdown-item-button>
        <b-dropdown-item-button><div v-b-modal.hoursModal>Godziny pracy</div></b-dropdown-item-button>
        <b-dropdown-item-button><div v-b-modal.changePasswordModal>Zmiana hasła</div></b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item-button @click="logOut">Wyloguj</b-dropdown-item-button>
    </b-dropdown>
    <b-modal id="profileModal" size="lg" title="Profil" @ok="handleOk" ref="profileModal" cancel-title="Zamknij">
        <backend-form ref="form" :klass="formClass" module="user_profile.forms"></backend-form>
    </b-modal>
    <b-modal @shown="adjustSliders" id="hoursModal" title="Godziny pracy" @ok="saveHours" ref="hoursModal" cancel-title="Zamknij">
        <working-hours style="width:100%; height:100%;" ref="workingHours"></working-hours>
    </b-modal>
    <b-modal id="changePasswordModal" size="lg" title="Zmiana hasła" @ok="changePassword" ref="changePasswordModal" cancel-title="Zamknij">
        <change-password ref="changePasswordForm"></change-password>
    </b-modal>

</div>
</template>
<script>
import {Account} from '../api'
import BackendForm from './BackendForm'
import WorkingHours from './WorkingHours'
import ChangePassword from './ChangePassword'
export default {
  name: 'settings',
  components: {ChangePassword, WorkingHours, BackendForm},
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
    adjustSliders () {
      let wh = this.$refs.workingHours
      wh.days.forEach((day) => wh.$refs[day.name][0].refresh())
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.$refs.form.handleSubmit(() => this.$refs.profileModal.hide())
    },
    changePassword (evt) {
      this.$refs.changePasswordForm.changePassword(evt, response => this.$refs.changePasswordModal.hide())
    }
  }
}
</script>
