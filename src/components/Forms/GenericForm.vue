<template>
    <form @submit.prevent="save" v-if="loaded">
        <div class="form-group row" v-for="field in fields" v-bind:key="field.name">
            <div class="col-sm-3">
                <label :for="field.name">{{ field.label }}<span v-if="field.required">*</span></label>
            </div>
            <div class="col-sm-9">
                <template v-if="field.type=='multiselect'">
                    <span v-if="values[field.name].length == 0 && readonly">-</span>
                    <template v-else>
                        <template v-if="field.name in choices">
                            <ul class="list-unstyled" v-if="readonly">
                                <li v-for="value in values[field.name]" :key="value">{{ getChoiceFromId(value, choices[field.name], field.choiceDisplay) }}</li>
                            </ul>
                            <select v-else class="form-control" v-model="values[field.name]" multiple>
                                <option :value="choice.id" v-for="choice in choices[field.name]" :key="choice.id">
                                    <template v-if="field.choiceDisplay">{{ field.choiceDisplay(choice) }}</template>
                                    <template v-else>{{ choice.name }}</template>
                                </option>
                            </select>
                        </template>
                    </template>
                </template>
                <template v-else-if="field.type=='select'">
                    <template v-if="field.name in choices">
                        <ul class="list-unstyled" v-if="readonly">
                            <li v-for="value in values[field.name]" :key="value">{{ getChoiceFromId(value, choices[field.name]) }}</li>
                        </ul>
                        <select class="form-control" v-model="values[field.name]" v-else>
                            <option :value="choice.id" v-for="choice in choices[field.name]" :key="choice.id">
                                <template v-if="field.choiceDisplay">{{ field.choiceDisplay(choice) }}</template>
                                <template v-else>{{ choice.name }}</template>
                            </option>
                        </select>
                    </template>
                </template>
                <template v-else-if="field.type=='textarea'">
                    <textarea v-model="values[field.name]" :name="field.name" :readonly="readonly"
                              v-bind="fieldAttributes(field)" rows="5"
                              :class="{ 'is-invalid form-control': errors[field.name],
                            'form-control': !errors[field.name] && !readonly,
                            'form-control-plaintext': readonly }"></textarea>
                </template>
                <template v-else-if="field.type=='editor'">
                    <div v-if="readonly || field.readonly" class="form-control-plaintext" v-html="values[field.name]">
                    </div>
                    <rich-field :editable="readonly || field.readonly" v-else
                                :content="values[field.name]"
                                :ref="field.name + '_editor'"
                                :cls="{ 'is-invalid form-control': errors[field.name],
                                'form-control': !errors[field.name]}" />
                </template>
                <template v-else>
                    <input :type="field.type ? field.type : 'text'" v-model="values[field.name]" :name="field.name"
                           :readonly="readonly || field.readonly"
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
import RichField from './fields/RichField'
export default {
  name: 'generic-form',
  components: {
    RichField
  },
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
      choices: {},
      errors: {},
      loaded: false
    }
  },
  beforeMount () {
    this.setUp()
  },
  watch: {
    fields () {
      this.setUp()
    }
  },
  methods: {
    fieldAttributes (field) {
      if (!('attributes' in field)) { field.attributes = {} }
      return field.attributes
    },
    getChoiceFromId (value, choices, choiceDisplay) {
      if (choiceDisplay) {
        return choiceDisplay(choices.find(x => x.id === value))
      } else {
        return choices.find(x => x.id === value).name
      }
    },
    getData () {
      this.fields.forEach((f) => { if (f.type === 'editor') { this.values[f.name] = this.$refs[f.name + '_editor'][0].getHTML() } })
      return this.values
    },
    reset () {
      this.values = {}
    },
    setUp () {
      this.fields.forEach((field, i) => {
        if (field.type === 'select' || field.type === 'multiselect') {
          this.$set(this.values, field.name, [])
        } else {
          this.$set(this.values, field.name, '')
        }
        if ('choicesUrl' in field) {
          axios.get(field.choicesUrl, {params: {no_pagination: 1}}).then((response) => {
            if (field.transformChoicesFunction) {
              this.$set(this.choices, field.name, field.transformChoicesFunction(response.data))
            } else {
              this.$set(this.choices, field.name, response.data)
            }
          })
        }
      })
      this.loaded = true
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
