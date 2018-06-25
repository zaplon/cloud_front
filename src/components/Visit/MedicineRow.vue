<template>
    <tr :class="this.klass">
        <td>{{ medicine.name }}</td><td>{{ medicine.composition }}</td>
        <td>
            <select class="form-control" v-model="medicine.size" @mousedown="getChildren(medicine)" @change="sizeSelected(medicine)">
                <option v-if="!medicine.children">Wybierz...</option>
                <option v-for="option in medicine.children" v-bind:value="option.id" :key="option.id">
                    {{ option.size }} (nfz)
                </option>
            </select>
        </td>
        <td>
            <select class="form-control" v-model="medicine.refundation">
                <option v-if="!medicine.refundation" value="0">-</option>
                <option v-for="option in medicine.refundations" v-bind:value="option.id" :key="option.id">
                    {{ option.to_pay }}
                </option>
            </select>
        </td>
        <td>{{ medicine.form }}</td><td>{{ medicine.dose }}</td>
        <td><input type="text" class="form-control" v-model="medicine.dosage"></td>
        <td>
            <button v-if="toAdd" @click="add(medicine)" class="btn btn-success">Dodaj</button>
            <button v-else @click="remove(medicine)" class="btn btn-danger">Usuń</button>
        </td>
    </tr>
</template>
<script>
import axios from 'axios'
export default {
  name: 'medicine-row',
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
        refundation: this.medicine.refundation}
    },
    add (medicine) {
      this.$emit('add-record', medicine)
    },
    remove (medicine) {
      this.$emit('remove-record', medicine)
    },
    getChildren (medicine) {
      if (!medicine.children) {
        axios.get('rest/medicines/', {params: {parent: medicine.id}}).then(response => {
          this.$set(medicine, 'children', response.data.results)
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
