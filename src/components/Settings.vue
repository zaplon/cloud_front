<template>
<div>
    <b-dropdown id="ddown-divider" variant="light" class="m-2">
        <template slot="button-content"><i class="fa fa-user"></i></template>
        <b-dropdown-item-button><div v-b-modal.settingsModal>Ustawienia</div></b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item-button @click="logOut">Wyloguj</b-dropdown-item-button>
    </b-dropdown>
    <b-modal id="settingsModal" title="Ustawienia" @ok="handleOk" ref="modal">
        <backend-form ref="form" klass="DoctorForm" module="user_profile.forms"></backend-form>
    </b-modal>
</div>
</template>
<script>
import {Account} from '../api'
import BackendForm from './BackendForm'
export default {
  name: 'settings',
  components: {BackendForm},
  methods: {
    logOut () {
      Account.logOut(this)
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.$refs.form.handleSubmit(() => this.$refs.modal.hide())
    }
  }
}
</script>
