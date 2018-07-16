<template>
    <div class="card mt-4">
        <div class="card-header">
            Godziny pracy
        </div>
        <div class="card-body mt-4">
            <working-hours ref="workingHours"></working-hours>
        </div>
        <div class="card-footer">
            <button @click="save" class="btn btn-lg btn-success pull-right">Zapisz</button>
        </div>
    </div>
</template>
<script>
import WorkingHours from '../../components/WorkingHours'
export default {
  components: {WorkingHours},
  methods: {
    save () {
      this.$refs.workingHours.save().then(this.$router.push('/'))
    }
  }
}
</script>
