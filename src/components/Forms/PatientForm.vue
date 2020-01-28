<template>
    <generic-form :fields="fields" ref="form"></generic-form>
</template>
<script>
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'patient-form',
  props: {
    fields: Array
  },
  components: {GenericForm},
  methods: {
    setData (data) {
      this.$refs.form.setData(data)
    },
    getData () {
      return this.$refs.form.getData()
    },
    getDateFromPesel (pesel) {
      let year = pesel.substr(0, 2)
      let month = pesel.substr(2, 2)
      let day = pesel.substr(4, 2)
      return this.$moment(year + '-' + month + '-' + day)
    },
    formChanged (newValue, oldValue) {
      console.log(newValue, oldValue)
      if (newValue.pesel && newValue.pesel !== oldValue.pesel) {
        if (!newValue.birth_date) {
          this.$refs.form.values.birth_date = this.getDateFromPesel(newValue.pesel)
        }
      }
    }

  },
  mounted () {
    this.$watch(
      'this.$refs.form.values',
      (newValue, oldValue) => {
        console.log(newValue, oldValue)
        if (newValue.pesel && newValue.pesel !== oldValue.pesel) {
          if (!newValue.birth_date) {
            this.$refs.form.values.birth_date = this.getDateFromPesel(newValue.pesel)
          }
        }
      }, {deep: true}
    )
  }
}
</script>
