<template>
    <form @submit.prevent="save">
        <div class="form-group" v-for="field in fields" v-bind:key="field.label">
            <label :for="field.label">{{ field.label }}</label>
            <input :type="field.type" :v-model="data"
                   :class="{ 'is-invalid form-control': errors.firstName, 'form-control': !errors.firstName }">
        </div>
    </form>
</template>
<script>
export default {
  name: 'form-booking',
  props: {
    fields: Object
  },
  data () {
    return {
      values: {},
      errors: {}
    }
  }
}
</script>
