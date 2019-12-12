<template>
    <div class="row">
        <template v-if="medicine.isHandMade">
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Ilość</th>
                            <th>Receptura</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control" v-model="medicine.name"></td>
                            <td><input type="text" class="form-control" v-model="medicine.amount"></td>
                            <td><textarea class="form-control" v-model="medicine.composition"></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-else>
            <div class="col-md-12">
                <span>
                    <strong>{{ medicine.name }} {{medicine.form}} {{ medicine.dose }}</strong>
                </span>
                <span>{{ medicine.availability_cat }}</span>
                <button title="Usuń lek" class="ml-1 btn btn-sm btn-danger" @click="remove(medicine)">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Opakowanie</th>
                            <th>Kategoria</th>
                            <th>Refundacja</th>
                            <th>Ilość</th>
                            <th>Dawkowanie</th>
                            <th>Osobna recepta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select class="form-control" v-model="medicine.size" @mousedown="getChildren(medicine)" @change="sizeSelected(medicine)">
                                    <option v-if="!medicine.children">Wybierz...</option>
                                    <option v-for="option in medicine.children" v-bind:value="option.id" :key="option.id">
                                        <span>{{ option.size }}</span><span v-if="option.refundation">(nfz)</span>
                                    </option>
                                </select>
                            </td>
                            <td class="text-center" style="vertical-align: middle;">
                                <span v-if="medicine.child">{{ medicine.child.availability_cat }}</span>
                            </td>
                            <td>
                                <select :disabled="!medicine.refundations" v-if="medicine.user_id" class="form-control"
                                        v-model="medicine.refundation">
                                    <option value="0">-</option>
                                    <option value="30%">30%</option>
                                </select>
                                <select :disabled="!medicine.refundations" v-else class="form-control"
                                        v-model="medicine.refundation">
                                    <option v-if="!medicine.refundation" value="0">-</option>
                                    <option v-for="option in medicine.refundations" v-bind:value="option.to_pay" :key="option.id">
                                        {{ option.to_pay }}
                                    </option>
                                </select>
                            </td>
                            <td><input type="text" :class="[errors.amount ? 'is-invalid' : '', 'form-control']" v-model="medicine.amount"></td>
                            <td><input type="text" :class="[errors.dosage ? 'is-invalid' : '', 'form-control']" v-model="medicine.dosage"></td>
                            <td class="text-center" style="vertical-align: middle;">
                                <div class="pretty p-default p-round p-smooth">
                                    <input type="checkbox" v-model="medicine.separate" class="form-check-input">
                                    <div class="state">
                                        <label></label>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="6"><input placeholder="Uwagi" type="text"
                                                   class="form-control" v-model="medicine.notes"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'medicine-row',
  data () {
    return {
      errors: {
        amount: false,
        dosage: false
      }
    }
  },
  props: {
    medicine: Object,
    toAdd: {
      type: Boolean,
      default: false
    },
    klass: {
      type: String,
      default: ''
    }
  },
  methods: {
    validate () {
      var hasErrors = false
      for (var k in this.errors) {
        let v = this.medicine[k]
        if (!v) {
          this.errors[k] = true
          hasErrors = true
        } else {
          this.errors[k] = false
        }
      }
      return !hasErrors
    },
    getData () {
      if (this.medicine.isHandMade) {
        return {
          name: this.medicine.name,
          amount: this.medicine.amount,
          composition: this.medicine.composition
        }
      } else {
        return {
          name: this.medicine.name,
          child: this.medicine.child,
          dose: this.medicine.dose,
          dosage: this.medicine.dosage,
          amount: this.medicine.amount,
          size: this.medicine.size,
          separate: this.medicine.separate,
          notes: this.medicine.notes,
          refundation: this.medicine.refundation
        }
      }
    },
    add (medicine) {
      this.$emit('add-record', medicine)
    },
    remove (medicine) {
      this.$emit('remove-record', medicine)
    },
    getChildren (medicine) {
      if (!medicine.children || medicine.loadChildren) {
        axios.get('rest/medicines/', {params: {parent: medicine.id}}).then(response => {
          this.$set(medicine, 'children', response.data.results)
          medicine.loadChildren = false
        })
      }
    },
    sizeSelected (parent) {
      let child = parent.children.filter((c) => c.id === parent.size)[0]
      parent.child = child
      if (child.refundation && !child.refundations) {
        axios.get('rest/refundations/', {params: {medicine: child.id}}).then((response) => {
          this.$set(parent, 'refundations', response.data)
        })
      }
    }
  }
}
</script>
