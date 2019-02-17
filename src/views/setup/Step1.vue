<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-12">
            <div class="card mx-4">
                <div class="card-header">
                    Podstawowe informacje
                </div>
                <div class="card-body p-4">
                    <template v-if="userType == 'doctor'">
                        <backend-form ref="form" klass="DoctorForm" module="user_profile.forms"></backend-form>
                    </template>
                    <template v-else>
                        <backend-form ref="form" klass="UserForm" module="user_profile.forms"></backend-form>
                    </template>
                </div>
                <div class="card-footer">
                    <button @click="save" class="btn btn-success pull-right">Zapisz</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'step1',
  computed: {
    userType () {
      return this.$store.state.user.type
    }
  },
  methods: {
    save () {
      this.$refs.form.handleSubmit(() => { this.$router.push('/setup/2') })
    }
  }
}
</script>
