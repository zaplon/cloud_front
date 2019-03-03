<template>
    <form @submit.prevent="save" v-if="loaded">
        <div class="form-group row" v-for="field in fields" v-bind:key="field.name">
            <div class="col-sm-3">
                <label :for="field.name">{{ field.label }}<span v-if="field.required">*</span></label>
            </div>
            <div class="col-sm-9">
                <template v-if="field.type=='multiselect'">
                    <ul class="list-unstyled" v-if="readonly">
                        <li v-for="value in values[field.name]" :key="value">{{ getChoiceFromId(value, field.choices) }}</li>
                    </ul>
                    <select v-else class="form-control" v-model="values[field.name]" multiple>
                        <option :value="choice.id" v-for="choice in field.choices" :key="choice.id">
                            {{ choice.name }}
                        </option>
                    </select>
                </template>
                <template v-else-if="field.type=='select'">
                    <ul class="list-unstyled" v-if="readonly">
                        <li v-for="value in values[field.name]" :key="value">{{ getChoiceFromId(value, field.choices) }}</li>
                    </ul>
                    <select class="form-control" v-model="values[field.name]" v-else>
                        <option :value="choice.id" v-for="choice in field.choices" :key="choice.id">
                            {{ choice.name }}
                        </option>
                    </select>
                </template>
                <template v-else-if="field.type=='textarea'">
                    <textarea v-model="values[field.name]" :name="field.name" :readonly="readonly"
                              v-bind="fieldAttributes(field)" rows="5"
                              :class="{ 'is-invalid form-control': errors[field.name],
                            'form-control': !errors[field.name] && !readonly,
                            'form-control-plaintext': readonly }"></textarea>
                </template>
                <template v-else>
                    <input :type="field.type ? field.type : 'text'" v-model="values[field.name]" :name="field.name"
                           :readonly="readonly"
                           v-bind="fieldAttributes(field)"
                           :class="{ 'is-invalid form-control': errors[field.name],
                            'form-control': !errors[field.name] && !readonly,
                            'form-control-plaintext': readonly }">
                </template>
                <div v-show="errors[field.name]" class="invalid-feedback">
                    <span v-for="(error, index) in errors[field.name]" :key="index">{{ error }}</span>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import axios from 'axios'
export default {
  name: 'generic-form',
  props: {
    fields: Array,
    readonly: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      values: {},
      errors: {},
      loaded: false
    }
  },
  mounted () {
    this.fields.forEach((field) => {
      if (field.type === 'select' || field.type === 'multiselect') {
        this.$set(this.values, field.name, [])
        field.choices = this.$set(field, 'choices', [])
      } else {
        this.$set(this.values, field.name, '')
      }
      if ('choicesUrl' in field) {
        axios.get(field.choicesUrl, {params: {no_pagination: 1}}).then((response) => {
          if (field.transformChoicesFunction) { field.choices = field.transformChoicesFunction(response.data) } else {
            field.choices = response.data
          }
        })
      }
    })
    this.loaded = true
  },
  methods: {
    fieldAttributes (field) {
      if (!('attributes' in field)) { field.attributes = {} }
      return field.attributes
    },
    getChoiceFromId (value, choices) {
      return choices.find(x => x.id === value).name
    },
    getData () {
      return this.values
    },
    setData (data) {
      this.fields.forEach((field) => {
        if (field.name in data) {
          this.values[field.name] = data[field.name]
        } else if (this.readonly) {
          if (field.type === 'text') {
            this.values[field.name] = '-'
          }
        }
      })
    }
  }
}
</script>