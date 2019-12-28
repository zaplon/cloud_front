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
                            <select v-else :class="[{formSize: 'form-control' + formSize}, 'form-control']" v-model="values[field.name]" multiple>
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
                            <li>{{ getChoiceFromId(values[field.name], choices[field.name]) }}</li>
                        </ul>
                        <select :class="[{formSize: 'form-control' + formSize}, 'form-control']" v-model="values[field.name]" v-else>
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
                            'form-control': formSize == 'md', 'form-control': formSize == 'lg',
                            'form-control-plaintext': readonly }"></textarea>
                </template>
                <template v-else-if="field.type=='editor'">
                    <div v-if="readonly || field.readonly" class="form-control-plaintext" v-html="values[field.name]">
                    </div>
                    <rich-field :editable="readonly || field.readonly" v-else
                                :content="values[field.name]"
                                :ref="field.name + '_editor'"
                                :cls="{ 'is-invalid form-control': errors[field.name],
                                'form-control-sm': formSize == 'sm', 'form-control-lg': formSize == 'lg',
                                'form-control': !errors[field.name]}" />
                </template>
                <template v-else-if="field.type=='color'">
                    <input type="color" v-model="values[field.name]" disabled="disabled" v-if="readonly || field.readonly">
                    <input type="color" v-model="values[field.name]" :name="field.name" v-else
                           v-bind="fieldAttributes(field)">
                </template>
                <template v-else-if="field.type=='file'">
                    <span v-if="readonly">{{ helpers[field.name] }}</span>
                    <template v-else>
                    <input type="file" :name="field.name"
                           v-bind="fieldAttributes(field)" @change="processFile($event, field.name)"
                           :class="{ 'is-invalid form-control': errors[field.name],
                            'form-control': !errors[field.name] && !readonly,
                            'form-control-sm': formSize == 'sm', 'form-control-lg': formSize == 'lg'}">
                        <small v-if="helpers[field.name]" class="form-text text-muted">Obecnie {{ helpers[field.name] }}</small>
                        <!--<button role="button" @click="values[field.name]=null" class="btn btn-link"><small>wyczyść</small></button>-->
                    </template>
                </template>
                <template v-else-if="field.type=='postal_code'">
                    <div class="form-row">
                        <div class="col-5">
                            <input type="text" maxlength="2" v-model="values[field.name + '_1']" :name="field.name"
                                   :readonly="readonly || field.readonly"
                                   v-bind="fieldAttributes(field)" pattern="[0-9.]+"
                                   :class="{ 'is-invalid form-control': errors[field.name],
                                    'form-control': !errors[field.name] && !readonly,
                                    'form-control-sm': formSize == 'sm', 'form-control-lg': formSize == 'lg',
                                    'form-control-plaintext': readonly }">
                        </div>
                        <div class="col-2 text-center"><span>-</span></div>
                        <div class="col-5">
                            <input type="text" maxlength="3" v-model="values[field.name + '_2']" :name="field.name"
                                   :readonly="readonly || field.readonly"
                                   v-bind="fieldAttributes(field)" pattern="[0-9.]+"
                                   :class="{ 'is-invalid form-control': errors[field.name],
                                    'form-control': !errors[field.name] && !readonly,
                                    'form-control-sm': formSize == 'sm', 'form-control-lg': formSize == 'lg',
                                    'form-control-plaintext': readonly }">
                        </div>
                    </div>
                </template>
                <template v-else>
                    <input :type="field.type ? field.type : 'text'" v-model="values[field.name]" :name="field.name"
                           :readonly="readonly || field.readonly"
                           v-bind="fieldAttributes(field)"
                           :class="{ 'is-invalid form-control': errors[field.name],
                            'form-control': !errors[field.name] && !readonly,
                            'form-control-sm': formSize == 'sm', 'form-control-lg': formSize == 'lg',
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
    formSize: {
      type: String,
      default: '',
      required: false
    },
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
      helpers: {},
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
    processFile (event, name) {
      console.log(event, name)
      this.values[name] = event.target.files[0]
    },
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
      this.fields.forEach((f) => {
        if (f.type === 'editor') {
          this.values[f.name] = this.$refs[f.name + '_editor'][0].getHTML()
        } else if (f.type === 'postal_code') {
          this.values[f.name] = this.values[f.name + '_1'] + '-' + this.values[f.name + '_2']
        }
      })
      console.log(this.values)
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
          if (field.type !== 'file') {
            this.$set(this.values, field.name, field.default ? field.default : '')
          }
        }
        if ('choicesUrl' in field) {
          axios.get(field.choicesUrl, {params: {no_pagination: 1}}).then((response) => {
            if (field.transformChoicesFunction) {
              this.$set(this.choices, field.name, field.transformChoicesFunction(response.data))
            } else {
              this.$set(this.choices, field.name, response.data)
            }
          })
        } else if ('choices' in field) {
          this.$set(this.choices, field.name, field.choices)
        }
      })
      this.loaded = true
    },
    setData (data) {
      this.fields.forEach((field) => {
        if (field.name in data) {
          if (field.type === 'postal_code') {
            if (data[field.name].split('-').length === 2) {
              let parts = data[field.name].split('-')
              this.values[field.name + '_1'] = parts[0]
              this.values[field.name + '_2'] = parts[1]
            }
          } else if (field.type === 'file') {
            this.helpers[field.name] = data[field.name]
          } else {
            this.values[field.name] = data[field.name]
          }
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
