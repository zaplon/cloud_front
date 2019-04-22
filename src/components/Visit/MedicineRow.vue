<template>
    <tr :class="this.klass">
        <td>{{ medicine.name }}</td>
        <td>
            <select class="form-control" v-model="medicine.size" @mousedown="getChildren(medicine)" @change="sizeSelected(medicine)">
                <option v-if="!medicine.children">Wybierz...</option>
                <option v-for="option in medicine.children" v-bind:value="option.id" :key="option.id">
                    {{ option.size }} (nfz)
                </option>
            </select>
        </td>
        <td>
            <select v-if="medicine.user_id" class="form-control" v-model="medicine.refundation">
                <option value="0">-</option>
                <option value="30%">30%</option>
            </select>
            <select v-else class="form-control" v-model="medicine.refundation">
                <option v-if="!medicine.refundation" value="0">-</option>
                <option v-for="option in medicine.refundations" v-bind:value="option.id" :key="option.id">
                    {{ option.to_pay }}
                </option>
            </select>
        </td>
        <td>{{ medicine.form }}</td><td>{{ medicine.dose }}</td>
        <td><input type="text" :class="[errors.size ? 'is-invalid' : '', 'form-control']" v-model="medicine.size"></td>
        <td><input type="text" :class="[errors.dosage ? 'is-invalid' : '', 'form-control']" v-model="medicine.dosage"></td>
        <td><input type="text" class="form-control" v-model="medicine.notes"></td>
        <td class="text-center"><input type="checkbox" v-model="medicine.separate" class="form-check-input"></td>
        <td>
            <button v-if="toAdd" @click="add(medicine)" class="btn btn-sm btn-success">Dodaj</button>
            <button v-else @click="remove(medicine)" class="btn btn-sm btn-danger">Usuń</button>
        </td>
    </tr>
</template>
<script>
import axios from 'axios'
export default {
  name: 'medicine-row',
  data () {
    return {
      errors: {}
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
    getData () {
      return {name: this.medicine.name,
        child: this.medicine.child,
        dose: this.medicine.dose,
        dosage: this.medicine.dosage,
        size: this.medicine.size,
        separate: this.medicine.separate,
        notes: this.medicine.notes,
        refundation: this.medicine.refundation}
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
